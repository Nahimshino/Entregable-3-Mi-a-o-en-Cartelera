import type { ElementoLista } from '../types/lista';

/** Milisegundos de una fecha en hora local; mes de 1 a 12 para leer los tests como un calendario. */
export function ms(anio: number, mes: number, dia: number, hora = 12, minuto = 0): number {
  return new Date(anio, mes - 1, dia, hora, minuto).getTime();
}

let siguienteId = 1;

/** Obra vista con datos de TMDB completos; cada test sobrescribe lo que le importa. */
export function obra(cambios: Partial<ElementoLista> = {}): ElementoLista {
  const tmdbId = siguienteId++;
  const tipo = cambios.tipo ?? 'movie';
  return {
    id: `${tipo}_${tmdbId}`,
    tmdbId,
    tipo,
    titulo: `Obra ${tmdbId}`,
    anio: '2020',
    posterPath: null,
    estado: 'vista',
    calificacionPersonal: null,
    comentario: '',
    agregadoEn: ms(2026, 1, 1),
    actualizadoEn: ms(2026, 1, 1),
    vistaEn: ms(2026, 6, 15),
    generos: ['Drama'],
    duracionMin: tipo === 'movie' ? 100 : null,
    directores: tipo === 'movie' ? ['Directora X'] : [],
    ...cambios,
  };
}
