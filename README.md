# Plataforma PGIRASA – ISO 14001:2015

Repositorio monorepo que soporta el desarrollo de la plataforma para gestionar PGIRASA y cumplimiento ISO 14001:2015 enfocada al sector salud.

## Estructura

```
.
├── backend/              # API Express + TypeScript (REST)
├── frontend/             # SPA React + Vite
├── docs/                 # Checklists, datos de muestra, criterios de historias
├── scripts/              # Scripts de utilidad (importación de datos)
└── PGIRASA_MVP.fig       # Prototipo UX/UI completo
```

## Requisitos

- Node.js >= 18
- npm (o pnpm/yarn) compatible

## Instalación

```bash
# Instala dependencias
cd backend && npm install
cd ../frontend && npm install
```

## Variables de entorno

Backend (`backend/.env`):

```
PORT=4000
```

Frontend: no requiere variables por defecto, pero puedes crear `frontend/.env` para ajustar `VITE_API_URL` si deseas sobreescribir el proxy.

## Scripts

Backend:

- `npm run dev` – levanta API con recarga en caliente (puerto 4000)
- `npm run build` – compila a `dist/`
- `npm start` – ejecuta versión compilada

Frontend:

- `npm run dev` – inicia Vite (puerto 5173, proxy `/api` → backend 4000)
- `npm run build` – genera build de producción en `dist/`
- `npm run preview` – sirve build generado

## Datos de prueba

Ejecuta el script para generar métricas y validar los registros de ejemplo:

```bash
powershell -ExecutionPolicy Bypass -File scripts/import-sample-data.ps1
```

Los resultados se escriben en `docs/sample-data/aggregated_metrics.json` y sirven como base para probar el dashboard.

## Próximos pasos sugeridos

1. Implementar autenticación y control de roles.
2. Persistir datos en una base real (PostgreSQL) en lugar de CSV.
3. Añadir tests automatizados (Jest/React Testing Library, supertest para API).
4. Integrar despliegues automatizados (CI/CD) y documentación OpenAPI.
