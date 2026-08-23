[CmdletBinding()]
param(
  [string]$AdminEmail = ""
)

$ErrorActionPreference = "Stop"
$ProjectUrl = "https://uqtkxhchtbcizzteuvsq.supabase.co"
$BootstrapScript = Join-Path $PSScriptRoot "bootstrap-admin.ts"
$EnvironmentNames = @(
  "SUPABASE_URL",
  "SUPABASE_SECRET_KEY",
  "HF_ADMIN_EMAIL",
  "HF_ADMIN_PASSWORD"
)
$PreviousEnvironment = @{}
foreach ($Name in $EnvironmentNames) {
  $PreviousEnvironment[$Name] = [Environment]::GetEnvironmentVariable($Name, "Process")
}

function ConvertFrom-Secret {
  param([Security.SecureString]$Value)

  $Pointer = [Runtime.InteropServices.Marshal]::SecureStringToBSTR($Value)
  try {
    return [Runtime.InteropServices.Marshal]::PtrToStringBSTR($Pointer)
  }
  finally {
    [Runtime.InteropServices.Marshal]::ZeroFreeBSTR($Pointer)
  }
}

if ([string]::IsNullOrWhiteSpace($AdminEmail)) {
  $AdminEmail = Read-Host "DOCSSAM 관리자 이메일"
}
$AdminEmail = $AdminEmail.Trim().ToLowerInvariant()
if ($AdminEmail -notmatch '^[^\s@]+@[^\s@]+\.[^\s@]+$') {
  throw "관리자 이메일 형식이 올바르지 않습니다."
}

$Deno = Get-Command deno -ErrorAction Stop
$SecretInput = Read-Host "Hyper Focus Supabase secret key" -AsSecureString
$PasswordInput = Read-Host "관리자 비밀번호(16자 이상)" -AsSecureString
$PasswordConfirmInput = Read-Host "관리자 비밀번호 확인" -AsSecureString

$SecretKey = $null
$AdminPassword = $null
$AdminPasswordConfirm = $null
try {
  $SecretKey = ConvertFrom-Secret $SecretInput
  $AdminPassword = ConvertFrom-Secret $PasswordInput
  $AdminPasswordConfirm = ConvertFrom-Secret $PasswordConfirmInput

  if ($SecretKey -notmatch '^sb_secret_') {
    throw "publishable key가 아닌 sb_secret_ 형식의 프로젝트 secret key가 필요합니다."
  }
  if ($AdminPassword.Length -lt 16) {
    throw "관리자 비밀번호는 16자 이상이어야 합니다."
  }
  if ($AdminPassword -cne $AdminPasswordConfirm) {
    throw "관리자 비밀번호 확인이 일치하지 않습니다."
  }

  $env:SUPABASE_URL = $ProjectUrl
  $env:SUPABASE_SECRET_KEY = $SecretKey
  $env:HF_ADMIN_EMAIL = $AdminEmail
  $env:HF_ADMIN_PASSWORD = $AdminPassword

  & $Deno.Source run --allow-env --allow-net $BootstrapScript
  if ($LASTEXITCODE -ne 0) {
    throw "관리자 부트스트랩이 실패했습니다(exit $LASTEXITCODE)."
  }
}
finally {
  foreach ($Name in $EnvironmentNames) {
    [Environment]::SetEnvironmentVariable($Name, $PreviousEnvironment[$Name], "Process")
  }
  $PreviousEnvironment.Clear()
  $SecretKey = $null
  $AdminPassword = $null
  $AdminPasswordConfirm = $null
  $SecretInput = $null
  $PasswordInput = $null
  $PasswordConfirmInput = $null
}
