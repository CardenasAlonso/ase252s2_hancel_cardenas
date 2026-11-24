import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router, ActivatedRoute } from '@angular/router';
import { IncidenciaService } from '../../core/services/incidencia.service';
import { NotificationService } from '../../core/services/notification.service';
import { ConfirmDialogComponent } from '../../shared/components/confirm-dialog/confirm-dialog';
import { Incidencia } from '../../core/models/incidencia.model';

@Component({
  selector: 'app-incidencia-detail',
  standalone: true,
  imports: [CommonModule, RouterModule, ConfirmDialogComponent],
  templateUrl: './incidencia-detail.component.html',
  styleUrl: './incidencia-detail.component.scss',
})
export class IncidenciaDetailComponent {
  private readonly service = inject(IncidenciaService);
  private readonly notifications = inject(NotificationService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  readonly incidencia = signal<Incidencia | null>(null);
  confirmOpen = false;

  constructor() {
    this.route.paramMap.subscribe((params) => {
      const id = params.get('id');
      const found = id ? this.service.getById(id) : undefined;
      if (!found) {
        this.notifications.error('Incidencia no encontrada.');
        this.router.navigate(['/incidencias']);
        return;
      }
      this.incidencia.set(found ?? null);
    });
  }

  solicitarEliminacion(): void {
    this.confirmOpen = true;
  }

  cancelarEliminacion(): void {
    this.confirmOpen = false;
  }

  confirmarEliminacion(): void {
    const inc = this.incidencia();
    if (inc) {
      this.service.delete(inc.id);
      this.notifications.success(`Incidencia ${inc.id} eliminada.`);
      this.router.navigate(['/incidencias']);
    }
    this.confirmOpen = false;
  }

  prioridadClass(p: string): string {
    return `badge badge-${p.toLowerCase()}`;
  }

  estadoClass(e: string): string {
    return `badge badge-${e.toLowerCase().replace(/\s+/g, '-')}`;
  }

  formatDate(value: string): string {
    if (!value) return '—';
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return value;
    return date.toLocaleDateString('es-PE', { day: '2-digit', month: 'long', year: 'numeric' });
  }

  formatDateTime(value: string): string {
    if (!value) return '—';
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return value;
    return date.toLocaleString('es-PE');
  }
}
