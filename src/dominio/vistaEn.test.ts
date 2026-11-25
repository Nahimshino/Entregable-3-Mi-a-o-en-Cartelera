import { describe, expect, it } from 'vitest';
import { accionVistaEn } from './vistaEn';

describe('accionVistaEn (D1)', () => {
  it.each([
    ['por_ver', 'vista', 'marcar'],
    ['viendo', 'vista', 'marcar'],
    ['vista', 'por_ver', 'borrar'],
    ['vista', 'viendo', 'borrar'],
    ['vista', 'vista', 'conservar'],
    ['por_ver', 'viendo', 'conservar'],
    ['viendo', 'por_ver', 'conservar'],
  ] as const)('de %s a %s → %s', (anterior, nuevo, esperado) => {
    expect(accionVistaEn(anterior, nuevo)).toBe(esperado);
  });
});
