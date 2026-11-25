import type { ElementoLista } from '../types/lista';

export interface Top {
  nombre: string;
  obras: number;
}

export interface ResumenAnual {
  anio: number;
  totalObras: number;
  peliculas: number;
  series: number;
  /** Horas de películas con un decimal (D7). */
  horas: number;
  /** Películas con datos de TMDB pero sin duración (D7). */
  peliculasSinDuracion: number;
  /** Obras sin datos de TMDB (D6). */
  obrasSinDatos: number;
  generoTop: Top | null;
  directorTop: Top | null;
  /** 12 posiciones, enero = 0 (D10). */
  obrasPorMes: number[];
  mesTop: number | null;
  destacada: ElementoLista | null;
}

/** D4: años con obras vistas más el actual, del más reciente al más antiguo. */
export function aniosDisponibles(_items: ElementoLista[], _anioActual: number): number[] {
  throw new Error('sin implementar');
}

/** D3, D6 a D11: resumen de las obras vistas en un año. */
export function resumenAnual(_items: ElementoLista[], _anio: number): ResumenAnual {
  throw new Error('sin implementar');
}
