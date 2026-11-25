// Tokens de diseño: única fuente de verdad de colores, tipografía, espacios, radios e íconos.
// Los valores salen de DESIGN.md §2 y del brand board (docs/diseno/brand-board.html).
// El sensor tokensDesign.test.ts comprueba que coinciden con DESIGN.md.

/** Paleta monocroma: negro, blanco y grises. confirmacion es el único color (solo fondos de confirmación). */
export const paleta = {
  tinta: '#000000',
  papel: '#ffffff',
  ceniza: '#eeeeee',
  concreto: '#d9d9d9',
  carbon: '#333333',
  pizarra: '#595959',
  piedra: '#808080',
  confirmacion: '#7ffeb1',
} as const;

/** Roles que usan los componentes; cada uno apunta a la paleta (DESIGN.md §2.1). */
export const colores = {
  fondo: paleta.papel,
  superficie: paleta.ceniza,
  superficieAlta: paleta.papel,
  borde: paleta.concreto,
  texto: paleta.tinta,
  textoSuave: paleta.pizarra,
  primario: paleta.tinta,
  textoSobrePrimario: paleta.papel,
  dato: paleta.tinta,
  deshabilitado: paleta.piedra,
  peligro: paleta.tinta,
  peligroSuave: paleta.ceniza,
  exito: paleta.tinta,
  aviso: paleta.tinta,
  barra: paleta.carbon,
  barraVacia: paleta.piedra,
  estadoPorVer: paleta.pizarra,
  estadoViendo: paleta.carbon,
  estadoVista: paleta.tinta,
  confirmacion: paleta.confirmacion,
} as const;

/** Solo para el logo oficial de TMDB (artwork de terceros). */
export const coloresTmdb = {
  verde: '#90cea1',
  turquesa: '#3cbec9',
  azul: '#00b3e5',
} as const;

export const tipo = {
  display: 106,
  titulo: 28,
  dato: 28,
  marca: 28,
  subtitulo: 24,
  destacado: 18,
  cuerpo: 16,
  secundario: 14,
  nota: 12,
} as const;

export const interlineado = {
  display: 88,
  titulo: 34,
  dato: 34,
  marca: 34,
  subtitulo: 30,
  destacado: 25,
  cuerpo: 22,
  secundario: 19,
  nota: 15,
} as const;

type RolTipo = keyof typeof tipo;

/** Tracking de 0,06 em en todo, en puntos; el display va sin tracking (DESIGN.md §2.2). */
export const tracking = Object.fromEntries(
  (Object.keys(tipo) as RolTipo[]).map((rol) => [
    rol,
    rol === 'display' ? 0 : Math.round(tipo[rol] * 0.06 * 100) / 100,
  ]),
) as Record<RolTipo, number>;

/** Solo tres pesos; nunca 500 ni 600. */
export const peso = {
  ligero: '300',
  normal: '400',
  bold: '700',
} as const;

export const espacio = { xs: 4, s: 8, m: 12, l: 16, ml: 20, xl: 24, xxl: 32 } as const;

export const radio = { chico: 4, tarjeta: 8, campo: 20, boton: 40, etiqueta: 100 } as const;

export const icono = { chico: 16, medio: 20, grande: 48, enorme: 64 } as const;

/** Altura mínima de cualquier elemento tocable (Semana 6). */
export const ALTURA_TOCABLE = 44;
