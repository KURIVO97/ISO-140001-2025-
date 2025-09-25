<#
    Script: import-sample-data.ps1
    Description: Importa los archivos de datos de ejemplo (empresa_demo.json, rh1_demo.csv, rhps_demo.csv,
                 acta_incineracion_demo.csv), valida su estructura y genera métricas agregadas.
    Uso: powershell -ExecutionPolicy Bypass -File scripts/import-sample-data.ps1
#>

$ErrorActionPreference = 'Stop'

$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$root = Split-Path -Parent $scriptDir
$sampleDir = Join-Path $root 'docs/sample-data'

if (-not (Test-Path $sampleDir)) {
    throw "No se encontró el directorio de datos de muestra: $sampleDir"
}

$empresaPath = Join-Path $sampleDir 'empresa_demo.json'
$rh1Path = Join-Path $sampleDir 'rh1_demo.csv'
$rhpsPath = Join-Path $sampleDir 'rhps_demo.csv'
$actaPath = Join-Path $sampleDir 'acta_incineracion_demo.csv'

foreach ($file in @($empresaPath,$rh1Path,$rhpsPath,$actaPath)) {
    if (-not (Test-Path $file)) {
        throw "Archivo requerido no encontrado: $file"
    }
}

Write-Host "Importando empresa demo..." -ForegroundColor Cyan
$empresa = Get-Content $empresaPath -Raw | ConvertFrom-Json

Write-Host "Importando RH1..." -ForegroundColor Cyan
$rh1 = Import-Csv $rh1Path

Write-Host "Importando RHPS..." -ForegroundColor Cyan
$rhps = Import-Csv $rhpsPath

Write-Host "Importando acta de incineración..." -ForegroundColor Cyan
$actas = Import-Csv $actaPath

function Convert-ToDecimal($value) {
    if ([string]::IsNullOrWhiteSpace($value)) { return 0 }
    return [decimal]::Parse($value, [System.Globalization.CultureInfo]::InvariantCulture)
}

$categories = @(
    'aprovechables_kg','no_aprovechables_kg','organicos_kg',
    'biosanitarios_kg','anatomopatologicos_kg','cortopunzantes_kg',
    'farmacos_kg','corrosivos_kg','raee_kg'
)

$rh1Metrics = [ordered]@{}
foreach ($cat in $categories) { $rh1Metrics[$cat] = 0 }

foreach ($row in $rh1) {
    foreach ($cat in $categories) {
        $rh1Metrics[$cat] += Convert-ToDecimal $row.$cat
    }
}

$rh1Totals = [ordered]@{
    total_no_peligrosos = ($rh1Metrics['aprovechables_kg'] + $rh1Metrics['no_aprovechables_kg'] + $rh1Metrics['organicos_kg'])
    total_peligrosos = ($rh1Metrics['biosanitarios_kg'] + $rh1Metrics['anatomopatologicos_kg'] + $rh1Metrics['cortopunzantes_kg'] + $rh1Metrics['farmacos_kg'] + $rh1Metrics['corrosivos_kg'] + $rh1Metrics['raee_kg'])
}

$rhpsTotals = [ordered]@{
    biosanitarios_kg = 0
    anatomopatologicos_kg = 0
    cortopunzantes_kg = 0
    farmacos_kg = 0
    corrosivos_kg = 0
    raee_kg = 0
}
foreach ($row in $rhps) {
    $rhpsTotals['biosanitarios_kg'] += Convert-ToDecimal $row.biosanitarios_kg
    $rhpsTotals['anatomopatologicos_kg'] += Convert-ToDecimal $row.anatomopatologicos_kg
    $rhpsTotals['cortopunzantes_kg'] += Convert-ToDecimal $row.cortopunzantes_kg
    $rhpsTotals['farmacos_kg'] += Convert-ToDecimal $row.farmacos_kg
    $rhpsTotals['corrosivos_kg'] += Convert-ToDecimal $row.corrosivos_kg
    $rhpsTotals['raee_kg'] += Convert-ToDecimal $row.raee_kg
}

$acta = $actas | Select-Object -First 1
$conciliacion = [ordered]@{
    mes = $acta.mes
    cantidad_enviada_kg = Convert-ToDecimal $acta.cantidad_enviada_kg
    cantidad_incinerada_kg = Convert-ToDecimal $acta.cantidad_incinerada_kg
    diferencia_kg = Convert-ToDecimal $acta.diferencia_kg
}

$result = [ordered]@{
    empresa = $empresa.empresas[0].nombre
    sede = $empresa.empresas[0].sedes[0].nombre
    periodo = 'semana inicial septiembre 2025'
    rh1 = $rh1Metrics
    totales = $rh1Totals
    rhps = $rhpsTotals
    acta = $conciliacion
}

$aggregatePath = Join-Path $sampleDir 'aggregated_metrics.json'
$result | ConvertTo-Json -Depth 5 | Set-Content -Path $aggregatePath -Encoding UTF8

Write-Host "Métricas agregadas generadas en $aggregatePath" -ForegroundColor Green
Write-Host "Totales RH1 (No peligrosos / Peligrosos): $($rh1Totals.total_no_peligrosos) / $($rh1Totals.total_peligrosos)" -ForegroundColor Yellow
Write-Host "Total RHPS biosanitarios: $($rhpsTotals.biosanitarios_kg)" -ForegroundColor Yellow
Write-Host "Conciliación acta $($conciliacion.mes): Diferencia $($conciliacion.diferencia_kg) kg" -ForegroundColor Yellow
