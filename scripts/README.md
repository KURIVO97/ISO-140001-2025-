# Scripts

## import-sample-data.ps1

Importa los datasets de `docs/sample-data/` y genera métricas agregadas para validar los cálculos del MVP.

**Uso**

```powershell
powershell -ExecutionPolicy Bypass -File scripts/import-sample-data.ps1
```

**Salida**
- `docs/sample-data/aggregated_metrics.json` con totales por categoría.
- Mensajes en consola con totales de residuos no peligrosos vs peligrosos, sumarizados para pruebas rápidas.

Ajusta o extiende el script si agregas nuevas columnas o archivos al dataset.
