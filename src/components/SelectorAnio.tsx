import { ScrollView, StyleSheet } from 'react-native';
import { Chip } from './Chip';
import { espacio } from '../tema';

interface Props {
  /** Del más reciente al más antiguo (D4). */
  anios: number[];
  seleccionado: number;
  onCambiar: (anio: number) => void;
}

/** DESIGN.md §3: fila horizontal de chips de año. */
export function SelectorAnio({ anios, seleccionado, onCambiar }: Props) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      style={styles.fila}
      contentContainerStyle={styles.contenido}
      accessibilityLabel="Elegir año"
    >
      {anios.map((anio) => (
        <Chip key={anio} texto={String(anio)} activo={anio === seleccionado} onPress={() => onCambiar(anio)} />
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  fila: { flexGrow: 0 },
  contenido: { gap: espacio.s, paddingHorizontal: espacio.l, paddingVertical: espacio.s },
});
