import { Pressable, TextInput, View, ScrollView, Text } from 'react-native'
import { useState } from 'react'
import { router } from "expo-router";

type Props = {}

const LoginForm = (props: Props) => {
    const [values, setValues] = useState({
        email: '',
        senha: '',
    })

    const [errors, setErrors] = useState({
        email: '',
        senha: '',
    })

    const handleFieldChange = (field: keyof typeof values, value: string) => {
        setValues(prev => ({ ...prev, [field]: value }))
    }

    const validateField = (field: keyof typeof values, value: string) => {
        let error = ''
        if (
            field === 'email' &&
            !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
        ) {
            error = 'Email inválido'
        } else if (field === 'senha' && value.length < 8) {
            error = 'Senha deve ter no mínimo 8 caracteres'
        }
        setErrors(prev => ({ ...prev, [field]: error }))
    }

    return (
        <View className="flex-1 w-full px-2">
            {/* Título mais impactante */}
            <Text className="text-white text-4xl font-bold mb-2">Login</Text>

            {/* Texto de apoio mais discreto e curto (UX melhor) */}
            <Text className="text-white/60 text-base mb-8 leading-5">
                Acesse sua conta para gerenciar seus agendamentos no Book Me.
            </Text>

            <View className="gap-y-2">
                {/* Campo de Email */}
                <View>
                    <Text className="text-white/80 ml-1 mb-1 font-medium">Email</Text>
                    <TextInput
                        placeholder="email@exemplo.com"
                        placeholderTextColor="rgba(255, 255, 255, 0.4)"
                        keyboardType="email-address"
                        autoCapitalize="none"
                        className="bg-white/10 border border-white/10 rounded-2xl px-4 py-4 text-white text-base focus:border-white/30"
                        value={values.email}
                        onChangeText={text => handleFieldChange('email', text)}
                        onBlur={() => validateField('email', values.email)}
                    />
                    <View className="h-5 justify-center">
                        {errors.email && <Text className="text-red-400 text-xs ml-2">{errors.email}</Text>}
                    </View>
                </View>

                {/* Campo de Senha */}
                <View>
                    <Text className="text-white/80 ml-1 mb-1 font-medium">Senha</Text>
                    <TextInput
                        placeholder="••••••••"
                        placeholderTextColor="rgba(255, 255, 255, 0.4)"
                        secureTextEntry={true}
                        className="bg-white/10 border border-white/10 rounded-2xl px-4 py-4 text-white text-base focus:border-white/30"
                        value={values.senha}
                        onChangeText={text => handleFieldChange('senha', text)}
                        onBlur={() => validateField('senha', values.senha)}
                    />
                    <View className="h-5 justify-center">
                        {errors.senha && <Text className="text-red-400 text-xs ml-2">{errors.senha}</Text>}
                    </View>
                </View>

                {/* Botão Entrar com estilo de destaque */}
                <Pressable
                    style={({ pressed }) => ({ transform: [{ scale: pressed ? 0.98 : 1 }] })}
                    className="bg-white py-4 rounded-2xl items-center mt-4 active:bg-white/90 shadow-lg"
                >
                    <Text className="text-blue-600 font-bold text-lg">Entrar</Text>
                </Pressable>

                {/* Link para recuperar senha */}
                <Pressable 
                onPress={() => router.push("/forgot")}
                className="mt-4 items-center">
                    <Text
                  numberOfLines={1}
                  adjustsFontSizeToFit
                  className="text-white/60 text-base text-center"
                >Esqueceu sua senha?</Text>
                </Pressable>
            </View>
        </View>
    )
}

export default LoginForm



