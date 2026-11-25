# PRD — Mi Cartelera Personal · Épica «Mi año en cine»

| Campo              | Valor                                                                                                                        |
| :----------------- | :--------------------------------------------------------------------------------------------------------------------------- |
| Producto           | Mi Cartelera Personal (Expo + Firebase + TMDB)                                                                               |
| Versión de partida | etiqueta `p3-final`                                                                                                          |
| Épica              | E-A · Mi año en cine                                                                                                         |
| Cliente            | Docente de la materia                                                                                                        |
| Fecha              | 2026-11-25 (revisado el mismo día con la regla «cada decisión apunta a una respuesta del cliente o a un supuesto declarado») |

## 0. Cómo leer este PRD (rastreabilidad)

Cada afirmación lleva su origen entre corchetes:

| Marca                                  | Origen                                                                                                                                                                                             |
| :------------------------------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **[C-1.3]**, **[C-1.5]**, **[C-1.6]**… | Respuesta del cliente: sección del enunciado del Entregable 3 donde el docente la dio (1.3 la épica, 1.4 las historias, 1.5 las decisiones D1–D13, 1.6 el modelo de datos, 1.10 las restricciones) |
| **[P3]**                               | Requisito vigente del Proyecto 3 (`entregable_2_mi_cartelera_personal.md`, RF1–RF10)                                                                                                               |
| **[S-n]**                              | Supuesto del equipo: el cliente no lo dijo. Está en la sección 9 y se puede cambiar                                                                                                                |
| **[PA-n]**                             | Punto abierto: caso que las decisiones no cubren. Tiene un supuesto provisional y queda para consultar (sección 10)                                                                                |

## 1. Problema

La app guarda qué obras vio el usuario, pero no cuándo ni con qué datos de TMDB (género, duración, director),
así que no puede mostrar un resumen de un año. **[C-1.3]**

## 2. Objetivo

Una pantalla nueva, accesible desde una pestaña, con el resumen de un año: obras vistas (cuántas películas y
cuántas series), horas de cine, género y director más vistos, mes más activo con una barra por mes, obra
destacada y selector de año. **[C-1.3]** Sin romper lo que ya funciona (RF1 a RF10). **[P3]**

## 3. Usuarios

Quienes ya usan Mi Cartelera para llevar su lista. **[P3]** Tienen obras vistas antes de la épica y el
resumen debe funcionar también para ellas. **[C-1.4, HU-A.4]**

## 4. Alcance

**Dentro:**

| Qué                                                                                      | Origen                  |
| :--------------------------------------------------------------------------------------- | :---------------------- |
| Guardar la fecha de visionado `vistaEn`                                                  | [C-1.3], [C-1.5 D1]     |
| Guardar `generos`, `duracionMin` y `directores` al agregar                               | [C-1.3], [C-1.5 D5]     |
| Migrar fechas y completar datos de las obras anteriores                                  | [C-1.5 D2, D6]          |
| Pantalla Mi año con sus estados de carga, vacío, error, sin conexión y datos faltantes   | [C-1.3], [C-1.4 HU-A.5] |
| Reglas de Firestore con los campos nuevos                                                | [C-1.6]                 |
| Sistema de diseño (`DESIGN.md`, `src/tema/`) y pantallas del Proyecto 3 pasadas a tokens | [C-1.8], [C-1.10]       |

**Fuera:**

| Qué                                        | Origen                                                  |
| :----------------------------------------- | :------------------------------------------------------ |
| Revisionados (ver dos veces la misma obra) | [C-1.5 D3] «no hay revisionados»                        |
| Horas de series                            | [C-1.5 D7] «las series cuentan como obras, no en horas» |
| Librerías de gráficas                      | [C-1.10] «las barras por mes se construyen con `View`»  |
| Compartir el resumen, notificaciones       | [S-1]                                                   |

## 5. Historias

| Id     | Historia                                                                          | Origen  |
| :----- | :-------------------------------------------------------------------------------- | :------ |
| HU-A.1 | Como usuario, quiero que la app recuerde cuándo vi cada obra                      | [C-1.4] |
| HU-A.2 | Como usuario, quiero ver mi resumen del año                                       | [C-1.4] |
| HU-A.3 | Como usuario, quiero cambiar de año                                               | [C-1.4] |
| HU-A.4 | Como usuario, quiero ver mi resumen aunque mis obras sean anteriores a esta épica | [C-1.4] |
| HU-A.5 | Como usuario, quiero entender un resumen vacío o incompleto                       | [C-1.4] |

Criterios y tickets: [`docs/backlog/epica-mi-anio.md`](../backlog/epica-mi-anio.md).

## 6. Reglas de negocio (decisiones del cliente)

Copiadas de la tabla 1.5 del enunciado **[C-1.5]**, sin cambios de contenido. Lo que el código hace y estas
reglas no dicen está en las secciones 9 y 10.

| #       | Tema                           | Regla                                                                                                                                                                                                                                                                    | Supuestos y puntos abiertos relacionados |
| :------ | :----------------------------- | :----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :--------------------------------------- |
| **D1**  | Fecha de visionado             | Nuevo campo `vistaEn`. Se guarda con `serverTimestamp` cuando la obra pasa a vista. Si deja de estar vista, vuelve a `null`; si vuelve a vista, toma la fecha nueva. Editar calificación o comentario no la cambia                                                       | —                                        |
| **D2**  | Obras vistas antes de la épica | Al abrir Mi año en cine, las obras en vista sin `vistaEn` reciben `vistaEn = actualizadoEn`. Se hace una sola vez y se guarda en Firestore                                                                                                                               | PA-1, PA-9                               |
| **D3**  | Año de una obra                | Al año calendario de `vistaEn` en la hora local del teléfono. Cada obra cuenta una sola vez: no hay revisionados                                                                                                                                                         | PA-8                                     |
| **D4**  | Años del selector              | Los años con al menos una obra vista, más el año actual, del más reciente al más antiguo. Se abre en el año actual                                                                                                                                                       | PA-8                                     |
| **D5**  | Datos de TMDB                  | Al agregar una obra se guardan `generos` (nombres en español), `duracionMin` (solo películas; en series es `null`) y `directores` (solo películas; en series es una lista vacía)                                                                                         | S-4                                      |
| **D6**  | Obras sin esos datos           | Al abrir el resumen se completan desde TMDB las obras vistas del año elegido que no los tengan, de una en una y con progreso visible. Si TMDB falla para una obra, cuenta en el total pero no en horas, género ni director, y el resumen dice cuántas quedaron sin datos | S-2, S-3, PA-3, PA-4                     |
| **D7**  | Horas de cine                  | Suma de `duracionMin` de las películas vistas, en horas con un decimal (37,5 h). Las series cuentan como obras, no en horas. Una película sin duración no suma y el resumen lo indica                                                                                    | PA-5                                     |
| **D8**  | Género más visto               | Cada obra suma 1 a cada uno de sus géneros. Gana el que tenga más obras. Empate: mayor promedio de calificación personal entre sus obras calificadas (sin calificadas pierde). Si persiste: orden alfabético                                                             | PA-2                                     |
| **D9**  | Director más visto             | Solo películas; cada director suma 1. Mismo desempate que D8. Si ninguna película tiene director, la tarjeta dice que no hay datos suficientes                                                                                                                           | PA-2                                     |
| **D10** | Mes más activo                 | El mes con más obras vistas. Empate: el más reciente. Se muestran los 12 meses del año, también los que tienen 0                                                                                                                                                         | —                                        |
| **D11** | Obra destacada                 | La de mayor calificación personal. Empate: la de `vistaEn` más reciente. Si no hay obras calificadas, la tarjeta invita a calificar                                                                                                                                      | PA-6                                     |
| **D12** | Resumen vacío                  | Un año sin obras vistas muestra un estado vacío con el botón Ir a Mi lista                                                                                                                                                                                               | —                                        |
| **D13** | Sin conexión                   | El resumen se calcula con la copia de AsyncStorage y muestra un aviso. Sin conexión no se completan datos ni se migran fechas                                                                                                                                            | S-5, PA-7                                |

Ninguna regla vive en una pantalla: todas se calculan en `src/dominio/` con funciones puras probadas con
Vitest. **[C-1.5]** («Ninguna de estas reglas debe vivir en una pantalla»)

## 7. Modelo de datos

Ruta sin cambios: `usuarios/{uid}/mi_lista/{itemId}`. **[C-1.6]** Campos nuevos, opcionales para no romper los
documentos que no los tienen; las reglas los leen con `get(campo, defecto)`. **[C-1.6]**

| Campo         | Tipo               | Límites                     | Origen                                         |
| :------------ | :----------------- | :-------------------------- | :--------------------------------------------- |
| `vistaEn`     | timestamp o `null` | Solo si `estado == 'vista'` | [C-1.6], [C-1.5 D1, D2]                        |
| `generos`     | lista de texto     | Máximo 10                   | [C-1.6], [C-1.5 D5]                            |
| `duracionMin` | entero o `null`    | 1 a 1000                    | [C-1.6] (regla `d.duracionMin > 0 && <= 1000`) |
| `directores`  | lista de texto     | Máximo 10                   | [C-1.6], [C-1.5 D5]                            |

## 8. Requisitos no funcionales

| Requisito                                                                                                     | Origen                        |
| :------------------------------------------------------------------------------------------------------------ | :---------------------------- |
| Las reglas de Firestore siguen aislando a cada usuario y validan los campos nuevos; se prueba con dos cuentas | [P3], [C-1.6], Hito 3 paso 14 |
| Pantallas sin Firebase y sin `any`                                                                            | [P3], [C-1.7]                 |
| Colores y tamaños solo desde `src/tema/`; ninguna pantalla sin `DESIGN.md`                                    | [C-1.10]                      |
| Elementos tocables de 44 px o más; tres estados por petición                                                  | [P3], [C-1.10]                |
| Atribución de TMDB visible y menos prominente que la marca                                                    | [P3], [C-1.8]                 |
| Barras por mes con `View`, sin librerías de gráficas                                                          | [C-1.10]                      |
| Dependencias nuevas solo si la spec las justifica, compatibles con Expo Go                                    | [C-1.10]                      |
| `npm test` y `npx tsc --noEmit` en verde antes de cada commit de código                                       | [C-1.7]                       |
| El dominio recibe el año actual como parámetro y nunca lee la fecha del sistema                               | [C-1.6]                       |

## 9. Supuestos del equipo

Lo que el cliente no dijo y el equipo decidió para poder construir. Cualquiera se puede cambiar si el cliente
responde otra cosa.

| #   | Supuesto                                                                                                                             | Dónde se aplica       |
| :-- | :----------------------------------------------------------------------------------------------------------------------------------- | :-------------------- |
| S-1 | Compartir el resumen y las notificaciones quedan fuera del MVP: no aparecen en 1.3 ni en las historias                               | Alcance               |
| S-2 | Para D6, una obra «no tiene esos datos» cuando le falta el campo `generos`. Una lista vacía significa que TMDB respondió sin géneros | `tieneDatosTmdb`      |
| S-3 | El completado de D6 corre al abrir Mi año **y al cambiar de año en el selector**, porque D6 habla del «año elegido»                  | `MiAnioScreen`        |
| S-4 | Los directores salen de `credits.crew` con `job = "Director"`, sin repetidos                                                         | `datosTmdbDePelicula` |
| S-5 | «Sin conexión» (D13) es: NetInfo dice que no hay internet o la app está mostrando la copia de AsyncStorage                           | `sincronizarAnio`     |
| S-6 | La duración de TMDB se redondea a minutos enteros, porque las reglas exigen un entero                                                | `datosTmdbDePelicula` |

**Métricas de éxito (supuesto S-7, el cliente no las fijó):** con una cuenta con obras anteriores a la épica,
el resumen muestra datos sin intervención manual, y los 18 pasos de `docs/VERIFICACION.md` tienen resultado
obtenido en el teléfono.

## 10. Puntos abiertos (para consultar al cliente)

Casos que D1–D13 no cubren. Cada uno tiene un supuesto provisional, que es lo que hace el código hoy, y queda
**pendiente de respuesta del cliente**. No son decisiones del cliente.

| #    | Caso no cubierto                                                                                                                    | Supuesto provisional                                                         | Estado    |
| :--- | :---------------------------------------------------------------------------------------------------------------------------------- | :--------------------------------------------------------------------------- | :-------- |
| PA-1 | D2: obra vista sin `vistaEn` y sin `actualizadoEn`                                                                                  | Se usa `agregadoEn`; si tampoco existe, no se migra y no entra en ningún año | Pendiente |
| PA-2 | D8/D9: empate entre dos nombres que no tienen ninguna obra calificada                                                               | Decide el orden alfabético en español                                        | Pendiente |
| PA-3 | D6: ¿se reintenta una obra que falló en TMDB?                                                                                       | Sí, la próxima vez que se abra el resumen                                    | Pendiente |
| PA-4 | D6: obras en por ver o viendo agregadas antes de la épica                                                                           | No se completan hasta que pasen a vista                                      | Pendiente |
| PA-5 | D7: una serie vista que tiene `duracionMin` por error                                                                               | Se ignora: las series nunca suman horas                                      | Pendiente |
| PA-6 | D11: empate también en `vistaEn` exacta                                                                                             | Se desempata por título                                                      | Pendiente |
| PA-7 | D13: ¿se puede cambiar de año sin conexión?                                                                                         | Sí, con la copia local y sin completar datos                                 | Pendiente |
| PA-8 | D3/D4: obra con fecha futura (reloj del teléfono adelantado)                                                                        | Cuenta en su año y ese año aparece en el selector                            | Pendiente |
| PA-9 | D2: las reglas exigen `actualizadoEn == request.time` en toda escritura, así que migrar `vistaEn` también actualiza `actualizadoEn` | Se acepta; `vistaEn` toma el valor anterior antes de escribir                | Pendiente |
