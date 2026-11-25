import type { EstadoVisto } from '../types/lista';

export type AccionVistaEn = 'marcar' | 'borrar' | 'conservar';

/**
 * D1: al pasar a vista se marca la fecha nueva; al salir de vista se borra. Cualquier otro cambio
 * (calificación, comentario, por ver ↔ viendo) la conserva.
 */
export function accionVistaEn(anterior: EstadoVisto, nuevo: EstadoVisto): AccionVistaEn {
  if (anterior !== 'vista' && nuevo === 'vista') return 'marcar';
  if (anterior === 'vista' && nuevo !== 'vista') return 'borrar';
  return 'conservar';
}
