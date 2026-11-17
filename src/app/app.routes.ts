import { Routes } from "@angular/router";
import { ListaClases } from "./paginas/lista-clases/lista-clases";
import { Horarios } from "./paginas/horarios/horarios";
import { Miembros } from "./paginas/miembros/miembros";
import { Login } from "./paginas/login/login";
import { Panel } from "./paginas/panel/panel";
import { soloAdmin } from "./sesion/solo-admin";
import { cambiosSinGuardar } from "./guardas/cambios-sin-guardar";
import { DetalleClase } from "./paginas/detalle-clase/detalle-clase";

// aqui se dice que pagina sale con cada direccion. title es el texto de la pestaña del navegador
export const routes: Routes = [
    // el login va afuera del panel, porque para entrar no se necesita sesion
    { path: "login", component: Login },
    // el panel es el marco (la barra) y adentro se pintan sus rutas hijas (children)
    // canActivate: antes de entrar, el guardia soloAdmin revisa que haya sesion de admin. si no, manda al login
    { path: "", component: Panel, canActivate: [soloAdmin], children: [
        { path: "clases", component: ListaClases, title: "Clases - Admin" },
        { path: "horarios", component: Horarios, title: "Horarios - Admin" },
        { path: "miembros", component: Miembros, title: "Miembros - Admin" },
        // loadComponent: el formulario se descarga hasta que alguien entra a esta ruta, no desde el principio
        { path: "clases/nueva",
            loadComponent: () => import("./paginas/formulario-clase/formulario-clase")
                .then((m) => m.FormularioClase),
            // canDeactivate: antes de salir del formulario se revisa si hay cambios sin guardar
            canDeactivate: [cambiosSinGuardar],
            title: "Nueva clase - Admin" },
        // la misma pagina del formulario sirve para editar. el :id de la url le llega al formulario como input
        { path: "clases/:id/editar",
            loadComponent: () => import("./paginas/formulario-clase/formulario-clase")
                .then((m) => m.FormularioClase),
            canDeactivate: [cambiosSinGuardar],
            title: "Editar clase - Admin" },
        // el detalle va DESPUES de clases/nueva: si fuera antes, "nueva" se tomaria como si fuera un id
        { path: "clases/:id", component: DetalleClase, title: "Detalle de clase - Admin" },
        // si la direccion esta vacia (localhost:4200) manda a /clases. pathMatch full = solo si esta vacia completa
        { path: "", redirectTo: "clases", pathMatch: 'full' },
    ]},
    // ** atrapa cualquier direccion que no exista. va al final porque angular revisa las rutas en orden
    { path: "**", redirectTo: "clases" },
];
