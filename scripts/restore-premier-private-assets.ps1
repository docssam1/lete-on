[CmdletBinding()]
param(
  [Parameter(Mandatory = $true)]
  [string]$PrivateAssetsRoot,

  [string]$Repository = "docssam1/lete-on"
)

$ErrorActionPreference = "Stop"

$repoRoot = (Resolve-Path -LiteralPath (Join-Path $PSScriptRoot "..")).Path
$gitSafe = $repoRoot.Replace("\", "/")
$branch = (& git -c "safe.directory=$gitSafe" -C $repoRoot branch --show-current).Trim()
if ($LASTEXITCODE -ne 0 -or [string]::IsNullOrWhiteSpace($branch)) {
  throw "현재 Git 브랜치를 확인하지 못했습니다."
}
if ($branch -eq "main") {
  throw "main에서는 비공개 원본 자산을 복원하지 않습니다. 작업 브랜치를 사용하세요."
}

$repoInfo = & gh repo view $Repository --json isPrivate,visibility,url | ConvertFrom-Json
if (-not $repoInfo.isPrivate) {
  throw "중단: $Repository 저장소가 $($repoInfo.visibility) 상태입니다. 유료 원본 이미지는 Private 전환 뒤에만 복원할 수 있습니다."
}

$trackedChanges = @(& git -c "safe.directory=$gitSafe" -C $repoRoot status --porcelain --untracked-files=no)
if ($LASTEXITCODE -ne 0) {
  throw "Git 상태를 확인하지 못했습니다."
}
if ($trackedChanges.Count -gt 0) {
  throw "추적 파일에 미커밋 변경이 있습니다. 먼저 커밋하거나 작업을 정리하세요."
}

$sourceRoot = (Resolve-Path -LiteralPath $PrivateAssetsRoot).Path
$expected = [ordered]@{
  "utilization-1" = 4
  "utilization-2" = 4
  "utilization-3" = 4
  "utilization-4" = 4
  "utilization-5" = 5
  "utilization-6" = 4
  "utilization-7" = 8
  "utilization-8" = 4
  "final-1" = 4
  "final-2" = 4
  "final-3" = 5
  "last-1" = 5
  "last-2" = 4
  "last-3" = 4
  "last-4" = 4
}

function Test-WebPFile {
  param([Parameter(Mandatory = $true)][string]$Path)
  $item = Get-Item -LiteralPath $Path
  if ($item.Length -le 20000) {
    throw "비정상적으로 작은 이미지입니다: $Path"
  }
  $stream = [System.IO.File]::OpenRead($item.FullName)
  try {
    $header = New-Object byte[] 12
    if ($stream.Read($header, 0, 12) -ne 12) {
      throw "이미지 헤더를 읽지 못했습니다: $Path"
    }
  } finally {
    $stream.Dispose()
  }
  if ([System.Text.Encoding]::ASCII.GetString($header, 0, 4) -ne "RIFF" -or
      [System.Text.Encoding]::ASCII.GetString($header, 8, 4) -ne "WEBP") {
    throw "WebP 파일이 아닙니다: $Path"
  }
}

$sourceFiles = New-Object System.Collections.Generic.List[object]
foreach ($folder in $expected.Keys) {
  $sourceDirectory = Join-Path $sourceRoot $folder
  if (-not (Test-Path -LiteralPath $sourceDirectory -PathType Container)) {
    throw "비공개 자산 폴더가 없습니다: $sourceDirectory"
  }
  $files = @(Get-ChildItem -LiteralPath $sourceDirectory -File -Filter "page_*.webp" | Sort-Object Name)
  if ($files.Count -ne $expected[$folder]) {
    throw "$folder 이미지 수가 $($expected[$folder])개가 아닙니다: $($files.Count)개"
  }
  for ($index = 0; $index -lt $files.Count; $index += 1) {
    $expectedName = "page_{0:D3}.webp" -f ($index + 1)
    if ($files[$index].Name -ne $expectedName) {
      throw "$folder 페이지 번호가 연속적이지 않습니다: $($files[$index].Name)"
    }
    Test-WebPFile -Path $files[$index].FullName
    $sourceFiles.Add([pscustomobject]@{
      Folder = $folder
      Name = $files[$index].Name
      FullName = $files[$index].FullName
      Length = $files[$index].Length
      Hash = (Get-FileHash -LiteralPath $files[$index].FullName -Algorithm SHA256).Hash
    })
  }
}
if ($sourceFiles.Count -ne 67) {
  throw "전체 프리미어 이미지가 67쪽이 아닙니다: $($sourceFiles.Count)쪽"
}

$targetRoot = Join-Path $repoRoot "premier\assets\print"
foreach ($source in $sourceFiles) {
  $targetDirectory = Join-Path $targetRoot $source.Folder
  New-Item -ItemType Directory -Path $targetDirectory -Force | Out-Null
  $targetPath = Join-Path $targetDirectory $source.Name
  Copy-Item -LiteralPath $source.FullName -Destination $targetPath -Force
  Test-WebPFile -Path $targetPath
  $targetItem = Get-Item -LiteralPath $targetPath
  $targetHash = (Get-FileHash -LiteralPath $targetPath -Algorithm SHA256).Hash
  if ($targetItem.Length -ne $source.Length -or $targetHash -ne $source.Hash) {
    throw "복원한 이미지가 원본과 다릅니다: $targetPath"
  }
}

$previousGate = [Environment]::GetEnvironmentVariable("PREMIER_REQUIRE_PRIVATE_ASSETS", "Process")
try {
  [Environment]::SetEnvironmentVariable("PREMIER_REQUIRE_PRIVATE_ASSETS", "1", "Process")
  & node (Join-Path $repoRoot "hyper-focus\qa\validate_premier_page_images.cjs")
  if ($LASTEXITCODE -ne 0) {
    throw "프리미어 이미지 배포 게이트가 실패했습니다."
  }
} finally {
  [Environment]::SetEnvironmentVariable("PREMIER_REQUIRE_PRIVATE_ASSETS", $previousGate, "Process")
}

$totalBytes = ($sourceFiles | Measure-Object Length -Sum).Sum
Write-Host "복원 완료: $($sourceFiles.Count)쪽 / $totalBytes 바이트"
Write-Host "저장소: $($repoInfo.url) ($($repoInfo.visibility))"
Write-Host "브랜치: $branch"
Write-Host "다음 검수 후에만 실행: git add -f premier/assets/print/**/*.webp"
