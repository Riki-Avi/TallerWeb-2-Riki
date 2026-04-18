# 🎲 Proyecto Dados — Taller Web 2, Clase 1

Juego simple de dados hecho con **Angular 21** para aprender los conceptos fundamentales del framework.

---

## 📌 ¿Qué hace la app?

1. El usuario hace clic en el botón **"Tirar Dados"**
2. Se generan **2 números aleatorios** del 1 al 6
3. Se muestran las **imágenes** de los dados correspondientes (`dice1.png` a `dice6.png`)
4. Si ambos dados tienen el **mismo número** → muestra **"GANASTE"**
5. Si son **diferentes** → muestra **"PERDISTE"**

---

## 🛠️ Stack Tecnológico

| Tecnología     | Versión  | Para qué se usa                       |
|----------------|----------|---------------------------------------|
| Angular        | 21.2.0   | Framework principal (SPA)             |
| TypeScript     | 5.9.2    | Lenguaje tipado del componente        |
| Bootstrap      | 5.3.8    | Estilos CSS (CDN en `index.html`)     |
| Vitest         | 4.0.8    | Test runner (reemplaza a Karma/Jest)  |
| Node/npm       | —        | Gestor de paquetes y scripts          |

---

## 📁 Estructura del Proyecto (solo lo importante)

```
Dados/
├── public/                    ← Assets estáticos (imágenes de dados)
│   ├── dice1.png ... dice6.png
│   └── favicon.ico
├── src/
│   ├── index.html             ← HTML raíz, carga Bootstrap por CDN
│   ├── main.ts                ← Punto de entrada, bootstrapea la app
│   ├── styles.css             ← Estilos globales (vacío por ahora)
│   └── app/
│       ├── app.ts             ← ⭐ COMPONENTE PRINCIPAL (toda la lógica vive acá)
│       ├── app.html           ← ⭐ TEMPLATE del componente (el HTML que se ve)
│       ├── app.css            ← Estilos del componente (tamaño de los dados)
│       ├── app.config.ts      ← Configuración de providers (router, errores)
│       ├── app.routes.ts      ← Rutas (vacío, no se usan rutas)
│       └── app.spec.ts        ← Tests unitarios del componente
├── angular.json               ← Config de Angular CLI (build, serve, assets)
├── package.json               ← Dependencias y scripts npm
└── tsconfig.json              ← Configuración de TypeScript
```

---

## ⭐ Explicación del Código Clave

### 1. `main.ts` — Punto de entrada

```typescript
bootstrapApplication(App, appConfig)
  .catch((err) => console.error(err));
```

- **`bootstrapApplication()`**: Función que arranca la app Angular.
- Recibe 2 argumentos:
  - `App` → El componente raíz (el que tiene `selector: 'app-root'`)
  - `appConfig` → Objeto con los providers globales (router, error handling)
- **No usa `NgModule`** → Esto es Angular moderno (**standalone**). Todo funciona sin módulos.

---

### 2. `app.ts` — EL COMPONENTE (donde vive toda la lógica)

```typescript
import { Component, signal } from '@angular/core';

@Component({
  selector: 'app-root',     // <app-root></app-root> en index.html
  imports: [],               // Standalone: importaría otros componentes acá
  templateUrl: './app.html', // Apunta al archivo HTML del template
  styleUrl: './app.css',     // Apunta al archivo CSS del componente
})
export class App {
  // signal() → API reactiva de Angular (nuevo, reemplaza a BehaviorSubject para UI)
  protected readonly title = signal('dados');

  // Propiedades "clásicas" (sin signals, property binding directo)
  dadoIzquierdo: string = 'dice1.png';   // nombre del archivo de imagen
  dadoDerecho: string = 'dice2.png';

  numero1: number = 1;    // valor numérico del dado izquierdo
  numero2: number = 2;    // valor numérico del dado derecho

  resultado = '';          // texto que muestra GANASTE o PERDISTE

  lanzarDados() {
    // Math.random() → número entre 0 y 0.999...
    // * 6 → entre 0 y 5.999...
    // Math.floor() → redondea hacia abajo: 0, 1, 2, 3, 4, 5
    // + 1 → resultado final: 1, 2, 3, 4, 5, 6
    this.numero1 = Math.floor(Math.random() * 6) + 1;
    this.numero2 = Math.floor(Math.random() * 6) + 1;

    // Construye el nombre del archivo: "dice" + número + ".png"
    // Ej: numero1 = 4 → "dice4.png"
    this.dadoIzquierdo = 'dice' + this.numero1 + '.png';
    this.dadoDerecho = 'dice' + this.numero2 + '.png';

    // Lógica del juego: iguales = ganaste
    if (this.numero1 == this.numero2) {
      this.resultado = 'GANASTE';
    } else {
      this.resultado = 'PERDISTE';
    }
  }
}
```

#### Conceptos clave de Angular usados acá:

| Concepto              | Qué es                                          | Ejemplo en el código                        |
|-----------------------|-------------------------------------------------|---------------------------------------------|
| `@Component`          | Decorador que marca una clase como componente   | `@Component({ selector: 'app-root' ... })`  |
| `selector`            | El tag HTML custom que representa al componente | `<app-root></app-root>` en `index.html`     |
| `templateUrl`         | Archivo HTML separado para el template          | `'./app.html'`                              |
| `styleUrl`            | Archivo CSS encapsulado del componente          | `'./app.css'`                               |
| `signal()`            | API reactiva (Angular 16+), como un state       | `signal('dados')` (no se usa mucho acá)     |
| Property binding      | `[propiedad]="valor"` en el HTML                | `[src]="dadoIzquierdo"`                     |
| Event binding         | `(evento)="método()"` en el HTML                | `(click)="lanzarDados()"`                   |
| Interpolation         | `{{ expresión }}` muestra valores en el HTML    | `{{ resultado }}`                           |
| **Standalone**        | Componente sin NgModule (moderno)               | `imports: []` en el decorador               |

---

### 3. `app.html` — El Template (lo que ve el usuario)

```html
<div class="jumbotron text-center mt-3">
  <!-- EVENT BINDING: al hacer clic ejecuta lanzarDados() -->
  <button (click)="lanzarDados()" class="btn btn-primary"> Tirar Dados </button>
  <br>

  <!-- PROPERTY BINDING: [src] se enlaza a la propiedad dadoIzquierdo del .ts -->
  <!-- Cuando dadoIzquierdo cambia de valor, la imagen cambia automáticamente -->
  <img class="img" [src]="dadoIzquierdo" alt="">
  <img class="img" [src]="dadoDerecho" alt="">

  <!-- INTERPOLATION: muestra el valor de 'resultado' del .ts -->
  <h1>{{resultado}}</h1>
</div>
```

#### Los 3 tipos de Data Binding usados:

```
┌──────────────────────────────────────────────────────────┐
│                    DATA BINDING                          │
│                                                          │
│  1. INTERPOLATION    {{ resultado }}                     │
│     TS → HTML        Muestra el valor como texto         │
│                                                          │
│  2. PROPERTY BINDING [src]="dadoIzquierdo"               │
│     TS → HTML        Enlaza una propiedad HTML a un      │
│                      valor del componente TypeScript      │
│                                                          │
│  3. EVENT BINDING    (click)="lanzarDados()"             │
│     HTML → TS        Cuando pasa un evento en el HTML,   │
│                      ejecuta un método del componente    │
└──────────────────────────────────────────────────────────┘
```

---

### 4. `app.css` — Estilos del componente

```css
.img {
    width: 200px;       /* Tamaño fijo del dado */
    height: 200px;
    margin: 30px;       /* Espacio entre dados */
    background-color: red;   /* Color de fondo mientras carga la imagen */
    border-radius: 10px;     /* Bordes redondeados */
}
```

> Estos estilos están **encapsulados**: solo aplican dentro de este componente, no afectan al resto de la app. Esto es por el **View Encapsulation** de Angular.

---

### 5. `app.config.ts` — Configuración global

```typescript
export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),  // Captura errores globales del browser
    provideRouter(routes)                  // Habilita el router (aunque no se usa acá)
  ]
};
```

> Los **providers** son servicios/configuraciones inyectados globalmente. Es como decirle a Angular: "che, necesito estas funcionalidades disponibles en toda la app".

---

## 🧠 Flujo Completo de la App (de arriba a abajo)

```
1. El browser carga index.html
2. index.html tiene <app-root></app-root> ← placeholder del componente
3. main.ts ejecuta bootstrapApplication(App, appConfig)
4. Angular reemplaza <app-root> con el template de app.html
5. El usuario ve el botón "Tirar Dados" y las imágenes iniciales
6. El usuario hace clic → (click)="lanzarDados()"
7. Se ejecuta lanzarDados() en app.ts:
   a. Genera 2 números random del 1 al 6
   b. Actualiza dadoIzquierdo y dadoDerecho (nombres de imágenes)
   c. Compara: iguales = GANASTE, distintos = PERDISTE
8. Angular detecta que las propiedades cambiaron
9. Actualiza automáticamente el DOM:
   - Las imágenes cambian ([src] binding)
   - El texto del resultado cambia ({{ interpolation }})
```

---

## 🗂️ Assets: Las imágenes de los dados

Las imágenes están en `public/` y se sirven como archivos estáticos:

| Archivo    | Representa |
|------------|------------|
| dice1.png  | ⚀ (1)     |
| dice2.png  | ⚁ (2)     |
| dice3.png  | ⚂ (3)     |
| dice4.png  | ⚃ (4)     |
| dice5.png  | ⚄ (5)     |
| dice6.png  | ⚅ (6)     |

Se acceden directamente por nombre (`dice4.png`) porque Angular mapea la carpeta `public/` como raíz de assets estáticos (configurado en `angular.json` → `assets`).

---

## 🚀 Comandos para correr el proyecto

```bash
# Instalar dependencias (solo la primera vez)
npm install

# Levantar el servidor de desarrollo
ng serve
# o también:
npm start

# La app corre en: http://localhost:4200

# Correr tests
ng test
```

---

## 📎 Glosario Rápido de Angular

| Término               | Definición simple                                                             |
|-----------------------|-------------------------------------------------------------------------------|
| **Componente**        | Pieza reutilizable de UI = clase TypeScript + template HTML + estilos CSS      |
| **Decorador**         | `@Component`, `@Injectable`, etc. Metadatos que le dicen a Angular qué es qué |
| **Standalone**        | Componente que no necesita un `NgModule`. Es el estándar moderno de Angular    |
| **Data Binding**      | Conexión automática entre datos del TS y la vista HTML                         |
| **Interpolation**     | `{{ variable }}` → muestra el valor de una variable en el HTML                 |
| **Property Binding**  | `[atributo]="propiedad"` → enlaza un atributo HTML a una propiedad del TS     |
| **Event Binding**     | `(evento)="método()"` → escucha un evento del DOM y ejecuta un método         |
| **Signal**            | Primitiva reactiva de Angular (v16+). Como un `state` reactivo                |
| **Provider**          | Servicio o config inyectable disponible en toda la app                         |
| **Bootstrap**         | El proceso de arrancar la app Angular (no confundir con Bootstrap CSS)         |
| **View Encapsulation**| Los estilos CSS de un componente no se filtran a otros componentes             |
