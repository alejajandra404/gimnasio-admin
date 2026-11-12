import { AbstractControl, ValidationErrors, ValidatorFn } from "@angular/forms";

// validador propio: revisa que el numero sea multiplo de n (con n = 5: 45, 50, 55...)
// se escribe como una funcion que regresa otra funcion, asi se le puede pasar el numero: multiploDe(5)
export function multiploDe(n: number): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
        const valor = Number(control.value);

        // si el campo esta vacio no digo nada, de eso ya se encarga Validators.required
        if (control.value === null || control.value === "") return null;
        // null = todo bien. si no, regreso un objeto con el nombre del error, que es el que busca hasError('multiploDe')
        return valor % n === 0 ? null : { multiploDe: { n, valor } };
    }
}
