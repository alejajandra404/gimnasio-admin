import { Component, inject, input, OnInit, signal } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { RouterLink } from '@angular/router';
import { ClaseConHorarios } from '../../modelos/clase';
import { API_URL } from '../../../config';
import { ClasesApi } from '../../../servicios/clases-api';
import { mensajeDeApi } from '../../../servicios/errores';

@Component({
  imports: [RouterLink],
  selector: 'app-detalle-clase',
  styleUrl: './detalle-clase.css',
  templateUrl: './detalle-clase.html',
})
export class DetalleClase implements OnInit {
  // el :id de la url, igual que en el formulario de editar
  readonly id = input<string>();

  protected readonly apiUrl = API_URL;
  private readonly api = inject(ClasesApi);

  // la clase con sus horarios. empieza en null mientras llega
  protected readonly clase = signal<ClaseConHorarios | null>(null);
  protected readonly error = signal<string | null>(null);

  ngOnInit(): void {
    // GET /clases/:id ya regresa la clase con su lista de horarios
    this.api.obtener(Number(this.id())).subscribe({
      next: (c) => this.clase.set(c),
      error: (e: HttpErrorResponse) => this.error.set(mensajeDeApi(e)),
    });
  }
}
