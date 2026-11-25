import type { DatosTmdb } from '../types/lista';
import type { DetallePeliculaCrudo, DetalleSerieCrudo } from '../types/tmdb';

export const MAX_GENEROS = 10;
export const MAX_DIRECTORES = 10;
export const MAX_DURACION_MIN = 1000;

/** D5: géneros, duración y directores de una película de TMDB. */
export function datosTmdbDePelicula(_d: Pick<DetallePeliculaCrudo, 'genres' | 'runtime' | 'credits'>): DatosTmdb {
  throw new Error('sin implementar');
}

/** D5: en series solo se guardan los géneros. */
export function datosTmdbDeSerie(_d: Pick<DetalleSerieCrudo, 'genres'>): DatosTmdb {
  throw new Error('sin implementar');
}
