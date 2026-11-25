import NetInfo from '@react-native-community/netinfo';

/** D13: true si el teléfono tiene red e internet (o si NetInfo no puede saberlo todavía). */
export async function estaConectado(): Promise<boolean> {
  const estado = await NetInfo.fetch();
  return estado.isConnected !== false && estado.isInternetReachable !== false;
}
