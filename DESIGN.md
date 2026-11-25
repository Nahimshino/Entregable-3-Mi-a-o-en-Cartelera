# DESIGN.md — Sistema de diseño de Mi Cartelera

> Afiche de concierto en blanco y negro: titulares que gritan, todo lo demás en silencio.

Cadena: referencia de estilo de la autora ([`docs/diseno/referencia-estilo.md`](docs/diseno/referencia-estilo.md))
→ [`docs/diseno/BRIEF.md`](docs/diseno/BRIEF.md) → [`docs/diseno/brand-board.html`](docs/diseno/brand-board.html) →
este archivo → `src/tema/`. Las decisiones son de la autora; **el agente no modifica este archivo por su cuenta**.
Si una pantalla necesita algo que no está aquí, se anota en «Decisiones pendientes» y se consulta.

**Tema:** claro.

## 1. Principios

1. **Monocromo.** Negro (`tinta`), blanco (`papel`) y grises. Ningún color en la interfaz: el color lo ponen los
   pósters de TMDB. La única excepción es `confirmacion`, como fondo de una confirmación.
2. **Ruidoso solo en los titulares.** El año del resumen en display de 106 y las cifras en 28 negrita; todo lo
   demás tranquilo.
3. **Plano.** Sin sombras, elevación ni degradados. La separación la dan el espacio y el contraste.
4. **Píldoras y esquinas suaves.** Botones con radio 40, chips con radio 100, tarjetas e imágenes con 8.
5. **Honesto y legible.** Los datos faltantes se dicen. Texto con contraste de 4,5:1 o más; tocables de 44 o más.
6. **Un solo origen.** Todo color, tamaño, espacio y radio sale de `src/tema/`.

## 2. Tokens

Importar siempre desde `src/tema` (`import { colores, espacio, tipo, tracking, radio, icono, peso, ALTURA_TOCABLE } from '../tema'`).

### 2.1 Color

**Paleta (`paleta`)**

| Token          | Valor     | Uso                                                                         |
| :------------- | :-------- | :-------------------------------------------------------------------------- |
| `tinta`        | `#000000` | Texto, botón lleno, chip activo, bandas oscuras, cifras                     |
| `papel`        | `#ffffff` | Fondo de pantallas, texto sobre tinta                                       |
| `ceniza`       | `#eeeeee` | Tarjetas, relleno detrás de pósters, avisos suaves                          |
| `concreto`     | `#d9d9d9` | Bordes, divisores, chips inactivos, estrellas deshabilitadas (nunca texto)  |
| `carbon`       | `#333333` | Barras por mes, estado viendo, texto secundario fuerte                      |
| `pizarra`      | `#595959` | Texto suave, metadatos, estado por ver, pestaña inactiva                    |
| `piedra`       | `#808080` | Deshabilitado, mes con 0 obras, pista de progreso (**nunca texto**: 3,95:1) |
| `confirmacion` | `#7ffeb1` | Único color: fondo de «Está en tu lista». Nunca texto, borde ni botón       |

**Roles (`colores`)**: los componentes usan estos nombres, que apuntan a la paleta.

| Rol                  | Paleta     | Rol            | Paleta         |
| :------------------- | :--------- | :------------- | :------------- |
| `fondo`              | `papel`    | `peligro`      | `tinta`        |
| `superficie`         | `ceniza`   | `peligroSuave` | `ceniza`       |
| `superficieAlta`     | `papel`    | `exito`        | `tinta`        |
| `borde`              | `concreto` | `aviso`        | `tinta`        |
| `texto`              | `tinta`    | `barra`        | `carbon`       |
| `textoSuave`         | `pizarra`  | `barraVacia`   | `piedra`       |
| `primario`           | `tinta`    | `estadoPorVer` | `pizarra`      |
| `textoSobrePrimario` | `papel`    | `estadoViendo` | `carbon`       |
| `dato`               | `tinta`    | `estadoVista`  | `tinta`        |
| `deshabilitado`      | `piedra`   | `confirmacion` | `confirmacion` |

**Estados y error sin color:** por ver (`pizarra` + reloj), viendo (`carbon` + reproducir), vista (`tinta` +
doble check + negrita). El error es `tinta` con ícono de alerta, negrita y un texto que explica qué pasó, sobre
`peligroSuave`.

`coloresTmdb` (`verde #90cea1`, `turquesa #3cbec9`, `azul #00b3e5`) es artwork del logo oficial de TMDB, no parte
de la interfaz.

**Contraste comprobado** (brand board §2): tinta/papel 21:1, tinta/ceniza 18,1:1, carbon/papel 12,6:1,
pizarra/papel 7:1, pizarra/ceniza 6:1, papel/tinta 21:1, tinta/confirmacion 16,7:1.

### 2.2 Tipografía (`tipo`, `interlineado`, `tracking`, `peso`)

Fuente del sistema. **Tracking 0,06 em en todo** (`tracking.<rol>` = tamaño × 0,06), excepto el display (0).
Pesos: `ligero` 300, `normal` 400, `bold` 700. Nunca 500 ni 600. (El 350 de la referencia no existe en React Native.)

| Token        | Tamaño | Interlineado | Peso    | Uso                                                                |
| :----------- | :----- | :----------- | :------ | :----------------------------------------------------------------- |
| `display`    | 106    | 88 (0,83)    | 700     | Solo el año del resumen. Nunca en otro lugar ni por debajo de 80   |
| `titulo`     | 28     | 34           | 700     | Encabezado de pantalla en mayúsculas                               |
| `dato`       | 28     | 34           | 700     | Cifras del resumen                                                 |
| `marca`      | 28     | 34           | 700     | «MI CARTELERA» en el login                                         |
| `subtitulo`  | 24     | 30           | 700     | Título del detalle, título de sección                              |
| `destacado`  | 18     | 25           | 700     | Título de estado vacío o error; cifras de texto (género, director) |
| `cuerpo`     | 16     | 22           | 400–700 | Texto general, títulos de tarjeta                                  |
| `secundario` | 14     | 19           | 400–700 | Metadatos, chips, avisos                                           |
| `nota`       | 12     | 15           | 300–700 | Botones (mayúsculas, 700), notas, iniciales de mes                 |

### 2.3 Espacio, forma e íconos

| Espacio (`espacio`) | `xs` 4 · `s` 8 · `m` 12 · `l` 16 · `ml` 20 · `xl` 24 · `xxl` 32                                                                               |
| :------------------ | :-------------------------------------------------------------------------------------------------------------------------------------------- |
| **Radio (`radio`)** | `chico` 4 (barras, avisos) · `tarjeta` 8 (tarjetas e imágenes) · `campo` 20 (campos de texto) · `boton` 40 (botones) · `etiqueta` 100 (chips) |
| **Ícono (`icono`)** | `chico` 16 · `medio` 20 · `grande` 48 · `enorme` 64                                                                                           |
| **Táctil**          | `ALTURA_TOCABLE = 44`; el botón mide `ALTURA_TOCABLE + 4` (la referencia da ~38: se agranda por accesibilidad)                                |

Margen lateral de pantalla: `espacio.l`. Separación entre elementos: `espacio.s` a `espacio.m`.

## 3. Componentes

### Se conservan del Proyecto 3 (`src/components/`)

| Componente                                                         | Reglas                                                                                                                                                                                                                               |
| :----------------------------------------------------------------- | :----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `Boton`                                                            | Píldora (`radio.boton`), texto `tipo.nota` 700 en MAYÚSCULAS con tracking. `primario`: lleno `tinta`, texto `papel`. `secundario` y `peligro`: contorno de 1 `tinta`, fondo transparente, texto `tinta`. Deshabilitado: opacidad 0,5 |
| `Chip`                                                             | Alto 44, `radio.etiqueta`, borde `borde`, fondo `papel`, texto `tinta` 700; activo con fondo y borde `tinta`, texto `papel`                                                                                                          |
| `Estrellas`                                                        | Cinco tocables de 44 × 44, color `tinta` (o `papel` sobre una banda negra); deshabilitadas en `borde`                                                                                                                                |
| Tarjeta de obra (en `MiListaScreen`)                               | `superficie`, `radio.tarjeta`, padding `espacio.m`, póster con `radio.tarjeta`, estado con su tono e ícono, sin sombra                                                                                                               |
| `Poster`                                                           | Relleno `superficie` con ícono y «Sin imagen» si falta; esquinas `radio.tarjeta`                                                                                                                                                     |
| `Estado` (`Cargando`, `MensajeError`, `Vacio`, `AvisoSinConexion`) | Centrados, `espacio.xl` de padding. El aviso sin conexión es una banda `tinta` con texto `papel`                                                                                                                                     |
| `LogoTmdb`                                                         | Ancho máximo 72, solo en Acerca de, debajo de la marca                                                                                                                                                                               |
| Confirmación «Está en tu lista»                                    | Píldora con fondo `confirmacion` y texto `tinta` 700                                                                                                                                                                                 |

### Nuevos de la épica

| Componente         | Reglas                                                                                                                                                                                                                                                             |
| :----------------- | :----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `TarjetaDato`      | `superficie`, `radio.tarjeta`, padding `espacio.l`. Valor en `tipo.dato` `tinta` (o `tipo.destacado` si es texto), etiqueta `tipo.secundario` `textoSuave`, nota opcional `tipo.nota`                                                                              |
| `BarrasPorMes`     | 12 columnas con `View` (sin librerías). Alto máximo 80. Barra `barra`, mes más activo `tinta`, mes con 0 una línea de 3 en `barraVacia`. Inicial del mes en `tipo.nota` (la del mes más activo en negrita). Cada columna con `accessibilityLabel` «julio: 7 obras» |
| `TarjetaDestacada` | Banda negra: fondo `tinta`, texto `papel`, `radio.tarjeta`. Etiqueta «OBRA DESTACADA» en `tipo.nota` 700, póster de 72, título y estrellas en `papel`. Sin calificadas: tarjeta `superficie` con la invitación a calificar                                         |
| `SelectorAnio`     | Fila horizontal de `Chip`, del año más reciente al más antiguo; el actual seleccionado al abrir                                                                                                                                                                    |
| `AvisoSuave`       | `superficie`, borde izquierdo de 3 `tinta`, `radio.chico`, texto `tipo.secundario` `carbon`. Barra de progreso de 6: pista `barraVacia`, relleno `tinta`                                                                                                           |

## 4. Pantallas

| Pantalla                                     | Composición                                                                                                                                                                                                                                       |
| :------------------------------------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **Mi año** (pestaña nueva, ícono `calendar`) | «MI AÑO» (`tipo.titulo`) → año elegido en `tipo.display` → `SelectorAnio` → avisos (sin conexión, progreso, datos faltantes) → rejilla 2 × 2 de `TarjetaDato` (obras, horas, género, director) → `BarrasPorMes` → `TarjetaDestacada`. Desplazable |
| Mi año · vacío                               | `Vacio` con «No viste nada en {año}.» y `Boton` primario «Ir a Mi lista»                                                                                                                                                                          |
| Mi año · cargando / error                    | `Cargando` «Cargando tu año…» / `MensajeError` con Reintentar                                                                                                                                                                                     |
| Pantallas del Proyecto 3                     | Misma estructura; tema claro y tokens de esta guía. Barra de pestañas blanca con borde `borde`, activa `tinta`, inactiva `textoSuave`                                                                                                             |

## 5. Voz

Tuteo, frases cortas, sin culpa ni exclamaciones. Encabezados y botones en MAYÚSCULAS; el resto en frase normal.
Decir qué pasó y qué puede hacer el usuario. Coma decimal (`37,5 h`), meses en minúscula, plurales correctos.

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

- Contraste de 4,5:1 o más en todo texto; `piedra` y `concreto` nunca son texto.
- La información nunca depende solo del tono: los estados llevan ícono, el error lleva ícono y texto, el mes
  más activo se nombra en el título.
- Tocables de 44 × 44 o más; `accessibilityRole` y `accessibilityState` en botones y chips.
- Las barras tienen `accessibilityLabel` con mes y cantidad; las cifras se leen junto con su etiqueta.
- Los avisos usan `accessibilityRole="alert"`.

## 7. Sí y no

| Sí                                      | No                                               |
| :-------------------------------------- | :----------------------------------------------- |
| `colores.texto`, `colores.primario`     | `'#000000'` o cualquier hex fuera de `src/tema/` |
| Negro, blanco y grises en la interfaz   | Colores de acento en botones, bordes o texto     |
| `radio.boton` (40) en todos los botones | Botones cuadrados o con poco redondeo            |
| `tracking.<rol>` en todo texto          | Otro tracking, o pesos 500 / 600                 |
| `tipo.display` solo para el año         | Display en cualquier otro texto                  |
| Superficies planas                      | Sombras, elevación, degradados                   |
| `pizarra` para texto suave              | `piedra` para texto (3,95:1)                     |
| Barras con `View`                       | Librerías de gráficas                            |
| Logo TMDB pequeño en Acerca de          | Logo TMDB más grande que la marca                |
| Reglas de negocio en `src/dominio/`     | Calcular el resumen dentro de la pantalla        |

## 8. Decisiones pendientes

| #    | Tema                                                                  | Estado                                                                                                |
| :--- | :-------------------------------------------------------------------- | :---------------------------------------------------------------------------------------------------- |
| DP-1 | Fuentes de la referencia (sans grotesca y condensada para el display) | No se usan: son de pago y la entrega pide la del sistema. Se imita con mayúsculas, negrita y tracking |
| DP-2 | Peso 350 de la referencia                                             | React Native no lo tiene; se usa 300 (`peso.ligero`)                                                  |
| DP-3 | Texto terciario en `piedra` (como la referencia)                      | Rechazado por contraste; se usa `pizarra`                                                             |
| DP-4 | Ícono de la pestaña Mi año                                            | Provisional: `calendar` de Ionicons                                                                   |
| DP-5 | ¿Modo oscuro?                                                         | Fuera de alcance: la app es solo clara                                                                |
