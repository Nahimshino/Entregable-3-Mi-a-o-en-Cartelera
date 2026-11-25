import { describe, expect, it } from 'vitest';
import { MAX_COMENTARIO } from '../types/lista';
import { crearItemId, normalizarCambios } from './validaciones';

// RF6 del Proyecto 3: calificación de 1 a 5, solo si el estado es "vista"; comentario de hasta 500.
describe('normalizarCambios (RF6)', () => {
  it('conserva la calificación cuando la obra está vista', () => {
    expect(normalizarCambios({ estado: 'vista', calificacionPersonal: 4, comentario: '' }).calificacionPersonal).toBe(
      4,
    );
  });

  it.each(['por_ver', 'viendo'] as const)('anula la calificación si el estado es %s', (estado) => {
    expect(normalizarCambios({ estado, calificacionPersonal: 5, comentario: '' }).calificacionPersonal).toBeNull();
  });

  it('limita la calificación al rango 1 a 5 y la redondea', () => {
    expect(normalizarCambios({ estado: 'vista', calificacionPersonal: 9, comentario: '' }).calificacionPersonal).toBe(
      5,
    );
    expect(normalizarCambios({ estado: 'vista', calificacionPersonal: 0, comentario: '' }).calificacionPersonal).toBe(
      1,
    );
    expect(normalizarCambios({ estado: 'vista', calificacionPersonal: 3.6, comentario: '' }).calificacionPersonal).toBe(
      4,
    );
  });

  it('una obra vista sin calificar sigue sin calificación', () => {
    expect(
      normalizarCambios({ estado: 'vista', calificacionPersonal: null, comentario: '' }).calificacionPersonal,
    ).toBeNull();
  });

  it('recorta el comentario a 500 caracteres', () => {
    const largo = 'a'.repeat(MAX_COMENTARIO + 20);
    expect(
      normalizarCambios({ estado: 'por_ver', calificacionPersonal: null, comentario: largo }).comentario,
    ).toHaveLength(MAX_COMENTARIO);
  });
});

// RF4: el id tipo_tmdbId evita duplicados y choques entre películas y series.
describe('crearItemId (RF4)', () => {
  it('combina tipo y tmdbId', () => {
    expect(crearItemId('movie', 550)).toBe('movie_550');
    expect(crearItemId('tv', 550)).toBe('tv_550');
  });
});
