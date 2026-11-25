import { describe, expect, it } from 'vitest';
import { formatearHoras, INICIALES_MES, NOMBRES_MES, plural } from './formato';

describe('formatearHoras (D7, voz)', () => {
  it('usa coma decimal y un decimal como máximo', () => {
    expect(formatearHoras(37.5)).toBe('37,5 h');
    expect(formatearHoras(3.58)).toBe('3,6 h');
    expect(formatearHoras(2)).toBe('2 h');
    expect(formatearHoras(0)).toBe('0 h');
  });
});

describe('plural', () => {
  it('concuerda con el número', () => {
    expect(plural(1, 'obra')).toBe('1 obra');
    expect(plural(0, 'obra')).toBe('0 obras');
    expect(plural(2, 'película')).toBe('2 películas');
    expect(plural(3, 'mes', 'meses')).toBe('3 meses');
  });
});

describe('meses', () => {
  it('hay 12 nombres en minúscula y 12 iniciales', () => {
    expect(NOMBRES_MES).toHaveLength(12);
    expect(INICIALES_MES).toHaveLength(12);
    expect(NOMBRES_MES[6]).toBe('julio');
  });
});
