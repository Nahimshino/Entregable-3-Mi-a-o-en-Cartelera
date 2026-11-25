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

| Id   | Hallazgo                                                                                                                                                                                | Evidencia                                                                                          | Gravedad            | Decisión                                                                                                               |
| :--- | :-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :------------------------------------------------------------------------------------------------- | :------------------ | :--------------------------------------------------------------------------------------------------------------------- |
| A-01 | No hay tests automáticos ni script `npm test`; ninguna regla de negocio tiene un sensor                                                                                                 | `package.json` (`scripts`)                                                                         | Alta                | Corregir ahora (Hito 1, paso 5: Vitest + test de `normalizarCambios`)                                                  |
| A-02 | Las reglas exigen exactamente los 10 campos actuales (`hasOnly` + `hasAll`): cualquier documento con `vistaEn`, `generos`, `duracionMin` o `directores` será rechazado                  | `firestore.rules`, `datosValidos()`                                                                | Alta para la épica  | Fuera de alcance del Hito 1: se corrige en el Hito 3 (paso 14) con `get(campo, defecto)` según 1.6                     |
| A-03 | Agregar una obra sin conexión falla: `agregarElemento` hace `getDocFromServer` antes de escribir y se agota el tiempo                                                                   | `listaService.ts`, `agregarElemento()`                                                             | Media               | Riesgo conocido: RF8 solo exige mostrar la copia sin conexión; el error se muestra traducido                           |
| A-04 | Las escrituras pendientes sin conexión viven en la cola en memoria de Firestore; si se cierra la app antes de reconectar se pierden, pero la copia de AsyncStorage ya muestra el cambio | `CarteleraContext.tsx`, `actualizar()` / `eliminar()`; `firebaseConfig.ts` (sin caché persistente) | Media               | Riesgo conocido: se avisa al usuario con `AVISO_PENDIENTE`; al reconectar `recargar()` vuelve a la verdad del servidor |
| A-05 | Colores escritos fuera del tema: `rgba(255,107,107,0.12)` en el login y los hex del logo de TMDB                                                                                        | `LoginScreen.tsx:165`, `LogoTmdb.tsx:4`                                                            | Baja                | Fuera de alcance: se mueven a `src/tema/` en el Hito 4 (el test de colores fijos lo detectará en el Hito 2)            |
| A-06 | Tamaños y espacios sueltos (43 valores numéricos de `fontSize`, `height`, `padding`, `margin`) en pantallas y componentes                                                               | `src/screens/*`, `src/components/*`                                                                | Baja                | Fuera de alcance: pasan a tokens en el Hito 4                                                                          |
| A-07 | El tema vive en `src/utils/tema.ts`; la épica pide `src/tema/` como única fuente de verdad                                                                                              | `src/utils/tema.ts`                                                                                | Baja                | Fuera de alcance: se migra en el Hito 3 (paso 15)                                                                      |
| A-08 | `ElementoLista` no tiene los campos de la épica (`vistaEn`, `generos`, `duracionMin`, `directores`) y el detalle de TMDB no los guarda al agregar                                       | `types/lista.ts`, `DetalleScreen.tsx` (`agregarALista`)                                            | Media para la épica | Fuera de alcance: Hito 3 (pasos 11 y 14)                                                                               |
| A-09 | `.vscode/settings.json` trae una opción de Python que no aplica al proyecto                                                                                                             | `.vscode/settings.json`                                                                            | Baja                | Riesgo conocido (no afecta)                                                                                            |
| A-10 | El botón Guardar se habilita si el comentario solo difiere en espacios al final, aunque al guardar se recorta y no cambia nada                                                          | `EditarScreen.tsx`, `huboCambios`                                                                  | Baja                | Riesgo conocido                                                                                                        |

### 1.3 Requisitos que se cumplen (sin hallazgos)

| RF       | Evidencia                                                                                                              |
| :------- | :--------------------------------------------------------------------------------------------------------------------- |
| RF1      | `firebaseConfig.ts` (`getReactNativePersistence`), `RootNavigator.tsx`, `utils/erroresFirebase.ts`                     |
| RF2, RF3 | `tmdbService.ts` (`buscar`, `obtenerDetalle` con `append_to_response=credits`), `Estado.tsx`                           |
| RF4      | `crearItemId` + `DuplicadoError` + regla `itemId == tipo + '_' + tmdbId`                                               |
| RF5      | Filtros en `MiListaScreen.tsx`                                                                                         |
| RF6      | `normalizarCambios` + estrellas deshabilitadas + regla `calificacionPersonal` en `firestore.rules`                     |
| RF7      | `Alert` de confirmación en `EditarScreen.tsx`                                                                          |
| RF8      | `cacheService.ts` + `copiaSinConexion` en el contexto                                                                  |
| RF9      | `AcercaDeScreen.tsx` + `LogoTmdb.tsx`                                                                                  |
| RF10     | Sin `any` (búsqueda en `src/`), pantallas sin imports de Firebase, `.env` nunca subido (`git log --all -- .env` vacío) |

## 2. Auditoría final (Hito 4, cierre 2026-11-25)

Estado de la rama `epica-mi-anio` al cerrar: `npm test` 62 tests en verde (dominio, regla RF6, colores fijos,
formatos), `npx tsc --noEmit` sin errores, `npm run test:reglas` 13 casos en verde contra el emulador.

### 2.1 Hallazgos iniciales

| Id   | Estado                | Cómo se resolvió / por qué sigue                                                                                                                                              |
| :--- | :-------------------- | :---------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| A-01 | ✅ Resuelto           | Vitest + `npm test`; tests del dominio, de RF6/RF4, de formatos y sensor de colores fijos                                                                                     |
| A-02 | ✅ Resuelto en código | `firestore.rules` con los campos opcionales de 1.6; sensor `test:reglas` (con las reglas viejas fallan 5 casos). Publicadas el 2026-11-25 (A-13)                              |
| A-03 | ⚠️ Riesgo conocido    | Sin cambios: agregar sigue necesitando conexión                                                                                                                               |
| A-04 | ⚠️ Riesgo conocido    | Sin cambios. Ahora también aplica a `vistaEn`: si se marca vista sin conexión y se cierra la app antes de reconectar, la fecha se pierde y D2 la repondrá con `actualizadoEn` |
| A-05 | ✅ Resuelto           | Colores del logo en `coloresTmdb` y fondo del error del login en `colores.peligroSuave` (T-07)                                                                                |
| A-06 | ✅ Resuelto           | Pantallas del Proyecto 3 con `tipo`, `espacio`, `radio`, `icono` y `peso` (T-09)                                                                                              |
| A-07 | ✅ Resuelto           | `src/utils/tema.ts` eliminado; todo importa de `src/tema/`                                                                                                                    |
| A-08 | ✅ Resuelto           | Modelo con `vistaEn`, `generos`, `duracionMin`, `directores`; guardado al agregar (T-03, T-04)                                                                                |
| A-09 | ⚠️ Riesgo conocido    | Sin cambios (no afecta)                                                                                                                                                       |
| A-10 | ⚠️ Riesgo conocido    | Sin cambios                                                                                                                                                                   |

### 2.2 Hallazgos nuevos

| Id   | Hallazgo                                                                                                                                                                                                                | Evidencia                                                                                         | Gravedad | Decisión                                                                                                                                |
| :--- | :---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :------------------------------------------------------------------------------------------------ | :------- | :-------------------------------------------------------------------------------------------------------------------------------------- |
| A-11 | `npm run lint` reporta 3 errores `react-hooks/set-state-in-effect`; ya estaban en `p3-final`                                                                                                                            | `CarteleraContext.tsx` (efecto de sesión), `BuscarScreen.tsx`, `DetalleScreen.tsx`                | Baja     | Riesgo conocido: no rompen nada; corregirlos cambia la carga de datos y queda fuera de la épica                                         |
| A-12 | Vitest 5 exige Node 22.12+ y el README pedía Node 20                                                                                                                                                                    | `package.json` (`engines`), README                                                                | Media    | ✅ Resuelto: README y `engines` actualizados (detectado por la revisión de Codex)                                                       |
| A-13 | Las reglas nuevas no están publicadas en Firebase todavía (falta `firebase login` en la PC)                                                                                                                             | `npm run reglas:publicar` pendiente                                                               | **Alta** | ✅ Resuelto el 2026-11-25: `npm run test:reglas` en verde (13) y `npm run reglas:publicar` → «released rules»                           |
| A-14 | El sensor de reglas necesita Java 21 y el emulador, por eso no corre en `npm test`                                                                                                                                      | `package.json` (`test:reglas`)                                                                    | Baja     | Riesgo conocido: se corre a mano antes de tocar las reglas (anotado en la spec y en `AGENTS.md`)                                        |
| A-15 | La migración D2 y el completado D6 reescriben `actualizadoEn`, porque las reglas exigen `actualizadoEn == request.time` en toda escritura                                                                               | `listaService.migrarVistaEn`, `guardarDatosTmdb`                                                  | Baja     | Riesgo conocido: `vistaEn` toma el valor anterior antes de escribir, así que D2 no se ve afectado                                       |
| A-16 | T-09 unificó algunos tamaños cercanos (15 → 16, 13 → 14, gap 3 → 2): cambios visuales mínimos                                                                                                                           | `src/screens/*`                                                                                   | Baja     | Aceptado por `DESIGN.md` §2.2; se comprueba en V-17                                                                                     |
| A-17 | Los tests de horas y meses dependen de la zona horaria del equipo solo a través de fechas locales construidas en el propio test                                                                                         | `fabrica.test-utils.ts` (`ms()`)                                                                  | Baja     | Riesgo conocido: se construyen y se leen en la misma zona, así que pasan en cualquier zona                                              |
| A-18 | `docs/VERIFICACION.md` todavía no tiene resultados obtenidos                                                                                                                                                            | `docs/VERIFICACION.md`                                                                            | Media    | Pendiente de la autora: probar en el teléfono y llenar la columna                                                                       |
| A-19 | La autora cambió el sistema de diseño por su referencia monocroma (`docs/diseno/referencia-estilo.md`). La referencia usa fuentes de pago, peso 350 y `#808080` para texto (3,95:1)                                     | `DESIGN.md` §8 (DP-1 a DP-3)                                                                      | Media    | Resuelto adaptando: fuente del sistema, peso 300 y `pizarra` para texto; la cadena brief → board → DESIGN.md → `src/tema` se rehízo     |
| A-20 | No había sensor que comprobara que `DESIGN.md` y `src/tema` coinciden (se comparaba a mano)                                                                                                                             | `src/tema/tokensDesign.test.ts`                                                                   | Media    | ✅ Resuelto: nuevo sensor (6 tests) que lee `DESIGN.md` y compara paleta, roles, tipografía, tracking, pesos, espacios, radios e íconos |
| A-21 | En Mi lista la fila de chips de estado (Todos, Por ver, Viendo, Vista) sale recortada por abajo y los chips quedan en ~41 dp: el `ScrollView` horizontal trae `flexShrink: 1` por defecto y la lista (flex 1) lo encoge | V-18 en el emulador (uiautomator: 107 px de alto a 420 dpi), `MiListaScreen.tsx` `filaFiltros`    | Media    | Se corrige con `flexShrink: 0` en `filaFiltros` (commit `fix:`) y se vuelve a medir                                                     |
| A-22 | La pantalla Editar no permite quitar la calificación de una obra vista (solo cambiarla); ya era así en `p3-final`                                                                                                       | V-08: para probar la invitación a calificar se puso `calificacionPersonal: null` desde la consola | Baja     | Riesgo conocido: fuera del alcance de la épica; D11 queda cubierta por los tests de `resumenAnual` y por V-08                           |

### 2.3 Riesgos que quedan

A-03, A-04, A-11, A-14 y A-15 como riesgos conocidos; A-18 depende de que la autora pruebe en el teléfono antes
de la demo.
