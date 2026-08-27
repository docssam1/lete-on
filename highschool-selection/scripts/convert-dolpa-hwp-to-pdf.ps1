param(
  [Parameter(Mandatory = $true)][string]$SourceRoot,
  [Parameter(Mandatory = $true)][string]$QueuePath,
  [Parameter(Mandatory = $true)][string]$OutputRoot,
  [Parameter(Mandatory = $true)][string]$WorkRoot,
  [int]$MaxJobs = 10,
  [switch]$ListOnly,
  [switch]$RetryFailed
)

$ErrorActionPreference = "Stop"
$PrinterName = "nPDF로 변환하기"
$NpdfConfig = "C:\Program Files (x86)\nSeries\nPDF\config.ini"
$PrintManager = "C:\Program Files (x86)\HNC\Office 2020\HOffice110\bin\HwpPrnMng.exe"
$PdfInfo = "C:\Users\user\.cache\codex-runtimes\codex-primary-runtime\dependencies\native\poppler\Library\bin\pdfinfo.exe"

function Resolve-SafeChild([string]$Root, [string]$RelativePath) {
  $resolvedRoot = [IO.Path]::GetFullPath($Root).TrimEnd([IO.Path]::DirectorySeparatorChar) + [IO.Path]::DirectorySeparatorChar
  $resolvedChild = [IO.Path]::GetFullPath((Join-Path $Root ($RelativePath -replace '/', [IO.Path]::DirectorySeparatorChar)))
  if (-not $resolvedChild.StartsWith($resolvedRoot, [StringComparison]::OrdinalIgnoreCase)) {
    throw "허용된 폴더 밖의 경로입니다: $RelativePath"
  }
  return $resolvedChild
}

function Set-NpdfConfig([string]$Folder, [byte[]]$OriginalBytes) {
  [Text.Encoding]::RegisterProvider([Text.CodePagesEncodingProvider]::Instance)
  $encoding = [Text.Encoding]::GetEncoding(949)
  $text = $encoding.GetString($OriginalBytes)
  $settings = @{
    "c_autosaveenable" = "1"
    "c_autosaverule" = "<title>"
    "c_autosavefolder" = ($Folder.TrimEnd('\') + '\')
    "c_autoclose" = "1"
    "c_closeprompt" = "0"
    "c_completesound" = "0"
    "c_completeforcetop" = "0"
  }
  foreach ($key in $settings.Keys) {
    $text = [regex]::Replace($text, "(?m)^$([regex]::Escape($key))=.*$", "$key=$($settings[$key])")
  }
  [IO.File]::WriteAllText($NpdfConfig, $text, $encoding)
}

function Set-DefaultPrinter([string]$Name) {
  $escaped = $Name.Replace("'", "''")
  $printer = Get-CimInstance Win32_Printer -Filter "Name='$escaped'"
  if (-not $printer) { throw "프린터를 찾지 못했습니다: $Name" }
  $result = Invoke-CimMethod -InputObject $printer -MethodName SetDefaultPrinter
  if ($result.ReturnValue -ne 0) { throw "기본 프린터를 바꾸지 못했습니다: $Name" }
  Start-Sleep -Milliseconds 500
  $current = Get-CimInstance Win32_Printer | Where-Object Default | Select-Object -First 1 -ExpandProperty Name
  if ($current -ne $Name) { throw "기본 프린터 확인 실패: $current" }
}

function Get-PdfPageCount([string]$PdfPath) {
  if (-not (Test-Path -LiteralPath $PdfInfo)) { throw "pdfinfo를 찾지 못했습니다." }
  $info = & $PdfInfo $PdfPath 2>&1
  if ($LASTEXITCODE -ne 0) { throw "PDF 기본 검사가 실패했습니다." }
  $line = $info | Where-Object { $_ -match '^Pages:\s+(\d+)' } | Select-Object -First 1
  if (-not $line) { throw "PDF 페이지 수를 읽지 못했습니다." }
  return [int]([regex]::Match($line, '^Pages:\s+(\d+)').Groups[1].Value)
}

function Close-NewNpdfProcesses([int[]]$BeforeIds) {
  $processes = @(Get-Process print2pdf -ErrorAction SilentlyContinue | Where-Object { $BeforeIds -notcontains $_.Id })
  foreach ($process in $processes) {
    [void]$process.CloseMainWindow()
    if (-not $process.WaitForExit(5000)) { Stop-Process -Id $process.Id -Force }
  }
}

function Save-Queue($Queue, [string]$Path) {
  $Queue.summary.pending = @($Queue.jobs | Where-Object status -eq "대기").Count
  $Queue.summary.completed = @($Queue.jobs | Where-Object status -eq "변환 완료").Count
  $Queue.summary.failed = @($Queue.jobs | Where-Object status -eq "변환 실패").Count
  $updatedAt = (Get-Date).ToUniversalTime().ToString("o")
  if ($Queue.PSObject.Properties.Name -contains "updatedAt") { $Queue.updatedAt = $updatedAt }
  else { $Queue | Add-Member -NotePropertyName updatedAt -NotePropertyValue $updatedAt }
  [IO.File]::WriteAllText([IO.Path]::GetFullPath($Path), ($Queue | ConvertTo-Json -Depth 10) + "`n", [Text.UTF8Encoding]::new($false))
}

$sourceRootPath = [IO.Path]::GetFullPath($SourceRoot)
$queueFilePath = [IO.Path]::GetFullPath($QueuePath)
$outputRootPath = [IO.Path]::GetFullPath($OutputRoot)
$workRootPath = [IO.Path]::GetFullPath($WorkRoot)
if (-not (Test-Path -LiteralPath $sourceRootPath -PathType Container)) { throw "원본 폴더가 없습니다." }
if (-not (Test-Path -LiteralPath $queueFilePath -PathType Leaf)) { throw "변환 대기열이 없습니다." }

$queue = Get-Content -Raw -Encoding UTF8 $queueFilePath | ConvertFrom-Json
$jobs = @($queue.jobs | Where-Object { $_.status -eq "대기" -or ($RetryFailed -and $_.status -eq "변환 실패") } | Sort-Object order | Select-Object -First $MaxJobs)
if ($ListOnly) {
  $jobs | Select-Object order, sourceId, familyHint, courseHint, layer, inputRelativePath, outputRelativePath, status
  exit 0
}
if ($jobs.Count -eq 0) {
  Write-Output '{"selected":0,"completed":0,"failed":0}'
  exit 0
}

New-Item -ItemType Directory -Force -Path $outputRootPath, $workRootPath | Out-Null
$configBackup = [IO.File]::ReadAllBytes($NpdfConfig)
$defaultBefore = Get-CimInstance Win32_Printer | Where-Object Default | Select-Object -First 1 -ExpandProperty Name
$completed = 0
$failed = 0

try {
  foreach ($job in $jobs) {
    $inputPath = Resolve-SafeChild $sourceRootPath $job.inputRelativePath
    $finalPath = Resolve-SafeChild $outputRootPath $job.outputRelativePath
    $jobWork = Resolve-SafeChild $workRootPath $job.sourceId
    $npdfBefore = @(Get-Process print2pdf -ErrorAction SilentlyContinue | Select-Object -ExpandProperty Id)
    try {
      if (-not (Test-Path -LiteralPath $inputPath -PathType Leaf)) { throw "원본 파일을 찾지 못했습니다." }
      if (Test-Path -LiteralPath $finalPath -PathType Leaf) {
        $pages = Get-PdfPageCount $finalPath
        if ($pages -lt 1) { throw "기존 PDF 페이지가 없습니다." }
        $job.status = "변환 완료"
        $job.reviewStatus = "자동 기본검사 통과"
        $job.pageCount = $pages
        $job.outputSize = (Get-Item -LiteralPath $finalPath).Length
        $completed += 1
        Write-Output "SKIP|$($job.order)|$($job.sourceId)|$pages"
        Save-Queue $queue $queueFilePath
        continue
      }

      New-Item -ItemType Directory -Force -Path $jobWork, (Split-Path $finalPath) | Out-Null
      $existing = @(Get-ChildItem -LiteralPath $jobWork -Filter '*.pdf' -File -ErrorAction SilentlyContinue)
      if ($existing.Count -gt 1) { throw "작업 폴더에 PDF가 두 개 이상 있습니다." }
      $pdf = $existing | Select-Object -First 1
      if (-not $pdf) {
        Set-NpdfConfig $jobWork $configBackup
        Set-DefaultPrinter $PrinterName
        $arguments = '/p "' + $inputPath + '"'
        $process = Start-Process -FilePath $PrintManager -ArgumentList $arguments -WindowStyle Hidden -PassThru
        $deadline = (Get-Date).AddSeconds(60)
        while (-not $process.HasExited -and (Get-Date) -lt $deadline) {
          Start-Sleep -Milliseconds 500
          $process.Refresh()
        }
        if (-not $process.HasExited) {
          Stop-Process -Id $process.Id -Force
          throw "한글 인쇄가 60초 안에 끝나지 않았습니다."
        }

        Close-NewNpdfProcesses $npdfBefore
        $pdfDeadline = (Get-Date).AddSeconds(20)
        while (-not $pdf -and (Get-Date) -lt $pdfDeadline) {
          Start-Sleep -Milliseconds 500
          $pdf = Get-ChildItem -LiteralPath $jobWork -Filter '*.pdf' -File -ErrorAction SilentlyContinue | Select-Object -First 1
        }
      }
      if (-not $pdf -or $pdf.Length -lt 1024) { throw "nPDF 결과 파일이 만들어지지 않았습니다." }
      $pages = Get-PdfPageCount $pdf.FullName
      if ($pages -lt 1) { throw "PDF 페이지가 없습니다." }
      Move-Item -LiteralPath $pdf.FullName -Destination $finalPath
      $job.status = "변환 완료"
      $job.reviewStatus = "자동 기본검사 통과"
      $job.pageCount = $pages
      $job.outputSize = (Get-Item -LiteralPath $finalPath).Length
      $job.convertedAt = (Get-Date).ToUniversalTime().ToString("o")
      $job.error = $null
      $completed += 1
      Write-Output "OK|$($job.order)|$($job.sourceId)|$pages|$($job.outputSize)"
    } catch {
      $job.status = "변환 실패"
      $job.reviewStatus = "다시 변환 필요"
      $job.error = $_.Exception.Message
      $failed += 1
      Write-Output "FAIL|$($job.order)|$($job.sourceId)|$($job.error)"
    } finally {
      Close-NewNpdfProcesses $npdfBefore
      [IO.File]::WriteAllBytes($NpdfConfig, $configBackup)
      if ($defaultBefore) { Set-DefaultPrinter $defaultBefore }
      Save-Queue $queue $queueFilePath
    }
  }
} finally {
  [IO.File]::WriteAllBytes($NpdfConfig, $configBackup)
  if ($defaultBefore) { Set-DefaultPrinter $defaultBefore }
}

Write-Output ($queue.summary | ConvertTo-Json -Compress)
if ($failed -gt 0) { exit 2 }
