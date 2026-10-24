# Citas React

Aplicación de **seguimiento de pacientes para una veterinaria** hecha con **React 19, Vite y Tailwind CSS 4**. Permite **registrar mascotas** con su propietario, email de contacto, fecha de alta y síntomas, y luego **editarlas o eliminarlas**. Todo se guarda en el **`localStorage` del navegador**, así que los datos sobreviven a una recarga sin necesidad de backend.

**Demo:** https://citasreact.vercel.app

![Tech](https://img.shields.io/badge/React-19-61DAFB)
![Tech](https://img.shields.io/badge/Vite-8-646CFF)
![Tech](https://img.shields.io/badge/Tailwind_CSS-4-38BDF8)
![Tech](https://img.shields.io/badge/localStorage-persistencia-orange)

---

## Tabla de contenidos

- [Citas React](#citas-react)
  - [Tabla de contenidos](#tabla-de-contenidos)
  - [Qué hace el proyecto](#qué-hace-el-proyecto)
  - [Cómo ejecutar el proyecto](#cómo-ejecutar-el-proyecto)
  - [Uso](#uso)
  - [Cómo funciona](#cómo-funciona)
    - [1. `src/App.jsx`](#1-srcappjsx)
    - [2. `src/components/Formulario.jsx`](#2-srccomponentsformulariojsx)
    - [3. Listado y tarjetas](#3-listado-y-tarjetas)
    - [4. `src/index.css` y `vercel.json`](#4-srcindexcss-y-verceljson)
    - [Flujo de la aplicación](#flujo-de-la-aplicación)
  - [Tecnologías](#tecnologías)
  - [Estructura del proyecto](#estructura-del-proyecto)
  - [Personalización](#personalización)
  - [Licencia](#licencia)

---

## Qué hace el proyecto

- **Alta de pacientes**: nombre de la mascota, propietario, email, fecha de alta y síntomas.
- **Edición** de un paciente existente reutilizando el mismo formulario.
- **Eliminación** con confirmación previa.
- **Validación**: todos los campos son obligatorios (se ignoran los que solo tienen espacios).
- **Persistencia en `localStorage`**, descartando datos corruptos o con un formato inesperado.
- Si el navegador bloquea `localStorage` (por ejemplo en un `<iframe>` de terceros), la app **sigue funcionando en memoria**.
- Diseño responsive con **Tailwind CSS**: formulario y listado lado a lado en pantallas medianas.
- Puede **incrustarse en un `<iframe>`** (`frame-ancestors *`).

---

## Cómo ejecutar el proyecto

Requisitos: **Node.js `^20.19.0` o `>=22.12.0`** (campo `engines` de `package.json`).

```bash
npm install
npm run dev
```

Abre la URL que imprime Vite (por defecto http://localhost:5173).

| Comando           | Descripción                              |
| ----------------- | ---------------------------------------- |
| `npm run dev`     | Servidor de desarrollo                   |
| `npm run build`   | Build de producción en `dist/`           |
| `npm run preview` | Previsualiza el build de producción      |

No requiere variables de entorno.

---

## Uso

1. Rellena el formulario **Seguimiento Pacientes** y pulsa **Agregar Paciente**.
2. El paciente aparece en **Listado Pacientes** como una tarjeta.
3. **Editar** carga sus datos en el formulario; el botón pasa a **Editar Paciente** y al enviarlo se actualiza el registro.
4. **Eliminar** pide confirmación (`¿Deseas eliminar a este paciente?`) y lo borra del listado.

Para incrustarla en otra web:

```html
<iframe
  src="https://citasreact.vercel.app"
  title="Citas React"
  width="100%"
  height="800"
  style="border: 0"
></iframe>
```

> En un `<iframe>` de otro dominio algunos navegadores bloquean o particionan el almacenamiento: la app funciona igual, pero los pacientes no se conservan entre visitas.

---

## Cómo funciona

### 1. `src/App.jsx`

Es el dueño del estado:

- `pacientes`: lista de pacientes, inicializada de forma diferida con `useState(obtenerLS)` para leer `localStorage` **antes del primer render** (así el efecto de guardado nunca pisa los datos con un array vacío).
- `obtenerLS()`: hace `JSON.parse` de la clave `pacientes` dentro de un `try/catch`, exige un array y filtra los objetos cuyos campos de `CAMPOS` no sean todos `string`.
- Un `useEffect([pacientes])` guarda la lista con `localStorage.setItem`, también protegido con `try/catch`.
- `paciente`: el paciente en edición (`{}` si no hay ninguno).
- `eliminarPaciente(id)`: filtra la lista y, si se borra el paciente que se estaba editando, limpia `paciente`.

### 2. `src/components/Formulario.jsx`

- Un `useState` por campo (`nombre`, `propietario`, `email`, `fecha`, `sintomas`) y otro para `error`.
- Un `useEffect([paciente])` rellena los campos cuando se pulsa **Editar**.
- `generarId()`: id único combinando `Math.random().toString(36)` y `Date.now().toString(36)`.
- `handleSubmit`: valida con `some(campo => campo.trim() === '')`; si hay `paciente.id` sustituye el registro con `map`, si no añade uno nuevo con id generado; después reinicia el formulario.
- Muestra el componente `Error` con _"Todos los campos son obligatorios"_ cuando falla la validación.

### 3. Listado y tarjetas

- **`ListadoPacientes`**: si hay pacientes renderiza un `Pacientes` por cada uno; si no, muestra _"No hay pacientes"_.
- **`Pacientes`**: tarjeta con los datos y los botones **Editar** (`setPaciente(paciente)`) y **Eliminar** (`confirm` + `eliminarPaciente(id)`).
- **`Header`**: título principal. **`Error`**: caja de mensaje que recibe `children`.

### 4. `src/index.css` y `vercel.json`

`index.css` importa Tailwind (`@import "tailwindcss"`) y añade en `@layer base` el color de borde por defecto y el cursor de los botones, para mantener el comportamiento de Tailwind v3. `vercel.json` envía `frame-ancestors *`, `X-Content-Type-Options: nosniff` y `Referrer-Policy`.

### Flujo de la aplicación

```
main.jsx
  └─ <App>
       ├─ useState(obtenerLS)          → lee y sanea localStorage['pacientes']
       ├─ useEffect([pacientes])       → localStorage.setItem('pacientes', …)
       ├─ <Header>
       ├─ <Formulario>
       │     ├─ useEffect([paciente])  → carga datos al editar
       │     └─ handleSubmit()
       │          ├─ campos vacíos  → <Error>
       │          ├─ paciente.id    → map() reemplaza el registro
       │          └─ nuevo          → generarId() + [...pacientes, nuevo]
       └─ <ListadoPacientes>
             └─ <Pacientes> × N
                   ├─ Editar   → setPaciente(paciente)
                   └─ Eliminar → confirm() → eliminarPaciente(id)
```

---

## Tecnologías

- **React 19** — componentes funcionales y hooks (`useState`, `useEffect`).
- **Vite 8** — servidor de desarrollo y build.
- **Tailwind CSS 4** — integrado con el plugin `@tailwindcss/vite`.
- **Web Storage API** — `localStorage` para la persistencia.
- **Vercel** — despliegue y cabeceras.

---

## Estructura del proyecto

```
citas_react/
├── public/
│   ├── apple-touch-icon.png
│   └── favicon.svg
├── src/
│   ├── components/
│   │   ├── Error.jsx             # Mensaje de validación
│   │   ├── Formulario.jsx        # Alta / edición
│   │   ├── Header.jsx
│   │   ├── ListadoPacientes.jsx  # Lista de pacientes
│   │   └── Pacientes.jsx         # Tarjeta de un paciente
│   ├── App.jsx                   # Estado y persistencia
│   ├── index.css                 # Tailwind + estilos base
│   └── main.jsx
├── index.html
├── package.json
├── vercel.json
└── vite.config.js
```

---

## Personalización

| Dónde                            | Constante / valor | Significado                                         | Valor actual                                                   |
| -------------------------------- | ----------------- | --------------------------------------------------- | -------------------------------------------------------------- |
| `src/App.jsx`                    | `CAMPOS`          | Campos que debe tener un paciente válido en storage | `['id', 'nombre', 'propietario', 'email', 'fecha', 'sintomas']` |
| `src/App.jsx`                    | clave de storage  | Clave usada en `localStorage`                       | `'pacientes'`                                                  |

> `obtenerLS()` descarta cualquier registro guardado al que le falte un campo de `CAMPOS`. Si añades un campo nuevo al formulario y a `CAMPOS`, los pacientes guardados antes del cambio se descartarán al recargar.

---

## Licencia

Proyecto de uso libre con fines educativos y de práctica.
