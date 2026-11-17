import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideHttpClient, withFetch } from '@angular/common/http';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    // con esto la app ya puede usar las rutas de app.routes.ts
    provideRouter(routes),
    // con esto la app ya puede hacer peticiones a la api (httpResource y HttpClient lo necesitan)
    provideHttpClient(withFetch()),
  ]
};
