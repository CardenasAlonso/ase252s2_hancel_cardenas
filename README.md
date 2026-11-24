# Sistema de Gestión de Incidencias

Aplicación web desarrollada en **Angular + TypeScript** para el reto individual
"S06 | AP4 | Preparándonos para la Hackathon". Permite registrar y administrar
incidencias institucionales mediante operaciones **CRUD** (crear, listar, consultar,
editar y eliminar), con búsqueda y filtrado por título, prioridad y estado.

## Características

- Arquitectura modular basada en componentes standalone de Angular.
- Servicio centralizado de lógica CRUD con persistencia en `localStorage`.
- Formularios reactivos con validaciones activas.
- Búsqueda por título/código/responsable y filtros por prioridad y estado.
- Vista de detalle completa de cada incidencia.
- Eliminación con confirmación previa.
- Diseño responsive con identidad visual propia.
- Notificaciones (toast) y estados vacíos.

## Estructura de datos de una incidencia

| Campo | Descripción |
| --- | --- |
| Código | Identificador único (generado automáticamente) |
| Título | Asunto breve |
| Descripción | Detalle técnico |
| Responsable | Técnico asignado |
| Prioridad | Alta, Media o Baja |
| Estado | Pendiente, Proceso o Resuelta |
| Fecha | Registro inicial |

## Requisitos

- Node.js 18 o superior
- npm 9 o superior
- Angular CLI 21

## Instalación

```bash
npm install
```

## Ejecución en desarrollo

```bash
npm start
```

La aplicación quedará disponible en `http://localhost:4200/`.

## Compilación para producción

```bash
npm run build
```

Los archivos generados se ubican en `dist/`.

## Pruebas

```bash
npm test
```

## Enfoque técnico

- **Front-End 100%**: sin Back-End, los datos se almacenan localmente.
- **Componentes standalone**, **signals** y **nuevo flujo de control** (`@if`, `@for`, `@defer`, `@placeholder`).
- **Servicios** para la lógica CRUD y notificaciones.
- **Formularios controlados** con `ReactiveFormsModule`.
- **Routing** con vistas de listado, creación, detalle y edición.
