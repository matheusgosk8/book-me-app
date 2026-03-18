import { View, Text, Pressable, FlatList, Platform } from "react-native";
import { useRouter } from "expo-router";
import { useServices } from "@/providers/ServiceContext";
import { SafeAreaView } from "react-native-safe-area-context";
import { useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { useAuth } from "@/providers/AuthContext";

export default function Home() {
  const router = useRouter();
  const { servicos } = useServices();
  const [categoriaSelecionada, setCategoriaSelecionada] = useState<string | null>(null);
  const categorias = ["Beleza", "Saúde", "Eventos", "Educação", "Manutenção"]
  const servicosExibidos = categoriaSelecionada
    ? servicos.filter(s => s.categoria === categoriaSelecionada)
    : servicos;

    const authState = useSelector((state: RootState)=> state.auth)
    const {token, userId} = authState

    const {user} = useAuth()

  return (
    <SafeAreaView style={{ flex: 1 }} edges={["top"]}>
      <View style={{ flex: 1 }}>

        {/* Header Fixo */}
        <View className="px-6 flex-row justify-between items-center mb-6 mt-4">
          <View>
            <Text className="text-white/60 text-sm">Explore os</Text>
            <Text className="text-white text-2xl font-bold">Serviços</Text>
          </View>
          <Pressable
            onPress={() => router.push("/profile")}
            className="bg-white/5 p-2 pr-4 rounded-2xl border border-white/10 flex-row items-center"
          >
            {/* Avatarzinho com a letra do nome */}
            <View className="w-8 h-8 bg-blue-600 rounded-lg items-center justify-center mr-3 shadow-lg">
              <Text className="text-white font-bold text-xs">
                {user?.nome ? user.nome.charAt(0).toUpperCase() : 'U'}
              </Text>
            </View>
            <Text className="text-white font-medium text-sm">Meu Perfil</Text>
          </Pressable>
        </View>

    
        <View>
          <FlatList
            data={["Todos", ...categorias]}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 24 }}
            renderItem={({ item }) => {
              const isActive = (item === "Todos" && categoriaSelecionada === null) || categoriaSelecionada === item;

              return (
                <Pressable
                  onPress={() => setCategoriaSelecionada(item === "Todos" ? null : item)}
                  className={`mr-3 px-5 py-2 rounded-full border ${isActive ? "bg-blue-600 border-blue-600" : "bg-white/5 border-white/10"
                    }`}
                >
                  <Text className={`text-sm ${isActive ? "text-white font-bold" : "text-white"}`}>
                    {item}
                  </Text>
                </Pressable>
              );
            }}
          />
        </View>

        <FlatList
          data={servicosExibidos}
          keyExtractor={(item, index) => item.id?.toString() || index.toString()}
          style={{ flex: 1 }}
          contentContainerStyle={{
            paddingHorizontal: 24,
            paddingBottom: 120
          }}
          showsVerticalScrollIndicator={false}
          ListHeaderComponent={() => (
            <Text className="text-white/80 mb-4 font-medium">
              {servicos.length > 0 ? "" : "Nenhum serviço cadastrado"}
            </Text>
          )}
          renderItem={({ item }) => (
            <Pressable
              className="bg-white/5 border border-white/10 p-5 rounded-3xl mb-4"
              onPress={() => console.log(`Selecionou: ${item.titulo}`)}
            >
              <View className="flex-row justify-between items-start">
                <View className="flex-1">
                  <View className="bg-blue-600/20 self-start px-2 py-1 rounded-md mb-2">
                    <Text className="text-blue-400 text-[10px] font-bold uppercase">
                      {item.categoria}
                    </Text>
                  </View>
                  <Text className="text-white text-lg font-bold">{item.titulo}</Text>
                  <Text className="text-white/50 text-sm mb-3">Profissional: {item.profissional}</Text>
                </View>
                <Text className="text-white font-bold text-base">
                  R$ {item.preco ? Number(item.preco).toFixed(2).replace('.', ',') : '0,00'}
                </Text>
              </View>

              <View className="flex-row items-center justify-between border-t border-white/5 pt-3">
                <Text className="text-white/40 text-xs">⭐ 5.0 (Novo)</Text>
                <Text className="text-blue-500 font-bold">Agendar</Text>
              </View>
            </Pressable>
          )}
        />
      </View>

      {/* Botão Flutuante (Absolute sempre no final) */}
      <Pressable
        onPress={() => router.push("/signup?step=4")}
        className="absolute bottom-10 right-8 bg-blue-600 w-16 h-16 rounded-full items-center justify-center shadow-2xl active:bg-blue-700"
      >
        <Text className="text-white text-3xl">+</Text>
      </Pressable>
    </SafeAreaView>
  );
}