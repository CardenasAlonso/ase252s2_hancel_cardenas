import { Routes } from '@angular/router';
import { IncidenciaListComponent } from './features/incidencias/incidencia-list.component';
import { IncidenciaFormComponent } from './features/incidencias/incidencia-form.component';
import { IncidenciaDetailComponent } from './features/incidencias/incidencia-detail.component';

export const routes: Routes = [
  { path: '', redirectTo: 'incidencias', pathMatch: 'full' },
  { path: 'incidencias', component: IncidenciaListComponent },
  { path: 'incidencias/nueva', component: IncidenciaFormComponent },
  { path: 'incidencias/:id', component: IncidenciaDetailComponent },
  { path: 'incidencias/:id/editar', component: IncidenciaFormComponent },
  { path: '**', redirectTo: 'incidencias' },
];
