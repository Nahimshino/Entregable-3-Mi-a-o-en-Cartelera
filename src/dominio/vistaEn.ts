import type { EstadoVisto } from '../types/lista';

export type AccionVistaEn = 'marcar' | 'borrar' | 'conservar';

/** D1: qué hacer con vistaEn al pasar de un estado a otro. */
export function accionVistaEn(_anterior: EstadoVisto, _nuevo: EstadoVisto): AccionVistaEn {
  throw new Error('sin implementar');
}
