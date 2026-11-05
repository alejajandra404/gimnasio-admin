import { Component, inject } from '@angular/core';
import type { Clase } from './modelos/clase';
import { CLASES_LOCALES } from './datos/clases-locales';
import { TarjetaClase } from './componentes/tarjeta-clase/tarjeta-clase';
import { Catalogo } from '../servicios/catalogo';
import { FiltroCategoria } from './componentes/filtro-categoria/filtro-categoria';

@Component({
  // para usar <app-tarjeta-clase> en el html, el componente tiene que estar aqui en imports
  imports: [TarjetaClase, FiltroCategoria],
  selector: 'app-root',
  styleUrl: './app.css',
  templateUrl: './app.html',
})
export class App {

  protected readonly catalogo = inject(Catalogo);

  // las clases que se muestran. por ahora salen del archivo local
  protected clases: Clase[] = CLASES_LOCALES;

  // un getter se calcula cada vez que se lee: asi el numero siempre esta al dia
  protected get minutosTotales(): number {
    return this.clases.reduce((suma, c) => suma + c.duracionMin, 0);
  }

  protected get clasesLargas(): number {
    return this.clases.filter((c) => c.duracionMin >= 60).length;
  }

  // deja el catalogo sin clases, para ver el mensaje de vacio
  protected vaciar(): void {
    this.clases = [];
  }

  // vuelve a poner las clases del archivo local
  protected restaurar(): void {
    this.clases = CLASES_LOCALES;
  }
}
