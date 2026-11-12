import { Component, inject } from '@angular/core';
import { Catalogo } from '../../../servicios/catalogo';
import { TarjetaClase } from '../../componentes/tarjeta-clase/tarjeta-clase';
import { FiltroCategoria } from '../../componentes/filtro-categoria/filtro-categoria';
import { RouterLink } from '@angular/router';

@Component({
  // el tablero se mudo aqui desde app, por eso esta pagina ahora importa la tarjeta y el filtro
  // routerLink tambien se importa aqui porque el boton de nueva clase lo usa
  imports: [TarjetaClase, FiltroCategoria, RouterLink],
  selector: 'app-lista-clases',
  styleUrl: './lista-clases.css',
  templateUrl: './lista-clases.html',
})
export class ListaClases {
  // la pagina lee los datos del mismo servicio de antes
  protected readonly catalogo = inject(Catalogo);
}
