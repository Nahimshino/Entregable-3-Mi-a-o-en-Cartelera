import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Boton } from './Boton';
import { colores, espacio, icono, peso, tipo, tracking } from '../tema';

// En Vacio la prop `icono` es el nombre del ícono; el tamaño se toma antes para no confundirlos.
const TAMANO_ICONO_VACIO = icono.grande;

export function Cargando({ texto = 'Cargando…' }: { texto?: string }) {
  return (
    <View style={styles.centro}>
      <ActivityIndicator size="large" color={colores.primario} />
      <Text style={styles.texto}>{texto}</Text>
    </View>
  );
}

export function MensajeError({ mensaje, onReintentar }: { mensaje: string; onReintentar?: () => void }) {
  return (
    <View style={styles.centro}>
      <Ionicons name="alert-circle-outline" size={icono.grande} color={colores.peligro} />
      <Text style={styles.texto}>{mensaje}</Text>
      {onReintentar && <Boton titulo="Reintentar" variante="secundario" onPress={onReintentar} />}
    </View>
  );
}

export function Vacio({
  icono,
  titulo,
  texto,
  accion,
}: {
  icono: keyof typeof Ionicons.glyphMap;
  titulo: string;
  texto?: string;
  /** Botón opcional, por ejemplo «Ir a Mi lista» en un año vacío (D12). */
  accion?: { titulo: string; onPress: () => void };
}) {
  return (
    <View style={styles.centro}>
      <Ionicons name={icono} size={TAMANO_ICONO_VACIO} color={colores.textoSuave} />
      <Text style={styles.titulo}>{titulo}</Text>
      {texto && <Text style={styles.texto}>{texto}</Text>}
      {accion && <Boton titulo={accion.titulo} onPress={accion.onPress} />}
    </View>
  );
}

export function AvisoSinConexion({ fecha }: { fecha: number }) {
  const cuando = new Date(fecha).toLocaleString('es-MX', { dateStyle: 'short', timeStyle: 'short' });
  return (
    <View style={styles.aviso} accessibilityRole="alert">
      <Ionicons name="cloud-offline-outline" size={icono.medio} color={colores.fondo} />
      <Text style={styles.textoAviso}>Sin conexión. Mostrando la última copia guardada ({cuando}).</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  centro: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: espacio.xl, gap: espacio.m },
  titulo: {
    color: colores.texto,
    fontSize: tipo.destacado,
    letterSpacing: tracking.destacado,
    fontWeight: peso.bold,
    textAlign: 'center',
  },
  texto: { color: colores.textoSuave, fontSize: tipo.cuerpo, letterSpacing: tracking.cuerpo, textAlign: 'center' },
  aviso: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: espacio.s,
    backgroundColor: colores.aviso,
    paddingHorizontal: espacio.l,
    paddingVertical: espacio.s,
  },
  textoAviso: { color: colores.fondo, fontWeight: peso.bold, flex: 1 },
});
