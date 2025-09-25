import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  AggregatedMetrics,
  Empresa,
  fetchAggregatedMetrics,
  fetchEmpresas,
  fetchRh1BySede,
  fetchRhpsBySede,
} from './api';

function MetricsPanel({ metrics }: { metrics: AggregatedMetrics | undefined }) {
  if (!metrics) return null;

  return (
    <section>
      <h2>Indicadores agregados</h2>
      <p>
        <strong>{metrics.empresa}</strong> · {metrics.sede} · {metrics.periodo}
      </p>
      <div className="metrics-grid">
        <div className="metric-card">
          <h3>Residuos No Peligrosos</h3>
          <p>{metrics.totales.total_no_peligrosos.toFixed(1)} kg</p>
        </div>
        <div className="metric-card">
          <h3>Residuos Peligrosos</h3>
          <p>{metrics.totales.total_peligrosos.toFixed(1)} kg</p>
        </div>
      </div>
    </section>
  );
}

function DataTable({ rows }: { rows: Array<Record<string, unknown>> }) {
  if (!rows.length) return <p>No hay registros disponibles.</p>;

  const headers = Object.keys(rows[0]);

  return (
    <div style={{ overflowX: 'auto' }}>
      <table className="table">
        <thead>
          <tr>
            {headers.map((header) => (
              <th key={header}>{header}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, index) => (
            <tr key={index}>
              {headers.map((header) => (
                <td key={header}>{String(row[header])}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function App() {
  const [selectedEmpresa, setSelectedEmpresa] = useState<string>('');
  const [selectedSede, setSelectedSede] = useState<string>('');

  const empresasQuery = useQuery({ queryKey: ['empresas'], queryFn: fetchEmpresas });
  const metricsQuery = useQuery({ queryKey: ['metrics'], queryFn: fetchAggregatedMetrics });

  const rh1Query = useQuery({
    queryKey: ['rh1', selectedSede],
    queryFn: () => fetchRh1BySede(selectedSede),
    enabled: Boolean(selectedSede),
  });

  const rhpsQuery = useQuery({
    queryKey: ['rhps', selectedSede],
    queryFn: () => fetchRhpsBySede(selectedSede),
    enabled: Boolean(selectedSede),
  });

  const empresas = empresasQuery.data ?? [];
  const selectedEmpresaObj = empresas.find((empresa) => empresa.empresa_id === selectedEmpresa);
  const sedes = selectedEmpresaObj?.sedes ?? [];

  return (
    <main>
      <header>
        <h1>PGIRASA · Gestión Ambiental Sector Salud</h1>
        <p>Visualiza empresas, sedes y seguimiento de residuos peligrosos y no peligrosos.</p>
      </header>

      <section>
        <h2>Selecciona organización</h2>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <label>
            Empresa
            <select
              value={selectedEmpresa}
              onChange={(event) => {
                setSelectedEmpresa(event.target.value);
                setSelectedSede('');
              }}
            >
              <option value="">-- Selecciona --</option>
              {empresas.map((empresa: Empresa) => (
                <option key={empresa.empresa_id} value={empresa.empresa_id}>
                  {empresa.nombre}
                </option>
              ))}
            </select>
          </label>

          <label>
            Sede
            <select value={selectedSede} onChange={(event) => setSelectedSede(event.target.value)} disabled={!sedes.length}>
              <option value="">-- Selecciona --</option>
              {sedes.map((sede) => (
                <option key={sede.sede_id} value={sede.sede_id}>
                  {sede.nombre}
                </option>
              ))}
            </select>
          </label>
        </div>
      </section>

      <MetricsPanel metrics={metricsQuery.data} />

      <section>
        <h2>Registros RH1 diario</h2>
        {rh1Query.isLoading ? <p>Cargando RH1...</p> : <DataTable rows={rh1Query.data ?? []} />}
      </section>

      <section>
        <h2>Registros RHPS (recolección externa)</h2>
        {rhpsQuery.isLoading ? <p>Cargando RHPS...</p> : <DataTable rows={rhpsQuery.data ?? []} />}
      </section>
    </main>
  );
}
