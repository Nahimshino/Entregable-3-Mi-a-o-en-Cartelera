# Backlog — Épica E-A · Mi año en cine

Fuente: [`docs/prd/PRD.md`](../prd/PRD.md). Cada criterio indica la decisión que cubre y cómo se comprueba:
**[test]** con Vitest o **[teléfono]** con una acción concreta en Expo Go.

## Épica

**E-A · Mi año en cine.** Como usuario de Mi Cartelera quiero ver un resumen de lo que vi en un año para
recordar y comparar mis hábitos de cine. Termina cuando HU-A.1 a HU-A.5 cumplen sus criterios y
`docs/VERIFICACION.md` está lleno.

---

## HU-A.1 · Recordar cuándo vi cada obra

> Como usuario, quiero que la app recuerde cuándo vi cada obra.

| Id    | Dec. | DADO                             | CUANDO                                                    | ENTONCES                                                               | Verif.                                                   |
| :---- | :--- | :------------------------------- | :-------------------------------------------------------- | :--------------------------------------------------------------------- | :------------------------------------------------------- |
| CA-01 | D1   | una obra en por ver o viendo     | la marco como vista y guardo                              | el documento tiene `vistaEn` con la hora del servidor                  | [test] `cambiosVistaEn` + [teléfono] consola de Firebase |
| CA-02 | D1   | una obra vista con `vistaEn`     | la paso a por ver o viendo                                | `vistaEn` vuelve a `null`                                              | [test]                                                   |
| CA-03 | D1   | una obra que dejó de estar vista | la vuelvo a marcar como vista                             | `vistaEn` toma la fecha nueva                                          | [test]                                                   |
| CA-04 | D1   | una obra vista con `vistaEn`     | cambio solo su calificación o comentario                  | `vistaEn` no cambia                                                    | [test]                                                   |
| CA-05 | D5   | busco una película en TMDB       | la agrego a Mi lista                                      | el documento guarda `generos` en español, `duracionMin` y `directores` | [test] `datosTmdbDePelicula` + [teléfono] consola        |
| CA-06 | D5   | busco una serie                  | la agrego                                                 | `generos` con nombres, `duracionMin = null`, `directores = []`         | [test] `datosTmdbDeSerie`                                |
| CA-07 | 1.6  | las reglas publicadas            | escribo `duracionMin: -5` o `vistaEn` en una obra por ver | Firestore rechaza la escritura                                         | [teléfono] simulador de reglas                           |

## HU-A.2 · Ver mi resumen del año

> Como usuario, quiero ver mi resumen del año.

| Id    | Dec. | DADO                                                             | CUANDO               | ENTONCES                                                              | Verif.                                        |
| :---- | :--- | :--------------------------------------------------------------- | :------------------- | :-------------------------------------------------------------------- | :-------------------------------------------- |
| CA-08 | D3   | una obra con `vistaEn` el 31 de diciembre a las 23:30 hora local | calculo el resumen   | cuenta en ese año, no en el siguiente                                 | [test]                                        |
| CA-09 | D3   | una obra vista                                                   | calculo el resumen   | cuenta una sola vez; las obras por ver y viendo no cuentan            | [test]                                        |
| CA-10 | 1.3  | 3 películas y 2 series vistas en el año                          | abro Mi año          | veo 5 obras: 3 películas, 2 series                                    | [test] + [teléfono]                           |
| CA-11 | D7   | películas de 120, 95 y 0/sin duración minutos                    | calculo las horas    | 3,6 h con un decimal y aviso «1 película sin duración»                | [test]                                        |
| CA-12 | D7   | una serie vista                                                  | calculo las horas    | no suma horas pero sí cuenta como obra                                | [test]                                        |
| CA-13 | D8   | Drama en 3 obras y Comedia en 2                                  | calculo el género    | gana Drama con 3 obras                                                | [test]                                        |
| CA-14 | D8   | Drama y Comedia empatados en obras                               | calculo el género    | gana el de mayor promedio de calificación; uno sin calificadas pierde | [test]                                        |
| CA-15 | D8   | empate en obras y en promedio                                    | calculo el género    | gana el primero en orden alfabético                                   | [test]                                        |
| CA-16 | D9   | películas con directores y series                                | calculo el director  | solo cuentan películas, mismo desempate que D8                        | [test]                                        |
| CA-17 | D9   | ninguna película con director                                    | abro Mi año          | la tarjeta dice «No hay datos suficientes»                            | [test] `directorTop = null` + [teléfono]      |
| CA-18 | D10  | 2 obras en marzo y 2 en julio                                    | calculo el mes       | gana julio (empate: el más reciente)                                  | [test]                                        |
| CA-19 | D10  | un año con obras solo en mayo                                    | abro Mi año          | veo 12 barras; las de 0 se dibujan vacías                             | [test] `obrasPorMes.length = 12` + [teléfono] |
| CA-20 | D11  | obras con 5, 4 y sin calificación                                | calculo la destacada | es la de 5; si hay dos de 5 gana la de `vistaEn` más reciente         | [test]                                        |
| CA-21 | D11  | ninguna obra calificada                                          | abro Mi año          | la tarjeta invita a calificar                                         | [test] `destacada = null` + [teléfono]        |

## HU-A.3 · Cambiar de año

> Como usuario, quiero cambiar de año.

| Id    | Dec. | DADO                                         | CUANDO           | ENTONCES                        | Verif.     |
| :---- | :--- | :------------------------------------------- | :--------------- | :------------------------------ | :--------- |
| CA-22 | D4   | obras vistas en 2024 y 2026, año actual 2026 | abro el selector | veo 2026 y 2024, en ese orden   | [test]     |
| CA-23 | D4   | ninguna obra vista, año actual 2026          | abro el selector | veo solo 2026                   | [test]     |
| CA-24 | D4   | abro Mi año                                  | —                | está seleccionado el año actual | [teléfono] |
| CA-25 | D4   | obras vistas solo en 2023, año actual 2026   | abro el selector | veo 2026 y 2023                 | [test]     |

## HU-A.4 · Resumen con obras anteriores a la épica

> Como usuario, quiero ver mi resumen aunque mis obras sean anteriores a esta épica.

| Id    | Dec.   | DADO                               | CUANDO                   | ENTONCES                                                                                    | Verif.                                            |
| :---- | :----- | :--------------------------------- | :----------------------- | :------------------------------------------------------------------------------------------ | :------------------------------------------------ |
| CA-26 | D2     | obras vistas sin `vistaEn`         | abro Mi año con conexión | reciben `vistaEn = actualizadoEn` y se guarda en Firestore                                  | [test] `obrasPorMigrarFecha` + [teléfono] consola |
| CA-27 | D2     | ya se migró                        | abro Mi año otra vez     | no se vuelve a escribir (no quedan obras por migrar)                                        | [test]                                            |
| CA-28 | D6     | obras vistas del año sin `generos` | abro Mi año con conexión | se completan desde TMDB de una en una con «Completando 2 de 5…»                             | [test] `obrasPorCompletar` + [teléfono]           |
| CA-29 | D6     | TMDB falla para una obra           | termina el completado    | cuenta en el total pero no en horas, género ni director; el resumen dice «1 obra sin datos» | [test]                                            |
| CA-30 | D2, D6 | la migración                       | —                        | no borra ni cambia estado, calificación ni comentario                                       | [test] + [teléfono]                               |

## HU-A.5 · Entender un resumen vacío o incompleto

> Como usuario, quiero entender un resumen vacío o incompleto.

| Id    | Dec.   | DADO                                     | CUANDO      | ENTONCES                                                                  | Verif.                                                |
| :---- | :----- | :--------------------------------------- | :---------- | :------------------------------------------------------------------------ | :---------------------------------------------------- |
| CA-31 | —      | la lista todavía carga                   | abro Mi año | veo «Cargando tu año…»                                                    | [teléfono]                                            |
| CA-32 | D12    | un año sin obras vistas                  | lo elijo    | veo el estado vacío con el botón Ir a Mi lista, que me lleva a la pestaña | [test] `totalObras = 0` + [teléfono]                  |
| CA-33 | —      | falla la carga y no hay caché            | abro Mi año | veo un mensaje de error con Reintentar                                    | [teléfono]                                            |
| CA-34 | D13    | sin conexión y con caché                 | abro Mi año | el resumen se calcula con la copia y aparece el aviso sin conexión        | [teléfono] modo avión                                 |
| CA-35 | D13    | sin conexión                             | abro Mi año | no se migran fechas ni se completan datos                                 | [test] `planSincronizacion(sinConexion)` + [teléfono] |
| CA-36 | D6, D7 | obras sin datos o películas sin duración | abro Mi año | un aviso dice cuántas quedaron sin datos o sin duración                   | [test] + [teléfono]                                   |

---

## Tickets

Cada ticket se cierra cuando cumple su **Definition of Done (DoD)**. DoD común a todos: spec actualizada
antes del código, `npm test` y `npx tsc --noEmit` en verde, commit con `/commit`, push.

| Ticket   | Historia         | Descripción                                                                | Criterios                                        | DoD específico                                                             |
| :------- | :--------------- | :------------------------------------------------------------------------- | :----------------------------------------------- | :------------------------------------------------------------------------- |
| **T-01** | HU-A.2, A.3      | Tests de `resumenAnual` y `aniosDisponibles` (en rojo)                     | CA-08 a CA-25                                    | Commit `test:` antes de cualquier `feat:` del dominio                      |
| **T-02** | HU-A.2, A.3      | Implementar `src/dominio/resumenAnual.ts`                                  | CA-08 a CA-25                                    | Todos los tests de T-01 en verde; sin Firebase ni `new Date()` del sistema |
| **T-03** | HU-A.1           | `vistaEn` al cambiar de estado (dominio `cambiosVistaEn` + `listaService`) | CA-01 a CA-04                                    | Test de D1; documento con `vistaEn` visible en la consola                  |
| **T-04** | HU-A.1           | Guardar `generos`, `duracionMin`, `directores` al agregar                  | CA-05, CA-06                                     | Test de la normalización; documento nuevo con los campos en la consola     |
| **T-05** | HU-A.1           | Reglas de Firestore con los campos nuevos, publicadas                      | CA-07                                            | `duracionMin: -5` rechazado; dos cuentas siguen aisladas                   |
| **T-06** | HU-A.4           | Migraciones D2 y D6 (`planSincronizacion`, servicio)                       | CA-26 a CA-30, CA-35                             | Tests de selección; progreso visible                                       |
| **T-07** | —                | Tokens `src/tema/` y test de colores fijos en verde                        | —                                                | Valores iguales al brand board; test de colores pasa                       |
| **T-08** | HU-A.2, A.3, A.5 | Pantalla Mi año y componentes del board                                    | CA-10, CA-17, CA-19, CA-21, CA-24, CA-31 a CA-36 | Estados de carga, vacío, error y sin conexión visibles                     |
| **T-09** | —                | Pantallas del Proyecto 3 con tokens                                        | —                                                | Test de colores fijos en verde; sin cambios de comportamiento              |
| **T-10** | Todas            | Verificación humana y documentación                                        | Todos                                            | `docs/VERIFICACION.md` lleno a mano; README y `docs/IA.md`                 |
