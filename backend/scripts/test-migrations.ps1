$ErrorActionPreference = 'Stop'
$backendRoot = Split-Path -Parent $PSScriptRoot
$composeFile = Join-Path $backendRoot 'compose.migrations-test.yml'
$projectName = 'handycraft-migrations-' + [guid]::NewGuid().ToString('N').Substring(0, 12)

function Invoke-TestCompose {
    & docker compose -f $composeFile -p $projectName @args
    if ($LASTEXITCODE -ne 0) {
        throw "Migration test command failed (exit $LASTEXITCODE): $args"
    }
}

try {
    Invoke-TestCompose up -d --wait db
    Invoke-TestCompose run --rm migrate up 1
    Invoke-TestCompose exec -T db psql -X -v ON_ERROR_STOP=1 -U migration_test -d handycraft_migration_test -f /tests/smoke.sql
    Invoke-TestCompose run --rm migrate down 1
    Invoke-TestCompose exec -T db psql -X -v ON_ERROR_STOP=1 -U migration_test -d handycraft_migration_test -f /tests/empty.sql
    Invoke-TestCompose run --rm migrate up 1
    Invoke-TestCompose exec -T db psql -X -v ON_ERROR_STOP=1 -U migration_test -d handycraft_migration_test -f /tests/smoke.sql
    Write-Host 'PASS: up -> checks -> down -> empty -> up -> checks'
}
finally {
    # Only this invocation's randomly named test project is removed.
    & docker compose -f $composeFile -p $projectName down --volumes --remove-orphans
    if ($LASTEXITCODE -ne 0) {
        Write-Warning "Could not clean up test project $projectName"
    }
}
