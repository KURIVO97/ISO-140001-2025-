# Datos de prueba PGIRASA MVP

Este directorio contiene un set actualizado con datos reales del primer semestre para validar las historias del Sprint 2.

## Archivos

- `empresa_demo.json`: Estructura base de "Hospital Demo S.A.S." con una sede piloto y metadatos del PGIRASA vigente.
- `rh1_demo.csv`: Registros diarios RH1 para la primera semana de septiembre de 2025 (sede `SED-2025-09-01`).
- `rhps_demo.csv`: Dos recolecciones RHPS asociadas a la sede piloto, con manifiestos y gestor externo.
- `acta_incineracion_demo.csv`: Consolidado mensual de incineración, conciliado con los RHPS del periodo.
- `aggregated_metrics.json`: Resultado generado por `scripts/import-sample-data.ps1` con totales por categoría (no peligrosos, peligrosos) y conciliación mensual.

## Cómo usarlos

1. Importa los CSV en la base de datos o en hojas de cálculo para pruebas manuales.
2. Verifica que los consecutivos respeten los formatos definidos en los criterios (`SED-AAAA-MM-##`, `RHPS-YYYYMMDD-##`).
3. Utiliza `empresa_demo.json` como semilla para crear la empresa y sede inicial dentro de la aplicación.
4. Ejecuta `powershell -ExecutionPolicy Bypass -File scripts/import-sample-data.ps1` para generar métricas agregadas y validar que los totales coincidan con los reportes del semestre.
5. Usa la información del acta mensual para probar el flujo `US-PG-04` y las alertas por diferencias (>10%).

## Próximos pasos sugeridos

- Extender los datos a un trimestre completo antes de la prueba piloto.
- Añadir ejemplos de capacitaciones y checklists diligenciados cuando se implemente `US-PG-05` y `US-PG-09`.
- Crear scripts de importación adicionales (REST/GraphQL) si necesitas cargar estos datos directamente en la aplicación.
