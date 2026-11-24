import { Component, inject } from '@angular/core';
import { Catalogo } from '../../../servicios/catalogo';
import { TarjetaClase } from '../../componentes/tarjeta-clase/tarjeta-clase';
import { FiltroCategoria } from '../../componentes/filtro-categoria/filtro-categoria';
import { RouterLink } from '@angular/router';
import { API_URL } from '../../../config';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { debounceTime, distinctUntilChanged, map } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  // el tablero se mudo aqui desde app, por eso esta pagina ahora importa la tarjeta y el filtro
  // routerLink tambien se importa aqui porque el boton de nueva clase lo usa
  // ReactiveFormsModule es para que el input entienda [formControl]
  imports: [TarjetaClase, FiltroCategoria, RouterLink, ReactiveFormsModule],
  selector: 'app-lista-clases',
  styleUrl: './lista-clases.css',
  templateUrl: './lista-clases.html',
})
export class ListaClases {
  // la pagina lee los datos del mismo servicio de antes
  protected readonly catalogo = inject(Catalogo);
  // la imagen del panel lateral tambien viene de la api
  protected readonly apiUrl = API_URL;
  // la caja de busqueda. empieza con el texto que ya estaba buscado, por si regreso a la pagina
  protected readonly busqueda = new FormControl(this.catalogo.texto(), { nonNullable: true });

  constructor() {
    // valueChanges avisa cada vez que se escribe una letra
    this.busqueda.valueChanges.pipe(
      debounceTime(300),       // espera a que deje de teclear 300 ms
      map((t) => t.trim()),    // le quita los espacios del inicio y del final
      distinctUntilChanged(),  // si el texto es el mismo que la vez pasada, no busca otra vez
      takeUntilDestroyed()     // cuando salgo de la pagina deja de escuchar solito
    ).subscribe((texto) => this.catalogo.buscar(texto));
  }
}
