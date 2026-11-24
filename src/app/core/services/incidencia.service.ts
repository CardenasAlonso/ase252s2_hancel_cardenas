import { Injectable, signal, computed } from '@angular/core';
import { StorageService } from './storage.service';
import {
  Incidencia,
  IncidenciaFormValue,
  Prioridad,
  Estado,
  PRIORIDADES,
  ESTADOS,
} from '../models/incidencia.model';

const STORAGE_KEY = 'incidencias_crud_v1';

const SEED: Incidencia[] = [
  {
    id: 'INC-001',
    titulo: 'Falla de red en Laboratorio 04',
    descripcion: 'Los equipos del laboratorio 04 pierden conectividad de forma intermitente durante las clases prácticas.',
    responsable: 'Carlos Mendoza',
    prioridad: 'Alta',
    estado: 'Proceso',
    fecha: '2026-11-23',
    createdAt: '2026-11-23T08:15:00.000Z',
    updatedAt: '2026-11-23T08:15:00.000Z',
  },
  {
    id: 'INC-002',
    titulo: 'Error de acceso al portal institucional',
    descripcion: 'Usuarios reportan error 403 al ingresar al portal académico desde dispositivos móviles.',
    responsable: 'Ana Torres',
    prioridad: 'Media',
    estado: 'Pendiente',
    fecha: '2026-11-23',
    createdAt: '2026-11-23T09:30:00.000Z',
    updatedAt: '2026-11-23T09:30:00.000Z',
  },
  {
    id: 'INC-003',
    titulo: 'Actualización de Office en aulas',
    descripcion: 'Se requiere actualizar el paquete Office en las aulas de cómputo del pabellón B.',
    responsable: 'Luis Cardenas',
    prioridad: 'Baja',
    estado: 'Resuelta',
    fecha: '2026-11-22',
    createdAt: '2026-11-22T14:00:00.000Z',
    updatedAt: '2026-11-22T16:45:00.000Z',
  },
];

@Injectable({ providedIn: 'root' })
export class IncidenciaService {
  private readonly storage: StorageService;
  private readonly _incidencias = signal<Incidencia[]>([]);

  readonly incidencias = this._incidencias.asReadonly();
  readonly total = computed(() => this._incidencias().length);
  readonly pendientes = computed(() => this._incidencias().filter((i) => i.estado === 'Pendiente').length);
  readonly enProceso = computed(() => this._incidencias().filter((i) => i.estado === 'Proceso').length);
  readonly resueltas = computed(() => this._incidencias().filter((i) => i.estado === 'Resuelta').length);

  constructor(storage: StorageService) {
    this.storage = storage;
    this.load();
  }

  private load(): void {
    const stored = this.storage.get<Incidencia[]>(STORAGE_KEY);
    if (stored && Array.isArray(stored) && stored.length) {
      this._incidencias.set(stored);
    } else {
      this._incidencias.set([...SEED]);
      this.persist();
    }
  }

  private persist(): void {
    this.storage.set(STORAGE_KEY, this._incidencias());
  }

  private nextId(): string {
    const numbers = this._incidencias()
      .map((i) => parseInt(i.id.replace(/\D/g, ''), 10))
      .filter((n) => !Number.isNaN(n));
    const next = numbers.length ? Math.max(...numbers) + 1 : 1;
    return `INC-${next.toString().padStart(3, '0')}`;
  }

  getById(id: string): Incidencia | undefined {
    return this._incidencias().find((i) => i.id === id);
  }

  create(value: IncidenciaFormValue): Incidencia {
    const now = new Date().toISOString();
    const incidencia: Incidencia = {
      id: this.nextId(),
      titulo: value.titulo.trim(),
      descripcion: value.descripcion.trim(),
      responsable: value.responsable.trim(),
      prioridad: value.prioridad,
      estado: value.estado,
      fecha: new Date().toISOString().slice(0, 10),
      createdAt: now,
      updatedAt: now,
    };
    this._incidencias.update((list) => [incidencia, ...list]);
    this.persist();
    return incidencia;
  }

  update(id: string, value: IncidenciaFormValue): Incidencia | undefined {
    let updated: Incidencia | undefined;
    this._incidencias.update((list) =>
      list.map((item) => {
        if (item.id !== id) return item;
        updated = {
          ...item,
          titulo: value.titulo.trim(),
          descripcion: value.descripcion.trim(),
          responsable: value.responsable.trim(),
          prioridad: value.prioridad,
          estado: value.estado,
          updatedAt: new Date().toISOString(),
        };
        return updated;
      }),
    );
    if (updated) this.persist();
    return updated;
  }

  delete(id: string): void {
    this._incidencias.update((list) => list.filter((i) => i.id !== id));
    this.persist();
  }

  resetToSeed(): void {
    this._incidencias.set([...SEED]);
    this.persist();
  }

  filter(query: string, prioridad: Prioridad | 'Todas', estado: Estado | 'Todos'): Incidencia[] {
    const q = query.trim().toLowerCase();
    return this._incidencias().filter((i) => {
      const matchesQuery =
        !q ||
        i.titulo.toLowerCase().includes(q) ||
        i.id.toLowerCase().includes(q) ||
        i.responsable.toLowerCase().includes(q);
      const matchesPrioridad = prioridad === 'Todas' || i.prioridad === prioridad;
      const matchesEstado = estado === 'Todos' || i.estado === estado;
      return matchesQuery && matchesPrioridad && matchesEstado;
    });
  }

  exportJson(): string {
    return JSON.stringify(this._incidencias(), null, 2);
  }
}
