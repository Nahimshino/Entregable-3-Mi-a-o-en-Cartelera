import { describe, expect, it } from 'vitest';
import { datosTmdbDePelicula, datosTmdbDeSerie } from './datosTmdb';

const generos = (...nombres: string[]) => nombres.map((name, id) => ({ id, name }));

describe('datosTmdbDePelicula (D5)', () => {
  it('guarda géneros en español, duración y directores', () => {
    expect(
      datosTmdbDePelicula({
        genres: generos('Ciencia ficción', 'Aventura'),
        runtime: 166,
        credits: {
          cast: [],
          crew: [
            { id: 1, name: 'Denis Villeneuve', job: 'Director' },
            { id: 2, name: 'Jon Spaihts', job: 'Screenplay' },
          ],
        },
      }),
    ).toEqual({ generos: ['Ciencia ficción', 'Aventura'], duracionMin: 166, directores: ['Denis Villeneuve'] });
  });

  it('sin duración, duración 0 o fuera de rango da null; redondea minutos', () => {
    const base = { genres: [], credits: { cast: [], crew: [] } };
    expect(datosTmdbDePelicula({ ...base, runtime: null }).duracionMin).toBeNull();
    expect(datosTmdbDePelicula({ ...base, runtime: 0 }).duracionMin).toBeNull();
    expect(datosTmdbDePelicula({ ...base, runtime: 1500 }).duracionMin).toBeNull();
    expect(datosTmdbDePelicula({ ...base, runtime: 99.6 }).duracionMin).toBe(100);
  });

  it('sin créditos, directores es una lista vacía; sin repetidos y máximo 10', () => {
    expect(datosTmdbDePelicula({ genres: [], runtime: 90 }).directores).toEqual([]);
    const crew = Array.from({ length: 14 }, (_, i) => ({ id: i, name: `D${i % 12}`, job: 'Director' }));
    const r = datosTmdbDePelicula({ genres: [], runtime: 90, credits: { cast: [], crew } });
    expect(r.directores).toHaveLength(10);
    expect(new Set(r.directores).size).toBe(10);
  });

  it('máximo 10 géneros', () => {
    const muchos = generos(...Array.from({ length: 13 }, (_, i) => `G${i}`));
    expect(datosTmdbDePelicula({ genres: muchos, runtime: 90 }).generos).toHaveLength(10);
  });
});

describe('datosTmdbDeSerie (D5)', () => {
  it('guarda géneros; duración null y directores vacía', () => {
    expect(datosTmdbDeSerie({ genres: generos('Drama', 'Crimen') })).toEqual({
      generos: ['Drama', 'Crimen'],
      duracionMin: null,
      directores: [],
    });
  });
});
