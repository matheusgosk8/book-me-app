import { Link } from "expo-router";
import { Text, TouchableOpacity, View } from "react-native";

 {/* ====== CTA FINAL ====== */}
 export default function Cta() {
  return (
       <View className="px-6 pb-8 items-center w-full">
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
  );
}