import type { DatosTmdb } from '../types/lista';
import type { DetallePeliculaCrudo, DetalleSerieCrudo } from '../types/tmdb';

// Mismos límites que firestore.rules (sección 1.6 del enunciado).
export const MAX_GENEROS = 10;
export const MAX_DIRECTORES = 10;
export const MAX_DURACION_MIN = 1000;

function nombresDeGeneros(genres: { name: string }[] | undefined): string[] {
  return unicos((genres ?? []).map((g) => g.name)).slice(0, MAX_GENEROS);
}

function unicos(nombres: string[]): string[] {
  return [...new Set(nombres.map((n) => n.trim()).filter((n) => n.length > 0))];
}

function duracionValida(runtime: number | null | undefined): number | null {
  if (typeof runtime !== 'number' || !Number.isFinite(runtime)) return null;
  const minutos = Math.round(runtime);
  return minutos > 0 && minutos <= MAX_DURACION_MIN ? minutos : null;
}

/** D5: géneros, duración y directores de una película de TMDB. */
export function datosTmdbDePelicula(d: Pick<DetallePeliculaCrudo, 'genres' | 'runtime' | 'credits'>): DatosTmdb {
  const directores = (d.credits?.crew ?? []).filter((m) => m.job === 'Director').map((m) => m.name);
  return {
    generos: nombresDeGeneros(d.genres),
    duracionMin: duracionValida(d.runtime),
    directores: unicos(directores).slice(0, MAX_DIRECTORES),
  };
}

/** D5: en series solo se guardan los géneros. */
export function datosTmdbDeSerie(d: Pick<DetalleSerieCrudo, 'genres'>): DatosTmdb {
  return { generos: nombresDeGeneros(d.genres), duracionMin: null, directores: [] };
}
