// Tokens de diseño: única fuente de verdad de colores, tipografía, espacios, radios e íconos.
// Los valores salen de DESIGN.md §2 y del brand board (docs/diseno/brand-board.html).

export const colores = {
  fondo: '#0f1420',
  superficie: '#1a2133',
  superficieAlta: '#242d44',
  borde: '#33405e',
  texto: '#f2f4f8',
  textoSuave: '#a3adc2',
  primario: '#f5b301',
  textoSobrePrimario: '#1a1300',
  dato: '#ffd166',
  peligro: '#ff6b6b',
  peligroSuave: '#2c1e29',
  exito: '#4cd18a',
  aviso: '#ffb547',
  barra: '#8f6a0a',
  barraVacia: '#33405e',
  estadoPorVer: '#a3adc2',
  estadoViendo: '#ffb547',
  estadoVista: '#4cd18a',
} as const;

/** Solo para el logo oficial de TMDB. */
export const coloresTmdb = {
  verde: '#90cea1',
  turquesa: '#3cbec9',
  azul: '#00b3e5',
} as const;

export const tipo = {
  dato: 40,
  marca: 32,
  titulo: 28,
  subtitulo: 20,
  destacado: 18,
  cuerpo: 16,
  secundario: 14,
  nota: 12,
} as const;

export const peso = {
  normal: '400',
  semibold: '600',
  bold: '700',
  extra: '800',
} as const;

export const espacio = { xxs: 2, xs: 4, s: 8, m: 12, l: 16, xl: 24, xxl: 32 } as const;

export const radio = { chico: 6, medio: 10, grande: 12, pildora: 22 } as const;

export const icono = { chico: 16, medio: 20, grande: 48, enorme: 64 } as const;

/** Altura mínima de cualquier elemento tocable (Semana 6). */
export const ALTURA_TOCABLE = 44;
