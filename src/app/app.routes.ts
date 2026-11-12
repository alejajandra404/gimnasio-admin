import { Routes } from "@angular/router";
import { ListaClases } from "./paginas/lista-clases/lista-clases";
import { Horarios } from "./paginas/horarios/horarios";
import { Miembros } from "./paginas/miembros/miembros";
import { FormularioClase } from "./paginas/formulario-clase/formulario-clase";

// aqui se dice que pagina sale con cada direccion. title es el texto de la pestaña del navegador
export const routes: Routes = [
    { path: "clases", component: ListaClases, title: "Clases - Admin" },
    { path: "horarios", component: Horarios, title: "Horarios - Admin" },
    { path: "miembros", component: Miembros, title: "Miembros - Admin" },
    { path: "clases/nueva", component: FormularioClase, title: "Nueva clase - Admin" },
    // si la direccion esta vacia (localhost:4200) manda a /clases. pathMatch full = solo si esta vacia completa
    { path: "", redirectTo: "clases", pathMatch: 'full' },
    // ** atrapa cualquier direccion que no exista. va al final porque angular revisa las rutas en orden
    { path: "**", redirectTo: "clases" },
];
