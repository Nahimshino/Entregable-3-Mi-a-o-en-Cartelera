import { useEffect, useMemo, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import type { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { useCartelera, type ProgresoSincronizacion } from '../context/CarteleraContext';
import { AvisoSinConexion, Cargando, MensajeError, Vacio } from '../components/Estado';
import { SelectorAnio } from '../components/SelectorAnio';
import { TarjetaDato } from '../components/TarjetaDato';
import { BarrasPorMes } from '../components/BarrasPorMes';
import { TarjetaDestacada } from '../components/TarjetaDestacada';
import { AvisoSuave } from '../components/AvisoSuave';
import { aniosDisponibles, resumenAnual } from '../dominio/resumenAnual';
import type { PestanasParamList } from '../types/navegacion';
import { formatearHoras, plural } from '../utils/formato';
import { colores, espacio, peso, tipo } from '../tema';

/**
 * Mi año en cine (DESIGN.md §4). La pantalla solo muestra: el cálculo vive en src/dominio/resumenAnual.ts
 * y la sincronización (D2, D6, D13) en el contexto.
 */
export function MiAnioScreen() {
  const navigation = useNavigation<BottomTabNavigationProp<PestanasParamList>>();
  const { lista, estadoLista, copiaSinConexion, recargar, sincronizarAnio } = useCartelera();
  // El año actual se lee aquí, nunca dentro del dominio (1.6).
  const [anioActual] = useState(() => new Date().getFullYear());
  const [anio, setAnio] = useState(anioActual);
  const [progreso, setProgreso] = useState<ProgresoSincronizacion | null>(null);

  const listo = estadoLista.estado === 'exito';
  const anios = useMemo(() => aniosDisponibles(lista, anioActual), [lista, anioActual]);
  const resumen = useMemo(() => resumenAnual(lista, anio), [lista, anio]);

  // Al abrir el resumen o cambiar de año: migrar fechas y completar datos de TMDB del año.
  useEffect(() => {
    if (!listo) return;
    let activo = true;
    void sincronizarAnio(anio, (p) => {
      if (activo) setProgreso(p.hechas < p.total ? p : null);
    }).finally(() => {
      if (activo) setProgreso(null);
    });
    return () => {
      activo = false;
    };
  }, [anio, listo, sincronizarAnio]);

  const renderResumen = () => {
    if (resumen.totalObras === 0) {
      return (
        <Vacio
          icono="film-outline"
          titulo={`No viste nada en ${anio}.`}
          texto="Marca como vista una obra de tu lista y aparecerá aquí."
          accion={{ titulo: 'Ir a Mi lista', onPress: () => navigation.navigate('MiLista') }}
        />
      );
    }
    return (
      <ScrollView contentContainerStyle={styles.contenido}>
        {resumen.obrasSinDatos > 0 && !progreso && (
          <AvisoSuave
            texto={`${plural(resumen.obrasSinDatos, 'obra quedó', 'obras quedaron')} sin datos de TMDB: cuenta${
              resumen.obrasSinDatos === 1 ? '' : 'n'
            } en el total, no en horas, géneros ni directores.`}
          />
        )}
        <View style={styles.fila}>
          <TarjetaDato
            valor={String(resumen.totalObras)}
            etiqueta={resumen.totalObras === 1 ? 'obra vista' : 'obras vistas'}
            nota={`${plural(resumen.peliculas, 'película')} · ${plural(resumen.series, 'serie')}`}
          />
          <TarjetaDato
            valor={formatearHoras(resumen.horas)}
            etiqueta="de cine"
            nota={
              resumen.peliculasSinDuracion > 0
                ? `${plural(resumen.peliculasSinDuracion, 'película')} sin duración no suma${
                    resumen.peliculasSinDuracion === 1 ? '' : 'n'
                  } horas.`
                : undefined
            }
          />
        </View>
        <View style={styles.fila}>
          <TarjetaDato
            esTexto
            valor={resumen.generoTop?.nombre ?? 'Sin datos'}
            etiqueta="género más visto"
            nota={resumen.generoTop ? plural(resumen.generoTop.obras, 'obra') : 'Faltan géneros de TMDB.'}
          />
          <TarjetaDato
            esTexto
            valor={resumen.directorTop?.nombre ?? 'Sin datos'}
            etiqueta="director más visto"
            nota={
              resumen.directorTop
                ? plural(resumen.directorTop.obras, 'película')
                : 'No hay datos suficientes para saber tu director favorito.'
            }
          />
        </View>
        <BarrasPorMes obrasPorMes={resumen.obrasPorMes} mesTop={resumen.mesTop} />
        <TarjetaDestacada obra={resumen.destacada} />
      </ScrollView>
    );
  };

  const renderContenido = () => {
    switch (estadoLista.estado) {
      case 'cargando':
        return <Cargando texto="Cargando tu año…" />;
      case 'error':
        return <MensajeError mensaje={estadoLista.mensaje} onReintentar={() => void recargar()} />;
      case 'exito':
        return renderResumen();
    }
  };

  return (
    <SafeAreaView style={styles.pantalla} edges={['top']}>
      {copiaSinConexion !== null && <AvisoSinConexion fecha={copiaSinConexion} />}
      <Text style={styles.encabezado} accessibilityRole="header">
        Mi año
      </Text>
      {listo && <SelectorAnio anios={anios} seleccionado={anio} onCambiar={setAnio} />}
      {progreso && (
        <View style={styles.avisos}>
          <AvisoSuave
            texto={`Completando datos de TMDB: ${progreso.hechas + 1} de ${progreso.total}…`}
            progreso={progreso.hechas / progreso.total}
          />
        </View>
      )}
      {renderContenido()}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  pantalla: { flex: 1, backgroundColor: colores.fondo },
  encabezado: {
    color: colores.texto,
    fontSize: tipo.titulo,
    fontWeight: peso.extra,
    paddingHorizontal: espacio.l,
    paddingTop: espacio.s,
  },
  avisos: { paddingHorizontal: espacio.l },
  contenido: { padding: espacio.l, gap: espacio.m },
  fila: { flexDirection: 'row', gap: espacio.m },
});
