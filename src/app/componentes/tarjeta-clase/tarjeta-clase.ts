import { Component, input, output } from '@angular/core';
import type { Clase } from '../../modelos/clase';

@Component({
  imports: [],
  selector: 'app-tarjeta-clase',
  styleUrl: './tarjeta-clase.css',
  templateUrl: './tarjeta-clase.html',
})
export class TarjetaClase {
  // la clase la manda el componente de afuera. required quiere decir que es obligatorio mandarla
  readonly clase = input.required<Clase>();

  readonly activa = input(false);

  readonly seleccion = output<Clase>();
}
