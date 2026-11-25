import { StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import type { ElementoLista } from '../types/lista';
import { ETIQUETA_TIPO } from '../types/lista';
import { Poster } from './Poster';
import { Estrellas } from './Estrellas';
import { colores, espacio, icono, peso, radio, tipo } from '../tema';

/** DESIGN.md §3: la obra mejor calificada del año (D11); sin calificadas invita a calificar. */
export function TarjetaDestacada({ obra }: { obra: ElementoLista | null }) {
  if (!obra) {
    return (
      <View style={[styles.tarjeta, styles.vacia]}>
        <Ionicons name="star-outline" size={icono.medio} color={colores.primario} />
        <Text style={styles.invitacion}>
          Aún no calificas ninguna obra de este año. Califica una para ver tu destacada.
        </Text>
      </View>
    );
  }
  return (
    <View style={styles.tarjeta} accessible accessibilityLabel={`Obra destacada: ${obra.titulo}`}>
      <Poster path={obra.posterPath} ancho={72} />
      <View style={styles.info}>
        <Text style={styles.etiqueta}>OBRA DESTACADA</Text>
        <Text style={styles.titulo} numberOfLines={2}>
          {obra.titulo}
        </Text>
        <Text style={styles.meta}>
          {ETIQUETA_TIPO[obra.tipo]} · {obra.anio || 'Sin año'}
        </Text>
        <Estrellas valor={obra.calificacionPersonal} tamano={icono.chico} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  tarjeta: {
    flexDirection: 'row',
    gap: espacio.m,
    alignItems: 'center',
    backgroundColor: colores.superficieAlta,
    borderWidth: 1,
    borderColor: colores.primario,
    borderRadius: radio.grande,
    padding: espacio.m,
  },
  vacia: { borderColor: colores.borde },
  info: { flex: 1, gap: espacio.xxs },
  etiqueta: { color: colores.primario, fontSize: tipo.nota, fontWeight: peso.bold, letterSpacing: 1 },
  titulo: { color: colores.texto, fontSize: tipo.cuerpo, fontWeight: peso.bold },
  meta: { color: colores.textoSuave, fontSize: tipo.secundario },
  invitacion: { flex: 1, color: colores.textoSuave, fontSize: tipo.secundario },
});
