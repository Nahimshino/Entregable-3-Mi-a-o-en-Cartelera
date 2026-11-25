import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import * as tema from './index';

// Sensor de la cadena brand board → DESIGN.md → src/tema: cada token que DESIGN.md declara debe existir en
// src/tema con el mismo valor. Si alguien cambia uno sin el otro, este test falla.
const DESIGN = readFileSync(join(__dirname, '..', '..', 'DESIGN.md'), 'utf8');
const tokens = tema as unknown as Record<string, Record<string, unknown> | number>;

function grupo(nombre: string): Record<string, unknown> {
  const valor = tokens[nombre];
  return typeof valor === 'object' && valor !== null ? valor : {};
}

/** Filas `| \`nombre\` | \`#hex\` |` de la paleta. */
function paletaDeclarada(): Record<string, string> {
  return Object.fromEntries([...DESIGN.matchAll(/^\| `([a-z]+)` +\| `(#[0-9a-f]{6})`/gm)].map((m) => [m[1], m[2]]));
}

/** Pares rol → paleta de la tabla de roles (dos pares por fila). */
function rolesDeclarados(): Record<string, string> {
  const seccion = DESIGN.slice(DESIGN.indexOf('**Roles'), DESIGN.indexOf('**Estados y error'));
  return Object.fromEntries([...seccion.matchAll(/`([a-zA-Z]+)` +\| `([a-z]+)`/g)].map((m) => [m[1], m[2]]));
}

/** Filas de la tabla de tipografía: token, tamaño, interlineado. */
function tipografiaDeclarada(): { token: string; tamano: number; interlineado: number }[] {
  return [...DESIGN.matchAll(/^\| `([a-z]+)` +\| (\d+) +\| (\d+)/gm)].map((m) => ({
    token: m[1],
    tamano: Number(m[2]),
    interlineado: Number(m[3]),
  }));
}

/** Pares `nombre` valor de una fila de la tabla de espacio/forma, por ejemplo «`xs` 4 · `s` 8». */
function escala(etiqueta: string): Record<string, number> {
  const fila = DESIGN.split('\n').find((l) => l.includes(etiqueta)) ?? '';
  return Object.fromEntries([...fila.matchAll(/`([a-z]+)` (\d+)/g)].map((m) => [m[1], Number(m[2])]));
}

describe('DESIGN.md = src/tema', () => {
  it('la paleta tiene los mismos valores', () => {
    const declarada = paletaDeclarada();
    expect(Object.keys(declarada).length).toBeGreaterThanOrEqual(8);
    expect(grupo('paleta')).toEqual(declarada);
  });

  it('cada rol apunta al color de la paleta que dice DESIGN.md', () => {
    const roles = rolesDeclarados();
    const paleta = paletaDeclarada();
    expect(Object.keys(roles).length).toBeGreaterThanOrEqual(20);
    const esperado = Object.fromEntries(Object.entries(roles).map(([rol, ref]) => [rol, paleta[ref]]));
    expect(grupo('colores')).toEqual(esperado);
  });

  it('tamaños e interlineados de la tipografía', () => {
    const filas = tipografiaDeclarada();
    expect(filas.length).toBeGreaterThanOrEqual(9);
    for (const { token, tamano, interlineado } of filas) {
      expect(grupo('tipo')[token], `tipo.${token}`).toBe(tamano);
      expect(grupo('interlineado')[token], `interlineado.${token}`).toBe(interlineado);
    }
  });

  it('tracking de 0,06 em en todo salvo el display', () => {
    for (const { token, tamano } of tipografiaDeclarada()) {
      const esperado = token === 'display' ? 0 : Math.round(tamano * 0.06 * 100) / 100;
      expect(grupo('tracking')[token], `tracking.${token}`).toBe(esperado);
    }
  });

  it('pesos: solo 300, 400 y 700', () => {
    expect(grupo('peso')).toEqual({ ligero: '300', normal: '400', bold: '700' });
  });

  it('espacios, radios e íconos', () => {
    expect(grupo('espacio')).toEqual(escala('Espacio (`espacio`)'));
    expect(grupo('radio')).toEqual(escala('**Radio (`radio`)**'));
    expect(grupo('icono')).toEqual(escala('**Ícono (`icono`)**'));
    expect(tokens.ALTURA_TOCABLE).toBe(44);
  });
});
