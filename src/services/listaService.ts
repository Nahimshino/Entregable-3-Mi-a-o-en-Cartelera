import {
  collection,
  deleteDoc,
  doc,
  getDocFromServer,
  getDocsFromServer,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  Timestamp,
  updateDoc,
  type DocumentData,
  type QueryDocumentSnapshot,
} from 'firebase/firestore';
import { db } from './firebaseConfig';
import type { CambiosElemento, DatosTmdb, ElementoLista, NuevoElemento } from '../types/lista';
import type { AccionVistaEn } from '../dominio/vistaEn';
import { crearItemId } from '../utils/validaciones';
import { conTiempoLimite } from '../utils/tiempoLimite';

export class DuplicadoError extends Error {
  constructor() {
    super('Esta obra ya está en tu lista.');
    this.name = 'DuplicadoError';
  }
}

function coleccionLista(uid: string) {
  return collection(db, 'usuarios', uid, 'mi_lista');
}

function docLista(uid: string, itemId: string) {
  return doc(db, 'usuarios', uid, 'mi_lista', itemId);
}

function listaDeTextos(valor: unknown): string[] | undefined {
  return Array.isArray(valor) ? valor.filter((v): v is string => typeof v === 'string') : undefined;
}

function aElemento(snap: QueryDocumentSnapshot<DocumentData>): ElementoLista {
  const d = snap.data();
  const elemento: ElementoLista = {
    id: snap.id,
    tmdbId: d.tmdbId,
    tipo: d.tipo,
    titulo: d.titulo,
    anio: d.anio,
    posterPath: d.posterPath ?? null,
    estado: d.estado,
    calificacionPersonal: d.calificacionPersonal ?? null,
    comentario: d.comentario ?? '',
    agregadoEn: d.agregadoEn ?? null,
    actualizadoEn: d.actualizadoEn ?? null,
    vistaEn: d.vistaEn ?? null,
  };
  // Los campos de TMDB solo se copian si existen: su ausencia significa «sin datos» (D6).
  const generos = listaDeTextos(d.generos);
  if (generos) {
    elemento.generos = generos;
    elemento.duracionMin = typeof d.duracionMin === 'number' ? d.duracionMin : null;
    elemento.directores = listaDeTextos(d.directores) ?? [];
  }
  return elemento;
}

/** Lee la lista desde el servidor (falla rápido sin conexión para poder usar la caché). */
export async function obtenerLista(uid: string): Promise<ElementoLista[]> {
  const q = query(coleccionLista(uid), orderBy('agregadoEn', 'desc'));
  const snap = await conTiempoLimite(getDocsFromServer(q));
  return snap.docs.map(aElemento);
}

/** Crea la entrada con estado inicial "por_ver" y los datos de TMDB (D5). El id tipo_tmdbId impide duplicados. */
export async function agregarElemento(uid: string, obra: NuevoElemento): Promise<ElementoLista> {
  const id = crearItemId(obra.tipo, obra.tmdbId);
  const ref = docLista(uid, id);

  const existente = await conTiempoLimite(getDocFromServer(ref));
  if (existente.exists()) throw new DuplicadoError();

  const elemento: Omit<ElementoLista, 'id'> = {
    ...obra,
    estado: 'por_ver',
    calificacionPersonal: null,
    comentario: '',
    vistaEn: null,
  };
  await conTiempoLimite(setDoc(ref, { ...elemento, agregadoEn: serverTimestamp(), actualizadoEn: serverTimestamp() }));
  return { id, ...elemento, agregadoEn: Date.now(), actualizadoEn: Date.now() };
}

/** D1: la acción de vistaEn la decide el dominio (accionVistaEn); aquí solo se traduce a Firestore. */
export async function actualizarElemento(
  uid: string,
  itemId: string,
  cambios: CambiosElemento,
  accion: AccionVistaEn,
): Promise<void> {
  const vistaEn = accion === 'marcar' ? { vistaEn: serverTimestamp() } : accion === 'borrar' ? { vistaEn: null } : {};
  await conTiempoLimite(updateDoc(docLista(uid, itemId), { ...cambios, ...vistaEn, actualizadoEn: serverTimestamp() }));
}

/** D2: fija vistaEn de una obra vista antes de la épica. */
export async function migrarVistaEn(uid: string, itemId: string, vistaEnMs: number): Promise<void> {
  await conTiempoLimite(
    updateDoc(docLista(uid, itemId), { vistaEn: Timestamp.fromMillis(vistaEnMs), actualizadoEn: serverTimestamp() }),
  );
}

/** D6: guarda los datos de TMDB de una obra que no los tenía. */
export async function guardarDatosTmdb(uid: string, itemId: string, datos: DatosTmdb): Promise<void> {
  await conTiempoLimite(
    updateDoc(docLista(uid, itemId), {
      generos: datos.generos,
      duracionMin: datos.duracionMin,
      directores: datos.directores,
      actualizadoEn: serverTimestamp(),
    }),
  );
}

export async function eliminarElemento(uid: string, itemId: string): Promise<void> {
  await conTiempoLimite(deleteDoc(docLista(uid, itemId)));
}
