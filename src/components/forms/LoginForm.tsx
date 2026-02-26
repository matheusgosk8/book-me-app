import { Pressable, Text, TextInput, View, ScrollView } from 'react-native'

type Props = {}

const LoginForm = (props: Props) => {
    return (
        <View className="flex-1 w-full max-h-dvh">
            <Text className="text-2xl font-bold mb-4">Login</Text>

            <Text className="mb-6 text-base">
                Bem vindo ao Book Me, o app de agendamento que conecta profissionais a seus clientes. Clientes podem buscar serviços e marcar horários diretamente no app, e os profissionais recebem notificações para organizar sua agenda.
            </Text>

            <View className="space-y-4">
                <View>
                    <Text className="mb-2">Nome</Text>
                    <TextInput
                        placeholder="Seu nome"
                        className="bg-white/10 rounded-md px-4 py-3"
                    />
                </View>

                <View>
                    <Text className="mb-2">Email</Text>
                    <TextInput
                        placeholder="email@exemplo.com"
                        keyboardType="email-address"
                        autoCapitalize="none"
                        className="bg-white/10 rounded-md px-4 py-3"
                    />
                </View>

                <View>
                    <Text className="mb-2">Senha</Text>
                    <TextInput
                        placeholder="••••••••"
                        secureTextEntry={true}
                        className="bg-white/10 rounded-md px-4 py-3"
                    />
                </View>

                <View>
                    <Text className="mb-2">Telefone</Text>
                    <TextInput
                        placeholder="(00) 00000-0000"
                        keyboardType="phone-pad"
                        className="bg-white/10 rounded-md px-4 py-3"
                    />
                </View>

                <Pressable className="bg-black px-6 py-3 rounded-lg items-center mt-4">
                    <Text className="text-white text-lg">Entrar</Text>
                </Pressable>
            </View>
        </View>
    )
}

export default LoginForm



