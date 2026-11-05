import { computed, Service, signal } from '@angular/core'
import { CLASES_LOCALES } from '../app/datos/clases-locales';
import { Categoria, Clase } from '../app/modelos/clase';

@Service()
export class Catalogo {
    private readonly clases = signal<Clase[]>(CLASES_LOCALES);

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

}    