import type { ElementoLista } from '../types/lista';
import { aMilisegundos, anioLocal, mesLocal } from './fechas';

export interface Top {
  nombre: string;
  obras: number;
}

export interface ResumenAnual {
  anio: number;
  totalObras: number;
  peliculas: number;
  series: number;
  /** Horas de películas con un decimal (D7). */
  horas: number;
  /** Películas con datos de TMDB pero sin duración (D7). */
  peliculasSinDuracion: number;
  /** Obras sin datos de TMDB (D6). */
  obrasSinDatos: number;
  generoTop: Top | null;
  directorTop: Top | null;
  /** 12 posiciones, enero = 0 (D10). */
  obrasPorMes: number[];
  mesTop: number | null;
  destacada: ElementoLista | null;
}

interface ObraVista {
  item: ElementoLista;
  vistaEn: number;
}

/** D3: solo cuentan las obras en estado vista con una fecha de visionado utilizable. */
function obrasVistas(items: ElementoLista[]): ObraVista[] {
  return items.flatMap((item) => {
    if (item.estado !== 'vista') return [];
    const vistaEn = aMilisegundos(item.vistaEn);
    return vistaEn === null ? [] : [{ item, vistaEn }];
  });
}

/** D6: una obra sin géneros guardados nunca recibió los datos de TMDB. */
export function tieneDatosTmdb(item: ElementoLista): boolean {
  return Array.isArray(item.generos);
}

/** D4: años con obras vistas más el actual, del más reciente al más antiguo. */
export function aniosDisponibles(items: ElementoLista[], anioActual: number): number[] {
  const anios = new Set<number>([anioActual]);
  for (const { vistaEn } of obrasVistas(items)) anios.add(anioLocal(vistaEn));
  return [...anios].sort((a, b) => b - a);
}

/**
 * D8 y D9: gana el nombre con más obras; empate → mayor promedio de calificación personal entre sus
 * obras calificadas (sin calificadas pierde); empate → orden alfabético en español.
 */
function masVisto(grupos: Map<string, ElementoLista[]>): Top | null {
  const candidatos = [...grupos].map(([nombre, obras]) => {
    const notas = obras.map((o) => o.calificacionPersonal).filter((n): n is number => n !== null);
    const promedio = notas.length > 0 ? notas.reduce((a, b) => a + b, 0) / notas.length : -Infinity;
    return { nombre, obras: obras.length, promedio };
  });
  candidatos.sort((a, b) => b.obras - a.obras || b.promedio - a.promedio || a.nombre.localeCompare(b.nombre, 'es'));
  const ganador = candidatos[0];
  return ganador ? { nombre: ganador.nombre, obras: ganador.obras } : null;
}

function agrupar(obras: ElementoLista[], nombres: (o: ElementoLista) => string[]): Map<string, ElementoLista[]> {
  const grupos = new Map<string, ElementoLista[]>();
  for (const obra of obras) {
    // Cada obra suma 1 a cada nombre, aunque TMDB lo repita.
    for (const nombre of new Set(nombres(obra))) {
      grupos.set(nombre, [...(grupos.get(nombre) ?? []), obra]);
    }
  }
  return grupos;
}

/** D11: mayor calificación; empate → vistaEn más reciente; empate → título (PA-6). */
function obraDestacada(vistas: ObraVista[]): ElementoLista | null {
  const calificadas = vistas.filter(({ item }) => item.calificacionPersonal !== null);
  calificadas.sort(
    (a, b) =>
      (b.item.calificacionPersonal ?? 0) - (a.item.calificacionPersonal ?? 0) ||
      b.vistaEn - a.vistaEn ||
      a.item.titulo.localeCompare(b.item.titulo, 'es'),
  );
  return calificadas[0]?.item ?? null;
}

/** D10: el mes con más obras; empate → el más reciente. null si el año está vacío. */
function mesMasActivo(obrasPorMes: number[]): number | null {
  const maximo = Math.max(...obrasPorMes);
  return maximo > 0 ? obrasPorMes.lastIndexOf(maximo) : null;
}

/** D3, D6 a D11: resumen de las obras vistas en un año. */
export function resumenAnual(items: ElementoLista[], anio: number): ResumenAnual {
  const vistas = obrasVistas(items).filter(({ vistaEn }) => anioLocal(vistaEn) === anio);
  const obras = vistas.map(({ item }) => item);
  const conDatos = obras.filter(tieneDatosTmdb);
  const peliculasConDatos = conDatos.filter((o) => o.tipo === 'movie');

  // D7: solo películas con duración válida suman; las series nunca (PA-5).
  const minutos = peliculasConDatos.reduce(
    (total, o) => total + (o.duracionMin && o.duracionMin > 0 ? o.duracionMin : 0),
    0,
  );

  const obrasPorMes = Array.from({ length: 12 }, () => 0);
  for (const { vistaEn } of vistas) obrasPorMes[mesLocal(vistaEn)] += 1;

  return {
    anio,
    totalObras: obras.length,
    peliculas: obras.filter((o) => o.tipo === 'movie').length,
    series: obras.filter((o) => o.tipo === 'tv').length,
    horas: Math.round((minutos / 60) * 10) / 10,
    peliculasSinDuracion: peliculasConDatos.filter((o) => !(o.duracionMin && o.duracionMin > 0)).length,
    obrasSinDatos: obras.length - conDatos.length,
    generoTop: masVisto(agrupar(conDatos, (o) => o.generos ?? [])),
    directorTop: masVisto(agrupar(peliculasConDatos, (o) => o.directores ?? [])),
    obrasPorMes,
    mesTop: mesMasActivo(obrasPorMes),
    destacada: obraDestacada(vistas),
  };
}
