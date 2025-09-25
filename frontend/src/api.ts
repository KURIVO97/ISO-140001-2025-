import axios from 'axios';

export const api = axios.create({
  baseURL: '/api',
});

export type Empresa = {
  empresa_id: string;
  nombre: string;
  nit: string;
  direccion: string;
  contacto: {
    nombre: string;
    cedula: string;
    correo: string;
    celular: string;
    cargo: string;
  };
  sedes: Array<{
    sede_id: string;
    nombre: string;
    direccion: string;
    tipo: string;
  }>;
};

export type AggregatedMetrics = {
  empresa: string;
  sede: string;
  periodo: string;
  totales: {
    total_no_peligrosos: number;
    total_peligrosos: number;
  };
  rh1: Record<string, number>;
  rhps: Record<string, number>;
  acta: Record<string, unknown>;
};

export async function fetchEmpresas() {
  const { data } = await api.get<Empresa[]>('/companies');
  return data;
}

export async function fetchAggregatedMetrics() {
  const { data } = await api.get<AggregatedMetrics>('/metrics/aggregated');
  return data;
}

export async function fetchRh1BySede(sedeId: string) {
  const { data } = await api.get(`/sedes/${sedeId}/rh1`);
  return data as Array<Record<string, unknown>>;
}

export async function fetchRhpsBySede(sedeId: string) {
  const { data } = await api.get(`/sedes/${sedeId}/rhps`);
  return data as Array<Record<string, unknown>>;
}
