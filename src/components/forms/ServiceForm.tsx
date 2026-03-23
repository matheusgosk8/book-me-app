import { View, Text, TextInput, Pressable } from "react-native";
import { useState } from "react";
import { useRouter } from "expo-router";
import { useServices } from '@/providers/ServiceContext';
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";

const ServiceForm = () => {
    const router = useRouter();
    const { addService } = useServices();

    // Lendo o usuário do Redux (Interface em Inglês)
    const { user } = useSelector((state: RootState) => state.auth);

    const [service, setService] = useState({
        nome: "",
        valor: "",
        categoria: "",
    });

    const categorias = ["Beleza", "Saúde", "Eventos", "Educação", "Manutenção"];

    const handleSaveService = () => {
        if (!service.nome || !service.valor || !service.categoria) {
            alert("Preencha todos os campos!");
            return;
        }

        const valorNumerico = parseFloat(service.valor.replace(',', '.'));

        if (isNaN(valorNumerico)) {
            alert("Digite um valor válido");
            return;
        }

        addService({
            titulo: service.nome,
            preco: valorNumerico,
            categoria: service.categoria,
            profissional: user?.name || "Profissional Desconhecido",
        });

        alert("Serviço adicionado com sucesso!");
        router.replace("/home");
    };

    return (
        <View>
            <Text className="text-white text-3xl font-bold mb-2">Seus Serviços</Text>
            <Text className="text-white/60 text-base mb-8">
                Cadastre o que você oferece para seus clientes.
            </Text>

            <View className="gap-y-6">
                {/* Nome do Profissional (Informativo) */}
                <View className="bg-white/5 p-3 rounded-xl border border-white/5">
                    <Text className="text-white/40 text-[10px] uppercase font-bold">Cadastrando como:</Text>
                    <Text className="text-white/80 font-medium">{user?.name}</Text>
                </View>

                <View>
                    <Text className="text-white/80 mb-2 ml-1 font-medium">Nome do Serviço</Text>
                    <TextInput
                        placeholder="Ex: Corte de Cabelo Masculino"
                        placeholderTextColor="rgba(255, 255, 255, 0.4)"
                        className="bg-white/10 border border-white/10 p-4 rounded-2xl text-white text-base focus:border-white/30"
                        value={service.nome}
                        onChangeText={(t) => setService({ ...service, nome: t })}
                    />
                </View>

                <View>
                    <Text className="text-white/80 mb-2 ml-1 font-medium">Valor do Serviço (R$)</Text>
                    <TextInput
                        placeholder="0,00"
                        placeholderTextColor="rgba(255, 255, 255, 0.4)"
                        keyboardType="numeric"
                        className="bg-white/10 border border-white/10 p-4 rounded-2xl text-white text-base focus:border-white/30"
                        value={service.valor}
                        onChangeText={(t) => setService({ ...service, valor: t })}
                    />
                </View>

                <View>
                    <Text className="text-white/80 mb-3 ml-1 font-medium">Categoria</Text>

                    <View className="flex-row flex-wrap">
                        {categorias.map((cat) => (
                            <Pressable
                                key={cat}
                                onPress={() => setService({ ...service, categoria: cat })}
                                className={`px-4 py-2 rounded-full border m-1 self-start ${service.categoria === cat
                                        ? "bg-blue-600 border-blue-600"
                                        : "bg-white/10 border-white/10"
                                    }`}
                            >
                                <Text
                                    className={`text-sm ${service.categoria === cat ? "text-white font-bold" : "text-white/60"
                                        }`}
                                    style={{
                                        paddingRight: 6,
                                        lineHeight: 18,
                                    }}
                                >
                                    {cat}
                                </Text>
                            </Pressable>
                        ))}
                    </View>
                </View>
            </View>

            <Pressable
                onPress={handleSaveService}
                className="bg-blue-600 py-4 rounded-2xl items-center mt-12 active:bg-blue-700 w-full"
            >
                <Text className="text-white font-bold text-lg">Adicionar serviço</Text>
            </Pressable>
        </View>
    );
};

export default ServiceForm;