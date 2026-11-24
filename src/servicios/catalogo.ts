import { computed, inject, Service, signal } from '@angular/core'
import { toSignal } from '@angular/core/rxjs-interop';
import { BehaviorSubject, catchError, map, of, startWith, switchMap } from 'rxjs';
import { Categoria, Clase } from '../app/modelos/clase';
import { mensajeDeApi } from './errores';
import { ClasesApi } from './clases-api';

@Service()
export class Catalogo {
    private readonly api = inject(ClasesApi);

    // el texto que se esta buscando. se guarda para que la caja no se borre al regresar a la pagina
    private readonly _texto = signal('');
    readonly texto = this._texto.asReadonly();

    // aqui se van metiendo los textos a buscar. empieza con '' para que al arrancar pida todas las clases
    private readonly busquedas = new BehaviorSubject<string>('');

    // el tubo: cada texto nuevo se convierte en una peticion GET /clases?q=...
    // switchMap: si llega un texto nuevo y la peticion de antes no ha terminado, la cancela y se queda con la nueva
    // startWith: antes de que llegue la respuesta avisa que esta cargando
    // catchError: si la api falla, en vez de tronar regresa el mensaje de error y la lista vacia
    // toSignal: convierte todo eso en un signal para poder leerlo como los demas
    private readonly resultado = toSignal(
        this.busquedas.pipe(
            switchMap((q) =>
                this.api.listar(q).pipe(
                    map((clases): Resultado => ({ cargando: false, error: null, clases })),
                    catchError((e) => of<Resultado>({ cargando: false, error: mensajeDeApi(e), clases: [] })),
                    startWith<Resultado>({ cargando: true, error: null, clases: [] })
                )
            )
        ),
        { initialValue: { cargando: true, error: null, clases: [] } }
    );

    // antes salian del httpResource, ahora salen del resultado del tubo
    private readonly clases = computed(() => this.resultado().clases);

    // true mientras la peticion no ha terminado
    readonly cargando = computed(() => this.resultado().cargando);

    // si la peticion fallo, aqui queda la frase para mostrar. si no, null
    readonly error = computed(() => this.resultado().error);

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

    // la caja de busqueda llama esto con el texto ya limpio. se mete al tubo y sale la peticion
    buscar(texto: string): void {
        this._texto.set(texto);
        this.seleccionada.set(null);
        this.busquedas.next(texto);
    }

    // vuelve a pedir las clases con el mismo texto de antes, por ejemplo despues de crear, editar o borrar
    recargar(): void {
        this.seleccionada.set(null);
        this.busquedas.next(this.busquedas.value);
    }

}

// lo que sale del tubo cada vez: si esta cargando, si hubo error y la lista de clases
interface Resultado {
    cargando: boolean;
    error: string | null;
    clases: Clase[];
}
