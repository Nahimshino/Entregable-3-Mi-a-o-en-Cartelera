import { useState } from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { urlImagen } from '../services/tmdbService';
import type { TamanoImagen } from '../types/tmdb';
import { colores, espacio, radio, tipo, tracking } from '../tema';

interface Props {
  path: string | null;
  ancho: number;
  tamano?: TamanoImagen;
  clase?: 'poster' | 'perfil';
}

/** Póster de TMDB con imagen de relleno si no hay ruta o si la descarga falla. */
export function Poster({ path, ancho, tamano = 'chico', clase = 'poster' }: Props) {
  const [fallo, setFallo] = useState(false);
  const uri = urlImagen(path, tamano, clase);
  const dimensiones = { width: ancho, height: ancho * 1.5, borderRadius: radio.tarjeta };

  if (!uri || fallo) {
    return (
      <View style={[styles.relleno, dimensiones]} accessibilityLabel="Sin imagen disponible">
        <Ionicons name={clase === 'perfil' ? 'person' : 'film-outline'} size={ancho / 3} color={colores.textoSuave} />
        {ancho > 60 && <Text style={styles.textoRelleno}>Sin imagen</Text>}
      </View>
    );
  }
  return <Image source={{ uri }} style={[styles.imagen, dimensiones]} onError={() => setFallo(true)} />;
}

const styles = StyleSheet.create({
  imagen: { backgroundColor: colores.superficie },
  relleno: {
    backgroundColor: colores.superficie,
    alignItems: 'center',
    justifyContent: 'center',
    gap: espacio.xs,
  },
  textoRelleno: { color: colores.textoSuave, fontSize: tipo.nota, letterSpacing: tracking.nota },
});
