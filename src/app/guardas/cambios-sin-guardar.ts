import { type CanDeactivateFn } from '@angular/router';
import type { FormularioClase } from '../paginas/formulario-clase/formulario-clase';

// guarda de salida: el router la ejecuta cuando quiero IRME del formulario (cancelar, un enlace de la barra, etc.)
// si regresa true me deja salir, si regresa false me quedo en el formulario
export const cambiosSinGuardar: CanDeactivateFn<FormularioClase> = (formulario) => {
    // si no cambie nada, salgo sin preguntar
    if (!formulario.hayCambios()) return true;

    // si hay cambios, pregunto con la ventanita del navegador
    return confirm('Tienes cambios sin guardar. ¿Seguro que quieres salir?');
};
