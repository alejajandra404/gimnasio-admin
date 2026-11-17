import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { routes } from './app.routes';
import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import { alFallar, conToken } from './sesion/interceptores';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    // con esto la app ya puede usar las rutas de app.routes.ts
    // withComponentInputBinding: lo que viene en la url (como el :id) le llega a la pagina como un input
    provideRouter(routes, withComponentInputBinding()),
    // con esto la app ya puede hacer peticiones a la api (httpResource y HttpClient lo necesitan)
    // withInterceptors: todas las peticiones pasan por estas dos funciones
    // conToken le pega el token a la peticion, y alFallar manda al login si la api responde 401
    provideHttpClient(withFetch(), withInterceptors([conToken, alFallar])),
  ]
};
