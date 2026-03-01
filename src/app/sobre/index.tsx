import { Link } from "expo-router";
import React, { useCallback, useRef, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  Animated,
  Dimensions,
  StatusBar,
  StyleSheet,
  Pressable,
  TouchableOpacity,
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

export default function Content() {
  const scrollY = useRef(new Animated.Value(0)).current;


  const handleScroll = Animated.event(
    [{ nativeEvent: { contentOffset: { y: scrollY } } }],
    { useNativeDriver: true }
  );


  return (
    <FadeInSection scrollY={scrollY}>
            <View className="bg-[#0a0a0f]">
      <StatusBar barStyle="light-content" backgroundColor="#0a0a0f" />

      <ScrollView
        contentContainerStyle={{ paddingBottom: 120 }}
        showsVerticalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
      >
        <View
          className="px-6 flex mb-4 flex-col gap-10"

        >
          <View >
            <View className="px-6 pt-16 pb-10 items-center">
              <View className="flex-row items-center w-full mb-6 justify-between">
                <View className="flex-1 items-start">
                  <Link href="/" asChild>
                    <TouchableOpacity hitSlop={12}>
                      <FontAwesome5 name="arrow-left" size={20} color="#fff" />
                    </TouchableOpacity>
                  </Link>                
                </View>
                <View className="flex-1 items-center">
                  <View className="bg-blue-500/10 px-4 py-1.5 rounded-full">
                    <Text className="text-blue-400 text-xs font-semibold tracking-wider uppercase">
                      Sobre nós
                    </Text>
                  </View>
                </View>
                <View className="flex-1" />
              </View>
            </View>
          </View>

          <FadeInSection scrollY={scrollY} delay={100}>
            <Text className="text-4xl font-extrabold text-white text-center mb-3 leading-tight">
              Conectando quem precisa{"\n"}a quem resolve
            </Text>
            <Text className="text-base text-gray-400 text-center leading-6 px-2">
              Somos a plataforma que simplifica a conexão entre clientes e
              profissionais qualificados, transformando a forma como serviços são
              encontrados e contratados no Brasil.
            </Text>
          </FadeInSection>

          {/* ====== ESTATÍSTICAS ====== */}
          <FadeInSection scrollY={scrollY} delay={100}>
            <View className="px-6 mb-10">
              <Text className="text-2xl font-bold text-white mb-4 text-center">
                Por que usar o BookMe?
              </Text>
              <View className="flex-row flex-wrap justify-center gap-4">
                <View className="bg-white/5 rounded-2xl p-4 w-[160px] items-center">
                  <FontAwesome5 name="user-check" size={28} color="#10b981" />
                  <Text className="text-white font-semibold mt-2 text-center">Profissionais verificados</Text>
                </View>
                <View className="bg-white/5 rounded-2xl p-4 w-[160px] items-center">
                  <FontAwesome5 name="clock" size={28} color="#3b82f6" />
                  <Text className="text-white font-semibold mt-2 text-center">Agendamento rápido</Text>
                </View>
                <View className="bg-white/5 rounded-2xl p-4 w-[160px] items-center">
                  <FontAwesome5 name="shield-alt" size={28} color="#f59e0b" />
                  <Text className="text-white font-semibold mt-2 text-center">Pagamento seguro</Text>
                </View>
              </View>
            </View>

            <View>
              <View className="flex-row items-center">
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
        </View>

        <View className="h-px bg-white/5 mx-6 mb-10" />


        {/* ====== NOSSOS VALORES ====== */}
  

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

        <View className="h-px bg-white/5 mx-6 mb-10" />

        {/* ====== SERVIÇOS ====== */}
        <View className="px-6 mb-12">
          <View className="flex-row items-center mb-4">
            <View className="w-10 h-10 bg-violet-500/20 rounded-xl items-center justify-center mr-3">
              <MaterialIcons name="handyman" size={20} color="#8b5cf6" />
            </View>
            <Text className="text-2xl font-bold text-white">Serviços</Text>
          </View>
          <Text className="text-gray-300 text-base leading-7 mb-4">
            Oferecemos uma ampla gama de serviços para atender todas as suas
            necessidades do dia a dia, desde reformas e manutenção até serviços
            especializados.
          </Text>
          <Text className="text-gray-400 text-sm leading-6 mb-5">
            Cada profissional cadastrado possui perfil verificado, portfólio de
            trabalhos anteriores e avaliações de outros clientes — tudo para que
            você faça a melhor escolha com segurança.
          </Text>

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

        {/* ====== COMO FUNCIONA ====== */}
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

        <View className="h-px bg-white/5 mx-6 mb-6" />

        {/* ====== POR QUE NOS ESCOLHER ====== */}
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
              Cada profissional passa por um processo rigoroso de verificação de
              identidade e qualificações.
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
              Comunique-se diretamente com o profissional antes, durante e após
              o serviço, tudo dentro do app.
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
      </ScrollView>



    </View>
    </FadeInSection>
  );
}

