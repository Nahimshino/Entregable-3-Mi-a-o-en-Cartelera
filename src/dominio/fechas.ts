import type { MarcaTiempo } from '../types/lista';

/** Convierte una marca de tiempo (ms, Timestamp de Firestore o nada) a milisegundos. */
export function aMilisegundos(marca: MarcaTiempo | undefined): number | null {
  if (typeof marca === 'number') return Number.isFinite(marca) ? marca : null;
  if (marca && typeof marca === 'object' && 'toMillis' in marca && typeof marca.toMillis === 'function') {
    return marca.toMillis();
  }
  // null, ausente o serverTimestamp() pendiente de confirmar.
  return null;
}

// new Date(ms) solo interpreta una fecha recibida; el dominio nunca lee la hora actual del sistema.

/** Año calendario en la hora local del teléfono (D3). */
export function anioLocal(ms: number): number {
  return new Date(ms).getFullYear();
}

/** Mes en la hora local del teléfono, enero = 0 (D10). */
export function mesLocal(ms: number): number {
  return new Date(ms).getMonth();
}
