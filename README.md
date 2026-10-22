# Citas React

A small patient tracker for a veterinary clinic, built with React. Add pets with their owner, contact email, admission date and symptoms, then edit or remove them. Data is stored in the browser's `localStorage`, so it persists across reloads without a backend.

**Live demo:** https://citasreact.vercel.app

## Features

- Add, edit and delete patients
- Form validation (all fields required)
- Persistence in `localStorage`, with corrupted or malformed data safely ignored
- Responsive layout with Tailwind CSS
- Embeddable in an `<iframe>`

## Tech stack

- [React 19](https://react.dev/)
- [Vite 8](https://vite.dev/)
- [Tailwind CSS 4](https://tailwindcss.com/) via `@tailwindcss/vite`
- Deployed on [Vercel](https://vercel.com/)

## Getting started

Requires Node.js `^20.19.0` or `>=22.12.0`.

```bash
npm install
npm run dev
```

Then open the URL printed by Vite (http://localhost:5173 by default).

### Scripts

| Command           | Description                          |
| ----------------- | ------------------------------------ |
| `npm run dev`     | Start the development server         |
| `npm run build`   | Build for production into `dist/`    |
| `npm run preview` | Preview the production build locally |

No environment variables are required.

## Embedding

The app sends `Content-Security-Policy: frame-ancestors *` (see `vercel.json`), so it can be embedded on any site:

```html
<iframe
  src="https://citasreact.vercel.app"
  title="Citas React"
  width="100%"
  height="800"
  style="border: 0"
></iframe>
```

When embedded on another domain, some browsers block or partition storage for third-party iframes. In that case the app still works, but patients are not saved between visits.

## Project structure

```
src/
├── App.jsx                     # State and localStorage persistence
├── main.jsx                    # Entry point
├── index.css                   # Tailwind import and base styles
└── components/
    ├── Header.jsx
    ├── Formulario.jsx          # Add / edit form
    ├── ListadoPacientes.jsx    # Patient list
    ├── Pacientes.jsx           # Patient card
    └── Error.jsx               # Validation message
```
