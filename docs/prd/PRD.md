# PRD — Mi Cartelera Personal · Épica «Mi año en cine»

| Campo              | Valor                                          |
| :----------------- | :--------------------------------------------- |
| Producto           | Mi Cartelera Personal (Expo + Firebase + TMDB) |
| Versión de partida | etiqueta `p3-final`                            |
| Épica              | E-A · Mi año en cine                           |
| Cliente            | Docente de la materia (decisiones D1 a D13)    |
| Fecha              | 2026-11-25                                     |

## 1. Problema

La app guarda qué obras vio el usuario, pero no cuándo ni con qué datos (género, duración, director). Por eso
no puede responder la pregunta que más interesa al usuario al final del año: «¿qué vi este año?».

## 2. Objetivo

Una pestaña nueva, **Mi año**, que resume lo visto en un año calendario: total de obras (películas y series),
horas de cine, género y director más vistos, mes más activo con una barra por mes, obra destacada y un
selector de año. Todo sin romper lo que ya funciona (RF1 a RF10 del Proyecto 3).

## 3. Usuarios

Personas que ya usan Mi Cartelera para llevar su lista. Tienen obras vistas antes de esta épica: el resumen
debe funcionar también para ellas (HU-A.4).

## 4. Alcance

**Dentro:** fecha de visionado (`vistaEn`), datos de TMDB al agregar (`generos`, `duracionMin`,
`directores`), migración de obras existentes, pantalla Mi año con sus estados, reglas de Firestore,
sistema de diseño (`DESIGN.md`, `src/tema/`) y migración de las pantallas actuales a los tokens.

**Fuera:** revisionados (ver dos veces la misma obra), compartir el resumen, estadísticas de series por
episodios u horas, gráficas con librerías externas, notificaciones.

## 5. Historias

| Id     | Historia                                                                          |
| :----- | :-------------------------------------------------------------------------------- |
| HU-A.1 | Como usuario, quiero que la app recuerde cuándo vi cada obra                      |
| HU-A.2 | Como usuario, quiero ver mi resumen del año                                       |
| HU-A.3 | Como usuario, quiero cambiar de año                                               |
| HU-A.4 | Como usuario, quiero ver mi resumen aunque mis obras sean anteriores a esta épica |
| HU-A.5 | Como usuario, quiero entender un resumen vacío o incompleto                       |

Criterios y tickets: [`docs/backlog/epica-mi-anio.md`](../backlog/epica-mi-anio.md).

## 6. Reglas de negocio (decisiones del cliente)

| #       | Tema                           | Regla                                                                                                                                                                                                                                                                    |
| :------ | :----------------------------- | :----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **D1**  | Fecha de visionado             | Campo `vistaEn`. Se guarda con `serverTimestamp` cuando la obra pasa a vista. Si deja de estar vista vuelve a `null`; si vuelve a vista toma la fecha nueva. Editar calificación o comentario no la cambia                                                               |
| **D2**  | Obras vistas antes de la épica | Al abrir Mi año, las obras en vista sin `vistaEn` reciben `vistaEn = actualizadoEn`. Una sola vez; se guarda en Firestore                                                                                                                                                |
| **D3**  | Año de una obra                | El año calendario de `vistaEn` en la hora local del teléfono. Cada obra cuenta una sola vez (sin revisionados)                                                                                                                                                           |
| **D4**  | Años del selector              | Años con al menos una obra vista más el año actual, del más reciente al más antiguo. Se abre en el año actual                                                                                                                                                            |
| **D5**  | Datos de TMDB                  | Al agregar se guardan `generos` (nombres en español), `duracionMin` (solo películas; `null` en series) y `directores` (solo películas; lista vacía en series)                                                                                                            |
| **D6**  | Obras sin esos datos           | Al abrir el resumen se completan desde TMDB las obras vistas del año elegido que no los tengan, de una en una y con progreso visible. Si TMDB falla para una obra, cuenta en el total pero no en horas, género ni director, y el resumen dice cuántas quedaron sin datos |
| **D7**  | Horas de cine                  | Suma de `duracionMin` de las películas vistas, en horas con un decimal (37,5 h). Las series cuentan como obras, no en horas. Una película sin duración no suma y el resumen lo indica                                                                                    |
| **D8**  | Género más visto               | Cada obra suma 1 a cada uno de sus géneros. Gana el de más obras. Empate: mayor promedio de calificación personal entre sus obras calificadas (sin calificadas pierde). Si persiste: orden alfabético                                                                    |
| **D9**  | Director más visto             | Solo películas; cada director suma 1. Mismo desempate que D8. Si ninguna película tiene director, la tarjeta dice que no hay datos suficientes                                                                                                                           |
| **D10** | Mes más activo                 | El mes con más obras vistas. Empate: el más reciente. Se muestran los 12 meses, también los de 0                                                                                                                                                                         |
| **D11** | Obra destacada                 | La de mayor calificación personal. Empate: la de `vistaEn` más reciente. Sin obras calificadas, la tarjeta invita a calificar                                                                                                                                            |
| **D12** | Resumen vacío                  | Un año sin obras vistas muestra un estado vacío con el botón Ir a Mi lista                                                                                                                                                                                               |
| **D13** | Sin conexión                   | El resumen se calcula con la copia de AsyncStorage y muestra un aviso. Sin conexión no se completan datos ni se migran fechas                                                                                                                                            |

Ninguna regla vive en una pantalla: todas se calculan en `src/dominio/` con funciones puras probadas con Vitest.

## 7. Modelo de datos

Ruta sin cambios: `usuarios/{uid}/mi_lista/{itemId}`. Campos nuevos (opcionales para no romper documentos
viejos; las reglas los leen con `get(campo, defecto)`):

| Campo         | Tipo                    | Regla                                |
| :------------ | :---------------------- | :----------------------------------- |
| `vistaEn`     | timestamp o `null`      | Solo si `estado == 'vista'` (D1, D2) |
| `generos`     | lista de texto, máx. 10 | D5                                   |
| `duracionMin` | entero 1–1000 o `null`  | D5, D7                               |
| `directores`  | lista de texto, máx. 10 | D5, D9                               |

## 8. Requisitos no funcionales

- Las reglas de Firestore siguen aislando a cada usuario y validan los campos nuevos.
- Pantallas sin Firebase, sin `any`, sin colores fijos fuera de `src/tema/`, tocables ≥ 44.
- La atribución de TMDB sigue visible y menos prominente que la marca.
- Sin librerías de gráficas: las barras por mes se hacen con `View`.
- `npm test` y `npx tsc --noEmit` en verde antes de cada commit de código.

## 9. Métricas de éxito

- Con una cuenta con obras anteriores a la épica, el resumen muestra datos sin intervención manual.
- Todos los criterios de `docs/VERIFICACION.md` tienen resultado obtenido en el teléfono.

## 10. Puntos abiertos

Casos que las decisiones no cubren. Se resolvieron provisionalmente así y quedan para consultar al cliente:

| #    | Caso                                                                                                                | Decisión provisional                                                                                                          |
| :--- | :------------------------------------------------------------------------------------------------------------------ | :---------------------------------------------------------------------------------------------------------------------------- |
| PA-1 | D2: obra vista sin `vistaEn` y sin `actualizadoEn` (documento muy viejo o copia de caché sin fecha)                 | Se usa `agregadoEn`; si tampoco existe, no se migra y no entra en ningún año                                                  |
| PA-2 | D8 con calificaciones: «promedio entre sus obras calificadas» cuando un género empatado no tiene ninguna calificada | Pierde frente a cualquiera con calificadas; entre dos sin calificadas decide el orden alfabético (`localeCompare` en español) |
| PA-3 | D6: ¿se reintenta una obra que falló en TMDB?                                                                       | Se reintenta en la próxima apertura del resumen; no se marca como fallida para siempre                                        |
| PA-4 | D6 se aplica a «las obras vistas del año elegido»; las obras en por ver o viendo agregadas antes de la épica        | No se completan hasta que pasen a vista y caigan en un año abierto                                                            |
| PA-5 | D7: la serie en estado vista con `duracionMin` presente por error                                                   | Se ignora la duración: las series nunca suman horas                                                                           |
| PA-6 | D11 empate en calificación y misma `vistaEn` exacta                                                                 | Se desempata por título (orden alfabético) para que el resultado sea estable                                                  |
| PA-7 | Al cambiar de año sin conexión (D13)                                                                                | Se permite; se calcula con la caché y sin completar datos                                                                     |
| PA-8 | Obra con fecha de visionado futura (reloj del teléfono adelantado)                                                  | Se cuenta en su año; el selector incluye ese año                                                                              |
