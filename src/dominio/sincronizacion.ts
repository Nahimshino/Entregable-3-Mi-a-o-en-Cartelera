import type { DatosTmdb, ElementoLista } from '../types/lista';
import { aMilisegundos, anioLocal } from './fechas';
import { tieneDatosTmdb } from './resumenAnual';

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
export function fechaMigrada(item: ElementoLista): number | null {
  return aMilisegundos(item.actualizadoEn) ?? aMilisegundos(item.agregadoEn);
}

/** D2, D6, D13 y PA-4: qué migrar y qué completar al abrir el resumen de un año. */
export function planSincronizacion(items: ElementoLista[], anio: number, conectado: boolean): PlanSincronizacion {
  if (!conectado) return { migrarFechas: [], completar: [] };

  const migrarFechas: MigracionFecha[] = [];
  const completar: ElementoLista[] = [];
  for (const item of items) {
    if (item.estado !== 'vista') continue;
    let vistaEn = aMilisegundos(item.vistaEn);
    if (vistaEn === null) {
      vistaEn = fechaMigrada(item);
      if (vistaEn !== null) migrarFechas.push({ item, vistaEn });
    }
    // Se usa la fecha ya migrada para decidir si la obra es del año elegido.
    if (vistaEn !== null && anioLocal(vistaEn) === anio && !tieneDatosTmdb(item)) completar.push(item);
  }
  return { migrarFechas, completar };
}

/** Copia de la obra con vistaEn fijada; no toca ningún otro campo (CA-30). */
export function conVistaEn(item: ElementoLista, vistaEn: number): ElementoLista {
  return { ...item, vistaEn };
}

/** Copia de la obra con los datos de TMDB; no toca ningún otro campo (CA-30). */
export function conDatosTmdb(item: ElementoLista, datos: DatosTmdb): ElementoLista {
  return { ...item, generos: datos.generos, duracionMin: datos.duracionMin, directores: datos.directores };
}
