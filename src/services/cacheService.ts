import AsyncStorage from '@react-native-async-storage/async-storage';
import type { ElementoLista } from '../types/lista';
import { aMilisegundos } from '../dominio/fechas';

interface CacheLista {
  guardadoEn: number;
  elementos: ElementoLista[];
}

const clave = (uid: string) => `@cartelera/lista/${uid}`;

export async function guardarCache(uid: string, elementos: ElementoLista[]): Promise<void> {
  // Los Timestamp de Firestore no son JSON: se guardan como milisegundos (también vistaEn, D13).
  const datos: CacheLista = {
    guardadoEn: Date.now(),
    elementos: elementos.map((e) => ({
      ...e,
      agregadoEn: aMilisegundos(e.agregadoEn),
      actualizadoEn: aMilisegundos(e.actualizadoEn),
      vistaEn: aMilisegundos(e.vistaEn),
    })),
  };
  try {
    await AsyncStorage.setItem(clave(uid), JSON.stringify(datos));
  } catch {
    // Si no se puede escribir la caché, la app sigue funcionando con Firestore.
  }
}

export async function leerCache(uid: string): Promise<CacheLista | null> {
  try {
    const texto = await AsyncStorage.getItem(clave(uid));
    return texto ? (JSON.parse(texto) as CacheLista) : null;
  } catch {
    return null;
  }
}
