import { Component, inject, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router, ActivatedRoute } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { IncidenciaService } from '../../core/services/incidencia.service';
import { NotificationService } from '../../core/services/notification.service';
import {
  Prioridad,
  Estado,
  PRIORIDADES,
  ESTADOS,
} from '../../core/models/incidencia.model';

@Component({
  selector: 'app-incidencia-form',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
  templateUrl: './incidencia-form.component.html',
  styleUrl: './incidencia-form.component.scss',
})
export class IncidenciaFormComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly service = inject(IncidenciaService);
  private readonly notifications = inject(NotificationService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  readonly prioridades = PRIORIDADES;
  readonly estados = ESTADOS;

  readonly editId = signal<string | null>(null);
  readonly isEdit = computed(() => !!this.editId());
  readonly submitting = signal(false);

  readonly form = this.fb.group({
    titulo: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(80)]],
    descripcion: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(500)]],
    responsable: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(60)]],
    prioridad: ['Media' as Prioridad, [Validators.required]],
    estado: ['Pendiente' as Estado, [Validators.required]],
  });

  constructor() {
    // placeholder for computed import
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const id = params.get('id');
      if (id) {
        const incidencia = this.service.getById(id);
        if (!incidencia) {
          this.notifications.error('La incidencia solicitada no existe.');
          this.router.navigate(['/incidencias']);
          return;
        }
        this.editId.set(id);
        this.form.patchValue({
          titulo: incidencia.titulo,
          descripcion: incidencia.descripcion,
          responsable: incidencia.responsable,
          prioridad: incidencia.prioridad,
          estado: incidencia.estado,
        });
      } else {
        this.editId.set(null);
        this.form.reset({
          titulo: '',
          descripcion: '',
          responsable: '',
          prioridad: 'Media',
          estado: 'Pendiente',
        });
      }
    });
  }

  controlInvalid(name: string): boolean {
    const c = this.form.get(name);
    return !!c && c.invalid && (c.dirty || c.touched);
  }

  errorMessage(name: string): string {
    const c = this.form.get(name);
    if (!c || !c.errors) return '';
    if (c.errors['required']) return 'Este campo es obligatorio.';
    if (c.errors['minlength']) return `Mínimo ${c.errors['minlength'].requiredLength} caracteres.`;
    if (c.errors['maxlength']) return `Máximo ${c.errors['maxlength'].requiredLength} caracteres.`;
    return 'Valor inválido.';
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.notifications.error('Revise los campos del formulario.');
      return;
    }
    this.submitting.set(true);
    const value = this.form.getRawValue() as {
      titulo: string;
      descripcion: string;
      responsable: string;
      prioridad: Prioridad;
      estado: Estado;
    };

    const id = this.editId();
    if (id) {
      const updated = this.service.update(id, value);
      this.submitting.set(false);
      if (updated) {
        this.notifications.success(`Incidencia ${id} actualizada.`);
        this.router.navigate(['/incidencias', id]);
      } else {
        this.notifications.error('No se pudo actualizar la incidencia.');
      }
    } else {
      const created = this.service.create(value);
      this.submitting.set(false);
      this.notifications.success(`Incidencia ${created.id} creada.`);
      this.router.navigate(['/incidencias', created.id]);
    }
  }

  cancelar(): void {
    const id = this.editId();
    if (id) {
      this.router.navigate(['/incidencias', id]);
    } else {
      this.router.navigate(['/incidencias']);
    }
  }
}
