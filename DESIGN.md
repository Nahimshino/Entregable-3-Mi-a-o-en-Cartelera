# DESIGN.md — Sistema de diseño de Mi Cartelera

Fuente: [`docs/diseno/BRIEF.md`](docs/diseno/BRIEF.md) → [`docs/diseno/brand-board.html`](docs/diseno/brand-board.html)
→ este archivo → `src/tema/`. Las decisiones son de la autora del proyecto; **el agente no modifica este
archivo por su cuenta**. Si una pantalla necesita algo que no está aquí, se anota en «Decisiones pendientes» y
se consulta.

## 1. Principios

1. **Nocturna.** Fondos azul noche; la luz la ponen los pósters, las cifras y el ámbar.
2. **Cálida.** Un solo color de acento, `primario` (ámbar de marquesina), para lo importante y lo activo.
3. **Honesta.** Los datos faltantes se dicen con un aviso; nunca se rellenan con ceros falsos.
4. **Una mano, poca luz.** Tocables ≥ 44, texto con contraste ≥ 4,5:1, información clave arriba.
5. **Un solo origen.** Todo color, tamaño, espacio y radio sale de `src/tema/`. Nada escrito a mano.

## 2. Tokens

Importar siempre desde `src/tema` (`import { colores, espacio, tipo, radio, icono, ALTURA_TOCABLE } from '../tema'`).

### 2.1 Color (`colores`)

| Token                | Valor     | Uso                                                                |
| :------------------- | :-------- | :----------------------------------------------------------------- |
| `fondo`              | `#0f1420` | Fondo de todas las pantallas                                       |
| `superficie`         | `#1a2133` | Tarjetas, barra de pestañas                                        |
| `superficieAlta`     | `#242d44` | Botón secundario, obra destacada, avisos suaves, póster de relleno |
| `borde`              | `#33405e` | Bordes, chips inactivos, estrellas deshabilitadas                  |
| `texto`              | `#f2f4f8` | Texto principal                                                    |
| `textoSuave`         | `#a3adc2` | Metadatos, etiquetas, notas                                        |
| `primario`           | `#f5b301` | Marca, chip activo, botón primario, mes más activo, estrellas      |
| `textoSobrePrimario` | `#1a1300` | Texto sobre `primario`                                             |
| `dato`               | `#ffd166` | Cifras grandes del resumen                                         |
| `peligro`            | `#ff6b6b` | Errores y acciones destructivas                                    |
| `peligroSuave`       | `#2c1e29` | Fondo de mensajes de error del formulario                          |
| `exito`              | `#4cd18a` | Confirmaciones                                                     |
| `aviso`              | `#ffb547` | Aviso sin conexión y de datos incompletos                          |
| `barra`              | `#8f6a0a` | Barras por mes                                                     |
| `barraVacia`         | `#33405e` | Mes con 0 obras, pista de la barra de progreso                     |
| `estadoPorVer`       | `#a3adc2` | Estado por ver                                                     |
| `estadoViendo`       | `#ffb547` | Estado viendo                                                      |
| `estadoVista`        | `#4cd18a` | Estado vista                                                       |

`coloresTmdb` (`verde #90cea1`, `turquesa #3cbec9`, `azul #00b3e5`) solo se usan dentro del logo oficial de TMDB.

**Contraste comprobado** (brand board, sección 2): todas las parejas texto/fondo usadas cumplen 4,5:1. La más
baja es `textoSuave` sobre `borde` (4,58:1): no usar texto más pequeño que `tipo.nota` en esa combinación.

### 2.2 Tipografía (`tipo`)

Fuente del sistema. Pesos: 400 normal, 600 semibold, 700 bold, 800 extra bold.

| Token        | Tamaño | Peso    | Uso                                                                       |
| :----------- | :----- | :------ | :------------------------------------------------------------------------ |
| `dato`       | 40     | 800     | Cifras del resumen (`tabular-nums` si la plataforma lo permite)           |
| `marca`      | 32     | 800     | Wordmark y título del login                                               |
| `titulo`     | 28     | 800     | Encabezado de pantalla                                                    |
| `subtitulo`  | 20     | 700     | Título de sección, título del detalle, cifras de texto (género, director) |
| `destacado`  | 18     | 700     | Título de estado vacío o error                                            |
| `cuerpo`     | 16     | 400–700 | Texto general, títulos de tarjeta, botones                                |
| `secundario` | 14     | 400–700 | Metadatos, etiquetas, chips, avisos                                       |
| `nota`       | 12     | 400–700 | Notas al pie, iniciales de mes                                            |

### 2.3 Espacio (`espacio`), forma (`radio`) e íconos (`icono`)

| Espacio    | `xxs` 2 · `xs` 4 · `s` 8 · `m` 12 · `l` 16 · `xl` 24 · `xxl` 32                                           |
| :--------- | :-------------------------------------------------------------------------------------------------------- |
| **Radio**  | `chico` 6 (pósters chicos, barras) · `medio` 10 (botones) · `grande` 12 (tarjetas) · `pildora` 22 (chips) |
| **Ícono**  | `chico` 16 · `medio` 20 · `grande` 48 · `enorme` 64                                                       |
| **Táctil** | `ALTURA_TOCABLE = 44`; el botón mide `ALTURA_TOCABLE + 4`                                                 |

Margen lateral de pantalla: `espacio.l`. Separación entre tarjetas: `espacio.m`.

## 3. Componentes

### Se conservan del Proyecto 3 (`src/components/`)

| Componente                                                         | Reglas                                                                                                                |
| :----------------------------------------------------------------- | :-------------------------------------------------------------------------------------------------------------------- |
| `Boton`                                                            | Variantes `primario`, `secundario`, `peligro`. Alto 48, `radio.medio`, `tipo.cuerpo` 700. Deshabilitado: opacidad 0,5 |
| `Chip`                                                             | Alto 44, `radio.pildora`, borde `borde`; activo con fondo `primario` y texto `textoSobrePrimario`                     |
| `Estrellas`                                                        | Cinco tocables de 44 × 44, color `primario`; deshabilitadas en `borde`                                                |
| Tarjeta de obra (en `MiListaScreen`)                               | `superficie`, `radio.grande`, padding `espacio.m`, póster de 70, estado con su color de estado e ícono                |
| `Poster`                                                           | Relleno `superficieAlta` con ícono y «Sin imagen» si falta                                                            |
| `Estado` (`Cargando`, `MensajeError`, `Vacio`, `AvisoSinConexion`) | Centrados, `espacio.xl` de padding; el aviso usa fondo `aviso` y texto `fondo`                                        |
| `LogoTmdb`                                                         | Ancho máximo 72, solo en Acerca de, debajo de la marca                                                                |

### Nuevos de la épica

| Componente         | Reglas                                                                                                                                                                                                                                                    |
| :----------------- | :-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `TarjetaDato`      | `superficie`, `radio.grande`, padding `espacio.l`. Valor en `tipo.dato` color `dato` (o `tipo.subtitulo` si es texto), etiqueta `tipo.secundario` `textoSuave`, nota opcional `tipo.nota`                                                                 |
| `BarrasPorMes`     | Siempre 12 columnas hechas con `View` (sin librerías). Alto máximo 80. Barra `barra`, mes más activo `primario`, mes con 0 una línea de 3 de alto en `barraVacia`. Inicial del mes en `tipo.nota`. Cada columna con `accessibilityLabel` «julio: 7 obras» |
| `TarjetaDestacada` | `superficieAlta`, borde 1 `primario`, `radio.grande`. Etiqueta «OBRA DESTACADA» en `tipo.nota` 700 `primario`, póster de 72, título y estrellas. Sin calificadas: texto que invita a calificar                                                            |
| `SelectorAnio`     | Fila horizontal de `Chip`, del año más reciente al más antiguo, el actual seleccionado al abrir                                                                                                                                                           |
| `AvisoSuave`       | `superficieAlta`, borde izquierdo 3 `aviso`, `tipo.secundario` `textoSuave`. Para progreso de completado y datos faltantes; puede llevar barra de progreso de 6 de alto                                                                                   |

## 4. Pantallas

| Pantalla                                     | Composición                                                                                                                                                                                                                  |
| :------------------------------------------- | :--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Mi año** (pestaña nueva, ícono `calendar`) | Encabezado «Mi año» (`tipo.titulo`) → `SelectorAnio` → avisos (sin conexión, progreso, datos faltantes) → rejilla 2 × 2 de `TarjetaDato` (obras, horas, género, director) → `BarrasPorMes` → `TarjetaDestacada`. Desplazable |
| Mi año · vacío                               | `Vacio` con «No viste nada en {año}» y `Boton` primario «Ir a Mi lista»                                                                                                                                                      |
| Mi año · cargando / error                    | `Cargando` «Cargando tu año…» / `MensajeError` con Reintentar                                                                                                                                                                |
| Pantallas del Proyecto 3                     | Sin cambios de estructura; solo pasan a usar tokens                                                                                                                                                                          |

## 5. Voz

Tuteo, frases cortas, sin culpa ni exclamaciones. Decir qué pasó y qué puede hacer el usuario. Números con
coma decimal (`37,5 h`), meses en minúscula, plurales correctos («1 obra», «2 obras»).

| Situación       | Texto                                                                                     |
| :-------------- | :---------------------------------------------------------------------------------------- |
| Año vacío       | «No viste nada en 2025.» + «Marca como vista una obra de tu lista y aparecerá aquí.»      |
| Error de carga  | «No pudimos cargar tu lista. Revisa tu conexión e inténtalo de nuevo.»                    |
| Sin conexión    | «Sin conexión. Mostrando la última copia guardada ({fecha}).»                             |
| Completando     | «Completando datos de TMDB: 2 de 5…»                                                      |
| Obras sin datos | «1 obra quedó sin datos de TMDB: cuenta en el total, no en horas, géneros ni directores.» |
| Sin duración    | «2 películas sin duración no suman horas.»                                                |
| Sin director    | «No hay datos suficientes para saber tu director favorito.»                               |
| Sin calificadas | «Aún no calificas ninguna obra de este año. Califica una para ver tu destacada.»          |

## 6. Accesibilidad

- Contraste ≥ 4,5:1 en todo texto (tabla del brand board).
- Tocables ≥ 44 × 44; `accessibilityRole` y `accessibilityState` en botones y chips.
- Las barras tienen `accessibilityLabel` con mes y cantidad; las cifras se leen con su etiqueta.
- La información no depende solo del color: el mes más activo también se nombra en texto y los estados
  llevan ícono.
- Los avisos usan `accessibilityRole="alert"`.

## 7. Sí y no

| Sí                                                 | No                                                   |
| :------------------------------------------------- | :--------------------------------------------------- |
| `colores.primario`                                 | `'#f5b301'` o cualquier hex fuera de `src/tema/`     |
| `tipo.cuerpo`                                      | `fontSize: 15`                                       |
| `espacio.l`, `radio.grande`                        | `padding: 16`, `borderRadius: 12` sueltos            |
| Barras con `View`                                  | Librerías de gráficas                                |
| Un acento (`primario`) por pantalla para lo activo | Varios colores llamativos compitiendo                |
| Decir «1 obra quedó sin datos»                     | Ocultar datos faltantes o mostrar 0                  |
| Logo TMDB pequeño en Acerca de                     | Logo TMDB en el encabezado o más grande que la marca |
| Reglas de negocio en `src/dominio/`                | Calcular el resumen dentro de la pantalla            |

## 8. Decisiones pendientes

| #    | Tema                                                                                      | Estado                                                             |
| :--- | :---------------------------------------------------------------------------------------- | :----------------------------------------------------------------- |
| DP-1 | ¿Mostrar el wordmark completo con marquesina en el login, o solo el texto «Mi Cartelera»? | Provisional: solo texto en `tipo.marca` color `primario`           |
| DP-2 | ¿Modo claro?                                                                              | Fuera de alcance: la app es solo oscura                            |
| DP-3 | Animación al cambiar de año                                                               | Fuera de alcance; si se agrega, debe respetar «reducir movimiento» |
| DP-4 | Ícono de la pestaña Mi año                                                                | Provisional: `calendar` de Ionicons                                |
