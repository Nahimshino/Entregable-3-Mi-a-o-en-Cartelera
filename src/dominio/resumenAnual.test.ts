import { describe, expect, it } from 'vitest';
import { aniosDisponibles, resumenAnual } from './resumenAnual';
import { ms, obra } from './fabrica.test-utils';

describe('pertenencia al año (D3)', () => {
  it('una obra vista el 31 de diciembre a las 23:30 hora local cuenta en ese año', () => {
    const items = [obra({ vistaEn: ms(2025, 12, 31, 23, 30) })];
    expect(resumenAnual(items, 2025).totalObras).toBe(1);
    expect(resumenAnual(items, 2026).totalObras).toBe(0);
  });

  it('una obra vista el 1 de enero a las 00:10 cuenta en el año nuevo', () => {
    const items = [obra({ vistaEn: ms(2026, 1, 1, 0, 10) })];
    expect(resumenAnual(items, 2026).totalObras).toBe(1);
    expect(resumenAnual(items, 2025).totalObras).toBe(0);
  });

  it('solo cuentan las obras en estado vista, cada una una vez', () => {
    const items = [
      obra(),
      obra({ estado: 'por_ver', vistaEn: null }),
      obra({ estado: 'viendo', vistaEn: ms(2026, 3, 1) }),
    ];
    expect(resumenAnual(items, 2026).totalObras).toBe(1);
  });

  it('una obra vista sin vistaEn no cuenta (espera la migración D2)', () => {
    expect(resumenAnual([obra({ vistaEn: undefined }), obra({ vistaEn: null })], 2026).totalObras).toBe(0);
  });

  it('acepta vistaEn como Timestamp de Firestore (objeto con toMillis)', () => {
    const marca = { toMillis: () => ms(2026, 2, 10) };
    // El Timestamp real tiene más métodos; al dominio solo le importa toMillis.
    const items = [obra({ vistaEn: marca as unknown as number })];
    expect(resumenAnual(items, 2026).totalObras).toBe(1);
  });
});

describe('totales (1.3)', () => {
  it('3 películas y 2 series vistas dan 5 obras', () => {
    const items = [obra(), obra(), obra(), obra({ tipo: 'tv' }), obra({ tipo: 'tv' })];
    const r = resumenAnual(items, 2026);
    expect([r.totalObras, r.peliculas, r.series]).toEqual([5, 3, 2]);
    expect(r.anio).toBe(2026);
  });
});

describe('horas de cine (D7)', () => {
  it('suma la duración de las películas en horas con un decimal', () => {
    const items = [obra({ duracionMin: 120 }), obra({ duracionMin: 95 })];
    expect(resumenAnual(items, 2026).horas).toBe(3.6);
  });

  it('2250 minutos son 37,5 horas', () => {
    const items = [obra({ duracionMin: 1000 }), obra({ duracionMin: 1000 }), obra({ duracionMin: 250 })];
    expect(resumenAnual(items, 2026).horas).toBe(37.5);
  });

  it('una película sin duración no suma y se cuenta en peliculasSinDuracion', () => {
    const r = resumenAnual([obra({ duracionMin: 120 }), obra({ duracionMin: null })], 2026);
    expect(r.horas).toBe(2);
    expect(r.peliculasSinDuracion).toBe(1);
  });

  it('las series cuentan como obras pero nunca suman horas (PA-5)', () => {
    const r = resumenAnual([obra({ tipo: 'tv', duracionMin: 50 })], 2026);
    expect(r.totalObras).toBe(1);
    expect(r.horas).toBe(0);
    expect(r.peliculasSinDuracion).toBe(0);
  });
});

describe('obras sin datos de TMDB (D6)', () => {
  it('cuentan en el total pero no en horas, género ni director', () => {
    const sinDatos = obra({ generos: undefined, duracionMin: undefined, directores: undefined });
    const r = resumenAnual([sinDatos], 2026);
    expect(r.totalObras).toBe(1);
    expect(r.peliculas).toBe(1);
    expect(r.obrasSinDatos).toBe(1);
    expect(r.horas).toBe(0);
    expect(r.peliculasSinDuracion).toBe(0);
    expect(r.generoTop).toBeNull();
    expect(r.directorTop).toBeNull();
  });

  it('una obra con lista de géneros vacía sí tiene datos', () => {
    expect(resumenAnual([obra({ generos: [] })], 2026).obrasSinDatos).toBe(0);
  });
});

describe('género más visto (D8)', () => {
  it('gana el género con más obras; cada obra suma 1 a cada uno de sus géneros', () => {
    const items = [
      obra({ generos: ['Drama', 'Comedia'] }),
      obra({ generos: ['Drama'] }),
      obra({ generos: ['Drama', 'Comedia'] }),
      obra({ generos: ['Terror'] }),
    ];
    expect(resumenAnual(items, 2026).generoTop).toEqual({ nombre: 'Drama', obras: 3 });
  });

  it('empate: gana el de mayor promedio de calificación personal', () => {
    const items = [
      obra({ generos: ['Drama'], calificacionPersonal: 3 }),
      obra({ generos: ['Drama'], calificacionPersonal: 3 }),
      obra({ generos: ['Comedia'], calificacionPersonal: 5 }),
      obra({ generos: ['Comedia'], calificacionPersonal: null }),
    ];
    expect(resumenAnual(items, 2026).generoTop).toEqual({ nombre: 'Comedia', obras: 2 });
  });

  it('empate: un género sin obras calificadas pierde', () => {
    const items = [obra({ generos: ['Acción'], calificacionPersonal: 1 }), obra({ generos: ['Drama'] })];
    expect(resumenAnual(items, 2026).generoTop?.nombre).toBe('Acción');
  });

  it('empate en obras y en promedio: orden alfabético', () => {
    const items = [
      obra({ generos: ['Drama'], calificacionPersonal: 4 }),
      obra({ generos: ['Acción'], calificacionPersonal: 4 }),
    ];
    expect(resumenAnual(items, 2026).generoTop?.nombre).toBe('Acción');
  });

  it('empate sin calificadas en ninguno: orden alfabético (PA-2)', () => {
    const items = [obra({ generos: ['Western'] }), obra({ generos: ['Animación'] })];
    expect(resumenAnual(items, 2026).generoTop?.nombre).toBe('Animación');
  });

  it('sin géneros en ninguna obra no hay género top', () => {
    expect(resumenAnual([obra({ generos: [] })], 2026).generoTop).toBeNull();
  });
});

describe('director más visto (D9)', () => {
  it('solo cuentan películas; cada director suma 1', () => {
    const items = [
      obra({ directores: ['Greta Gerwig'] }),
      obra({ directores: ['Greta Gerwig', 'Noah Baumbach'] }),
      obra({ directores: ['Noah Baumbach'] }),
      obra({ directores: ['Noah Baumbach'] }),
      obra({ tipo: 'tv', directores: ['Greta Gerwig', 'Greta Gerwig'] }),
    ];
    expect(resumenAnual(items, 2026).directorTop).toEqual({ nombre: 'Noah Baumbach', obras: 3 });
  });

  it('mismo desempate que D8: promedio de calificación y luego orden alfabético', () => {
    const porPromedio = [
      obra({ directores: ['Bong Joon-ho'], calificacionPersonal: 5 }),
      obra({ directores: ['Agnès Varda'], calificacionPersonal: 4 }),
    ];
    expect(resumenAnual(porPromedio, 2026).directorTop?.nombre).toBe('Bong Joon-ho');
    const porNombre = [
      obra({ directores: ['Bong Joon-ho'], calificacionPersonal: 4 }),
      obra({ directores: ['Agnès Varda'], calificacionPersonal: 4 }),
    ];
    expect(resumenAnual(porNombre, 2026).directorTop?.nombre).toBe('Agnès Varda');
  });

  it('si ninguna película tiene director, directorTop es null (no hay datos suficientes)', () => {
    const items = [obra({ directores: [] }), obra({ tipo: 'tv' })];
    expect(resumenAnual(items, 2026).directorTop).toBeNull();
  });
});

describe('mes más activo (D10)', () => {
  it('siempre hay 12 meses, también los que tienen 0', () => {
    const r = resumenAnual([obra({ vistaEn: ms(2026, 5, 3) })], 2026);
    expect(r.obrasPorMes).toEqual([0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0]);
    expect(r.mesTop).toBe(4);
  });

  it('empate: gana el mes más reciente', () => {
    const items = [
      obra({ vistaEn: ms(2026, 3, 1) }),
      obra({ vistaEn: ms(2026, 3, 20) }),
      obra({ vistaEn: ms(2026, 7, 4) }),
      obra({ vistaEn: ms(2026, 7, 30) }),
      obra({ vistaEn: ms(2026, 1, 9) }),
    ];
    const r = resumenAnual(items, 2026);
    expect(r.obrasPorMes[2]).toBe(2);
    expect(r.obrasPorMes[6]).toBe(2);
    expect(r.mesTop).toBe(6);
  });
});

describe('obra destacada (D11)', () => {
  it('es la de mayor calificación; empate: la de vistaEn más reciente', () => {
    const marzo = obra({ titulo: 'Marzo', calificacionPersonal: 5, vistaEn: ms(2026, 3, 1) });
    const junio = obra({ titulo: 'Junio', calificacionPersonal: 5, vistaEn: ms(2026, 6, 1) });
    const cuatro = obra({ calificacionPersonal: 4, vistaEn: ms(2026, 12, 1) });
    expect(resumenAnual([marzo, cuatro, junio, obra()], 2026).destacada?.titulo).toBe('Junio');
  });

  it('empate también en fecha: orden por título (PA-6)', () => {
    const fecha = ms(2026, 4, 4);
    const items = [
      obra({ titulo: 'Zodiac', calificacionPersonal: 5, vistaEn: fecha }),
      obra({ titulo: 'Amélie', calificacionPersonal: 5, vistaEn: fecha }),
    ];
    expect(resumenAnual(items, 2026).destacada?.titulo).toBe('Amélie');
  });

  it('sin obras calificadas no hay destacada', () => {
    expect(resumenAnual([obra(), obra()], 2026).destacada).toBeNull();
  });
});

describe('resumen vacío (D12)', () => {
  it('un año sin obras vistas da todo en cero y sin tops', () => {
    expect(resumenAnual([obra({ vistaEn: ms(2024, 1, 1) })], 2026)).toEqual({
      anio: 2026,
      totalObras: 0,
      peliculas: 0,
      series: 0,
      horas: 0,
      peliculasSinDuracion: 0,
      obrasSinDatos: 0,
      generoTop: null,
      directorTop: null,
      obrasPorMes: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      mesTop: null,
      destacada: null,
    });
  });
});

describe('aniosDisponibles (D4)', () => {
  it('años con obras vistas más el actual, del más reciente al más antiguo', () => {
    const items = [
      obra({ vistaEn: ms(2024, 5, 1) }),
      obra({ vistaEn: ms(2026, 1, 1) }),
      obra({ vistaEn: ms(2024, 9, 1) }),
    ];
    expect(aniosDisponibles(items, 2026)).toEqual([2026, 2024]);
  });

  it('sin obras vistas solo aparece el año actual', () => {
    expect(aniosDisponibles([], 2026)).toEqual([2026]);
    expect(aniosDisponibles([obra({ estado: 'por_ver', vistaEn: null })], 2026)).toEqual([2026]);
  });

  it('obras solo de un año anterior: ese año y el actual', () => {
    expect(aniosDisponibles([obra({ vistaEn: ms(2023, 8, 8) })], 2026)).toEqual([2026, 2023]);
  });

  it('una fecha futura por reloj adelantado también aparece (PA-8)', () => {
    expect(aniosDisponibles([obra({ vistaEn: ms(2027, 1, 2) })], 2026)).toEqual([2027, 2026]);
  });
});
