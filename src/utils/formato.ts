// Formatos de texto de DESIGN.md §5 (Voz): coma decimal, meses en minúscula y plurales correctos.

export const NOMBRES_MES = [
  'enero',
  'febrero',
  'marzo',
  'abril',
  'mayo',
  'junio',
  'julio',
  'agosto',
  'septiembre',
  'octubre',
  'noviembre',
  'diciembre',
] as const;

export const INICIALES_MES = ['E', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'] as const;

/** 37.5 → "37,5 h"; 2 → "2 h" (D7). */
export function formatearHoras(horas: number): string {
  const redondeadas = Math.round(horas * 10) / 10;
  return `${String(redondeadas).replace('.', ',')} h`;
}

/** plural(1, 'obra') → "1 obra"; plural(2, 'película') → "2 películas". */
export function plural(n: number, singular: string, pluralTexto = `${singular}s`): string {
  return `${n} ${n === 1 ? singular : pluralTexto}`;
}
