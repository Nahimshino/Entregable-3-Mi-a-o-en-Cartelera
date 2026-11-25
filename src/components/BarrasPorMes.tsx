import { StyleSheet, Text, View } from 'react-native';
import { colores, espacio, peso, radio, tipo, tracking } from '../tema';
import { INICIALES_MES, NOMBRES_MES, plural } from '../utils/formato';

interface Props {
  /** 12 posiciones, enero = 0 (D10). */
  obrasPorMes: number[];
  mesTop: number | null;
}

const ALTO_MAXIMO = 80;
const ALTO_CERO = 3;

/** DESIGN.md §3: 12 barras hechas con View, sin librerías de gráficas (D10). */
export function BarrasPorMes({ obrasPorMes, mesTop }: Props) {
  const maximo = Math.max(1, ...obrasPorMes);
  return (
    <View style={styles.tarjeta}>
      <Text style={styles.titulo}>
        {mesTop === null ? 'Sin obras por mes' : `Mes más activo: ${NOMBRES_MES[mesTop]}`}
      </Text>
      <View style={styles.fila}>
        {obrasPorMes.map((n, mes) => (
          <View
            key={mes}
            style={styles.columna}
            accessible
            accessibilityLabel={`${NOMBRES_MES[mes]}: ${plural(n, 'obra')}${mes === mesTop ? ', el mes más activo' : ''}`}
          >
            <View
              style={[
                styles.barra,
                { height: n === 0 ? ALTO_CERO : Math.max(ALTO_CERO, (n / maximo) * ALTO_MAXIMO) },
                n === 0 ? styles.barraCero : mes === mesTop ? styles.barraTop : null,
              ]}
            />
            <Text style={[styles.mes, mes === mesTop && styles.mesTop]}>{INICIALES_MES[mes]}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  tarjeta: { backgroundColor: colores.superficie, borderRadius: radio.tarjeta, padding: espacio.l, gap: espacio.m },
  titulo: { color: colores.texto, fontSize: tipo.cuerpo, letterSpacing: tracking.cuerpo, fontWeight: peso.bold },
  fila: { flexDirection: 'row', alignItems: 'flex-end', gap: espacio.xs, height: ALTO_MAXIMO + tipo.nota + espacio.l },
  columna: { flex: 1, alignItems: 'center', justifyContent: 'flex-end', gap: espacio.xs },
  barra: {
    width: '100%',
    backgroundColor: colores.barra,
    borderTopLeftRadius: radio.chico,
    borderTopRightRadius: radio.chico,
  },
  barraCero: { backgroundColor: colores.barraVacia },
  barraTop: { backgroundColor: colores.primario },
  mes: { color: colores.textoSuave, fontSize: tipo.nota, letterSpacing: tracking.nota },
  mesTop: { color: colores.primario, fontWeight: peso.bold },
});
