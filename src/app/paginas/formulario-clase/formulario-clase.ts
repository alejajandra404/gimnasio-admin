import { JsonPipe } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Categoria, CATEGORIAS, ClaseNueva } from '../../modelos/clase';
import { API_URL } from '../../../config';
import { multiploDe } from '../../validadores/multiplo-de';

// las 8 imagenes que ya tiene la api: /img/clase-01.jpg hasta /img/clase-08.jpg
const IMAGENES = Array.from({ length: 8 }, (_, i) => `/img/clase-0${i + 1}.jpg`);

@Component({
  // ReactiveFormsModule es el que hace funcionar [formGroup] y formControlName en el html
  imports: [ReactiveFormsModule, RouterLink, JsonPipe],
  selector: 'app-formulario-clase',
  styleUrl: './formulario-clase.css',
  templateUrl: './formulario-clase.html',
})
export class FormularioClase {
  protected readonly categorias = CATEGORIAS;
  protected readonly imagenes = IMAGENES;
  protected readonly apiUrl = API_URL;

  // aqui se guarda el objeto que se mandaria a la api. empieza en null para que no salga el aviso
  protected readonly lista = signal<ClaseNueva | null>(null);

  // el formulario vive aqui en el ts, no en el html. cada campo es [valor inicial, [validaciones]]
  // nonNullable hace que al reiniciar un campo regrese a su valor inicial y no a null
  protected readonly form = inject(FormBuilder).nonNullable.group({
    nombre: ['', [Validators.required, Validators.maxLength(80)]],
    categoria: ['fuerza' as Categoria, [Validators.required]],
    descripcion: ['', [Validators.required, Validators.maxLength(255)]],
    // multiploDe(5) es nuestro validador propio, se pone junto a los de angular
    duracionMin: [45, [Validators.required, Validators.min(10), Validators.max(180), multiploDe(5)]],
    imagen: [IMAGENES[0], Validators.required],
  });

  // atajo para escribir f.nombre en el html en lugar de form.controls.nombre
  protected get f() {
    return this.form.controls;
  }

  protected guardar(): void {
    // si falta algo, se marcan todos los campos como tocados para que salgan todos los mensajes en rojo
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.lista.set(null);
      return;
    }

    // getRawValue saca los valores de todos los campos en un solo objeto. todavia no se manda nada a la api
    const datos = this.form.getRawValue();
    console.log('Esto es lo que se va a mandar a la API', datos);
    this.lista.set(datos);
  }
}
