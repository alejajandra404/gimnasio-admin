import { Component, inject, input, OnInit, signal } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { Categoria, CATEGORIAS } from '../../modelos/clase';
import { API_URL } from '../../../config';
import { multiploDe } from '../../validadores/multiplo-de';
import { ClasesApi } from '../../../servicios/clases-api';
import { Catalogo } from '../../../servicios/catalogo';
import { mensajeDeApi, mensajesDelCuerpo } from '../../../servicios/errores';

// las 8 imagenes que ya tiene la api: /img/clase-01.jpg hasta /img/clase-08.jpg
const IMAGENES = Array.from({ length: 8 }, (_, i) => `/img/clase-0${i + 1}.jpg`);

@Component({
  // ReactiveFormsModule es el que hace funcionar [formGroup] y formControlName en el html
  // Router no va aqui: es un servicio, se usa con inject
  imports: [ReactiveFormsModule, RouterLink],
  selector: 'app-formulario-clase',
  styleUrl: './formulario-clase.css',
  templateUrl: './formulario-clase.html',
})
export class FormularioClase implements OnInit {
  // el :id de la url (en /clases/3/editar llega "3"). en /clases/nueva no hay id, entonces queda undefined
  readonly id = input<string>();

  protected readonly categorias = CATEGORIAS;
  protected readonly imagenes = IMAGENES;
  protected readonly apiUrl = API_URL;
  private readonly api = inject(ClasesApi);
  private readonly catalogo = inject(Catalogo);
  private readonly router = inject(Router);

  // true mientras se espera la respuesta de la api. sirve para apagar el boton y que no se mande dos veces
  protected readonly guardando = signal(false);

  // los mensajes de error que mando el servidor, para pintarlos arriba del formulario
  protected readonly erroresServidor = signal<string[]>([]);

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

  // se pone en true cuando ya se guardo o se borro bien, para que la guarda de salida no pregunte en ese caso
  private terminado = false;

  // la guarda de salida (cambiosSinGuardar) pregunta esto antes de dejarme ir
  // dirty = el usuario ya cambio algun campo (patchValue no cuenta, porque eso lo hace el codigo)
  hayCambios(): boolean {
    return this.form.dirty && !this.terminado;
  }

  // ngOnInit corre cuando la pagina ya recibio sus inputs, por eso aqui ya se puede leer el id
  ngOnInit(): void {
    const id = this.id();
    // si no hay id es una clase nueva y el formulario se queda vacio
    if (!id) return;

    // si hay id, pido la clase a la api y con patchValue lleno los campos con sus datos
    this.api.obtener(Number(id)).subscribe({
      next: (clase) => this.form.patchValue(clase),
      error: (e: HttpErrorResponse) => this.erroresServidor.set([mensajeDeApi(e)]),
    });
  }

  protected guardar(): void {
    // si falta algo, se marcan todos los campos como tocados para que salgan todos los mensajes en rojo
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.guardando.set(true);
    this.erroresServidor.set([]);

    // getRawValue saca los valores de todos los campos en un solo objeto
    const datos = this.form.getRawValue();
    const id = this.id();

    // la misma funcion sirve para las dos rutas: si hay id estoy editando (PATCH), si no, es nueva (POST)
    const peticion = id ? this.api.actualizar(Number(id), datos) : this.api.crear(datos);

    // el subscribe es el que de verdad hace que salga la peticion
    peticion.subscribe({
      // si salio bien: se vuelve a pedir el catalogo y regreso a /clases
      next: () => {
        this.terminado = true;
        this.catalogo.recargar();
        this.router.navigate(['/clases']);
      },
      // si salio mal: con 400 enseño cada mensaje del servidor, con otro error la frase de mensajeDeApi
      error: (e: HttpErrorResponse) => {
        const mensajes = e.status === 400 ? mensajesDelCuerpo(e.error) : [];
        this.erroresServidor.set(mensajes.length ? mensajes : [mensajeDeApi(e)]);
        this.guardando.set(false);
      },
    });
  }

  protected eliminar(): void {
    const id = this.id();
    if (!id) return;

    // confirm abre la ventanita del navegador con aceptar y cancelar. si le dan cancelar no se borra nada
    if (!confirm('¿Seguro que quieres eliminar esta clase?')) return;

    this.guardando.set(true);
    this.erroresServidor.set([]);

    this.api.eliminar(Number(id)).subscribe({
      // igual que al guardar: recargo el catalogo para que ya no salga la clase y regreso a /clases
      next: () => {
        this.terminado = true;
        this.catalogo.recargar();
        this.router.navigate(['/clases']);
      },
      error: (e: HttpErrorResponse) => {
        this.erroresServidor.set([mensajeDeApi(e)]);
        this.guardando.set(false);
      },
    });
  }
}
