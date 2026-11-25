import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { afterAll, beforeAll, beforeEach, describe, it } from 'vitest';
import {
  assertFails,
  assertSucceeds,
  initializeTestEnvironment,
  type RulesTestEnvironment,
} from '@firebase/rules-unit-testing';
import { deleteField, doc, getDoc, serverTimestamp, setDoc, Timestamp, updateDoc } from 'firebase/firestore';

// Sensor de firestore.rules (spec 01, §6). Corre contra el emulador: npm run test:reglas.
let entorno: RulesTestEnvironment;

const RUTA = (uid: string, id = 'movie_550') => `usuarios/${uid}/mi_lista/${id}`;

/** Documento tal como lo crea la app al agregar una película (D5). */
function nuevaPelicula(extra: Record<string, unknown> = {}) {
  return {
    tmdbId: 550,
    tipo: 'movie',
    titulo: 'El club de la pelea',
    anio: '1999',
    posterPath: null,
    estado: 'por_ver',
    calificacionPersonal: null,
    comentario: '',
    agregadoEn: serverTimestamp(),
    actualizadoEn: serverTimestamp(),
    vistaEn: null,
    generos: ['Drama'],
    duracionMin: 139,
    directores: ['David Fincher'],
    ...extra,
  };
}

/** Documento del Proyecto 3, sin los campos de la épica. */
const documentoViejo = {
  tmdbId: 550,
  tipo: 'movie',
  titulo: 'El club de la pelea',
  anio: '1999',
  posterPath: null,
  estado: 'vista',
  calificacionPersonal: 5,
  comentario: '',
  agregadoEn: Timestamp.fromMillis(Date.UTC(2025, 0, 1)),
  actualizadoEn: Timestamp.fromMillis(Date.UTC(2025, 5, 1)),
};

const db = (uid: string) => entorno.authenticatedContext(uid).firestore();

beforeAll(async () => {
  entorno = await initializeTestEnvironment({
    projectId: 'demo-cartelera',
    firestore: { rules: readFileSync(join(__dirname, '..', 'firestore.rules'), 'utf8') },
  });
});

afterAll(async () => {
  await entorno.cleanup();
});

beforeEach(async () => {
  await entorno.clearFirestore();
});

/** Siembra un documento saltándose las reglas. */
async function sembrar(uid: string, datos: Record<string, unknown>) {
  await entorno.withSecurityRulesDisabled(async (ctx) => {
    await setDoc(doc(ctx.firestore(), RUTA(uid)), datos);
  });
}

describe('aislamiento entre cuentas', () => {
  it('la dueña crea y lee su obra', async () => {
    await assertSucceeds(setDoc(doc(db('ana'), RUTA('ana')), nuevaPelicula()));
    await assertSucceeds(getDoc(doc(db('ana'), RUTA('ana'))));
  });

  it('otra cuenta no lee ni escribe la lista ajena', async () => {
    await sembrar('ana', documentoViejo);
    await assertFails(getDoc(doc(db('beto'), RUTA('ana'))));
    await assertFails(setDoc(doc(db('beto'), RUTA('ana', 'movie_1')), nuevaPelicula({ tmdbId: 1 })));
    await assertFails(getDoc(doc(entorno.unauthenticatedContext().firestore(), RUTA('ana'))));
  });
});

describe('campos de la épica al crear (D5, 1.6)', () => {
  it('rechaza duracionMin: -5', async () => {
    await assertFails(setDoc(doc(db('ana'), RUTA('ana')), nuevaPelicula({ duracionMin: -5 })));
  });

  it('rechaza duración decimal o mayor a 1000', async () => {
    await assertFails(setDoc(doc(db('ana'), RUTA('ana')), nuevaPelicula({ duracionMin: 90.5 })));
    await assertFails(setDoc(doc(db('ana'), RUTA('ana')), nuevaPelicula({ duracionMin: 1001 })));
  });

  it('rechaza vistaEn en una obra que nace por ver', async () => {
    await assertFails(setDoc(doc(db('ana'), RUTA('ana')), nuevaPelicula({ vistaEn: serverTimestamp() })));
  });

  it('rechaza más de 10 géneros o directores y campos desconocidos', async () => {
    const once = Array.from({ length: 11 }, (_, i) => `G${i}`);
    await assertFails(setDoc(doc(db('ana'), RUTA('ana')), nuevaPelicula({ generos: once })));
    await assertFails(setDoc(doc(db('ana'), RUTA('ana')), nuevaPelicula({ directores: once })));
    await assertFails(setDoc(doc(db('ana'), RUTA('ana')), nuevaPelicula({ trampa: true })));
  });

  it('acepta una serie con duración null y directores vacía', async () => {
    const serie = nuevaPelicula({ tmdbId: 1399, tipo: 'tv', duracionMin: null, directores: [] });
    await assertSucceeds(setDoc(doc(db('ana'), RUTA('ana', 'tv_1399')), serie));
  });
});

describe('vistaEn al actualizar (D1, D2)', () => {
  it('un documento del Proyecto 3 sin campos nuevos se puede seguir editando', async () => {
    await sembrar('ana', documentoViejo);
    await assertSucceeds(
      updateDoc(doc(db('ana'), RUTA('ana')), { comentario: 'Otra vez', actualizadoEn: serverTimestamp() }),
    );
  });

  it('marcar como vista guarda vistaEn con la hora del servidor (D1)', async () => {
    await sembrar('ana', { ...documentoViejo, estado: 'por_ver', calificacionPersonal: null });
    await assertSucceeds(
      updateDoc(doc(db('ana'), RUTA('ana')), {
        estado: 'vista',
        vistaEn: serverTimestamp(),
        actualizadoEn: serverTimestamp(),
      }),
    );
  });

  it('dejar de estar vista con vistaEn todavía puesta es rechazado; con null es aceptado (D1)', async () => {
    await sembrar('ana', { ...documentoViejo, calificacionPersonal: null, vistaEn: Timestamp.now() });
    const ref = doc(db('ana'), RUTA('ana'));
    await assertFails(updateDoc(ref, { estado: 'viendo', actualizadoEn: serverTimestamp() }));
    await assertSucceeds(updateDoc(ref, { estado: 'viendo', vistaEn: null, actualizadoEn: serverTimestamp() }));
  });

  it('la migración fija vistaEn = actualizadoEn anterior (D2) y completa datos de TMDB (D6)', async () => {
    await sembrar('ana', documentoViejo);
    const ref = doc(db('ana'), RUTA('ana'));
    await assertSucceeds(updateDoc(ref, { vistaEn: documentoViejo.actualizadoEn, actualizadoEn: serverTimestamp() }));
    await assertSucceeds(
      updateDoc(ref, {
        generos: ['Drama'],
        duracionMin: 139,
        directores: ['David Fincher'],
        actualizadoEn: serverTimestamp(),
      }),
    );
  });

  it('vistaEn que no es una marca de tiempo es rechazada', async () => {
    await sembrar('ana', documentoViejo);
    await assertFails(updateDoc(doc(db('ana'), RUTA('ana')), { vistaEn: 'ayer', actualizadoEn: serverTimestamp() }));
  });

  it('no se puede borrar un campo obligatorio del Proyecto 3', async () => {
    await sembrar('ana', documentoViejo);
    await assertFails(
      updateDoc(doc(db('ana'), RUTA('ana')), { comentario: deleteField(), actualizadoEn: serverTimestamp() }),
    );
  });
});
