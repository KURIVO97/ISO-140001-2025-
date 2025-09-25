import cors from 'cors';
import express from 'express';
import morgan from 'morgan';
import path from 'node:path';
import { readFileSync } from 'node:fs';
import { z } from 'zod';

type Rh1Record = {
  fecha: string;
  turno: string;
  sede_id: string;
  aprovechables_kg: number;
  no_aprovechables_kg: number;
  organicos_kg: number;
  biosanitarios_kg: number;
  anatomopatologicos_kg: number;
  cortopunzantes_kg: number;
  farmacos_kg: number;
  corrosivos_kg: number;
  raee_kg: number;
  comentario: string;
};

type RhpsRecord = {
  fecha_hora: string;
  sede_id: string;
  proveedor: string;
  numero_manifiesto: string;
  destino: string;
  vehiculo: string;
  firmado_por: string;
  biosanitarios_kg: number;
  anatomopatologicos_kg: number;
  cortopunzantes_kg: number;
  farmacos_kg: number;
  corrosivos_kg: number;
  raee_kg: number;
  adjunto: string;
};

type ActaRecord = {
  mes: string;
  sede_id: string;
  cantidad_enviada_kg: number;
  cantidad_incinerada_kg: number;
  diferencia_kg: number;
  justificacion: string;
  acta_pdf: string;
};

const app = express();
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

const dataDir = path.resolve(__dirname, '..', '..', 'docs', 'sample-data');

const loadJsonFile = <T>(filename: string): T => {
  const filePath = path.join(dataDir, filename);
  const raw = readFileSync(filePath, 'utf-8');
  return JSON.parse(raw) as T;
};

const parseCsv = (filename: string): Record<string, string>[] => {
  const filePath = path.join(dataDir, filename);
  const raw = readFileSync(filePath, 'utf-8');
  const [headerLine, ...rows] = raw.trim().split(/\r?\n/);
  const headers = headerLine.split(',');
  return rows.map((line) => {
    const values = line.split(',');
    const record: Record<string, string> = {};
    headers.forEach((header, index) => {
      record[header] = values[index]?.replace(/^"|"$/g, '') ?? '';
    });
    return record;
  });
};

const numericFields = [
  'aprovechables_kg',
  'no_aprovechables_kg',
  'organicos_kg',
  'biosanitarios_kg',
  'anatomopatologicos_kg',
  'cortopunzantes_kg',
  'farmacos_kg',
  'corrosivos_kg',
  'raee_kg',
];

const toRh1Records = (): Rh1Record[] =>
  parseCsv('rh1_demo.csv').map((row) => {
    const base: Record<string, unknown> = { ...row };
    numericFields.forEach((field) => {
      base[field] = Number.parseFloat(row[field] ?? '0');
    });
    return base as Rh1Record;
  });

const toRhpsRecords = (): RhpsRecord[] =>
  parseCsv('rhps_demo.csv').map((row) => {
    const fields = ['biosanitarios_kg', 'anatomopatologicos_kg', 'cortopunzantes_kg', 'farmacos_kg', 'corrosivos_kg', 'raee_kg'];
    const base: Record<string, unknown> = { ...row };
    fields.forEach((field) => {
      base[field] = Number.parseFloat(row[field] ?? '0');
    });
    return base as RhpsRecord;
  });

const toActaRecords = (): ActaRecord[] =>
  parseCsv('acta_incineracion_demo.csv').map((row) => {
    const fields = ['cantidad_enviada_kg', 'cantidad_incinerada_kg', 'diferencia_kg'];
    const base: Record<string, unknown> = { ...row };
    fields.forEach((field) => {
      base[field] = Number.parseFloat(row[field] ?? '0');
    });
    return base as ActaRecord;
  });

const aggregatedMetrics = loadJsonFile<Record<string, unknown>>('aggregated_metrics.json');

const companyDataSchema = z.object({
  empresas: z.array(
    z.object({
      empresa_id: z.string(),
      nombre: z.string(),
      nit: z.string(),
      direccion: z.string(),
      contacto: z.object({
        nombre: z.string(),
        cedula: z.string(),
        correo: z.string(),
        celular: z.string(),
        cargo: z.string(),
      }),
      sedes: z.array(
        z.object({
          sede_id: z.string(),
          nombre: z.string(),
          direccion: z.string(),
          tipo: z.string(),
          responsable: z.object({
            nombre: z.string(),
            cedula: z.string(),
            correo: z.string(),
            celular: z.string(),
            cargo: z.string(),
          }),
          pgirasa: z.object({
            version: z.string(),
            vigencia_desde: z.string(),
            vigencia_hasta: z.string(),
            archivo: z.string(),
          }),
        })
      ),
    })
  ),
});

const companyData = companyDataSchema.parse(loadJsonFile('empresa_demo.json'));

app.get('/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.get('/api/companies', (_req, res) => {
  res.json(companyData.empresas);
});

app.get('/api/companies/:empresaId', (req, res) => {
  const empresa = companyData.empresas.find((item) => item.empresa_id === req.params.empresaId);
  if (!empresa) {
    return res.status(404).json({ message: 'Empresa no encontrada' });
  }
  return res.json(empresa);
});

app.get('/api/sedes/:sedeId/rh1', (req, res) => {
  const data = toRh1Records().filter((record) => record.sede_id === req.params.sedeId);
  res.json(data);
});

app.get('/api/sedes/:sedeId/rhps', (req, res) => {
  const data = toRhpsRecords().filter((record) => record.sede_id === req.params.sedeId);
  res.json(data);
});

app.get('/api/sedes/:sedeId/actas', (req, res) => {
  const data = toActaRecords().filter((record) => record.sede_id === req.params.sedeId);
  res.json(data);
});

app.get('/api/metrics/aggregated', (_req, res) => {
  res.json(aggregatedMetrics);
});

app.use((req, res) => {
  res.status(404).json({ message: `Ruta no encontrada: ${req.path}` });
});

const port = process.env.PORT ? Number(process.env.PORT) : 4000;

export function createServer() {
  return app;
}

if (require.main === module) {
  app.listen(port, () => {
    console.log(`API PGIRASA escuchando en http://localhost:${port}`);
  });
}
