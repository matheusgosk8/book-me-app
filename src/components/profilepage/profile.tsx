import React from 'react';
import { View, Text, ScrollView, Pressable, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router'; 
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function Profile() {
    const router = useRouter();
    // const {user, signOut} = useAuth();

    const handleLogout = async () => {
        // await signOut();
        router.replace("/login")
    };

    return(
        <SafeAreaView className="flex-1 bg-[#0F172A]" edges={['top']}>
      <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
        
        {/* Header com botão voltar */}
        <View className="px-6 py-4 flex-row items-center">
          <Pressable 
            onPress={() => router.back()} 
            className="p-2 bg-white/5 rounded-full border border-white/10"
          >
            <Ionicons name="arrow-back" size={24} color="white" />
          </Pressable>
          <Text className="text-white text-xl font-bold ml-4">Meu Perfil</Text>
        </View>

        {/* Card de Informações do Usuário */}
        <View className="items-center mt-8 px-6">
          <View className="w-24 h-24 bg-blue-600 rounded-full items-center justify-center mb-4 shadow-xl">
            <Text className="text-white text-4xl font-bold">
              {/* {user?.nome ? user.name.charAt(0).toUpperCase() : 'U'} */}
            </Text>
          </View>
          
          <Text className="text-white text-2xl font-bold">{'Usuário'}</Text>
          <Text className="text-white/60 text-base">{'email@exemplo.com'}</Text>
          
          <View className="bg-blue-600/20 px-4 py-1 rounded-full mt-3 border border-blue-600/30">
            <Text className="text-blue-400 font-medium">Profissional</Text>
          </View>
        </View>

        {/* Menu de Opções */}
        <View className="mt-10 px-6 gap-y-4">
          <Text className="text-white/40 text-xs font-bold uppercase tracking-widest ml-1">Configurações</Text>
          
          <Pressable className="flex-row items-center bg-white/5 p-4 rounded-2xl border border-white/10">
            <Ionicons name="person-outline" size={22} color="#3B82F6" />
            <Text className="text-white text-base ml-4 flex-1">Editar Dados</Text>
            <Ionicons name="chevron-forward" size={20} color="rgba(255,255,255,0.3)" />
          </Pressable>

          <Pressable className="flex-row items-center bg-white/5 p-4 rounded-2xl border border-white/10">
            <Ionicons name="notifications-outline" size={22} color="#3B82F6" />
            <Text className="text-white text-base ml-4 flex-1">Notificações</Text>
            <Ionicons name="chevron-forward" size={20} color="rgba(255,255,255,0.3)" />
          </Pressable>

          <Pressable className="flex-row items-center bg-white/5 p-4 rounded-2xl border border-white/10">
            <Ionicons name="shield-checkmark-outline" size={22} color="#3B82F6" />
            <Text className="text-white text-base ml-4 flex-1">Privacidade e Segurança</Text>
            <Ionicons name="chevron-forward" size={20} color="rgba(255,255,255,0.3)" />
          </Pressable>

          {/* Botão de Sair - Destrutivo */}
          <Pressable 
            onPress={handleLogout}
            className="flex-row items-center bg-red-500/10 p-4 rounded-2xl border border-red-500/20 mt-4"
          >
            <Ionicons name="log-out-outline" size={22} color="#EF4444" />
            <Text className="text-red-500 text-base font-bold ml-4">Sair da Conta</Text>
          </Pressable>
        </View>

        {/* Versão do App */}
        <Text className="text-center text-white/20 text-xs mt-10">
          Book Me App • v1.0.0
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}