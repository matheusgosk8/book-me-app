import { Pressable, TextInput, View, Text, Platform } from 'react-native'
import { useState } from 'react'
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useDispatch } from 'react-redux';
import { setAuth } from '@/store/slices/authSlice';
import { email } from 'zod';
import { publicApi } from '@/services/api';

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
        const emailError = validateField('email', values.email);
        const senhaError = validateField('senha', values.senha);

        if (!emailError && !senhaError) {
        try {
            console.log("Tentando acesso ao servidor...");

            const response = await publicApi.post('/public/login', {
                email: values.email,
                senha: values.senha,
            });

            const data = response.data;
            
            dispatch(setAuth({
                token: data.token,
                userId: data.user.id
            }));

            console.log("Login realizado com sucesso!");
            router.replace("/home");

        } catch (error: any) {

            const mensagem = error.response?.data?.message || "Erro ao conectar ao servidor";
            alert(mensagem);
            console.error("Erro no login:", error);
        }

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
