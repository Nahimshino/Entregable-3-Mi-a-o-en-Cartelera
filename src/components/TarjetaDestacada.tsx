import { StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import type { ElementoLista } from '../types/lista';
import { ETIQUETA_TIPO } from '../types/lista';
import { Poster } from './Poster';
import { Estrellas } from './Estrellas';
import { colores, espacio, icono, peso, radio, tipo, tracking } from '../tema';

/**
 * DESIGN.md §3: la obra mejor calificada del año (D11) en una banda negra, como cabeza de cartel.
 * Sin calificadas, una tarjeta clara invita a calificar.
 */
export function TarjetaDestacada({ obra }: { obra: ElementoLista | null }) {
  if (!obra) {
    return (
      <View style={[styles.tarjeta, styles.vacia]}>
        <Ionicons name="star-outline" size={icono.medio} color={colores.texto} />
        <Text style={styles.invitacion}>
          Aún no calificas ninguna obra de este año. Califica una para ver tu destacada.
        </Text>
      </View>
    );
  }
  return (
    <View style={[styles.tarjeta, styles.banda]} accessible accessibilityLabel={`Obra destacada: ${obra.titulo}`}>
      <Poster path={obra.posterPath} ancho={72} />
      <View style={styles.info}>
        <Text style={styles.etiqueta}>OBRA DESTACADA</Text>
        <Text style={styles.titulo} numberOfLines={2}>
          {obra.titulo}
        </Text>
        <Text style={styles.meta}>
          {ETIQUETA_TIPO[obra.tipo]} · {obra.anio || 'Sin año'}
        </Text>
        <Estrellas valor={obra.calificacionPersonal} tamano={icono.chico} color={colores.textoSobrePrimario} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  tarjeta: {
    flexDirection: 'row',
    gap: espacio.m,
    alignItems: 'center',
    borderRadius: radio.tarjeta,
    padding: espacio.l,
  },
  banda: { backgroundColor: colores.primario },
  vacia: { backgroundColor: colores.superficie },
  info: { flex: 1, gap: espacio.xs },
  etiqueta: {
    color: colores.textoSobrePrimario,
    fontSize: tipo.nota,
    letterSpacing: tracking.nota,
    fontWeight: peso.bold,
  },
  titulo: {
    color: colores.textoSobrePrimario,
    fontSize: tipo.cuerpo,
    letterSpacing: tracking.cuerpo,
    fontWeight: peso.bold,
  },
  meta: { color: colores.textoSobrePrimario, fontSize: tipo.secundario, letterSpacing: tracking.secundario },
  invitacion: { flex: 1, color: colores.texto, fontSize: tipo.secundario, letterSpacing: tracking.secundario },
});
