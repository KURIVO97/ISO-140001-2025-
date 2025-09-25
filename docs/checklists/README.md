# Checklists PGIRASA

Pasos para aprovechar los archivos `.csv` y obtener cálculos automáticos en Excel o Google Sheets:

1. Importa el archivo CSV desde Excel (Datos → Desde texto/CSV) o Google Sheets (Archivo → Importar) y conviértelo en tabla.
2. Asegura el siguiente orden de columnas:
   - Pregunta
   - TipoRespuesta (`Si/No`, `Escala`, `Texto`)
   - Peso (%)
   - Requerido (Si/No)
   - Evidencia
   - Categoria
   - Respuesta
   - Puntaje
3. Aplica validaciones de datos en **Respuesta** según `TipoRespuesta`:
   - `Si/No`: lista con valores `Si`, `No`.
   - `Escala`: lista `1,2,3,4,5` (1 = desempeño nulo, 5 = cumplimiento total).
   - `Texto`: sin restricción, permite observaciones.
4. En la columna **Puntaje** usa la fórmula (ajusta la fila inicial):

   ```excel
   =IF(B2="Si/No",IF(G2="Si",1,0),IF(B2="Escala",VALUE(G2)/5,IF(B2="Texto",IF(G2<>"",1,0),0)))
   ```

5. Crea una hoja "Resumen" con:

   - **Peso total** (debe ser 100):
     ```excel
     =SUM(TablaChecklist[Peso (%)])
     ```
   - **Cumplimiento** (porcentaje):
     ```excel
     =SUMPRODUCT(TablaChecklist[Peso (%)],TablaChecklist[Puntaje])/100
     ```
   - **Estado**:
     ```excel
     =IFS(B2>=0.8,"Satisfactorio",B2>=0.6,"Con observaciones",TRUE,"No conforme")
     ```
     Sustituye `TablaChecklist` por el nombre de tu tabla y `B2` por la celda con el porcentaje calculado.

6. Opcional: añade columnas `Frecuencia` y `Responsable` si deseas planificar auditorías o asignar tareas.

7. Usa la plantilla `docs/FORMATO PGIRASA CEAD.xlsx` como base preconfigurada con las cabeceras de RH1, RHPS y actas de incineración; duplica las hojas según tus sedes y periodos.

8. Guarda el archivo como `.xlsx` para conservar validaciones y fórmulas; después súbelo a `docs/checklists/` o compártelo con el equipo.

## Calculadora de cumplimiento

Las filas finales llamadas `Total peso` ayudan a verificar que los pesos sumen 100. Los cálculos automáticos sólo funcionarán una vez conviertas el CSV en Excel/Sheets porque los archivos CSV no guardan fórmulas.

## Archivos incluidos

- `pgirasa_evaluacion.csv`
- `gestor_externo_evaluacion.csv`
- `central_residuos_evaluacion.csv`
- `../FORMATO PGIRASA CEAD.xlsx`

Cada archivo integra preguntas base alineadas con Resolución 591 de 2024, ISO 14001:2015 y buenas prácticas de gestión ambiental en sector salud.
