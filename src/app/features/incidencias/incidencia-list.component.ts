import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { IncidenciaService } from '../../core/services/incidencia.service';
import { NotificationService } from '../../core/services/notification.service';
import { ConfirmDialogComponent } from '../../shared/components/confirm-dialog/confirm-dialog';
import {
  Incidencia,
  Prioridad,
  Estado,
  PRIORIDADES,
  ESTADOS,
} from '../../core/models/incidencia.model';

@Component({
  selector: 'app-incidencia-list',
  standalone: true,
  imports: [CommonModule, RouterModule, ConfirmDialogComponent],
  templateUrl: './incidencia-list.component.html',
  styleUrl: './incidencia-list.component.scss',
})
export class IncidenciaListComponent {
  private readonly service = inject(IncidenciaService);
  private readonly notifications = inject(NotificationService);

  readonly prioridades = PRIORIDADES;
  readonly estados = ESTADOS;

  readonly search = signal('');
  readonly filtroPrioridad = signal<Prioridad | 'Todas'>('Todas');
  readonly filtroEstado = signal<Estado | 'Todos'>('Todos');

  readonly incidencias = computed(() =>
    this.service.filter(this.search(), this.filtroPrioridad(), this.filtroEstado()),
  );

  readonly total = this.service.total;
  readonly pendientes = this.service.pendientes;
  readonly enProceso = this.service.enProceso;
  readonly resueltas = this.service.resueltas;

  confirmOpen = false;
  pendingDelete: Incidencia | null = null;

  onSearch(event: Event): void {
    this.search.set((event.target as HTMLInputElement).value);
  }

  onPrioridadChange(event: Event): void {
    this.filtroPrioridad.set((event.target as HTMLSelectElement).value as Prioridad | 'Todas');
  }

  onEstadoChange(event: Event): void {
    this.filtroEstado.set((event.target as HTMLSelectElement).value as Estado | 'Todos');
  }

  limpiarFiltros(): void {
    this.search.set('');
    this.filtroPrioridad.set('Todas');
    this.filtroEstado.set('Todos');
  }

  solicitarEliminacion(incidencia: Incidencia): void {
    this.pendingDelete = incidencia;
    this.confirmOpen = true;
  }

  cancelarEliminacion(): void {
    this.confirmOpen = false;
    this.pendingDelete = null;
  }

  confirmarEliminacion(): void {
    if (this.pendingDelete) {
      this.service.delete(this.pendingDelete.id);
      this.notifications.success(`Incidencia ${this.pendingDelete.id} eliminada.`);
    }
    this.cancelarEliminacion();
  }

  prioridadClass(p: Prioridad): string {
    return `badge badge-${p.toLowerCase()}`;
  }

  estadoClass(e: Estado): string {
    return `badge badge-${e.toLowerCase().replace(/\s+/g, '-')}`;
  }

  formatDate(value: string): string {
    if (!value) return '—';
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return value;
    return date.toLocaleDateString('es-PE', { day: '2-digit', month: 'short', year: 'numeric' });
  }
}
