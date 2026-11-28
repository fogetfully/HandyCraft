$ErrorActionPreference = 'Stop'
$repositoryRoot = Split-Path -Parent (Split-Path -Parent $PSScriptRoot)
$composeFile = Join-Path $repositoryRoot 'docker-compose.yml'
$projectName = 'handycraft-startup-' + [guid]::NewGuid().ToString('N').Substring(0, 12)
$portNames = @('POSTGRES_PORT', 'BACKEND_PORT', 'FRONTEND_PORT')
$savedPorts = @{}

function Invoke-TestCompose {
    & docker compose -f $composeFile -p $projectName @args
    if ($LASTEXITCODE -ne 0) {
        throw "Startup test command failed (exit $LASTEXITCODE): $args"
    }
}

function Invoke-TestSQL([string]$SQL) {
    $result = $SQL | & docker compose -f $composeFile -p $projectName exec -T db psql -X -v ON_ERROR_STOP=1 -U handycraft -d handycraft -t -A
    if ($LASTEXITCODE -ne 0) { throw 'Database check failed' }
    return ($result -join "`n").Trim()
}

function Wait-TestHTTP([string]$URL) {
    $deadline = (Get-Date).AddMinutes(3)
    do {
        try {
            return Invoke-WebRequest -UseBasicParsing -Uri $URL -TimeoutSec 5
        }
        catch {
            if ((Get-Date) -ge $deadline) { throw "HTTP endpoint did not become ready: $URL" }
            Start-Sleep -Seconds 2
        }
    } while ($true)
}

function Test-RunningApp {
    $backendAddress = (Invoke-TestCompose port backend 8080 | Out-String).Trim()
    $frontendAddress = (Invoke-TestCompose port frontend 5173 | Out-String).Trim()
    $null = Wait-TestHTTP "http://$frontendAddress/"
    foreach ($address in @($backendAddress, $frontendAddress)) {
        $response = Wait-TestHTTP "http://$address/api/v1/posts"
        $body = $response.Content | ConvertFrom-Json
        if ($null -eq $body.items) { throw "API response has no items: $address" }
    }
    $version = Invoke-TestSQL 'SELECT version, dirty FROM schema_migrations;'
    if ($version -ne '1|f') { throw "Unexpected migration state: $version" }
    Write-Host 'PASS: frontend, backend, frontend API proxy and migration version'
}

try {
    foreach ($name in $portNames) {
        $savedPorts[$name] = [Environment]::GetEnvironmentVariable($name, 'Process')
        # Docker allocates an available host port when published port is zero.
        [Environment]::SetEnvironmentVariable($name, '0', 'Process')
    }

    Invoke-TestCompose up --build -d --wait --wait-timeout 180
    Test-RunningApp
    $null = Invoke-TestSQL @'
INSERT INTO "Users" ("Name", "email", "password", "created")
VALUES ('Persistence check', 'startup-test@example.test', 'test-fixture-only', CURRENT_TIMESTAMP);
'@

    # Deliberately preserve the volume; the second up must retain its data.
    Invoke-TestCompose down
    Invoke-TestCompose up -d --wait --wait-timeout 180
    Test-RunningApp
    $count = Invoke-TestSQL @'
SELECT count(*) FROM "Users" WHERE "email" = 'startup-test@example.test';
'@
    if ($count -ne '1') { throw 'Database record did not survive down/up' }
    Write-Host 'PASS: one-command startup, migrations and data persistence after down/up'
}
catch {
    & docker compose -f $composeFile -p $projectName logs --no-color --tail 80
    throw
}
finally {
    # This random project was created solely for this test; never target the dev project.
    & docker compose -f $composeFile -p $projectName down --volumes --remove-orphans
    if ($LASTEXITCODE -ne 0) { Write-Warning "Could not clean up test project $projectName" }
    foreach ($name in $savedPorts.Keys) {
        [Environment]::SetEnvironmentVariable($name, $savedPorts[$name], 'Process')
    }
}
