import { useCallback, useEffect, useState } from 'react';
import { FlatList, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { obtenerDetalle } from '../services/tmdbService';
import { useCartelera } from '../context/CarteleraContext';
import { Poster } from '../components/Poster';
import { Boton } from '../components/Boton';
import { Cargando, MensajeError } from '../components/Estado';
import type { EstadoPeticion } from '../types/peticion';
import type { DetalleObra } from '../types/tmdb';
import type { AppStackParamList } from '../types/navegacion';
import { ETIQUETA_ESTADO, ETIQUETA_TIPO } from '../types/lista';
import { crearItemId } from '../utils/validaciones';
import { colores, espacio, icono, peso, radio, tipo, tracking } from '../tema';

type Props = NativeStackScreenProps<AppStackParamList, 'Detalle'>;

export function DetalleScreen({ route, navigation }: Props) {
  const { tipo, id } = route.params;
  const { buscarEnLista, agregar } = useCartelera();
  const [peticion, setPeticion] = useState<EstadoPeticion<DetalleObra>>({ estado: 'cargando' });
  const [agregando, setAgregando] = useState(false);
  const [errorAgregar, setErrorAgregar] = useState<string | null>(null);

  const itemId = crearItemId(tipo, id);
  const enLista = buscarEnLista(itemId);

  const cargar = useCallback(async () => {
    setPeticion({ estado: 'cargando' });
    try {
      setPeticion({ estado: 'exito', datos: await obtenerDetalle(tipo, id) });
    } catch (error) {
      setPeticion({ estado: 'error', mensaje: error instanceof Error ? error.message : 'No se pudo cargar.' });
    }
  }, [tipo, id]);

  useEffect(() => {
    void cargar();
  }, [cargar]);

  if (peticion.estado === 'cargando')
    return (
      <View style={styles.pantalla}>
        <Cargando />
      </View>
    );
  if (peticion.estado === 'error') {
    return (
      <View style={styles.pantalla}>
        <MensajeError mensaje={peticion.mensaje} onReintentar={() => void cargar()} />
      </View>
    );
  }

  const obra = peticion.datos;

  const agregarALista = async () => {
    setAgregando(true);
    setErrorAgregar(null);
    try {
      await agregar({
        tmdbId: obra.id,
        tipo: obra.tipo,
        titulo: obra.titulo,
        anio: obra.anio,
        posterPath: obra.posterPath,
        ...obra.datosTmdb, // D5: géneros, duración y directores
      });
    } catch (error) {
      setErrorAgregar(error instanceof Error ? error.message : 'No se pudo agregar.');
    } finally {
      setAgregando(false);
    }
  };

  return (
    <ScrollView style={styles.pantalla} contentContainerStyle={styles.contenido}>
      <View style={styles.cabecera}>
        <Poster path={obra.posterPath} ancho={130} tamano="grande" />
        <View style={styles.datos}>
          <Text style={styles.titulo}>{obra.titulo}</Text>
          <Text style={styles.meta}>
            {ETIQUETA_TIPO[obra.tipo]} · {obra.anio || 'Sin año'}
            {obra.extra ? ` · ${obra.extra}` : ''}
          </Text>
          <View
            style={styles.calificacion}
            accessibilityLabel={`Calificación de TMDB ${obra.calificacion.toFixed(1)} de 10`}
          >
            <Ionicons name="star" size={icono.medio} color={colores.primario} />
            <Text style={styles.textoCalificacion}>
              {obra.votos > 0 ? obra.calificacion.toFixed(1) : '—'}
              <Text style={styles.meta}> / 10</Text>
            </Text>
            <Text style={styles.votos}>
              {obra.votos > 0 ? `${obra.votos.toLocaleString('es-MX')} votos` : 'Sin votos'}
            </Text>
          </View>
          {obra.generos.length > 0 && <Text style={styles.generos}>{obra.generos.join(' · ')}</Text>}
        </View>
      </View>

      {enLista ? (
        <View style={styles.enLista}>
          <Text style={styles.textoEnLista}>
            <Ionicons name="checkmark-circle" size={icono.chico} /> En tu lista · {ETIQUETA_ESTADO[enLista.estado]}
          </Text>
          <Boton
            titulo="Editar mi entrada"
            variante="secundario"
            onPress={() => navigation.navigate('Editar', { itemId })}
          />
        </View>
      ) : (
        <Boton titulo="Agregar a mi lista" onPress={agregarALista} cargando={agregando} />
      )}
      {errorAgregar && <Text style={styles.error}>{errorAgregar}</Text>}

      <Text style={styles.seccion}>Sinopsis</Text>
      <Text style={obra.sinopsis ? styles.sinopsis : styles.sinDatos}>
        {obra.sinopsis || 'Esta obra todavía no tiene sinopsis disponible.'}
      </Text>

      <Text style={styles.seccion}>Elenco</Text>
      {obra.elenco.length === 0 ? (
        <Text style={styles.sinDatos}>No hay información del elenco.</Text>
      ) : (
        <FlatList
          horizontal
          data={obra.elenco}
          keyExtractor={(m) => String(m.id)}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ gap: espacio.m }}
          renderItem={({ item }) => (
            <View style={styles.actor}>
              <Poster path={item.fotoPath} ancho={80} clase="perfil" />
              <Text style={styles.nombreActor} numberOfLines={2}>
                {item.nombre}
              </Text>
              {item.personaje ? (
                <Text style={styles.personaje} numberOfLines={2}>
                  {item.personaje}
                </Text>
              ) : null}
            </View>
          )}
        />
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  pantalla: { flex: 1, backgroundColor: colores.fondo },
  contenido: { padding: espacio.l, gap: espacio.m, paddingBottom: espacio.xl * 2 },
  cabecera: { flexDirection: 'row', gap: espacio.l },
  datos: { flex: 1, gap: espacio.s },
  titulo: { color: colores.texto, fontSize: tipo.subtitulo, letterSpacing: tracking.subtitulo, fontWeight: peso.bold },
  meta: { color: colores.textoSuave, fontSize: tipo.secundario, letterSpacing: tracking.secundario },
  calificacion: { flexDirection: 'row', alignItems: 'center', gap: espacio.xs, flexWrap: 'wrap' },
  textoCalificacion: {
    color: colores.texto,
    fontSize: tipo.subtitulo,
    letterSpacing: tracking.subtitulo,
    fontWeight: peso.bold,
  },
  votos: { color: colores.textoSuave, fontSize: tipo.nota, letterSpacing: tracking.nota, width: '100%' },
  generos: { color: colores.textoSuave, fontSize: tipo.secundario, letterSpacing: tracking.secundario },
  enLista: { gap: espacio.s },
  // Confirmación: la única superficie con color del sistema (DESIGN.md §2.1).
  textoEnLista: {
    alignSelf: 'flex-start',
    backgroundColor: colores.confirmacion,
    color: colores.texto,
    fontSize: tipo.secundario,
    letterSpacing: tracking.secundario,
    fontWeight: peso.bold,
    paddingHorizontal: espacio.l,
    paddingVertical: espacio.s,
    borderRadius: radio.etiqueta,
    overflow: 'hidden',
  },
  error: { color: colores.peligro },
  seccion: {
    color: colores.texto,
    fontSize: tipo.destacado,
    letterSpacing: tracking.destacado,
    fontWeight: peso.bold,
    marginTop: espacio.s,
  },
  sinopsis: { color: colores.texto, fontSize: tipo.cuerpo, letterSpacing: tracking.cuerpo, lineHeight: 22 },
  sinDatos: { color: colores.textoSuave, fontSize: tipo.cuerpo, letterSpacing: tracking.cuerpo, fontStyle: 'italic' },
  actor: { width: 80, gap: espacio.xs },
  nombreActor: { color: colores.texto, fontSize: tipo.nota, letterSpacing: tracking.nota, fontWeight: peso.bold },
  personaje: { color: colores.textoSuave, fontSize: tipo.nota, letterSpacing: tracking.nota },
});
