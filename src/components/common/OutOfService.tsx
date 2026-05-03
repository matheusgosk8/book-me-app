import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  Pressable,
  ActivityIndicator,
  Animated,
  Easing,
  StyleSheet,
  GestureResponderEvent,
} from 'react-native';
import FontAwesome5Icon from 'react-native-vector-icons/FontAwesome5';

type Props = {
  onRetry?: () => void;
  message?: string | null;
};

const OutOfService = ({ onRetry, message }: Props) => {
  const fade = useRef(new Animated.Value(0)).current;
  const slide = useRef(new Animated.Value(20)).current;
  const pulse = useRef(new Animated.Value(1)).current;
  const rotate = useRef(new Animated.Value(0)).current;
  const btnScale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fade, { toValue: 1, duration: 450, useNativeDriver: true }),
      Animated.timing(slide, { toValue: 0, duration: 450, easing: Easing.out(Easing.quad), useNativeDriver: true }),
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulse, { toValue: 1.08, duration: 700, useNativeDriver: true }),
          Animated.timing(pulse, { toValue: 1, duration: 700, useNativeDriver: true }),
        ])
      ),
      Animated.loop(
        Animated.timing(rotate, { toValue: 1, duration: 4000, easing: Easing.linear, useNativeDriver: true })
      ),
    ]).start();

    return () => rotate.stopAnimation();
  }, [fade, slide, pulse, rotate]);

  const rotation = rotate.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '360deg'] });

  const onPressIn = () => Animated.spring(btnScale, { toValue: 0.96, useNativeDriver: true }).start();
  const [isLoading, setIsLoading] = useState(false);

  const onPressOut = (e?: GestureResponderEvent) => {
    if (isLoading) return;
    Animated.spring(btnScale, { toValue: 1, useNativeDriver: true }).start();
    setIsLoading(true);
    // obrigar loading de 3s antes de chamar onRetry
    setTimeout(() => {
      setIsLoading(false);
      if (onRetry) onRetry();
    }, 3000);
  };

  return (
    <View style={styles.container}>
      {/* Decorative background circles */}
      <View style={[styles.decorCircle, { top: -60, left: -40, backgroundColor: 'rgba(59,130,246,0.06)' }]} />
      <View style={[styles.decorCircle, { bottom: -80, right: -50, backgroundColor: 'rgba(139,92,246,0.05)', width: 260, height: 260 }]} />

      <Animated.View style={[styles.card, { opacity: fade, transform: [{ translateY: slide }] }]}>
        <View style={styles.headerRow}>
          <View style={styles.badge}><Text style={styles.badgeText}>ERRO 503</Text></View>
          <Text style={styles.title}>Serviço Indisponível</Text>
        </View>

        <View style={styles.dividerRow}>
          <View style={styles.blueDot} />
          <View style={styles.sep} />
        </View>

        <View style={styles.iconWrap}>
          {/* WiFi icon built from Views */}
          <Animated.View style={{ transform: [{ scale: pulse }] }}>
            <View style={styles.wifiBase}>
              <Animated.View style={[styles.wifiArc, { width: 140, height: 70, borderRadius: 70, transform: [{ rotate: rotation }] }]} />
              <Animated.View style={[styles.wifiArc, { width: 100, height: 50, borderRadius: 50, marginTop: -24 }]} />
              <Animated.View style={[styles.wifiArc, { width: 60, height: 30, borderRadius: 30, marginTop: -20 }]} />
              <Animated.View style={[styles.wifiSlash, { transform: [{ rotate: '25deg' }] }]} />
              <Animated.View style={[styles.innerRotate, { transform: [{ rotate: rotation }] }]}>
                <FontAwesome5Icon name="wifi" size={24} color="rgba(255,255,255,0.06)" />
              </Animated.View>
            </View>
          </Animated.View>
        </View>

        <Text style={styles.message}>{message ?? 'Estamos com problemas de conexão com o servidor.'}</Text>

        <View style={styles.statusRow}>
          <View style={styles.statusItem}><View style={[styles.dot, { backgroundColor: '#10B981' }]} /><Text style={styles.statusText}>Servidor</Text></View>
          <View style={styles.statusItem}><View style={[styles.dot, { backgroundColor: '#F59E0B' }]} /><Text style={styles.statusText}>Rede</Text></View>
          <View style={styles.statusItem}><View style={[styles.dot, { backgroundColor: '#EF4444' }]} /><Text style={styles.statusText}>Dispositivo</Text></View>
        </View>

        <Animated.View style={{ transform: [{ scale: btnScale }], marginTop: 12 }}>
          <Pressable onPressIn={onPressIn} onPressOut={onPressOut} style={[styles.retryButton, isLoading && styles.retryButtonDisabled]} disabled={isLoading} accessibilityState={{ busy: isLoading }}>
            {isLoading ? (
              <>
                <ActivityIndicator size="small" color="#071022" style={{ marginRight: 8 }} />
                <Text style={styles.retryText}>Verificando...</Text>
              </>
            ) : (
              <>
                <FontAwesome5Icon name="sync" size={16} color="#071022" style={{ marginRight: 8 }} />
                <Text style={styles.retryText}>Tentar novamente</Text>
              </>
            )}
          </Pressable>
        </Animated.View>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#071022', justifyContent: 'center', alignItems: 'center', padding: 20 },
  decorCircle: { position: 'absolute', width: 160, height: 160, borderRadius: 80, opacity: 0.6 },
  card: { width: '100%', maxWidth: 520, backgroundColor: '#081226', borderRadius: 16, padding: 20, alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.45, shadowRadius: 30, elevation: 12 },
  headerRow: { width: '100%', flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start' },
  badge: { backgroundColor: '#7F1D1D', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12, marginRight: 12 },
  badgeText: { color: '#FFE4E6', fontWeight: '700', fontSize: 12 },
  title: { color: 'white', fontSize: 18, fontWeight: '800' },
  dividerRow: { width: '100%', flexDirection: 'row', alignItems: 'center', marginTop: 12, marginBottom: 8 },
  blueDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#3B82F6', marginRight: 8 },
  sep: { height: 2, backgroundColor: 'rgba(255,255,255,0.03)', flex: 1, borderRadius: 2 },
  iconWrap: { marginTop: 16, marginBottom: 12, alignItems: 'center', justifyContent: 'center' },
  wifiBase: { width: 160, height: 90, alignItems: 'center', justifyContent: 'center' },
  wifiArc: { borderWidth: 6, borderColor: '#60A5FA', backgroundColor: 'transparent' },
  wifiSlash: { position: 'absolute', width: 110, height: 8, backgroundColor: '#0B1220', top: 50, left: 25, borderRadius: 6, opacity: 0.95 },
  innerRotate: { position: 'absolute', alignSelf: 'center' },
  message: { color: '#cbd5e1', textAlign: 'center', marginTop: 6, paddingHorizontal: 8 },
  statusRow: { width: '100%', flexDirection: 'row', justifyContent: 'space-between', marginTop: 12 },
  statusItem: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  dot: { width: 10, height: 10, borderRadius: 5, marginRight: 8 },
  statusText: { color: '#cbd5e1', marginLeft: 8 },
  retryButton: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#3B82F6', paddingHorizontal: 18, paddingVertical: 12, borderRadius: 12, shadowColor: '#3B82F6', shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.35, shadowRadius: 14, elevation: 6 },
  retryText: { color: '#071022', fontWeight: '800' },
  retryButtonDisabled: { opacity: 0.85 },
});

export default OutOfService;
