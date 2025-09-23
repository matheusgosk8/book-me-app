// app/sobre/index.tsx
import { Link } from "expo-router";
import React from "react";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";

export default function SobrePage() {
  return (
      <View className="flex flex-1 justify-between items-center pt-10 text-white">

        {/* Seção 1 */}
        <View className="mb-12 items-center">
          <Text className="text-3xl font-bold text-white mb-2">Nossa Missão</Text>
          <FontAwesome5 name="rocket" size={40} color="#3b82f6" className="mb-4" />
          <Text className="text-center text-gray-300 text-lg">
            Nosso objetivo é conectar profissionais e clientes de forma simples e eficiente.
          </Text>
        </View>

        {/* Seção 2 */}
        <View className="mb-12 items-center">
          <Text className="text-3xl font-bold text-white mb-2">Serviços</Text>
          <MaterialIcons name="handyman" size={40} color="#8b5cf6"  className="mb-4" />
          <Text className="text-center text-gray-300 text-lg">
            Diversos tipos de serviços podem ser agendados diretamente pelo app, de forma prática e rápida.
          </Text>
        </View>

        {/* Seção 3 */}
        <View className="mb-12 items-center">
          <Text className="text-3xl font-bold text-white mb-2">Como Funciona</Text>
          <FontAwesome5 name="users" size={40} color="#06b6d4" className="mb-4" />
          <Text className="text-center text-gray-300 text-lg">
            O cliente escolhe o serviço, agenda com o profissional e recebe notificações sobre seu agendamento.
          </Text>
        </View>

        <View className="flex flex-row gap-4 mt-4">
          <TouchableOpacity  className="bg-black px-6 py-3 rounded-lg">
            <Link href="/sobre" asChild>
              <Text className="text-white text-lg font-roboto font-medium">
                Começe agora
              </Text>
            </Link>
          </TouchableOpacity>
      </View> 


      </View>
  );
}
