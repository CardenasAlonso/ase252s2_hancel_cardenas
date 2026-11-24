export type Prioridad = 'Alta' | 'Media' | 'Baja';

export type Estado = 'Pendiente' | 'Proceso' | 'Resuelta';

export interface Incidencia {
  id: string;
  titulo: string;
  descripcion: string;
  responsable: string;
  prioridad: Prioridad;
  estado: Estado;
  fecha: string;
  createdAt: string;
  updatedAt: string;
}

export interface IncidenciaFormValue {
  titulo: string;
  descripcion: string;
  responsable: string;
  prioridad: Prioridad;
  estado: Estado;
}

export const PRIORIDADES: Prioridad[] = ['Alta', 'Media', 'Baja'];
export const ESTADOS: Estado[] = ['Pendiente', 'Proceso', 'Resuelta'];
