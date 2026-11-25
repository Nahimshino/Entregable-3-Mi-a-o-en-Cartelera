import { StyleSheet, Text, View } from 'react-native';
import { colores, espacio, peso, radio, tipo, tracking } from '../tema';

interface Props {
  valor: string;
  etiqueta: string;
  nota?: string;
  /** El valor es texto (género, director) y no una cifra: se muestra más chico. */
  esTexto?: boolean;
}

/** DESIGN.md §3: cifra grande del resumen con su etiqueta y una nota opcional. */
export function TarjetaDato({ valor, etiqueta, nota, esTexto }: Props) {
  return (
    <View style={styles.tarjeta} accessible accessibilityLabel={`${etiqueta}: ${valor}${nota ? `. ${nota}` : ''}`}>
      <Text style={[styles.valor, esTexto && styles.valorTexto]} numberOfLines={2}>
        {valor}
      </Text>
      <Text style={styles.etiqueta}>{etiqueta}</Text>
      {nota ? <Text style={styles.nota}>{nota}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  tarjeta: {
    flex: 1,
    backgroundColor: colores.superficie,
    borderRadius: radio.tarjeta,
    padding: espacio.l,
    gap: espacio.xs,
  },
  valor: {
    color: colores.dato,
    fontSize: tipo.dato,
    letterSpacing: tracking.dato,
    fontWeight: peso.bold,
    fontVariant: ['tabular-nums'],
  },
  valorTexto: { fontSize: tipo.destacado, letterSpacing: tracking.destacado, fontWeight: peso.bold },
  etiqueta: { color: colores.textoSuave, fontSize: tipo.secundario, letterSpacing: tracking.secundario },
  nota: { color: colores.textoSuave, fontSize: tipo.nota, letterSpacing: tracking.nota, marginTop: espacio.xs },
});
