# Script de Configuração Automática do IIS para Porto Brasil com Autenticação
# IMPORTANTE: Execute o PowerShell como Administrador.

Write-Host "Iniciando configuração do IIS para Porto Brasil (Com Autenticação)..." -ForegroundColor Cyan

# Verifica Privilégios de Admin
if (!([Security.Principal.WindowsPrincipal][Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole] "Administrator")) {
    Write-Warning "Este script precisa ser executado como ADMINISTRADOR!"
    Write-Warning "Por favor, feche, abra o PowerShell como Administrador e tente novamente."
    Start-Sleep -Seconds 5
    Exit
}

# Parâmetros
$siteName = "PortoBrasil"
$port = 8090
$path = "c:\ikazin\porto-brasil\dist"
$firewallRuleName = "Porto Brasil LAN Rule"
$userName = "ikazin"
$passwordPlain = "Acesso@2026"

try {
    Import-Module WebAdministration -ErrorAction Stop
}
catch {
    Write-Error "Não foi possível carregar o módulo do IIS. Verifique se o IIS está habilitado."
    Exit
}

# 1. Habilitar Basic Authentication no Windows (Feature)
Write-Host "Verificando recurso de Autenticação Básica do IIS..." -ForegroundColor Gray
$basicAuthFeature = Get-WindowsOptionalFeature -Online -FeatureName "IIS-BasicAuthentication"
if ($basicAuthFeature.State -ne "Enabled") {
    Write-Host "Instalando IIS-BasicAuthentication (pode demorar um pouco)..." -ForegroundColor Yellow
    Enable-WindowsOptionalFeature -Online -FeatureName "IIS-BasicAuthentication" -All -NoRestart
}

# 2. Criar/Atualizar Usuário do Windows
Write-Host "Configurando usuário '$userName'..." -ForegroundColor Gray
$securePassword = ConvertTo-SecureString $passwordPlain -AsPlainText -Force

if (Get-LocalUser -Name $userName -ErrorAction SilentlyContinue) {
    Set-LocalUser -Name $userName -Password $securePassword
    Write-Host "Senha do usuário '$userName' atualizada." -ForegroundColor Green
}
else {
    New-LocalUser -Name $userName -Password $securePassword -FullName "Usuario IIS PortoBrasil" -Description "Acesso ao site PortoBrasil"
    Write-Host "Usuário '$userName' criado." -ForegroundColor Green
}

# 3. Limpeza Antiga
if (Get-Website | Where-Object { $_.Name -eq $siteName }) {
    Remove-Website -Name $siteName
}

# 4. Criar Site
Write-Host "Criando Site '$siteName' na porta $port..." -ForegroundColor Green
if (!(Test-Path $path)) {
    Write-Error "Pasta $path não encontrada! Rode 'npm run build' antes."
    Exit
}
New-Website -Name $siteName -Port $port -PhysicalPath $path -Force

# 5. Configurar Permissões de Pasta (ACL) para o usuário ler a pasta
$acl = Get-Acl $path
$permission = "$userName", "ReadAndExecute", "ContainerInherit,ObjectInherit", "None", "Allow"
$accessRule = New-Object System.Security.AccessControl.FileSystemAccessRule $permission
$acl.SetAccessRule($accessRule)
Set-Acl $path $acl
Write-Host "Permissões de leitura na pasta concedidas ao usuário '$userName'." -ForegroundColor Green

# 6. Configurar Autenticação no IIS
Write-Host "Configurando Autenticação (Basic ON, Anonymous OFF)..." -ForegroundColor Green
# Desabilita Anônimo
Set-WebConfigurationProperty -Filter /system.webServer/security/authentication/anonymousAuthentication -Name enabled -Value False -PSPath "IIS:\Sites\$siteName"
# Habilita Básico
Set-WebConfigurationProperty -Filter /system.webServer/security/authentication/basicAuthentication -Name enabled -Value True -PSPath "IIS:\Sites\$siteName"

# 7. Firewall (Garante que a regra existe)
Remove-NetFirewallRule -DisplayName $firewallRuleName -ErrorAction SilentlyContinue
New-NetFirewallRule -DisplayName $firewallRuleName -Direction Inbound -LocalPort $port -Protocol TCP -Action Allow | Out-Null

# 8. Finalização
$ipAddresses = Get-NetIPAddress -AddressFamily IPv4 | Where-Object { $_.InterfaceAlias -notlike "*Loopback*" -and $_.PrefixOrigin -ne "Manual" } | Select-Object -ExpandProperty IPAddress

Write-Host "`n✅ CONFIGURAÇÃO CONCLUÍDA!" -ForegroundColor Green
Write-Host "Usuário: $userName"
Write-Host "Senha:   $passwordPlain"
Write-Host "--------------------------------------------------"
Write-Host "Links de acesso:"
Write-Host "  -> http://localhost:$port"
foreach ($ip in $ipAddresses) {
    Write-Host "  -> http://${ip}:${port}"
}
Write-Host "--------------------------------------------------"
Write-Host "Pressione qualquer tecla para sair..."
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
