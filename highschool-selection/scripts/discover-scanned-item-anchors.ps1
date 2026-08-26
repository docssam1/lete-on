param(
  [Parameter(Mandatory = $true)][string]$SourceDirectory,
  [Parameter(Mandatory = $true)][string]$CatalogPath,
  [Parameter(Mandatory = $true)][string]$OutputPath,
  [string]$IncludePattern = ".*",
  [string]$ExcludePattern = "(?:\uB2F5\uC548|\uC815\uB2F5)",
  [string]$WorkDirectory = ""
)

$ErrorActionPreference = "Stop"
if (-not (Test-Path -LiteralPath $SourceDirectory -PathType Container)) { throw "SourceDirectory not found" }
if (-not (Test-Path -LiteralPath $CatalogPath -PathType Leaf)) { throw "CatalogPath not found" }

$resolvedSource = (Resolve-Path -LiteralPath $SourceDirectory).Path
$resolvedCatalog = (Resolve-Path -LiteralPath $CatalogPath).Path
$resolvedOutput = [System.IO.Path]::GetFullPath($OutputPath)
if ([string]::IsNullOrWhiteSpace($WorkDirectory)) {
  $WorkDirectory = Join-Path ([System.IO.Path]::GetTempPath()) "highselect-item-discovery"
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
      $wordCount = $words.Count
      if ($wordCount -eq 0) { continue }
      $first = $words[0].BoundingRect
      $last = $words[$wordCount - 1].BoundingRect
      $lines += [pscustomobject]@{
        text = $line.Text
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

function Find-PageAnchors {
  param($Ocr)
  $anchors = @()
  $conceptHeaderY = $null
  $exampleYs = @()
  foreach ($line in $Ocr.lines) {
    $compact = ($line.text -replace "\s+", "")
    if ($compact -match "\uAC1C\uB150\uD0D0\uAD6C|\uAC1C\uB150\uC5F0\uAD6C|\uAC1C\uB150\uD655\uC778") { $conceptHeaderY = [double]$line.y }
    $explicit = $compact -match "(?:\uC608\uC81C|\uC774\uC81C|\uC5D0\uC81C|\uC608\uC7AC|\uC5D0\uC7AC|\uBB38\uC81C)([0-9]{1,2})[-~\u2013\u2014]([0-9]{1,2})"
    $labelPrefix = -not $explicit -and $compact -notmatch "\uC911[0-9]|CHALLENGE" -and $compact -match "^[^0-9]{0,6}([0-9]{1,2})[-~\u2013\u2014]([0-9]{1,2})"
    $inBody = [double]$line.y -gt ([double]$Ocr.height * 0.08) -and [double]$line.y -lt ([double]$Ocr.height * 0.92)
    $leftAnchor = [double]$line.x -lt ([double]$Ocr.width * 0.55)
    if (($explicit -or $labelPrefix) -and $inBody -and $leftAnchor) {
      $label = "$($Matches[1])-$($Matches[2])"
      $exampleYs += [double]$line.y
      $anchors += [pscustomobject]@{ kind = "example"; label = $label; x = [double]$line.x; y = [double]$line.y; confidence = "ocr_candidate" }
    }
  }
  if ($null -ne $conceptHeaderY) {
    $limit = if ($exampleYs.Count -gt 0) { ($exampleYs | Measure-Object -Minimum).Minimum } else { [double]$Ocr.height * 0.45 }
    foreach ($line in $Ocr.lines) {
      if ([double]$line.y -le $conceptHeaderY -or [double]$line.y -ge $limit) { continue }
      if ($line.text -match "^\s*[\(\[]([1-9][0-9]?)[\)\]]") {
        $anchors += [pscustomobject]@{ kind = "concept"; label = "concept-$($Matches[1])"; x = [double]$line.x; y = [double]$line.y; confidence = "ocr_candidate" }
      }
    }
  }
  $deduplicated = @{}
  foreach ($anchor in ($anchors | Sort-Object y, x)) {
    $key = "{0}:{1}" -f $anchor.label, [Math]::Round([double]$anchor.y / 8)
    if (-not $deduplicated.ContainsKey($key)) { $deduplicated[$key] = $anchor }
  }
  return @($deduplicated.Values | Sort-Object y, x)
}

$utf8 = New-Object System.Text.UTF8Encoding($false)
$catalog = [System.IO.File]::ReadAllText($resolvedCatalog, $utf8) | ConvertFrom-Json
$sourceByHash = @{}
foreach ($source in $catalog.sources) {
  if ($source.sha256) { $sourceByHash[[string]$source.sha256] = $source }
}
$engine = [Windows.Media.Ocr.OcrEngine]::TryCreateFromUserProfileLanguages()
if (-not $engine) { throw "Windows OCR engine unavailable" }

$renderScript = Join-Path $resolvedWork "render-private-scan.py"
$renderCode = @'
import os
import json
from pathlib import Path
import pymupdf
import numpy as np
from skimage.measure import label, regionprops
pdf = Path(os.environ["HIGHSELECT_SCAN_PDF"])
out = Path(os.environ["HIGHSELECT_SCAN_OUT"])
doc = pymupdf.open(pdf)
for index, page in enumerate(doc):
    pix = page.get_pixmap(matrix=pymupdf.Matrix(2.4, 2.4), colorspace=pymupdf.csGRAY, alpha=False)
    pix.save(out / f"page-{index + 1:04d}.png")
    gray = np.frombuffer(pix.samples, dtype=np.uint8).reshape(pix.height, pix.width)
    regions = []
    for region in regionprops(label(gray < 170, connectivity=2)):
        y0, x0, y1, x1 = region.bbox
        height = y1 - y0
        width = x1 - x0
        fill = region.area / (height * width)
        if not (0.18 * pix.height < y0 < 0.93 * pix.height):
            continue
        if not (0.01 * pix.width < x0 < 0.35 * pix.width):
            continue
        if not (110 <= width <= 220 and 30 <= height <= 65):
            continue
        if not (2.2 <= width / height <= 5.5 and 0.08 <= fill <= 0.45):
            continue
        regions.append({"x": x0, "y": y0, "width": width, "height": height})
    (out / f"page-{index + 1:04d}.regions.json").write_text(json.dumps(regions), encoding="utf-8")
print(len(doc))
'@
[System.IO.File]::WriteAllText($renderScript, $renderCode, $utf8)

$books = @()
$pdfs = Get-ChildItem -LiteralPath $resolvedSource -File -Filter "*.pdf" | Where-Object {
  $_.Name -match $IncludePattern -and $_.Name -notmatch $ExcludePattern
}
foreach ($pdf in $pdfs) {
  $sha = (Get-FileHash -Algorithm SHA256 -LiteralPath $pdf.FullName).Hash.ToLowerInvariant()
  $source = $sourceByHash[$sha]
  if (-not $source) { throw "Catalog source not found for SHA-256 $sha" }
  $bookWork = Join-Path $resolvedWork $sha.Substring(0, 16)
  if (Test-Path -LiteralPath $bookWork) {
    $resolvedBookWork = (Resolve-Path -LiteralPath $bookWork).Path
    if (-not $resolvedBookWork.StartsWith($resolvedWork, [System.StringComparison]::OrdinalIgnoreCase)) { throw "Unsafe work path" }
    Remove-Item -LiteralPath $resolvedBookWork -Recurse -Force
  }
  New-Item -ItemType Directory -Force -Path $bookWork | Out-Null

  $env:HIGHSELECT_SCAN_PDF = $pdf.FullName
  $env:HIGHSELECT_SCAN_OUT = $bookWork
  $pageCount = [int](python $renderScript | Select-Object -Last 1)
  if ($LASTEXITCODE -ne 0) { throw "PDF render failed for $($pdf.Name)" }
  Remove-Item Env:HIGHSELECT_SCAN_PDF, Env:HIGHSELECT_SCAN_OUT -ErrorAction SilentlyContinue

  $pages = @()
  Write-Output ("BOOK_START {0} pages={1}" -f $pdf.Name, $pageCount)
  foreach ($image in (Get-ChildItem -LiteralPath $bookWork -File -Filter "page-*.png" | Sort-Object Name)) {
    $page = [int]([regex]::Match($image.BaseName, "[0-9]+$").Value)
    $ocr = Invoke-ImageOcr -ImagePath $image.FullName -Engine $engine
    $anchors = @(Find-PageAnchors -Ocr $ocr)
    $regionPath = Join-Path $bookWork ("page-{0:D4}.regions.json" -f $page)
    if (Test-Path -LiteralPath $regionPath) {
      $regions = [System.IO.File]::ReadAllText($regionPath, $utf8) | ConvertFrom-Json
      foreach ($region in @($regions)) {
        $near = $anchors | Where-Object { [Math]::Abs([double]$_.y - [double]$region.y) -le 35 }
        if (-not $near) {
          $anchors += [pscustomobject]@{ kind = "example"; label = $null; x = [double]$region.x; y = [double]$region.y; confidence = "image-region-candidate" }
        }
      }
      Remove-Item -LiteralPath $regionPath -Force
      $anchors = @($anchors | Sort-Object y, x)
    }
    $hasMission = [bool]($ocr.lines | Where-Object { ($_.text -replace "\s+", "") -match "Mission|Mlssion|\uBBF8\uC158" })
    $textLength = [int](($ocr.lines | ForEach-Object { $_.text.Length } | Measure-Object -Sum).Sum)
    $pages += [pscustomobject]@{
      page = $page
      width = $ocr.width
      height = $ocr.height
      textLength = $textLength
      missionLayout = $hasMission
      anchors = $anchors
    }
    Remove-Item -LiteralPath $image.FullName -Force
    if (($page % 25) -eq 0 -or $page -eq $pageCount) {
      Write-Output ("BOOK_PROGRESS {0} {1}/{2}" -f $pdf.Name, $page, $pageCount)
    }
  }
  Remove-Item -LiteralPath $bookWork -Force
  $books += [pscustomobject]@{
    sourceMemoryId = $source.id
    sourceFingerprint = $sha
    fileName = $pdf.Name
    pageCount = $pageCount
    pages = $pages
  }
}

$payload = [pscustomobject]@{
  schemaVersion = 1
  generatedAt = (Get-Date).ToString("o")
  discovery = "windows-ocr-hint-only"
  books = $books
}
$payload | ConvertTo-Json -Depth 10 | Set-Content -LiteralPath $resolvedOutput -Encoding utf8
Write-Output $resolvedOutput
