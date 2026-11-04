# Práctica 19 – El panel del gimnasio: el tablero en Angular

## Ejercicio 1: el proyecto y el tablero

Creé el proyecto con `ng new gimnasio-admin` sin SSR, sin router y sin pruebas, copié del código base los estilos, las imágenes, el modelo y las clases locales, y en el componente raíz puse el resumen: el total de clases (8), los minutos a la semana (380) y las clases de una hora o más (2).

![Tablero con las 8 clases](evidencias/01-tablero-8-clases.png)

### ¿Qué archivo de Angular hace el papel de main.tsx, de App.tsx y de vite.config.ts?

- `main.tsx` → `src/main.ts`. Es donde arranca la app: ahí se llama a `bootstrapApplication(App, appConfig)`, que es parecido a lo que hacía `createRoot(...).render(...)` en React.
- `App.tsx` → `src/app/app.ts`, junto con su `app.html` y su `app.css`. Es el componente raíz, el que contiene todo lo demás. En React el HTML iba dentro del mismo archivo y aquí va aparte.
- `vite.config.ts` → `angular.json`. Ahí se dice cuál es el archivo de entrada (`src/main.ts`), dónde están los estilos (`src/styles.css`) y que la carpeta `public` se sirve tal cual. Esta es la equivalencia que menos segura tengo, porque no son idénticos: lo digo por lo que cumple cada uno en el proyecto, que es la configuración de cómo se arma y se sirve la aplicación.

## Ejercicio 2: la tarjeta de una clase

Generé el componente `tarjeta-clase` con el CLI. Recibe la clase con `input.required()` y muestra su imagen, nombre, descripción, categoría y duración. La etiqueta «Larga» solo sale en las clases de 60 minutos o más (con `@if`; en mi tablero salió en Fuerza total y en Boxeo recreativo). Las tarjetas se repiten con `@for`, y cuando no hay clases sale un mensaje con `@empty`. Agregué los botones Vaciar y Restaurar.

Con el botón Vaciar, el tablero queda sin clases, con el resumen en 0 y el mensaje:

![Tablero vacío](evidencias/02-tablero-vacio.png)

### ¿Por qué clase() lleva paréntesis y para qué sirve track?

`clase()` lleva paréntesis porque `input.required()` no regresa la clase directamente, sino una señal (signal), y para leer lo que tiene adentro hay que llamarla como si fuera una función. Si pusiera `clase.nombre` sin paréntesis, estaría buscando el nombre en la señal y no en la clase.

El `track` sirve para que Angular reconozca cuál tarjeta es cuál cuando la lista cambia. En mi `@for` uso `track clase.id`, o sea que cada tarjeta se identifica por el id de su clase. Así, si la lista cambia, Angular sabe cuáles tarjetas ya existían y no tiene que volver a armarlas todas. Esto último es lo que entendí de cómo funciona, no lo comprobé midiendo nada.

### Provocar y capturar los errores NG5002 y NG8001

**NG8001.** Quité `TarjetaClase` de los `imports` del componente raíz. Angular ya no sabe qué es `<app-tarjeta-clase>` y marca el error `NG8001: 'app-tarjeta-clase' is not a known element`, con un recuadro rojo en el navegador.

![Error NG8001](evidencias/03-error-ng8001.png)

**NG5002.** Cambié `@empty` por `@vacio`, que no existe. Angular no lo reconoce como un bloque, entonces piensa que las llaves son texto suelto y marca `NG5002` (dos veces: «Unexpected character "EOF"» e «Invalid ICU message. Missing '}'»). Este error me salió en la terminal donde corre `ng serve`, pero en el navegador no salió nada: la página siguió mostrando la última versión que sí compilaba.

![Error NG5002](evidencias/04-error-ng5002.png)

Después de capturar los errores, regresé el código a como estaba.
