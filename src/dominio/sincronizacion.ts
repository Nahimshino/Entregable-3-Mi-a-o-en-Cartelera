import type { DatosTmdb, ElementoLista } from '../types/lista';

export interface MigracionFecha {
  item: ElementoLista;
  vistaEn: number;
}

export interface PlanSincronizacion {
  /** D2: obras vistas sin vistaEn, con la fecha que recibirán. */
  migrarFechas: MigracionFecha[];
  /** D6: obras vistas del año elegido sin datos de TMDB, en orden. */
  completar: ElementoLista[];
}

/** D2 y PA-1: fecha que recibe una obra vista sin vistaEn (actualizadoEn, si no agregadoEn). */
export function fechaMigrada(_item: ElementoLista): number | null {
  throw new Error('sin implementar');
}

/** D2, D6, D13 y PA-4: qué migrar y qué completar al abrir el resumen de un año. */
export function planSincronizacion(_items: ElementoLista[], _anio: number, _conectado: boolean): PlanSincronizacion {
  throw new Error('sin implementar');
}

/** Copia de la obra con vistaEn fijada; no toca ningún otro campo (CA-30). */
export function conVistaEn(_item: ElementoLista, _vistaEn: number): ElementoLista {
  throw new Error('sin implementar');
}

/** Copia de la obra con los datos de TMDB; no toca ningún otro campo (CA-30). */
export function conDatosTmdb(_item: ElementoLista, _datos: DatosTmdb): ElementoLista {
  throw new Error('sin implementar');
}
