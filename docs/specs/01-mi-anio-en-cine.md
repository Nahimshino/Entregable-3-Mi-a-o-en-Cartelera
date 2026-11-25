# Spec 01 — Mi año en cine

| Campo   | Valor                                                                                       |
| :------ | :------------------------------------------------------------------------------------------ |
| Épica   | E-A · Mi año en cine                                                                        |
| PRD     | [`docs/prd/PRD.md`](../prd/PRD.md) (D1 a D13, puntos abiertos PA-1 a PA-8)                  |
| Backlog | [`docs/backlog/epica-mi-anio.md`](../backlog/epica-mi-anio.md) (CA-01 a CA-36, T-01 a T-10) |
| Diseño  | [`DESIGN.md`](../../DESIGN.md)                                                              |
| Estado  | Aprobada para implementar · 2026-11-25                                                      |

## 1. Alcance

- Guardar `vistaEn` al pasar a vista y borrarla al salir de vista (D1).
- Guardar `generos`, `duracionMin` y `directores` al agregar desde TMDB (D5).
- Al abrir Mi año con conexión: migrar fechas (D2) y completar datos del año elegido (D6) con progreso.
- Pestaña **Mi año** con selector de año, cuatro tarjetas de dato, barras por mes y obra destacada, más los
  estados de carga, vacío, error, sin conexión y datos faltantes (D3 a D13).
- Reglas de Firestore con los campos nuevos (1.6), publicadas.
- Tokens en `src/tema/` y pantallas del Proyecto 3 migradas a ellos.

## 2. Fuera de alcance

Revisionados, compartir el resumen, horas de series, librerías de gráficas, modo claro, animaciones,
reintentos automáticos en segundo plano, caché persistente de Firestore.

## 3. Cambios al modelo

`ElementoLista` (en el enunciado se llama `ItemLista`; se conserva el nombre del Proyecto 3) suma cuatro
campos **opcionales**, porque los documentos anteriores no los tienen:

```typescript
interface ElementoLista {
  // … campos del Proyecto 3
  vistaEn?: MarcaTiempo; // Timestamp | FieldValue | ms | null
  generos?: string[]; // ausente = nunca se pidieron a TMDB
  duracionMin?: number | null;
  directores?: string[];
}
```

- **Ausente vs vacío:** `generos === undefined` significa «sin datos de TMDB» (D6). Una lista vacía significa
  que TMDB respondió sin géneros. `duracionMin === null` con `generos` presente es «película sin duración» (D7).
- La caché de AsyncStorage guarda `vistaEn` en milisegundos, igual que `agregadoEn` y `actualizadoEn`.
- Límites (iguales a las reglas): `generos` y `directores` máximo 10; `duracionMin` entero de 1 a 1000 o `null`.

## 4. Funciones de dominio (`src/dominio/`, puras, sin Firebase ni `new Date()` sin argumentos)

| Archivo             | Función                                                                      | Reglas                                        |
| :------------------ | :--------------------------------------------------------------------------- | :-------------------------------------------- |
| `fechas.ts`         | `aMilisegundos(marca): number \| null`                                       | Acepta número, objeto con `toMillis()` o nada |
|                     | `anioLocal(ms)`, `mesLocal(ms)`                                              | Año y mes en hora local del teléfono (D3)     |
| `vistaEn.ts`        | `accionVistaEn(anterior, nuevo): 'marcar' \| 'borrar' \| 'conservar'`        | D1                                            |
| `datosTmdb.ts`      | `datosTmdbDePelicula(crudo)`, `datosTmdbDeSerie(crudo)` → `DatosTmdb`        | D5 y límites                                  |
| `resumenAnual.ts`   | `aniosDisponibles(items, anioActual): number[]`                              | D3, D4, PA-8                                  |
|                     | `resumenAnual(items, anio): ResumenAnual`                                    | D3, D6 a D11                                  |
| `sincronizacion.ts` | `fechaMigrada(item): number \| null`                                         | D2, PA-1                                      |
|                     | `planSincronizacion(items, anio, conectado)` → `{ migrarFechas, completar }` | D2, D6, D13, PA-4                             |

```typescript
interface ResumenAnual {
  anio: number;
  totalObras: number;
  peliculas: number;
  series: number;
  horas: number; // un decimal (D7)
  peliculasSinDuracion: number; // con datos y sin duración (D7)
  obrasSinDatos: number; // sin generos (D6)
  generoTop: { nombre: string; obras: number } | null;
  directorTop: { nombre: string; obras: number } | null;
  obrasPorMes: number[]; // 12 posiciones, enero = 0 (D10)
  mesTop: number | null; // null si totalObras = 0
  destacada: ElementoLista | null;
}
```

Detalles:

- **Pertenencia (D3):** cuenta una obra si `estado === 'vista'` y `anioLocal(vistaEn) === anio`. Sin `vistaEn`
  utilizable no cuenta (queda para la migración).
- **Horas (D7):** suma de `duracionMin > 0` de películas con datos; `Math.round(min / 60 * 10) / 10`. Las
  series nunca suman (PA-5). Una obra sin datos (D6) no cuenta en `peliculasSinDuracion`, cuenta en
  `obrasSinDatos`.
- **Ranking (D8 y D9):** función común `masVisto(grupos)`. Orden: más obras → mayor promedio de
  `calificacionPersonal` entre las calificadas del grupo (sin calificadas = pierde, PA-2) → nombre con
  `localeCompare('es')`.
- **Director (D9):** solo películas con datos; si nadie tiene director → `null`.
- **Mes (D10):** máximo de `obrasPorMes`; empate → el índice mayor.
- **Destacada (D11):** mayor calificación; empate → `vistaEn` mayor; empate → título (PA-6). Sin calificadas
  → `null`.
- **Años (D4):** años de las obras vistas ∪ `anioActual`, sin repetir, de mayor a menor.
- **Plan (D13):** si `conectado` es `false`, ambas listas vacías.

## 5. Servicios

| Servicio                  | Cambio                                                                                                                                                                                                                                                                                                         |
| :------------------------ | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `tmdbService`             | `obtenerDetalle` devuelve también `datosTmdb` (usa `credits.crew` con `job === 'Director'` y `runtime`). Nueva `obtenerDatosTmdb(tipo, id)` para completar (D6)                                                                                                                                                |
| `listaService`            | `agregarElemento` guarda los tres campos (D5). `actualizarElemento(uid, id, cambios, accionVistaEn)` escribe `vistaEn: serverTimestamp()` o `null` según la acción (D1). Nuevas `migrarVistaEn(uid, id, ms)` (D2) y `guardarDatosTmdb(uid, id, datos)` (D6). `aElemento` lee los campos nuevos solo si existen |
| `cacheService`            | Convierte `vistaEn` a milisegundos                                                                                                                                                                                                                                                                             |
| `conexionService` (nuevo) | `estaConectado()` con NetInfo, para que el contexto no dependa de la librería                                                                                                                                                                                                                                  |
| `CarteleraContext`        | `actualizar` calcula `accionVistaEn` y aplica la fecha local optimista. Nueva acción `sincronizarAnio(anio, alProgresar)` que ejecuta `planSincronizacion` de una obra en una y actualiza estado + caché                                                                                                       |

Toda escritura sigue pasando `actualizadoEn: serverTimestamp()` porque las reglas lo exigen. En D2 se lee
`actualizadoEn` **antes** de escribir, así que la fecha migrada es la anterior.

## 6. Reglas de Firestore

`datosValidos(d)` cambia así (el resto del Proyecto 3 se mantiene):

- `hasOnly` suma `vistaEn`, `generos`, `duracionMin`, `directores`; `hasAll` sigue con los 10 campos viejos,
  para no romper los documentos existentes.
- Se agregan las condiciones de la sección 1.6 del enunciado con `d.get(campo, defecto)`.
- `create` exige además que `vistaEn` sea `null` o no exista (nace en por ver).

Prueba: `duracionMin: -5` y `vistaEn` en una obra por ver son rechazados; la cuenta B sigue sin leer la
lista de A (CA-07).

## 7. Componentes y pantalla (según `DESIGN.md`, sin copiar valores)

| Pieza                                                                           | Referencia en `DESIGN.md` |
| :------------------------------------------------------------------------------ | :------------------------ |
| `TarjetaDato`, `BarrasPorMes`, `TarjetaDestacada`, `SelectorAnio`, `AvisoSuave` | §3 «Nuevos de la épica»   |
| `MiAnioScreen` (pestaña `MiAnio`, ícono `calendar`)                             | §4 «Pantallas»            |
| Textos                                                                          | §5 «Voz»                  |
| Accesibilidad de barras y avisos                                                | §6                        |
| Tokens                                                                          | §2 (`src/tema/index.ts`)  |

## 8. Tickets y orden de commits

| Orden | Ticket     | Commit                                                                                                                                                                                              |
| :---- | :--------- | :-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1     | —          | `docs:` esta spec                                                                                                                                                                                   |
| 2     | T-07       | `feat:` tokens en `src/tema/` y colores del logo y del login movidos a tokens (deja el sensor de colores en verde antes de cualquier código de la épica, para que `npm test` sea una puerta válida) |
| 3     | T-01       | `test:` tests de dominio en rojo                                                                                                                                                                    |
| 4     | T-02       | `feat:` dominio en verde                                                                                                                                                                            |
| 5     | T-03, T-04 | `feat:` modelo, servicios y contexto (D1, D5)                                                                                                                                                       |
| 6     | T-05       | `feat:` reglas de Firestore publicadas                                                                                                                                                              |
| 7     | T-06       | `feat:` sincronización D2 y D6                                                                                                                                                                      |
| 8     | T-08       | `feat:` componentes y pantalla Mi año                                                                                                                                                               |
| 9     | T-09       | `feat:` pantallas del Proyecto 3 con tokens de tipografía, espacio y radio                                                                                                                          |
| 10    | T-10       | `docs:` verificación, auditoría final, README, IA                                                                                                                                                   |

## 9. Criterio → verificación

| Criterio            | Verificación                                                                   |
| :------------------ | :----------------------------------------------------------------------------- |
| CA-01 a CA-04       | `vistaEn.test.ts` (`accionVistaEn`) + V-01 y V-02 en el teléfono               |
| CA-05, CA-06        | `datosTmdb.test.ts` + V-03 (documento nuevo en la consola)                     |
| CA-07               | V-04 simulador de reglas y escritura con `duracionMin: -5`                     |
| CA-08, CA-09        | `resumenAnual.test.ts` «pertenencia (D3)»                                      |
| CA-10               | `resumenAnual.test.ts` «totales» + V-05                                        |
| CA-11, CA-12        | `resumenAnual.test.ts` «horas (D7)»                                            |
| CA-13 a CA-15       | `resumenAnual.test.ts` «género (D8)»                                           |
| CA-16, CA-17        | `resumenAnual.test.ts` «director (D9)» + V-06                                  |
| CA-18, CA-19        | `resumenAnual.test.ts` «mes (D10)» + V-07                                      |
| CA-20, CA-21        | `resumenAnual.test.ts` «destacada (D11)» + V-08                                |
| CA-22, CA-23, CA-25 | `resumenAnual.test.ts` «aniosDisponibles (D4)»                                 |
| CA-24               | V-09                                                                           |
| CA-26, CA-27, CA-30 | `sincronizacion.test.ts` + V-10 (consola de Firebase)                          |
| CA-28, CA-29        | `sincronizacion.test.ts`, `resumenAnual.test.ts` «obras sin datos (D6)» + V-11 |
| CA-31, CA-33        | V-12, V-13                                                                     |
| CA-32               | `resumenAnual.test.ts` «vacío (D12)» + V-14                                    |
| CA-34, CA-35        | `sincronizacion.test.ts` «sin conexión (D13)» + V-15 (modo avión)              |
| CA-36               | `resumenAnual.test.ts` (contadores) + V-16                                     |

Los V-xx son los pasos de [`docs/VERIFICACION.md`](../VERIFICACION.md).
