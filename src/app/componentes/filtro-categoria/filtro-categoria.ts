import { Component, inject } from '@angular/core';
import { Catalogo } from '../../../servicios/catalogo';
import { CATEGORIAS } from '../../modelos/clase';

@Component({
  imports: [],
  selector: 'app-filtro-categoria',
  styleUrl: './filtro-categoria.css',
  templateUrl: './filtro-categoria.html',
})
export class FiltroCategoria {
  protected readonly catalogo = inject(Catalogo);

  protected readonly opciones = ["todas" as const, ...CATEGORIAS];


}
