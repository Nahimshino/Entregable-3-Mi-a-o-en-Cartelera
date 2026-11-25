import { describe, expect, it } from 'vitest';
import { conDatosTmdb, conVistaEn, fechaMigrada, planSincronizacion } from './sincronizacion';
import { ms, obra } from './fabrica.test-utils';

describe('fechaMigrada (D2, PA-1)', () => {
  it('una obra vista sin vistaEn recibe actualizadoEn', () => {
    expect(fechaMigrada(obra({ vistaEn: null, actualizadoEn: ms(2025, 4, 2) }))).toBe(ms(2025, 4, 2));
  });

  it('sin actualizadoEn usa agregadoEn; sin ninguna no hay fecha', () => {
    expect(fechaMigrada(obra({ vistaEn: null, actualizadoEn: null, agregadoEn: ms(2024, 2, 2) }))).toBe(ms(2024, 2, 2));
    expect(fechaMigrada(obra({ vistaEn: null, actualizadoEn: null, agregadoEn: null }))).toBeNull();
  });
});

describe('planSincronizacion', () => {
  it('migra las obras vistas sin vistaEn de cualquier año (D2)', () => {
    const vieja = obra({ vistaEn: undefined, actualizadoEn: ms(2024, 10, 1) });
    const plan = planSincronizacion([vieja, obra(), obra({ estado: 'por_ver', vistaEn: null })], 2026, true);
    expect(plan.migrarFechas).toEqual([{ item: vieja, vistaEn: ms(2024, 10, 1) }]);
  });

  it('una vez migradas no se vuelven a migrar (CA-27)', () => {
    expect(planSincronizacion([obra({ vistaEn: ms(2024, 10, 1) })], 2026, true).migrarFechas).toEqual([]);
  });

  it('completa solo las obras vistas del año elegido sin datos de TMDB (D6, PA-4)', () => {
    const delAnio = obra({ generos: undefined });
    const migradaDelAnio = obra({ generos: undefined, vistaEn: null, actualizadoEn: ms(2026, 2, 2) });
    const otroAnio = obra({ generos: undefined, vistaEn: ms(2025, 1, 1) });
    const porVer = obra({ estado: 'por_ver', vistaEn: null, generos: undefined });
    const conDatos = obra();
    const plan = planSincronizacion([delAnio, migradaDelAnio, otroAnio, porVer, conDatos], 2026, true);
    expect(plan.completar).toEqual([delAnio, migradaDelAnio]);
  });

  it('sin conexión no se migran fechas ni se completan datos (D13)', () => {
    const items = [obra({ vistaEn: null }), obra({ generos: undefined })];
    expect(planSincronizacion(items, 2026, false)).toEqual({ migrarFechas: [], completar: [] });
  });
});

describe('las migraciones no pierden nada (CA-30)', () => {
  const original = obra({ estado: 'vista', calificacionPersonal: 4, comentario: 'Gran final', vistaEn: null });

  it('conVistaEn solo cambia vistaEn', () => {
    expect(conVistaEn(original, ms(2025, 5, 5))).toEqual({ ...original, vistaEn: ms(2025, 5, 5) });
  });

  it('conDatosTmdb solo cambia los tres campos de TMDB', () => {
    const datos = { generos: ['Terror'], duracionMin: 88, directores: ['Ari Aster'] };
    expect(conDatosTmdb(original, datos)).toEqual({ ...original, ...datos });
  });
});
