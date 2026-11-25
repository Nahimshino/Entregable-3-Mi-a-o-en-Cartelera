import type { MarcaTiempo } from '../types/lista';

/** Convierte una marca de tiempo (ms, Timestamp de Firestore o nada) a milisegundos. */
export function aMilisegundos(_marca: MarcaTiempo | undefined): number | null {
  throw new Error('sin implementar');
}

/** Año calendario en la hora local del teléfono (D3). */
export function anioLocal(_ms: number): number {
  throw new Error('sin implementar');
}

/** Mes en la hora local del teléfono, enero = 0 (D10). */
export function mesLocal(_ms: number): number {
  throw new Error('sin implementar');
}
