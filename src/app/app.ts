import { Component, inject } from '@angular/core';
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

  // el tablero ya no guarda sus propios datos: los lee del servicio con inject
  protected readonly catalogo = inject(Catalogo);
}
