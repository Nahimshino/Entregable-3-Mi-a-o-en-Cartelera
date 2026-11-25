import { ActivityIndicator, Pressable, StyleSheet, Text, type StyleProp, type ViewStyle } from 'react-native';
import { ALTURA_TOCABLE, colores, espacio, peso, radio, tipo, tracking } from '../tema';

type Variante = 'primario' | 'secundario' | 'peligro';

interface Props {
  titulo: string;
  onPress: () => void;
  variante?: Variante;
  cargando?: boolean;
  deshabilitado?: boolean;
  estilo?: StyleProp<ViewStyle>;
}

/** DESIGN.md §3: píldora llena (primario) o con contorno (secundario y peligro). Sin sombra. */
const LLENO: Record<Variante, boolean> = { primario: true, secundario: false, peligro: false };

export function Boton({ titulo, onPress, variante = 'primario', cargando, deshabilitado, estilo }: Props) {
  const inactivo = deshabilitado || cargando;
  const lleno = LLENO[variante];
  const colorTexto = lleno ? colores.textoSobrePrimario : colores.texto;
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled: !!inactivo, busy: !!cargando }}
      onPress={onPress}
      disabled={inactivo}
      style={({ pressed }) => [
        styles.base,
        lleno ? styles.lleno : styles.contorno,
        { opacity: inactivo ? 0.5 : pressed ? 0.8 : 1 },
        estilo,
      ]}
    >
      {cargando ? (
        <ActivityIndicator color={colorTexto} />
      ) : (
        <Text style={[styles.texto, { color: colorTexto }]}>{titulo}</Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    minHeight: ALTURA_TOCABLE + espacio.xs,
    borderRadius: radio.boton,
    paddingHorizontal: espacio.xl,
    alignItems: 'center',
    justifyContent: 'center',
  },
  lleno: { backgroundColor: colores.primario },
  contorno: { backgroundColor: 'transparent', borderWidth: 1, borderColor: colores.primario },
  texto: { fontSize: tipo.nota, letterSpacing: tracking.nota, fontWeight: peso.bold, textTransform: 'uppercase' },
});
