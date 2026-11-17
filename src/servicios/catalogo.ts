import { computed, Service, signal } from '@angular/core'
import { httpResource } from '@angular/common/http';
import { Categoria, Clase, Sobre } from '../app/modelos/clase';
import { API_URL } from '../config';
import { mensajeDeApi } from './errores';

@Service()
export class Catalogo {
    // httpResource pide GET /clases solito al arrancar. la api regresa { data, meta }, por eso es Sobre<Clase[]>
    private readonly recurso = httpResource<Sobre<Clase[]>>(() => `${API_URL}/clases`);

    // antes era un signal con las clases locales, ahora sale de lo que regreso la api (o [] si todavia no llega)
    // si la peticion fallo, leer value() truena asi que se pregunta con hasValue()
    private readonly clases = computed(() => this.recurso.hasValue() ? this.recurso.value().data : []);

    // true mientras la peticion no ha terminado
    readonly cargando = computed(() => this.recurso.isLoading());

    // si la peticion fallo, aqui queda la frase para mostrar. si no, null
    readonly error = computed(() => {
        const e = this.recurso.error();
        return e ? mensajeDeApi(e) : null;
    });

    readonly categoria = signal<Categoria | 'todas'>("todas");

    readonly seleccionada = signal<Clase | null>(null);

    // derivada
    readonly visibles = computed(() => {
        const cat = this.categoria();
        const todas = this.clases();
        return cat === "todas" ? todas : todas.filter((c) => c.categoria === cat);
    });

    readonly minutosTotales = computed(() => {
        return this.visibles().reduce((suma, c) => suma + c.duracionMin, 0);
    });

    readonly clasesLargas = computed(() => {
        return this.visibles().filter((c) => c.duracionMin >= 60).length;
    });

    filtrar(categoria: Categoria | "todas"): void {
        this.categoria.set(categoria);
        const elegida = this.seleccionada();
        if (elegida && categoria !== "todas" && elegida.categoria !== categoria) {
            this.seleccionada.set(null);
        }
    }

    seleccionar(clase: Clase): void {
        // set reemplaza el valor de la variable
        // update hace lo mismo pero tiene acceso al valor actual de la variable
        this.seleccionada.update((actual) => (actual?.id === clase.id ? null : clase));
    }

    // vuelve a pedir GET /clases, por ejemplo despues de crear una clase, para que el catalogo salga actualizado
    recargar(): void {
        this.seleccionada.set(null);
        this.recurso.reload();
    }

}    