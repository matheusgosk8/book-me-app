import { Link } from "expo-router";
import React, { useCallback, useRef, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Animated,
  Dimensions,
  StatusBar,
  StyleSheet,
  Pressable,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import Ionicons from "react-native-vector-icons/Ionicons";
import FadeInSection from "@/components/common/FadeInSection";
import StatCard from "@/components/sobre/StatCard";
import ValueCard from "@/components/sobre/ValueCard";
import StepCard from "@/components/sobre/StepCard";
import Cta from "@/components/sobre/Cta";

const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = Dimensions.get("window");

export default function Footer() {
  const [loginVisible, setLoginVisible] = useState(false);
  const loginSlideAnim = useRef(new Animated.Value(-SCREEN_HEIGHT)).current;
  const overlayOpacity = useRef(new Animated.Value(0)).current;

  const openLogin = useCallback(() => {
    setLoginVisible(true);
    Animated.parallel([
      Animated.spring(loginSlideAnim, {
        toValue: 0,
        useNativeDriver: true,
        damping: 20,
        stiffness: 90,
        mass: 1,
      }),
      Animated.timing(overlayOpacity, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();
  }, [loginSlideAnim, overlayOpacity]);

  const closeLogin = useCallback(() => {
    Animated.parallel([
      Animated.timing(loginSlideAnim, {
        toValue: -SCREEN_HEIGHT,
        duration: 350,
        useNativeDriver: true,
      }),
      Animated.timing(overlayOpacity, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setLoginVisible(false);
    });
  }, [loginSlideAnim, overlayOpacity]);

  return (
    <>
      <View
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 100,
        }}
        pointerEvents="box-none"
      >
        {/* Gradiente/shadow acima do CTA */}
        <LinearGradient
          colors={["rgba(10,10,15,0.001)", "rgba(10,10,15,0.7)", "#0a0a0f"]}
          locations={[0, 0.5, 1]}
          style={{
            position: 'absolute',
            top: -32,
            left: 0,
            right: 0,
            height: 32,
            zIndex: 21,
            borderTopLeftRadius: 16,
            borderTopRightRadius: 16,
          }}
          pointerEvents="none"
        />
        {/* Área do botão */}
        <View style={[styles.bottomBarContent, { zIndex: 22 }]}> 
          <TouchableOpacity
            onPress={openLogin}
            activeOpacity={0.85}
            style={styles.ctaButton}
          >
            <LinearGradient
              colors={["#10b981", "#059669"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.ctaGradient}
            >
              <FontAwesome5
                name="arrow-right"
                size={16}
                color="#fff"
                style={{ marginRight: 10 }}
              />
              <Text style={styles.ctaText}>Começar agora</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </View>

      {/* ====== LOGIN OVERLAY — Slide de cima para baixo ====== */}
      {loginVisible && (
        <View style={StyleSheet.absoluteFill} pointerEvents="box-none">
          {/* Fundo escurecido */}
          <Animated.View
            style={[styles.overlay, { opacity: overlayOpacity }]}
          >
            <Pressable style={StyleSheet.absoluteFill} onPress={closeLogin} />
          </Animated.View>

          {/* Painel de Login deslizando de cima para baixo */}
          <Animated.View
            style={[
              styles.loginPanel,
              { transform: [{ translateY: loginSlideAnim }] },
            ]}
          >
            {/* Header do painel */}
            <View style={styles.loginHeader}>
              <Text style={styles.loginTitle}>Entrar na sua conta</Text>
              <TouchableOpacity onPress={closeLogin} hitSlop={12}>
                <Ionicons name="close" size={24} color="#fff" />
              </TouchableOpacity>
            </View>

            {/* Placeholder para o conteúdo de login */}
            <View style={styles.loginPlaceholder}>
                <Cta/>
            </View>
          </Animated.View>
        </View>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0a0a0f",
  },

  /* ====== Bottom Bar ====== */
  bottomBarWrapper: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
  },
  gradient: {
    height: 60,
    width: "100%",
  },
  bottomBarContent: {
    backgroundColor: "#0a0a0f",
    paddingHorizontal: 24,
    paddingTop: 4,
    paddingBottom: 32, // safe area inferior
  },
  ctaButton: {
    borderRadius: 16,
    overflow: "hidden",
    elevation: 8,
    shadowColor: "#10b981",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 12,
  },
  ctaGradient: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 18,
    borderRadius: 16,
  },
  ctaText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "700",
    letterSpacing: 0.5,
  },

  /* ====== Login Overlay ====== */
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
  },
  loginPanel: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: "#111118",
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
    paddingTop: 56, // safe area superior
    paddingHorizontal: 24,
    paddingBottom: 32,
    minHeight: SCREEN_HEIGHT * 0.55,
    // Sombra verde sutil na borda inferior do painel
    shadowColor: "#10b981",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 12,
  },
  loginHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 32,
  },
  loginTitle: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "700",
  },
  loginPlaceholder: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 40,
  },
  loginPlaceholderText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    marginTop: 16,
  },
  loginPlaceholderSub: {
    color: "#6b7280",
    fontSize: 13,
    marginTop: 8,
    textAlign: "center",
    paddingHorizontal: 20,
  },
});
