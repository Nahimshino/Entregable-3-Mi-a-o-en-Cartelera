# Verificación humana — Mi año en cine

Prueba en el teléfono con Expo Go (`npm run dev`). La columna **Resultado obtenido** se llena a mano después de
probar: ✅ si coincide con lo esperado, ❌ y qué pasó si no. Lo que falle se corrige o se anota en
`docs/AUDITORIA.md`.

**Preparación:** cuenta A con al menos 3 películas y 2 series en la lista, alguna marcada como vista antes de
esta épica (para D2). Cuenta B vacía. Reglas publicadas (`npm run reglas:publicar`).

**Verificación automática previa** (ya en verde en la rama): `npm test` (dominio, reglas del P3, colores fijos,
formatos), `npx tsc --noEmit` y `npm run test:reglas` (13 casos de `firestore.rules` en el emulador).

| V    | Criterio                 | Pasos                                                                                                | Resultado esperado                                                                                                             | Resultado obtenido |
| :--- | :----------------------- | :--------------------------------------------------------------------------------------------------- | :----------------------------------------------------------------------------------------------------------------------------- | :----------------- |
| V-01 | CA-01 (D1)               | Editar una obra en por ver → Vista → Guardar. Abrir el documento en la consola de Firebase           | El documento tiene `vistaEn` con la hora actual                                                                                |                    |
| V-02 | CA-02 a CA-04 (D1)       | Cambiar solo el comentario de una obra vista; luego pasarla a Viendo; luego otra vez a Vista         | Comentario: `vistaEn` igual. Viendo: `vistaEn = null`. Vista: fecha nueva                                                      |                    |
| V-03 | CA-05, CA-06 (D5)        | Agregar una película y una serie nuevas desde Buscar. Ver los documentos en la consola               | Película: `generos` en español, `duracionMin`, `directores`. Serie: `duracionMin: null`, `directores: []`                      |                    |
| V-04 | CA-07 (1.6)              | En el simulador de reglas: escritura con `duracionMin: -5`; lectura de la lista de A con la cuenta B | Ambas denegadas                                                                                                                |                    |
| V-05 | CA-10 (1.3)              | Abrir la pestaña Mi año                                                                              | Total de obras del año con cuántas son películas y series; horas en formato «37,5 h»                                           |                    |
| V-06 | CA-17 (D9)               | Con un año en el que solo hay series vistas, abrir Mi año                                            | Tarjeta de director: «Sin datos» y «No hay datos suficientes…»                                                                 |                    |
| V-07 | CA-19 (D10)              | Ver las barras por mes                                                                               | 12 barras; las de 0 como una línea fina; el mes más activo en ámbar y nombrado en el título                                    |                    |
| V-08 | CA-20, CA-21 (D11)       | Ver la obra destacada; luego quitar la calificación a todas las del año                              | Primero la mejor calificada; luego la invitación a calificar                                                                   |                    |
| V-09 | CA-24 (D4)               | Abrir Mi año                                                                                         | Seleccionado el año actual; el selector solo muestra años con obras vistas más el actual                                       |                    |
| V-10 | CA-26, CA-27, CA-30 (D2) | Con obras vistas antes de la épica, abrir Mi año. Revisar la consola. Cerrar y abrir otra vez        | Reciben `vistaEn` (= su `actualizadoEn` anterior) sin perder estado, calificación ni comentario; la segunda vez no cambia nada |                    |
| V-11 | CA-28, CA-29 (D6)        | Con obras vistas sin géneros, abrir Mi año                                                           | Aviso «Completando datos de TMDB: 1 de N…» con barra; al terminar aparecen género y director                                   |                    |
| V-12 | CA-31                    | Cerrar la app, abrirla y entrar enseguida a Mi año                                                   | «Cargando tu año…» mientras carga                                                                                              |                    |
| V-13 | CA-33                    | Con la cuenta B recién creada y sin internet (sin caché) abrir Mi año                                | Mensaje de error con Reintentar                                                                                                |                    |
| V-14 | CA-32 (D12)              | Elegir en el selector un año sin obras (o usar la cuenta B)                                          | «No viste nada en {año}.» con el botón Ir a Mi lista, que abre la pestaña Mi lista                                             |                    |
| V-15 | CA-34, CA-35 (D13)       | Modo avión, cerrar y abrir la app, ir a Mi año                                                       | Aviso de sin conexión; el resumen se calcula con la copia; no aparece «Completando…»                                           |                    |
| V-16 | CA-36 (D6, D7)           | Con una película sin duración en TMDB o una obra sin datos                                           | Nota «1 película sin duración no suma horas.» o aviso «1 obra quedó sin datos de TMDB…»                                        |                    |
| V-17 | Proyecto 3               | Recorrer Buscar, Detalle, Mi lista, Editar y Acerca de                                               | Todo funciona como antes; colores y tamaños iguales o casi iguales; logo y aviso de TMDB visibles en Acerca de                 |                    |
| V-18 | 44 px                    | Tocar chips de año, barras y botones                                                                 | Todos se tocan con facilidad (≥ 44)                                                                                            |                    |

## Resumen

| Total | ✅  | ❌  | Anotados en la auditoría |
| :---- | :-- | :-- | :----------------------- |
| 18    |     |     |                          |

Fecha de la prueba: ______ · Teléfono / sistema: ______ · Expo Go versión: ______
