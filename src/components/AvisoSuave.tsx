import { StyleSheet, Text, View } from 'react-native';
import { colores, espacio, radio, tipo, tracking } from '../tema';

interface Props {
  texto: string;
  /** De 0 a 1; si se indica, se dibuja una barra de progreso (D6). */
  progreso?: number;
}

const ALTO_PROGRESO = 6;

/** DESIGN.md §3: aviso discreto para progreso y datos faltantes. */
export function AvisoSuave({ texto, progreso }: Props) {
  return (
    <View style={styles.aviso} accessibilityRole="alert">
      <Text style={styles.texto}>{texto}</Text>
      {progreso !== undefined && (
        <View
          style={styles.pista}
          accessibilityRole="progressbar"
          accessibilityValue={{ min: 0, max: 100, now: Math.round(progreso * 100) }}
        >
          <View style={[styles.relleno, { width: `${Math.min(100, Math.max(0, progreso * 100))}%` }]} />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  aviso: {
    backgroundColor: colores.superficie,
    borderLeftWidth: 3,
    borderLeftColor: colores.aviso,
    borderRadius: radio.chico,
    paddingVertical: espacio.s,
    paddingHorizontal: espacio.m,
    gap: espacio.s,
  },
  texto: { color: colores.textoSuave, fontSize: tipo.secundario, letterSpacing: tracking.secundario },
  pista: {
    height: ALTO_PROGRESO,
    backgroundColor: colores.barraVacia,
    borderRadius: ALTO_PROGRESO / 2,
    overflow: 'hidden',
  },
  relleno: { height: '100%', backgroundColor: colores.primario },
});
