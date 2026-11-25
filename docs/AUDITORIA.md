# Auditoría — Mi Cartelera Personal

## 1. Auditoría inicial (Hito 1, 2026-11-25)

Punto de partida: etiqueta `p3-final` (commit `eba839a`), rama `epica-mi-anio`.
Especificación de referencia: `entregable_2_mi_cartelera_personal.md` (RF1 a RF10, secciones 1.6 a 1.11). El
proyecto no tiene un `SPEC.md` aparte; ese documento cumple ese papel.

### 1.1 Resumen del proyecto (paso 1)

- **Qué hace:** app Expo + React Native en TypeScript. El usuario se registra con Firebase Auth, busca
  películas y series en TMDB, las agrega a su lista (`usuarios/{uid}/mi_lista/{tipo_tmdbId}`) y edita estado,
  calificación (1 a 5, solo si está vista) y comentario. Funciona sin conexión con una copia en AsyncStorage.
- **Capas:** `screens/` → `context/CarteleraContext` (estado global y acciones) → `services/` (único lugar que
  usa Firebase, TMDB y AsyncStorage). `types/` define el modelo, `utils/` tiene tema, validaciones,
  traducción de errores y tiempo límite. `components/` agrupa piezas visuales reutilizables.
- **Cómo se verifica hoy:** solo `npx tsc --noEmit` y `npm run lint`. No hay tests automáticos ni script
  `npm test`; la verificación de RF1 a RF11 se hizo a mano en Expo Go y con el simulador de reglas.

### 1.2 Hallazgos

Gravedad: **alta** (incumple un requisito o bloquea la épica), **media** (riesgo real en uso),
**baja** (calidad o deuda). Decisión: **corregir ahora**, **riesgo conocido** o **fuera de alcance** (se
resuelve en el hito indicado).

| Id | Hallazgo | Evidencia | Gravedad | Decisión |
| :--- | :--- | :--- | :--- | :--- |
| A-01 | No hay tests automáticos ni script `npm test`; ninguna regla de negocio tiene un sensor | `package.json` (`scripts`) | Alta | Corregir ahora (Hito 1, paso 5: Vitest + test de `normalizarCambios`) |
| A-02 | Las reglas exigen exactamente los 10 campos actuales (`hasOnly` + `hasAll`): cualquier documento con `vistaEn`, `generos`, `duracionMin` o `directores` será rechazado | `firestore.rules`, `datosValidos()` | Alta para la épica | Fuera de alcance del Hito 1: se corrige en el Hito 3 (paso 14) con `get(campo, defecto)` según 1.6 |
| A-03 | Agregar una obra sin conexión falla: `agregarElemento` hace `getDocFromServer` antes de escribir y se agota el tiempo | `listaService.ts`, `agregarElemento()` | Media | Riesgo conocido: RF8 solo exige mostrar la copia sin conexión; el error se muestra traducido |
| A-04 | Las escrituras pendientes sin conexión viven en la cola en memoria de Firestore; si se cierra la app antes de reconectar se pierden, pero la copia de AsyncStorage ya muestra el cambio | `CarteleraContext.tsx`, `actualizar()` / `eliminar()`; `firebaseConfig.ts` (sin caché persistente) | Media | Riesgo conocido: se avisa al usuario con `AVISO_PENDIENTE`; al reconectar `recargar()` vuelve a la verdad del servidor |
| A-05 | Colores escritos fuera del tema: `rgba(255,107,107,0.12)` en el login y los hex del logo de TMDB | `LoginScreen.tsx:165`, `LogoTmdb.tsx:4` | Baja | Fuera de alcance: se mueven a `src/tema/` en el Hito 4 (el test de colores fijos lo detectará en el Hito 2) |
| A-06 | Tamaños y espacios sueltos (43 valores numéricos de `fontSize`, `height`, `padding`, `margin`) en pantallas y componentes | `src/screens/*`, `src/components/*` | Baja | Fuera de alcance: pasan a tokens en el Hito 4 |
| A-07 | El tema vive en `src/utils/tema.ts`; la épica pide `src/tema/` como única fuente de verdad | `src/utils/tema.ts` | Baja | Fuera de alcance: se migra en el Hito 3 (paso 15) |
| A-08 | `ElementoLista` no tiene los campos de la épica (`vistaEn`, `generos`, `duracionMin`, `directores`) y el detalle de TMDB no los guarda al agregar | `types/lista.ts`, `DetalleScreen.tsx` (`agregarALista`) | Media para la épica | Fuera de alcance: Hito 3 (pasos 11 y 14) |
| A-09 | `.vscode/settings.json` trae una opción de Python que no aplica al proyecto | `.vscode/settings.json` | Baja | Riesgo conocido (no afecta) |
| A-10 | El botón Guardar se habilita si el comentario solo difiere en espacios al final, aunque al guardar se recorta y no cambia nada | `EditarScreen.tsx`, `huboCambios` | Baja | Riesgo conocido |

### 1.3 Requisitos que se cumplen (sin hallazgos)

| RF | Evidencia |
| :--- | :--- |
| RF1 | `firebaseConfig.ts` (`getReactNativePersistence`), `RootNavigator.tsx`, `utils/erroresFirebase.ts` |
| RF2, RF3 | `tmdbService.ts` (`buscar`, `obtenerDetalle` con `append_to_response=credits`), `Estado.tsx` |
| RF4 | `crearItemId` + `DuplicadoError` + regla `itemId == tipo + '_' + tmdbId` |
| RF5 | Filtros en `MiListaScreen.tsx` |
| RF6 | `normalizarCambios` + estrellas deshabilitadas + regla `calificacionPersonal` en `firestore.rules` |
| RF7 | `Alert` de confirmación en `EditarScreen.tsx` |
| RF8 | `cacheService.ts` + `copiaSinConexion` en el contexto |
| RF9 | `AcercaDeScreen.tsx` + `LogoTmdb.tsx` |
| RF10 | Sin `any` (búsqueda en `src/`), pantallas sin imports de Firebase, `.env` nunca subido (`git log --all -- .env` vacío) |

## 2. Auditoría final

_Pendiente (Hito 4, paso 18)._
