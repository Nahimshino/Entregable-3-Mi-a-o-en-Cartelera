import type { Timestamp, FieldValue } from 'firebase/firestore';

export type TipoObra = 'movie' | 'tv';
export type EstadoVisto = 'por_ver' | 'viendo' | 'vista';

/** Marca de tiempo tal como puede llegar: del servidor, pendiente de escritura o desde la caché (ms). */
export type MarcaTiempo = Timestamp | FieldValue | number | null;

export interface ElementoLista {
  id: string; // ej. "movie_550"
  tmdbId: number;
  tipo: TipoObra;
  titulo: string;
  anio: string;
  posterPath: string | null;
  estado: EstadoVisto;
  calificacionPersonal: number | null;
  comentario: string;
  agregadoEn?: MarcaTiempo;
  actualizadoEn?: MarcaTiempo;
  /** Cuándo pasó a vista (D1, D2). null o ausente si no está vista o aún no se migra. */
  vistaEn?: MarcaTiempo;
  /** Géneros de TMDB en español (máx. 10). Ausente = nunca se pidieron a TMDB (D6). */
  generos?: string[];
  /** Duración en minutos; null en series o si TMDB no la trae (D5, D7). */
  duracionMin?: number | null;
  /** Directores de la película (máx. 10); vacía en series (D5, D9). */
  directores?: string[];
}

/** Datos de TMDB que se guardan para el resumen anual (D5). */
export interface DatosTmdb {
  generos: string[];
  duracionMin: number | null;
  directores: string[];
}

/** Datos necesarios para agregar una obra a la lista. */
export type NuevoElemento = Pick<ElementoLista, 'tmdbId' | 'tipo' | 'titulo' | 'anio' | 'posterPath'>;

/** Campos que el usuario puede editar de su entrada. */
export type CambiosElemento = Pick<ElementoLista, 'estado' | 'calificacionPersonal' | 'comentario'>;

export type FiltroEstado = EstadoVisto | 'todos';
export type FiltroTipo = TipoObra | 'todos';

export const ESTADOS: readonly EstadoVisto[] = ['por_ver', 'viendo', 'vista'];

/** Record exhaustivo: si se agrega un estado nuevo, TypeScript obliga a darle etiqueta. */
export const ETIQUETA_ESTADO: Record<EstadoVisto, string> = {
  por_ver: 'Por ver',
  viendo: 'Viendo',
  vista: 'Vista',
};

export const ETIQUETA_TIPO: Record<TipoObra, string> = {
  movie: 'Película',
  tv: 'Serie',
};

export const MAX_COMENTARIO = 500;
