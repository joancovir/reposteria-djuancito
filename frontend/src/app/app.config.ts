import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http'; // <-- Importa withInterceptors
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { routes } from './app.routes';
import { BsModalService } from 'ngx-bootstrap/modal';
import { autenticacionInterceptor } from './interceptores/autenticacion-interceptor'; // <-- Importa tu interceptor

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(withInterceptors([autenticacionInterceptor])), // <-- MODIFICA ESTA LÍNEA
    provideAnimationsAsync(),
    BsModalService
  ]
};