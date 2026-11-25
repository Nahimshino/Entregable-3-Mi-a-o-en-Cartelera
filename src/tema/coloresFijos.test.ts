import { readdirSync, readFileSync } from 'node:fs';
import { join, relative, sep } from 'node:path';
import { describe, expect, it } from 'vitest';

// Sensor de DESIGN.md: los colores solo se escriben en src/tema/. Cualquier hex (#abc, #aabbcc, #aabbccdd)
// o rgb()/rgba() en otro archivo de código hace fallar este test y lo lista con archivo y línea.
const RAIZ = join(__dirname, '..', '..');
const CARPETAS = ['src', 'App.tsx', 'index.ts'];
const PERMITIDA = join('src', 'tema') + sep;
const COLOR = /#[0-9a-fA-F]{8}\b|#[0-9a-fA-F]{6}\b|#[0-9a-fA-F]{3}\b|rgba?\(/g;

function archivosDeCodigo(ruta: string): string[] {
  const completa = join(RAIZ, ruta);
  if (/\.(ts|tsx)$/.test(ruta)) return [completa];
  try {
    return readdirSync(completa, { withFileTypes: true }).flatMap((e) =>
      archivosDeCodigo(relative(RAIZ, join(completa, e.name))),
    );
  } catch {
    return [];
  }
}

export function buscarColoresFijos(): string[] {
  return CARPETAS.flatMap(archivosDeCodigo)
    .filter((archivo) => !relative(RAIZ, archivo).startsWith(PERMITIDA))
    .flatMap((archivo) =>
      readFileSync(archivo, 'utf8')
        .split('\n')
        .flatMap((linea, i) => [...linea.matchAll(COLOR)].map((m) => `${relative(RAIZ, archivo)}:${i + 1}  ${m[0]}`)),
    );
}

describe('colores fijos (DESIGN.md)', () => {
  it('ningún archivo fuera de src/tema/ escribe un color', () => {
    expect(buscarColoresFijos()).toEqual([]);
  });
});
