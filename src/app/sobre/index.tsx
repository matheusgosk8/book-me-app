// ============================================================
// app/sobre/index.tsx  (React Native / Expo Router + NativeWind)
// ============================================================
// Copie este arquivo para o seu projeto Expo.
// Dependências necessárias:
//   - react-native-reanimated  (já incluso no Expo SDK ≥ 49)
//   - react-native-vector-icons
//   - nativewind / tailwindcss
//   - expo-router
// ============================================================

import { Link } from "expo-router";
import React, { useCallback, useRef, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Animated,
  Dimensions,
  LayoutChangeEvent,
  NativeScrollEvent,
  NativeSyntheticEvent,
  StatusBar,
} from "react-native";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import Ionicons from "react-native-vector-icons/Ionicons";

const { height: SCREEN_HEIGHT } = Dimensions.get("window");

/* ------------------------------------------------------------------ */
/*  Componente auxiliar – seção com fade-in ao entrar na viewport      */
/* ------------------------------------------------------------------ */
function FadeInSection({
  children,
  scrollY,
  delay = 0,
}: {
  children: React.ReactNode;
  scrollY: Animated.Value;
  delay?: number;
}) {
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(40)).current;
  const [triggered, setTriggered] = useState(false);
  const sectionY = useRef(0);

  const onLayout = useCallback(
    (e: LayoutChangeEvent) => {
      sectionY.current = e.nativeEvent.layout.y;

      const listenerId = scrollY.addListener(({ value }) => {
        const visibleBottom = value + SCREEN_HEIGHT * 0.85;
        if (visibleBottom >= sectionY.current && !triggered) {
          setTriggered(true);
          Animated.parallel([
            Animated.timing(opacity, {
              toValue: 1,
              duration: 700,
              delay,
              useNativeDriver: true,
            }),
            Animated.timing(translateY, {
              toValue: 0,
              duration: 700,
              delay,
              useNativeDriver: true,
            }),
          ]).start();
          scrollY.removeListener(listenerId);
        }
      });

      // Checa imediatamente caso já esteja visível
      const currentVal = (scrollY as any).__getValue?.() ?? 0;
      if (currentVal + SCREEN_HEIGHT * 0.85 >= sectionY.current && !triggered) {
        setTriggered(true);
        Animated.parallel([
          Animated.timing(opacity, {
            toValue: 1,
            duration: 700,
            delay,
            useNativeDriver: true,
          }),
          Animated.timing(translateY, {
            toValue: 0,
            duration: 700,
            delay,
            useNativeDriver: true,
          }),
        ]).start();
      }
    },
    [scrollY, triggered, opacity, translateY, delay]
  );

  return (
    <Animated.View
      onLayout={onLayout}
      style={{ opacity, transform: [{ translateY }] }}
    >
      {children}
    </Animated.View>
  );
}

/* ------------------------------------------------------------------ */
/*  Card de estatísticas                                               */
/* ------------------------------------------------------------------ */
function StatCard({
  icon,
  iconFamily,
  value,
  label,
  color,
}: {
  icon: string;
  iconFamily: "FontAwesome5" | "MaterialIcons" | "Ionicons";
  value: string;
  label: string;
  color: string;
}) {
  const IconComponent =
    iconFamily === "FontAwesome5"
      ? FontAwesome5
      : iconFamily === "MaterialIcons"
      ? MaterialIcons
      : Ionicons;

  return (
    <View className="flex-1 items-center bg-white/5 rounded-2xl py-5 px-2 mx-1.5">
      <IconComponent name={icon} size={24} color={color} />
      <Text className="text-2xl font-bold text-white mt-2">{value}</Text>
      <Text className="text-xs text-gray-400 text-center mt-1">{label}</Text>
    </View>
  );
}

/* ------------------------------------------------------------------ */
/*  Card de valor/pilar                                                */
/* ------------------------------------------------------------------ */
function ValueCard({
  icon,
  title,
  description,
  color,
}: {
  icon: string;
  title: string;
  description: string;
  color: string;
}) {
  return (
    <View className="flex-row items-start bg-white/5 rounded-2xl p-4 mb-3">
      <View
        className="w-11 h-11 rounded-xl items-center justify-center mr-4"
        style={{ backgroundColor: color + "20" }}
      >
        <MaterialCommunityIcons name={icon} size={22} color={color} />
      </View>
      <View className="flex-1">
        <Text className="text-white font-bold text-base mb-1">{title}</Text>
        <Text className="text-gray-400 text-sm leading-5">{description}</Text>
      </View>
    </View>
  );
}

/* ------------------------------------------------------------------ */
/*  Card de passo (Como Funciona)                                      */
/* ------------------------------------------------------------------ */
function StepCard({
  step,
  title,
  description,
  icon,
  color,
  isLast,
}: {
  step: number;
  title: string;
  description: string;
  icon: string;
  color: string;
  isLast?: boolean;
}) {
  return (
    <View className="flex-row mb-1">
      {/* Linha vertical + número */}
      <View className="items-center mr-4">
        <View
          className="w-10 h-10 rounded-full items-center justify-center"
          style={{ backgroundColor: color }}
        >
          <Text className="text-white font-bold text-sm">{step}</Text>
        </View>
        {!isLast && <View className="w-0.5 flex-1 bg-white/10 mt-1" />}
      </View>

      {/* Conteúdo */}
      <View className="flex-1 pb-8">
        <View className="flex-row items-center mb-1">
          <FontAwesome5 name={icon} size={14} color={color} />
          <Text className="text-white font-bold text-base ml-2">{title}</Text>
        </View>
        <Text className="text-gray-400 text-sm leading-5">{description}</Text>
      </View>
    </View>
  );
}

/* ================================================================== */
/*  PÁGINA PRINCIPAL                                                   */
/* ================================================================== */
export default function SobrePage() {
  const scrollY = useRef(new Animated.Value(0)).current;

  const handleScroll = Animated.event(
    [{ nativeEvent: { contentOffset: { y: scrollY } } }],
    { useNativeDriver: true }
  );

  return (
    <View className="flex-1 bg-[#0a0a0f]">
      <StatusBar barStyle="light-content" backgroundColor="#0a0a0f" />

      <ScrollView
        className="flex-1"
        contentContainerClassName="pb-16"
        showsVerticalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
      >
        {/* ====== HERO ====== */}
        <FadeInSection scrollY={scrollY}>
          <View className="px-6 pt-16 pb-10 items-center">
            {/* Badge */}
            <View className="bg-blue-500/10 px-4 py-1.5 rounded-full mb-6">
              <Text className="text-blue-400 text-xs font-semibold tracking-wider uppercase">
                Sobre nós
              </Text>
            </View>

            <Text className="text-4xl font-extrabold text-white text-center mb-3 leading-tight">
              Conectando quem precisa{"\n"}a quem resolve
            </Text>
            <Text className="text-base text-gray-400 text-center leading-6 px-2">
              Somos a plataforma que simplifica a conexão entre clientes e
              profissionais qualificados, transformando a forma como serviços são
              encontrados e contratados no Brasil.
            </Text>
          </View>
        </FadeInSection>

        {/* ====== ESTATÍSTICAS ====== */}
        <FadeInSection scrollY={scrollY} delay={100}>
          <View className="px-4 mb-10">
            <View className="flex-row">
              <StatCard
                icon="users"
                iconFamily="FontAwesome5"
                value="50k+"
                label="Usuários ativos"
                color="#3b82f6"
              />
              <StatCard
                icon="briefcase"
                iconFamily="FontAwesome5"
                value="12k+"
                label="Profissionais"
                color="#8b5cf6"
              />
              <StatCard
                icon="star"
                iconFamily="Ionicons"
                value="4.9"
                label="Avaliação média"
                color="#f59e0b"
              />
            </View>
          </View>
        </FadeInSection>

        {/* Divider sutil */}
        <View className="h-px bg-white/5 mx-6 mb-10" />

        {/* ====== MISSÃO ====== */}
        <FadeInSection scrollY={scrollY} delay={0}>
          <View className="px-6 mb-12">
            <View className="flex-row items-center mb-4">
              <View className="w-10 h-10 bg-blue-500/20 rounded-xl items-center justify-center mr-3">
                <FontAwesome5 name="rocket" size={18} color="#3b82f6" />
              </View>
              <Text className="text-2xl font-bold text-white">
                Nossa Missão
              </Text>
            </View>
            <Text className="text-gray-300 text-base leading-7 mb-4">
              Nosso objetivo é democratizar o acesso a serviços de qualidade,
              conectando profissionais talentosos a clientes que precisam de
              soluções rápidas, confiáveis e acessíveis.
            </Text>
            <Text className="text-gray-400 text-sm leading-6">
              Acreditamos que todo profissional merece visibilidade e que todo
              cliente merece um serviço bem feito. Por isso, criamos uma
              plataforma intuitiva que elimina burocracias e aproxima pessoas.
            </Text>
          </View>
        </FadeInSection>

        {/* ====== NOSSOS VALORES ====== */}
        <FadeInSection scrollY={scrollY} delay={0}>
          <View className="px-6 mb-12">
            <View className="flex-row items-center mb-5">
              <View className="w-10 h-10 bg-emerald-500/20 rounded-xl items-center justify-center mr-3">
                <MaterialCommunityIcons
                  name="heart-pulse"
                  size={20}
                  color="#10b981"
                />
              </View>
              <Text className="text-2xl font-bold text-white">
                Nossos Valores
              </Text>
            </View>

            <ValueCard
              icon="shield-check"
              title="Confiança e Segurança"
              description="Todos os profissionais passam por verificação. Avaliações reais de clientes garantem transparência total."
              color="#3b82f6"
            />
            <ValueCard
              icon="lightning-bolt"
              title="Agilidade"
              description="Do agendamento à conclusão, tudo acontece de forma rápida e sem complicações."
              color="#f59e0b"
            />
            <ValueCard
              icon="account-group"
              title="Comunidade"
              description="Construímos uma rede colaborativa onde profissionais crescem e clientes encontram sempre o melhor."
              color="#8b5cf6"
            />
            <ValueCard
              icon="cellphone-check"
              title="Tecnologia Acessível"
              description="Interface simples e intuitiva para que qualquer pessoa possa usar, independentemente da experiência com tecnologia."
              color="#06b6d4"
            />
          </View>
        </FadeInSection>

        {/* Divider sutil */}
        <View className="h-px bg-white/5 mx-6 mb-10" />

        {/* ====== SERVIÇOS ====== */}
        <FadeInSection scrollY={scrollY} delay={0}>
          <View className="px-6 mb-12">
            <View className="flex-row items-center mb-4">
              <View className="w-10 h-10 bg-violet-500/20 rounded-xl items-center justify-center mr-3">
                <MaterialIcons name="handyman" size={20} color="#8b5cf6" />
              </View>
              <Text className="text-2xl font-bold text-white">Serviços</Text>
            </View>
            <Text className="text-gray-300 text-base leading-7 mb-4">
              Oferecemos uma ampla gama de serviços para atender todas as suas
              necessidades do dia a dia, desde reformas e manutenção até
              serviços especializados.
            </Text>
            <Text className="text-gray-400 text-sm leading-6 mb-5">
              Cada profissional cadastrado possui perfil verificado, portfólio
              de trabalhos anteriores e avaliações de outros clientes — tudo
              para que você faça a melhor escolha com segurança.
            </Text>

            {/* Tags de categorias */}
            <View className="flex-row flex-wrap gap-2">
              {[
                "Eletricista",
                "Encanador",
                "Pintor",
                "Diarista",
                "Montador",
                "Jardineiro",
                "Técnico em TI",
                "Pedreiro",
              ].map((service) => (
                <View
                  key={service}
                  className="bg-white/5 px-3.5 py-2 rounded-full"
                >
                  <Text className="text-gray-300 text-xs font-medium">
                    {service}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        </FadeInSection>

        {/* ====== COMO FUNCIONA ====== */}
        <FadeInSection scrollY={scrollY} delay={0}>
          <View className="px-6 mb-12">
            <View className="flex-row items-center mb-6">
              <View className="w-10 h-10 bg-cyan-500/20 rounded-xl items-center justify-center mr-3">
                <FontAwesome5 name="list-ol" size={16} color="#06b6d4" />
              </View>
              <Text className="text-2xl font-bold text-white">
                Como Funciona
              </Text>
            </View>

            <StepCard
              step={1}
              title="Crie sua conta"
              description="Cadastre-se gratuitamente em poucos segundos como cliente ou profissional. É rápido e seguro."
              icon="user-plus"
              color="#3b82f6"
            />
            <StepCard
              step={2}
              title="Encontre o serviço"
              description="Navegue pelas categorias ou pesquise diretamente o tipo de profissional que você precisa."
              icon="search"
              color="#8b5cf6"
            />
            <StepCard
              step={3}
              title="Agende com praticidade"
              description="Escolha o profissional, selecione a data e horário que melhor se encaixam na sua rotina."
              icon="calendar-check"
              color="#06b6d4"
            />
            <StepCard
              step={4}
              title="Acompanhe e avalie"
              description="Receba notificações em tempo real sobre o status do serviço e avalie o profissional após a conclusão."
              icon="check-circle"
              color="#10b981"
              isLast
            />
          </View>
        </FadeInSection>

        {/* Divider sutil */}
        <View className="h-px bg-white/5 mx-6 mb-10" />

        {/* ====== POR QUE NOS ESCOLHER ====== */}
        <FadeInSection scrollY={scrollY} delay={0}>
          <View className="px-6 mb-14">
            <View className="flex-row items-center mb-5">
              <View className="w-10 h-10 bg-amber-500/20 rounded-xl items-center justify-center mr-3">
                <FontAwesome5 name="trophy" size={16} color="#f59e0b" />
              </View>
              <Text className="text-2xl font-bold text-white">
                Por que nos escolher?
              </Text>
            </View>

            <View className="bg-white/5 rounded-2xl p-5 mb-3">
              <View className="flex-row items-center mb-2">
                <Ionicons name="shield-checkmark" size={18} color="#3b82f6" />
                <Text className="text-white font-semibold text-sm ml-2">
                  Profissionais verificados
                </Text>
              </View>
              <Text className="text-gray-400 text-sm leading-5">
                Cada profissional passa por um processo rigoroso de verificação
                de identidade e qualificações.
              </Text>
            </View>

            <View className="bg-white/5 rounded-2xl p-5 mb-3">
              <View className="flex-row items-center mb-2">
                <Ionicons name="chatbubbles" size={18} color="#8b5cf6" />
                <Text className="text-white font-semibold text-sm ml-2">
                  Chat integrado
                </Text>
              </View>
              <Text className="text-gray-400 text-sm leading-5">
                Comunique-se diretamente com o profissional antes, durante e
                após o serviço, tudo dentro do app.
              </Text>
            </View>

            <View className="bg-white/5 rounded-2xl p-5">
              <View className="flex-row items-center mb-2">
                <Ionicons name="wallet" size={18} color="#10b981" />
                <Text className="text-white font-semibold text-sm ml-2">
                  Pagamento seguro
                </Text>
              </View>
              <Text className="text-gray-400 text-sm leading-5">
                Pague pelo app com total segurança. O valor só é liberado ao
                profissional após a confirmação do serviço.
              </Text>
            </View>
          </View>
        </FadeInSection>

        {/* ====== CTA FINAL ====== */}
        <FadeInSection scrollY={scrollY} delay={0}>
          <View className="px-6 pb-8 items-center">
            <Text className="text-2xl font-bold text-white text-center mb-2">
              Pronto para começar?
            </Text>
            <Text className="text-gray-400 text-center text-sm mb-8 px-4 leading-5">
              Junte-se a milhares de pessoas que já transformaram a forma como
              encontram e contratam serviços.
            </Text>

            <TouchableOpacity
              className="w-full bg-blue-500 py-4 rounded-2xl items-center mb-3"
              activeOpacity={0.85}
            >
              <Link href="/cadastro" asChild>
                <Text className="text-white text-base font-bold tracking-wide">
                  Criar minha conta grátis
                </Text>
              </Link>
            </TouchableOpacity>

            <TouchableOpacity
              className="w-full border border-white/10 py-4 rounded-2xl items-center"
              activeOpacity={0.85}
            >
              <Link href="/login" asChild>
                <Text className="text-gray-300 text-base font-semibold">
                  Já tenho uma conta
                </Text>
              </Link>
            </TouchableOpacity>

            <Text className="text-gray-600 text-xs mt-6 text-center">
              Ao se cadastrar, você concorda com nossos Termos de Uso e
              Política de Privacidade.
            </Text>
          </View>
        </FadeInSection>
      </ScrollView>
    </View>
  );
}
