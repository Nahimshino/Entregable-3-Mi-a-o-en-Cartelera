# AGENTS.md — Mi Cartelera Personal

## Qué es la app

App móvil Expo + React Native en TypeScript. Cada usuario inicia sesión con Firebase Auth, busca películas y
series en TMDB y las guarda en su lista de Firestore (`usuarios/{uid}/mi_lista/{tipo_tmdbId}`) con estado
(por ver, viendo, vista), calificación de 1 a 5 y comentario. Funciona sin conexión con una copia en
AsyncStorage. Épica en curso: **Mi año en cine** (`docs/prd/`, `docs/backlog/`, `docs/specs/`).

## Capas y carpetas

| Carpeta | Responsabilidad |
| :--- | :--- |
| `src/screens/` | Pantallas. Solo UI: leen el contexto y llaman servicios; nunca importan Firebase |
| `src/components/` | Piezas visuales reutilizables |
| `src/context/` | `CarteleraContext`: usuario, lista, acciones y caché |
| `src/services/` | Único lugar que usa Firebase, TMDB y AsyncStorage |
| `src/dominio/` | Funciones puras de reglas de negocio (sin Firebase, sin `new Date()` del sistema) y sus tests |
| `src/tema/` | Tokens de diseño: única fuente de colores, espacios y tamaños |
| `src/types/`, `src/utils/` | Tipos del modelo y utilidades puras |
| `docs/` | Auditoría, PRD, backlog, specs, diseño, verificación y uso de IA |

## Comandos de verificación

```bash
npm test            # Vitest (dominio, reglas, colores fijos)
npx tsc --noEmit    # tipos
npm run lint        # ESLint de Expo
```

`npm test` y `npx tsc --noEmit` deben pasar antes de cada commit de código.

## Reglas

- **Nunca leer, mostrar ni editar `.env`**. Las claves de Firebase y el token de TMDB no van al chat.
- Las pantallas y componentes no importan `firebase/*`: todo pasa por `src/services/`.
- Sin `any`. Si es inevitable, un comentario que lo justifique.
- Toda petición maneja cargando, error y éxito (`EstadoPeticion<T>`). Elementos tocables de 44 de alto mínimo.
- La atribución y el logo de TMDB siguen visibles en Acerca de, siempre menos prominentes que la marca.
- Las reglas de negocio viven en `src/dominio/` como funciones puras con su test; nunca en una pantalla.
- Ningún código sin su spec: el documento (`docs:`) se commitea antes que el código (`feat:`/`fix:`).
- No se borra ni se salta un test para que pase.
- Dependencias nuevas solo si la spec las justifica, con `npx expo install`, compatibles con Expo Go.
  Sin librerías de gráficas.
- Commits con la skill `/commit` (español, prefijo `docs:`, `feat:`, `fix:`, `test:`, `chore:`).
- **Antes de tocar pantallas o componentes, leer `DESIGN.md`.** Colores y tamaños salen de `src/tema/`.
  El agente no modifica `DESIGN.md` por su cuenta.
