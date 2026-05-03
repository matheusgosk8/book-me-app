import { Pressable, TextInput, View, Text, Platform } from 'react-native'
import { useState } from 'react'
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useDispatch } from 'react-redux';
import { setAuth } from '@/store/slices/authSlice';
import { email } from 'zod';
import { publicApi } from '@/services/api';
import * as SecureStore from 'expo-secure-store';
import { LoginResponse } from '@/types/User';
import { ApiResponse } from '@/types/Api';

type Props = {}

const LoginForm = (props: Props) => {
    const router = useRouter();
    const insets = useSafeAreaInsets();
    const dispatch = useDispatch();

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
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: '' }));
        }
    };

    const validateField = (field: keyof typeof values, value: string) => {
        let error = '';
        if (field === 'email') {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!value) error = 'O email é obrigatório';
            else if (!emailRegex.test(value)) error = 'Email inválido';
        }

        if (field === 'senha') {
            if (!value) error = 'A senha é obrigatória';
            else if (value.length < 8) error = 'Senha deve ter no mínimo 8 caracteres';
        }

        setErrors(prev => ({ ...prev, [field]: error }));
        return error;
    };

    const handleLogin = async () => {
        try {
            console.log("Tentando acesso ao servidor...");
            const response = await publicApi.post<ApiResponse<LoginResponse>>('/public/login', {
                email: values.email,
                senha: values.senha,
            });

            const { user, access_token, refresh_token } = response.data.data;

            //Refresh token pode ser armazenado usando SecureStore ou AsyncStorage, dependendo da sua escolha de persistência

            

   
            dispatch(setAuth({
                token: access_token,
                user: {
                    id: parseInt(user.id),
                    name: user.nome,
                    email: user.email,
                    role: user.role
                }
            }))

            // salva refresh token de forma segura
            try {
                if (refresh_token) {
                    await SecureStore.setItemAsync('refreshToken', refresh_token);
                    console.log('[login] refresh token salvo no SecureStore');
                }
            } catch (e) {
                console.warn('[login] falha ao salvar refresh token no SecureStore', e);
            }

            console.log("Login realizado com sucesso!");
            router.replace("/home");

        } catch (error: any) {
            console.error("Erro detalhado:", error.response?.status, error.message);
            const serverMessage = error.response?.data?.message || "Ocorreu um erro inesperado. Tente novamente.";
            alert(serverMessage);
        }
    };

    return (
        <View
            className="flex-1 w-full px-2"
            style={{
                paddingTop: insets.top > 0 ? insets.top + 10 : 40
            }}
        >
            <Text className="text-white text-4xl font-bold mb-2">Login</Text>
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
                        {errors.email && <Text className="text-yellow-500 text-xs ml-2">{errors.email}</Text>}
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
                        {errors.senha && <Text className="text-yellow-500 text-xs ml-2">{errors.senha}</Text>}
                    </View>
                </View>

                {/* Botão Entrar*/}
                <Pressable
                    onPress={handleLogin}
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
