param(
  [Parameter(Mandatory = $true)][string]$SourceDirectory,
  [Parameter(Mandatory = $true)][string]$DiscoveryPath,
  [Parameter(Mandatory = $true)][string]$BaseIndexPath,
  [Parameter(Mandatory = $true)][string]$OutputPath,
  [string]$PythonPath = "python",
  [string]$WorkDirectory = "",
  [string]$IncludeSourceMemoryId = ""
)

$ErrorActionPreference = "Stop"

function Resolve-RequiredPath {
  param([string]$Value, [string]$Type)
  if (-not (Test-Path -LiteralPath $Value -PathType $Type)) { throw "Path not found: $Value" }
  return (Resolve-Path -LiteralPath $Value).Path
}

$resolvedSource = Resolve-RequiredPath $SourceDirectory Container
$resolvedDiscovery = Resolve-RequiredPath $DiscoveryPath Leaf
$resolvedBase = Resolve-RequiredPath $BaseIndexPath Leaf
$resolvedOutput = [System.IO.Path]::GetFullPath($OutputPath)
if ([string]::IsNullOrWhiteSpace($WorkDirectory)) {
  $WorkDirectory = Join-Path ([System.IO.Path]::GetTempPath()) "highselect-layout-discovery"
}
$resolvedWork = [System.IO.Path]::GetFullPath($WorkDirectory)
New-Item -ItemType Directory -Force -Path $resolvedWork | Out-Null
New-Item -ItemType Directory -Force -Path ([System.IO.Path]::GetDirectoryName($resolvedOutput)) | Out-Null

Add-Type -AssemblyName System.Runtime.WindowsRuntime
[Windows.Storage.StorageFile, Windows.Storage, ContentType=WindowsRuntime] | Out-Null
[Windows.Graphics.Imaging.BitmapDecoder, Windows.Graphics.Imaging, ContentType=WindowsRuntime] | Out-Null
[Windows.Media.Ocr.OcrEngine, Windows.Foundation, ContentType=WindowsRuntime] | Out-Null

function Await-WinRT {
  param($Operation, [Type]$ResultType)
  $methods = [System.WindowsRuntimeSystemExtensions].GetMethods() | Where-Object {
    $_.Name -eq "AsTask" -and $_.IsGenericMethod -and $_.GetParameters().Count -eq 1
  }
  foreach ($method in $methods) {
    try {
      $task = $method.MakeGenericMethod($ResultType).Invoke($null, @($Operation))
      if ($task) { $task.Wait(); return $task.Result }
    } catch { }
  }
  throw "Unable to await WinRT operation"
}

function Invoke-ImageOcr {
  param([string]$ImagePath, $Engine)
  $file = Await-WinRT ([Windows.Storage.StorageFile]::GetFileFromPathAsync($ImagePath)) ([Windows.Storage.StorageFile])
  $stream = Await-WinRT ($file.OpenAsync([Windows.Storage.FileAccessMode]::Read)) ([Windows.Storage.Streams.IRandomAccessStream])
  try {
    $decoder = Await-WinRT ([Windows.Graphics.Imaging.BitmapDecoder]::CreateAsync($stream)) ([Windows.Graphics.Imaging.BitmapDecoder])
    $bitmap = Await-WinRT ($decoder.GetSoftwareBitmapAsync()) ([Windows.Graphics.Imaging.SoftwareBitmap])
    $result = Await-WinRT ($Engine.RecognizeAsync($bitmap)) ([Windows.Media.Ocr.OcrResult])
    $lines = @()
    foreach ($line in $result.Lines) {
      $words = @($line.Words)
      if ($words.Count -eq 0) { continue }
      $first = $words[0].BoundingRect
      $last = $words[$words.Count - 1].BoundingRect
      $lines += [pscustomobject]@{
        text = [string]$line.Text
        x = [double]$first.X
        y = [double]$first.Y
        width = [double](($last.X + $last.Width) - $first.X)
        height = [double]([Math]::Max($first.Height, $last.Height))
      }
    }
    return [pscustomobject]@{ width = [int]$bitmap.PixelWidth; height = [int]$bitmap.PixelHeight; lines = $lines }
  } finally {
    if ($stream) { $stream.Dispose() }
  }
}

function New-NormalizedBox {
  param([double]$X, [double]$Y, [double]$Width, [double]$Height)
  $safeX = [Math]::Max([double]0, [Math]::Min([double]0.99, [double]$X))
  $safeY = [Math]::Max([double]0, [Math]::Min([double]0.99, [double]$Y))
  $safeWidth = [Math]::Max([double]0.01, [Math]::Min([double](1 - $safeX), [double]$Width))
  $safeHeight = [Math]::Max([double]0.01, [Math]::Min([double](1 - $safeY), [double]$Height))
  return [pscustomobject]@{ x = $safeX; y = $safeY; width = $safeWidth; height = $safeHeight }
}

function Find-NumberedAnchors {
  param($Ocr)
  $candidates = @()
  foreach ($line in $Ocr.lines) {
    $compact = ($line.text -replace "\s+", "")
    if ($compact -notmatch "^([0-9]{1,3})(?:[\.\)\]:]|$)") { continue }
    $number = [int]$Matches[1]
    if ($number -lt 1) { continue }
    $nx = [double]$line.x / [double]$Ocr.width
    $ny = [double]$line.y / [double]$Ocr.height
    if ($ny -lt 0.1 -or $ny -gt 0.93) { continue }
    $column = if ($nx -ge 0.015 -and $nx -le 0.18) { 0 } elseif ($nx -ge 0.43 -and $nx -le 0.66) { 1 } else { -1 }
    if ($column -lt 0) { continue }
    $candidates += [pscustomobject]@{ number = $number; x = $nx; y = $ny; column = $column }
  }

  $deduped = @()
  foreach ($candidate in ($candidates | Sort-Object column, y)) {
    $near = $deduped | Where-Object {
      $_.column -eq $candidate.column -and ($_.number -eq $candidate.number -or [Math]::Abs($_.y - $candidate.y) -lt 0.025)
    }
    if (-not $near) { $deduped += $candidate }
  }
  if ($deduped.Count -lt 2 -or $deduped.Count -gt 14) { return @() }

  # Printed exercise numbers form a near-consecutive run. Keep the largest run
  # whose adjacent numeric gap is at most two; isolated formula/handwriting
  # digits are discovery noise and must not create item IDs.
  $uniqueNumbers = @($deduped | Select-Object -ExpandProperty number | Sort-Object -Unique)
  $runs = @()
  $currentRun = @()
  foreach ($number in $uniqueNumbers) {
    if ($currentRun.Count -eq 0 -or $number - $currentRun[-1] -le 2) {
      $currentRun += $number
    } else {
      $runs += ,@($currentRun)
      $currentRun = @($number)
    }
  }
  if ($currentRun.Count -gt 0) { $runs += ,@($currentRun) }
  $bestRun = @()
  foreach ($run in $runs) {
    $candidateRun = @($run)
    $candidateSpan = if ($candidateRun.Count -gt 0) { $candidateRun[-1] - $candidateRun[0] } else { [int]::MaxValue }
    $bestSpan = if ($bestRun.Count -gt 0) { $bestRun[-1] - $bestRun[0] } else { [int]::MaxValue }
    if ($candidateRun.Count -gt $bestRun.Count -or ($candidateRun.Count -eq $bestRun.Count -and $candidateSpan -lt $bestSpan)) {
      $bestRun = $candidateRun
    }
  }
  if ($bestRun.Count -lt 2) { return @() }
  $deduped = @($deduped | Where-Object { $bestRun -contains $_.number })
  $seenNumbers = @{}
  $deduped = @($deduped | Sort-Object column, y | Where-Object {
    if ($seenNumbers.ContainsKey($_.number)) { return $false }
    $seenNumbers[$_.number] = $true
    return $true
  })

  $anchors = @()
  $order = 1
  foreach ($column in 0, 1) {
    $columnItems = @($deduped | Where-Object { $_.column -eq $column } | Sort-Object y)
    for ($index = 0; $index -lt $columnItems.Count; $index += 1) {
      $current = $columnItems[$index]
      $nextY = if ($index + 1 -lt $columnItems.Count) { [double]$columnItems[$index + 1].y } else { 0.94 }
      $top = [Math]::Max(0.08, [double]$current.y - 0.012)
      $left = if ($column -eq 0) { 0.025 } else { 0.505 }
      $right = if ($column -eq 0) { 0.49 } else { 0.975 }
      $height = [Math]::Max(0.035, $nextY - $top - 0.006)
      $anchors += [pscustomobject]@{
        kind = "exercise"
        printedLabelHint = [string]$current.number
        layoutOrder = $order
        box = New-NormalizedBox $left $top ($right - $left) $height
      }
      $order += 1
    }
  }
  return $anchors
}

function New-MissionAnchors {
  $anchors = @()
  $order = 1
  $tops = @(0.19, 0.435, 0.68)
  for ($column = 0; $column -lt 2; $column += 1) {
    for ($row = 0; $row -lt 3; $row += 1) {
      $left = if ($column -eq 0) { 0.035 } else { 0.51 }
      $anchors += [pscustomobject]@{
        kind = "mission"
        printedLabelHint = [string](($column * 3) + $row + 1)
        layoutOrder = $order
        box = New-NormalizedBox $left $tops[$row] 0.455 0.235
      }
      $order += 1
    }
  }
  return $anchors
}

$utf8 = New-Object System.Text.UTF8Encoding($false)
$discovery = [System.IO.File]::ReadAllText($resolvedDiscovery, $utf8) | ConvertFrom-Json
$base = [System.IO.File]::ReadAllText($resolvedBase, $utf8) | ConvertFrom-Json
$unresolved = @{}
foreach ($entry in $base.unresolvedPages) {
  $key = "{0}:{1}" -f $entry.privateSourceMemoryId, $entry.page
  $unresolved[$key] = $entry
}

$engine = [Windows.Media.Ocr.OcrEngine]::TryCreateFromUserProfileLanguages()
if (-not $engine) { throw "Windows OCR engine unavailable" }

$renderScript = Join-Path $resolvedWork "render-layout-pages.py"
$renderCode = @'
import json
import os
from pathlib import Path
import pymupdf

pdf = Path(os.environ["HIGHSELECT_LAYOUT_PDF"])
out = Path(os.environ["HIGHSELECT_LAYOUT_OUT"])
pages = json.loads(os.environ["HIGHSELECT_LAYOUT_PAGES"])
doc = pymupdf.open(pdf)
for page_number in pages:
    page = doc[page_number - 1]
    pix = page.get_pixmap(matrix=pymupdf.Matrix(2.4, 2.4), colorspace=pymupdf.csRGB, alpha=False)
    pix.save(out / f"page-{page_number:04d}.png")
'@
[System.IO.File]::WriteAllText($renderScript, $renderCode, $utf8)

$sourceResults = @()
foreach ($book in $discovery.books) {
  if (-not [string]::IsNullOrWhiteSpace($IncludeSourceMemoryId) -and $book.sourceMemoryId -ne $IncludeSourceMemoryId) { continue }
  $wantedPages = @($book.pages | Where-Object { $unresolved.ContainsKey(("{0}:{1}" -f $book.sourceMemoryId, $_.page)) } | ForEach-Object { [int]$_.page })
  if ($wantedPages.Count -eq 0) { continue }
  $pdfPath = Join-Path $resolvedSource $book.fileName
  if (-not (Test-Path -LiteralPath $pdfPath -PathType Leaf)) { throw "Source PDF not found: $($book.fileName)" }
  $sha = (Get-FileHash -Algorithm SHA256 -LiteralPath $pdfPath).Hash.ToLowerInvariant()
  if ($sha -ne [string]$book.sourceFingerprint) { throw "Source fingerprint changed: $($book.fileName)" }

  $bookWork = Join-Path $resolvedWork ([string]$book.sourceMemoryId)
  if (Test-Path -LiteralPath $bookWork) {
    $resolvedBookWork = (Resolve-Path -LiteralPath $bookWork).Path
    if (-not $resolvedBookWork.StartsWith($resolvedWork, [System.StringComparison]::OrdinalIgnoreCase)) { throw "Unsafe work path" }
    Remove-Item -LiteralPath $resolvedBookWork -Recurse -Force
  }
  New-Item -ItemType Directory -Force -Path $bookWork | Out-Null
  $env:HIGHSELECT_LAYOUT_PDF = $pdfPath
  $env:HIGHSELECT_LAYOUT_OUT = $bookWork
  $env:HIGHSELECT_LAYOUT_PAGES = ($wantedPages | ConvertTo-Json -Compress)
  & $PythonPath $renderScript
  if ($LASTEXITCODE -ne 0) { throw "PDF render failed: $($book.fileName)" }
  Remove-Item Env:HIGHSELECT_LAYOUT_PDF, Env:HIGHSELECT_LAYOUT_OUT, Env:HIGHSELECT_LAYOUT_PAGES -ErrorAction SilentlyContinue

  $pageResults = @()
  $processed = 0
  foreach ($pageNumber in $wantedPages) {
    $imagePath = Join-Path $bookWork ("page-{0:D4}.png" -f $pageNumber)
    $ocr = Invoke-ImageOcr $imagePath $engine
    $compactText = (($ocr.lines | ForEach-Object { $_.text }) -join "") -replace "\s+", ""
    $numbered = @(Find-NumberedAnchors $ocr)
    $mission = $compactText -match "(?i)Mission|Mlssion|\uBBF8\uC158"
    $scoreOrRecord = $compactText -match "\uD559\uC2B5\uC0C1\uD669|\uCC44\uC810\uAE30\uB85D|\uC131\uC801\uAE30\uB85D|\uD559\uC2B5\uAE30\uB85D|\uD2C0\uB9B0\uBB38\uC81C|\uB9DE\uC740\uBB38\uC81C"
    $instructionOrContents = $compactText -match "\uAD50\uC7AC\uC758\uAD6C\uC131|\uCC28\uB840|\uBAA9\uCC28"
    $frontOrBack = ($pageNumber -le 3 -or $pageNumber -ge ([int]$book.pageCount - 1)) -and -not $mission -and $numbered.Count -lt 2

    if ($scoreOrRecord) {
      $pageResults += [pscustomobject]@{ page = $pageNumber; disposition = "excluded_candidate"; reason = "score-or-learning-record"; layoutKind = "non-question-page"; anchors = @() }
    } elseif ($mission) {
      $pageResults += [pscustomobject]@{ page = $pageNumber; disposition = "layout_candidate"; reason = "mission-grid-detected"; layoutKind = "mission-six-cell"; coverageStatus = "candidate_full"; anchors = @(New-MissionAnchors) }
    } elseif ($numbered.Count -ge 2) {
      $numbers = @($numbered | ForEach-Object { [int]$_.printedLabelHint } | Sort-Object -Unique)
      $coverageStatus = if (($numbers[-1] - $numbers[0] + 1) -eq $numbers.Count) { "candidate_full" } else { "partial" }
      $pageResults += [pscustomobject]@{ page = $pageNumber; disposition = "layout_candidate"; reason = "printed-number-columns-detected"; layoutKind = "two-column-numbered"; coverageStatus = $coverageStatus; anchors = $numbered }
    } elseif ($instructionOrContents) {
      $pageResults += [pscustomobject]@{ page = $pageNumber; disposition = "excluded_candidate"; reason = "instruction-or-contents-page"; layoutKind = "non-question-page"; anchors = @() }
    } elseif ($frontOrBack) {
      $pageResults += [pscustomobject]@{ page = $pageNumber; disposition = "excluded_candidate"; reason = "front-or-back-matter"; layoutKind = "non-question-page"; anchors = @() }
    } else {
      $pageResults += [pscustomobject]@{ page = $pageNumber; disposition = "unresolved"; reason = "layout-anchor-not-found"; layoutKind = "unknown"; anchors = @() }
    }
    Remove-Item -LiteralPath $imagePath -Force
    $processed += 1
    if (($processed % 25) -eq 0 -or $processed -eq $wantedPages.Count) {
      Write-Output ("LAYOUT_PROGRESS {0} {1}/{2}" -f $book.fileName, $processed, $wantedPages.Count)
    }
  }
  Remove-Item -LiteralPath $bookWork -Force
  $sourceResults += [pscustomobject]@{
    sourceMemoryId = $book.sourceMemoryId
    sourceFingerprint = $book.sourceFingerprint
    pages = $pageResults
  }
}

$result = [pscustomobject]@{
  schemaVersion = 1
  generatedAt = (Get-Date).ToString("o")
  discovery = "windows-ocr-layout-hint-only"
  policy = [pscustomobject]@{ ocrIsDiscoveryOnly = $true; exclusionsRequireVisualReview = $true }
  sources = $sourceResults
}
[System.IO.File]::WriteAllText($resolvedOutput, (($result | ConvertTo-Json -Depth 12) + "`n"), $utf8)
Write-Output $resolvedOutput
