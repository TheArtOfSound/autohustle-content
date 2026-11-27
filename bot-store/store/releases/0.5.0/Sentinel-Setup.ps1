param([ValidateSet('Install','Open','Start','Stop','Status','Uninstall')][string]$Action='Install')
$ErrorActionPreference='Stop'
$ProgressPreference='SilentlyContinue'
$root=Join-Path $env:LOCALAPPDATA 'BotAutoHustle\SentinelStudio'
$app=Join-Path $root 'app'; $data=Join-Path $root 'data'; $node=Join-Path $app 'node.exe'
$entry=Join-Path $app 'sentinel-studio.mjs'; $manager=Join-Path $app 'Sentinel-Setup.ps1'
$envFile=Join-Path $data 'runtime.env'
$task='BotAutoHustle-Sentinel-'+[Security.Principal.WindowsIdentity]::GetCurrent().User.Value
$menu=Join-Path ([Environment]::GetFolderPath('Programs')) 'Bot.AutoHustle Sentinel Studio'
$url='http://127.0.0.1:4317/'
$expected='259ea21d5cc11f2ec2d56d3be4ef02a7accc4a6d65270cb13fb9aa7d7e785e55'
function Get-Task { Get-ScheduledTask -TaskName $task -ErrorAction SilentlyContinue }
function Test-Engine {
    try { $id=Invoke-RestMethod ($url+'api/identity') -TimeoutSec 2; return ($id.product -eq 'sentinel-studio' -and $id.version -eq '0.5.0') } catch { return $false }
}
function Stop-Engine {
    $t=Get-Task
    if ($t -and $t.State -eq 'Running') { Stop-ScheduledTask -TaskName $task; for($i=0;$i -lt 30;$i++){if((Get-Task).State -ne 'Running'){break};Start-Sleep -Milliseconds 200};if((Get-Task).State -eq 'Running'){throw 'Sentinel did not stop.'} }
}
function Start-Engine {
    $t=Get-Task; if(-not $t){throw 'Sentinel is not installed.'}
    if($t.State -ne 'Running'){Start-ScheduledTask -TaskName $task}
    for($i=0;$i -lt 30;$i++){if(Test-Engine){return};Start-Sleep -Milliseconds 300}
    throw 'Sentinel did not respond on port 4317. Check Task Scheduler for the Sentinel task and confirm that the port is free.'
}
function Shortcut($name,$verb){
    $shell=New-Object -ComObject WScript.Shell
    $link=$shell.CreateShortcut((Join-Path $menu ($name+'.lnk')))
    $link.TargetPath=(Join-Path $PSHOME 'powershell.exe')
    $link.Arguments='-NoProfile -File "'+$manager+'" -Action '+$verb
    $link.WorkingDirectory=$data; $link.Save()
}
switch($Action){
    'Open' {Start-Engine;Start-Process $url;return}
    'Start' {Start-Engine;Write-Host 'Sentinel engine is running.';return}
    'Stop' {Stop-Engine;Write-Host 'Sentinel engine stopped. Your saved monitoring preference is retained.';return}
    'Status' {$t=Get-Task;if($t){$t|Select-Object TaskName,State|Format-List;Write-Host ('Engine responding: '+(Test-Engine));Write-Host ('Data: '+$data)}else{Write-Host 'Not installed.'};return}
    'Uninstall' {
        if((Read-Host 'Remove Sentinel application and its logon task? Monitoring data will remain. Type REMOVE') -cne 'REMOVE'){return}
        Stop-Engine;if(Get-Task){Unregister-ScheduledTask -TaskName $task -Confirm:$false}
        if(Test-Path $menu){Remove-Item -LiteralPath $menu -Recurse -Force}
        if(Test-Path $app){Remove-Item -LiteralPath $app -Recurse -Force}
        Write-Host ('Uninstalled. Your monitoring data remains at '+$data);return
    }
}
if($env:OS -ne 'Windows_NT' -or -not [Environment]::Is64BitOperatingSystem -or $env:PROCESSOR_ARCHITECTURE -ne 'AMD64'){throw 'This evaluation installer targets Windows x64 using 64-bit Windows PowerShell.'}
if(Get-Task){throw 'An installation already exists. Uninstall first (data is retained).'}
if(Test-Path $app){throw 'An application folder already exists. Inspect or remove it before retrying; data is separate.'}
Write-Host 'Sentinel Studio 0.5 | Windows x64 evaluation'
Write-Host 'Installs only for this user; downloads the official Node.js 22 runtime; creates a visible Task Scheduler entry and Start menu shortcuts. No administrator elevation requested.'
if((Read-Host 'Continue? Type INSTALL') -cne 'INSTALL'){return}
$auto=(Read-Host 'Start engine automatically when you sign in? [y/N]') -match '^[Yy]$'
$resume=(Read-Host 'Resume previously enabled monitoring when engine starts? [y/N]') -match '^[Yy]$'
$stage=Join-Path ([IO.Path]::GetTempPath()) ('sentinel-'+[Guid]::NewGuid())
New-Item -ItemType Directory -Path $stage | Out-Null
$createdTask=$false; $createdApp=$false; $createdMenu=$false
try {
    [Net.ServicePointManager]::SecurityProtocol=[Net.SecurityProtocolType]::Tls12
    $dist='https://nodejs.org/dist/latest-v22.x/'
    $manifest=(Invoke-WebRequest -Uri ($dist+'SHASUMS256.txt') -UseBasicParsing -MaximumRedirection 0).Content
    $m=[regex]::Match($manifest,'(?m)^([a-fA-F0-9]{64})\s+(node-v22\.\d+\.\d+-win-x64\.zip)\s*$')
    if(-not $m.Success){throw 'Could not locate the official Windows x64 release checksum.'}
    $archive=Join-Path $stage $m.Groups[2].Value
    Invoke-WebRequest -Uri ($dist+$m.Groups[2].Value) -OutFile $archive -UseBasicParsing -MaximumRedirection 0
    if((Get-FileHash -LiteralPath $archive -Algorithm SHA256).Hash -ine $m.Groups[1].Value){throw 'Node archive checksum mismatch.'}
    Expand-Archive -LiteralPath $archive -DestinationPath $stage
    $runtime=Join-Path $stage ([IO.Path]::GetFileNameWithoutExtension($archive));$binary=Join-Path $runtime 'node.exe'
    $signature=Get-AuthenticodeSignature -FilePath $binary
    if($signature.Status -ne 'Valid' -or $signature.SignerCertificate.Subject -notmatch '(?i)(?:^|,\s*)(?:CN|O)=(?:OpenJS Foundation|Node\.js Foundation)(?:,|$)'){throw 'Node runtime publisher signature could not be verified.'}
    $source=Join-Path $PSScriptRoot 'sentinel-studio.mjs';$stagedSource=Join-Path $stage 'sentinel-studio.mjs'
    if(Test-Path $source){Copy-Item -LiteralPath $source -Destination $stagedSource}else{Invoke-WebRequest -Uri 'https://bot.autohustle.online/store/releases/0.5.0/sentinel-studio.mjs' -OutFile $stagedSource -UseBasicParsing -MaximumRedirection 0}
    if((Get-FileHash -LiteralPath $stagedSource -Algorithm SHA256).Hash -ine $expected){throw 'Sentinel source checksum mismatch.'}
    & $binary --check $stagedSource;if($LASTEXITCODE -ne 0){throw 'Sentinel source syntax check failed.'}
    New-Item -ItemType Directory -Path $app -Force|Out-Null;$createdApp=$true
    New-Item -ItemType Directory -Path $data -Force|Out-Null
    Copy-Item -LiteralPath $binary -Destination $node; Copy-Item -LiteralPath $stagedSource -Destination $entry; Copy-Item -LiteralPath $PSCommandPath -Destination $manager
    foreach($f in @('LICENSE','README.md')){if(Test-Path (Join-Path $runtime $f)){Copy-Item -LiteralPath (Join-Path $runtime $f) -Destination (Join-Path $app ('node-'+$f))}}
    @('SENTINEL_PORT=4317',('SENTINEL_RESUME='+[int]$resume)) | Set-Content -LiteralPath $envFile -Encoding ASCII
    $args='--env-file="'+$envFile+'" "'+$entry+'"'
    $act=New-ScheduledTaskAction -Execute $node -Argument $args -WorkingDirectory $data
    $principal=New-ScheduledTaskPrincipal -UserId ([Security.Principal.WindowsIdentity]::GetCurrent().Name) -LogonType Interactive -RunLevel Limited
    $settings=New-ScheduledTaskSettingsSet -MultipleInstances IgnoreNew -ExecutionTimeLimit ([TimeSpan]::Zero) -RestartCount 3 -RestartInterval (New-TimeSpan -Minutes 1) -AllowStartIfOnBatteries -DontStopIfGoingOnBatteries
    if($auto){$trigger=New-ScheduledTaskTrigger -AtLogOn -User ([Security.Principal.WindowsIdentity]::GetCurrent().Name);Register-ScheduledTask -TaskName $task -Action $act -Principal $principal -Settings $settings -Trigger $trigger -Description 'Sentinel Studio local website monitor (user-installed)'|Out-Null}else{Register-ScheduledTask -TaskName $task -Action $act -Principal $principal -Settings $settings -Description 'Sentinel Studio local website monitor (user-installed)'|Out-Null}
    $createdTask=$true
    if(Test-Path $menu){throw 'Start menu folder already exists; refusing to overwrite.'};New-Item -ItemType Directory -Path $menu|Out-Null;$createdMenu=$true
    Shortcut 'Open Sentinel Studio' 'Open';Shortcut 'Stop Sentinel engine' 'Stop';Shortcut 'Sentinel status' 'Status';Shortcut 'Uninstall Sentinel' 'Uninstall'
    Start-Engine;Start-Process $url
    Write-Host ('Installed. Data: '+$data)
} catch {
    if($createdTask){Stop-Engine;Unregister-ScheduledTask -TaskName $task -Confirm:$false}
    if($createdMenu -and (Test-Path $menu)){Remove-Item -LiteralPath $menu -Recurse -Force}
    if($createdApp -and (Test-Path $app)){Remove-Item -LiteralPath $app -Recurse -Force}
    throw
} finally {Remove-Item -LiteralPath $stage -Recurse -Force -ErrorAction SilentlyContinue}
