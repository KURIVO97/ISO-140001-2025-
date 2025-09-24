## US-AC-01 – Crear empresa

| Rol creador/edición | Rol lectura | Campos & validaciones | Flujo & reglas | Notificaciones |
| --- | --- | --- | --- | --- |
| Admin corporativo | Todos los usuarios de la empresa | Nombre empresa*, NIT*, Dirección, Contacto; Responsable: Nombre*, Cédula*, Correo*, Celular*, Cargo*, Empresa*, Sede*; validar formato NIT, correo corporativo, cédula 8‑12 dígitos, celular numérico | Estados: Borrador → Activa; consecutivo `EMP-####`; bitácora de cambios; visibilidad total para usuarios de la empresa | Al guardar: alerta inmediata al admin corporativo; si queda en Borrador, recordatorio diario por 3 días |

**Notas**
- El responsable registrado queda con rol administrador de empresa.
- Las empresas activas son prerequisito para crear sedes o cargar PGIRASA.

---

## US-RS-01 – Solicitud de sede

| Rol creador/edición | Rol lectura | Campos & validaciones | Flujo & reglas | Notificaciones |
| --- | --- | --- | --- | --- |
| Responsable de sede | Todos los usuarios de la empresa | Datos sede (Nombre*, Dirección*, Tipo); Responsable (Nombre*, Cédula*, Correo*, Celular*, Cargo*, Empresa*, Sede*); validar correo corporativo, cédula 8‑12 dígitos, celular numérico | Estados: Borrador → Enviada → Aprobada/Rechazada; único registro activo por sede; consecutivo `SED-AAAA-MM-##`; bitácora con comentarios del admin | Al enviar: alerta inmediata al admin; si sigue en revisión tras 24 h, recordatorio diario 3 días |

**Notas**
- Solo el admin corporativo puede aprobar o rechazar.
- Al aprobar, se asignan plantillas corporativas y roles locales automáticamente.

---

## US-PG-01 – Cargar PGIRASA

| Rol creador/edición | Rol lectura | Campos & validaciones | Flujo & reglas | Notificaciones |
| --- | --- | --- | --- | --- |
| Responsable de sede | Usuarios de la empresa y admins corporativos | Archivo PGIRASA (PDF/XLS, ≤10 MB), versión*, vigencia desde/hasta*, comentario; validar fechas (vigencia futura), formatos permitidos | Estados: Borrador → En revisión → Vigente; mantiene histórico de versiones; bitácora de revisiones | Al enviar a revisión: alerta inmediata al admin; si permanece en revisión >3 días, recordatorio diario |

**Notas**
- La versión vigente se usa como referencia en evaluaciones y auditorías.
- El sistema debe impedir eliminar versiones aprobadas.

---

## US-PG-02 – Registro RH1 diario

| Rol creador/edición | Rol lectura | Campos & validaciones | Flujo & reglas | Notificaciones |
| --- | --- | --- | --- | --- |
| Responsable de sede | Todos los usuarios de la empresa | Fecha*, turno, cantidades (kg) por categoría: aprovechables, no aprovechables, orgánicos, biosanitarios, anatomopatológicos, cortopunzantes, fármacos, corrosivos, RAEE; comentarios opcionales; validar una entrada por sede/día, números ≥0 | Estado único: Registrado; suma automática a totales mensuales, semestrales (Ene-Jun, Jul-Dic) y anual; bloqueo de fechas futuras; bitácora de modificaciones | Si falta RH1 del día anterior: alerta inmediata + recordatorio diario 3 días |

**Notas**
- Cada registro genera consecutivo diario `RH1-AAAA-MM-DD`.
- Totales semestrales se muestran en indicadores y en el informe semestral.

---

## US-PG-03 – Registro RHPS (recolección)

| Rol creador/edición | Rol lectura | Campos & validaciones | Flujo & reglas | Notificaciones |
| --- | --- | --- | --- | --- |
| Responsable de sede | Todos los usuarios de la empresa | Fecha/hora*, proveedor*, número de manifiesto*, cantidades (kg) por categoría, destino*, vehículo, firma digital; validar gestor externo activo y un RHPS por recolección | Estados: Borrador → Registrado; consecutivo `RHPS-aaaammdd-##`; alimenta actas mensuales e indicadores; bitácora detallada | Al registrar: alerta admin corporativo; si queda en Borrador, recordatorio diario 3 días |

**Notas**
- Cada RHPS se vincula a los registros RH1 correspondientes para conciliación.
- Permitir carga de soporte (manifiesto escaneado) en PDF ≤5 MB.

---

## US-PG-04 – Acta de incineración mensual

| Rol creador/edición | Rol lectura | Campos & validaciones | Flujo & reglas | Notificaciones |
| --- | --- | --- | --- | --- |
| Responsable de sede | Todos los usuarios de la empresa | Mes/año*, cantidades enviadas (precargadas de RHPS), cantidad incinerada*, justificación si diferencia >10%, acta adjunta (PDF ≤5 MB) | Estado único: Emitida; compara cantidades y señala alertas; suma a totales semestrales/anuales; bitácora | Si no se carga antes del día 5 del mes siguiente: alerta y recordatorio diario 3 días |

**Notas**
- Las diferencias mayores al 10% generan tarea de seguimiento para el admin.
- El acta consolida automáticamente todos los RHPS del mes.

---

## US-PG-06 – Dashboard de indicadores

| Rol creador/edición | Rol lectura | Campos & validaciones | Flujo & reglas | Notificaciones |
| --- | --- | --- | --- | --- |
| Admin corporativo y responsables de sede (configuran filtros) | Todos los usuarios de la empresa | Filtros: rango (mensual, semestral, anual), empresa, sede, tipo de residuo; mostrar datos de RH1, RHPS, actas | Visualiza totales y porcentajes por categoría (peligrosos vs no peligrosos, subtipos); gráficos y tablas exportables PDF/XLS; recalcula al registrar datos | Sin notificaciones automáticas; se registra en bitácora cada exportación generada |

**Notas**
- Debe mostrar totales semestrales (Ene-Jun, Jul-Dic) y anual.
- Permitir comparación contra metas (cuando estén definidas).

---

## US-PG-07 – Informe semestral

| Rol creador/edición | Rol lectura | Campos & validaciones | Flujo & reglas | Notificaciones |
| --- | --- | --- | --- | --- |
| Responsable de sede (prepara), Admin corporativo (aprueba) | Todos los usuarios de la empresa | Periodo (Ene-Jun o Jul-Dic)*, datos precargados de RH1/RHPS/actas/capacitaciones; campos editables requieren justificación*; adjuntos opcionales | Flujo: Borrador → En revisión → Aprobado; un informe por sede/semestre; al aprobar se bloquea edición; bitácora completa | Al enviar a revisión: alerta inmediata al admin; recordatorio diario 3 días mientras esté pendiente; al aprobar: alerta general |

**Notas**
- Exportación en PDF/XLS cumple formato para comités y reporte semestral.
- Se debe guardar versión histórica de cada informe aprobado.

---

## US-PG-08 – Recordatorio RESPEL anual

| Rol creador/edición | Rol lectura | Campos & validaciones | Flujo & reglas | Notificaciones |
| --- | --- | --- | --- | --- |
| Responsable de sede | Admin corporativo y responsables de sede | Tarea con checklist (pasos predefinidos), adjunto obligatorio al completar, fecha límite: 20 de febrero | Estados: Pendiente → En progreso → Completado; exige adjunto para completarse; historial anual consultable | Alertas 30, 15 y 7 días antes de la fecha límite; si no se completa el 20 Feb: alerta diaria 3 días |

**Notas**
- El checklist debe alinearse con la plataforma RESPEL.
- Registrar quién subió el soporte y fecha/hora exacta.
