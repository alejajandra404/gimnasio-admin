import { HttpClient } from '@angular/common/http';
import { inject, Service } from '@angular/core';
import { map } from 'rxjs';
import { Clase, ClaseConHorarios, ClaseNueva, Sobre } from '../app/modelos/clase';
import { API_URL } from '../config';

// este servicio habla con la api: listar, crear, editar y borrar clases
// todos regresan { data, meta } y con map me quedo solo con data
@Service()
export class ClasesApi {
    private readonly http = inject(HttpClient);

    // POST /clases: crea una clase nueva
    // ojo: esto no manda nada hasta que alguien le haga subscribe()
    crear(datos: ClaseNueva) {
        return this.http.post<Sobre<Clase>>(`${API_URL}/clases`, datos).pipe(map((r) => r.data));
    }

    // GET /clases/2: una sola clase, con sus horarios
    obtener(id: number) {
        return this.http.get<Sobre<ClaseConHorarios>>(`${API_URL}/clases/${id}`).pipe(map((r) => r.data));
    }

    // PATCH /clases/2: cambia los datos de una clase que ya existe
    actualizar(id: number, datos: ClaseNueva) {
        return this.http.patch<Sobre<Clase>>(`${API_URL}/clases/${id}`, datos).pipe(map((r) => r.data));
    }

    // DELETE /clases/2: borra la clase
    eliminar(id: number) {
        return this.http.delete<Sobre<Clase>>(`${API_URL}/clases/${id}`).pipe(map((r) => r.data));
    }

    // GET /clases?q=yoga: las clases que tienen ese texto en el nombre
    // si q viene vacio no se manda el ?q= y regresa todas
    listar(q = '') {
        const params = q ? { q } : undefined;
        return this.http.get<Sobre<Clase[]>>(`${API_URL}/clases`, { params }).pipe(map((r) => r.data));
    }
}
