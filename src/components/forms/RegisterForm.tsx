import { Pressable, Text, TextInput, View, ScrollView } from 'react-native'
import { useState } from 'react'
import { z } from 'zod'

type Props = {}

const RegisterForm = (props: Props) => {
    const [values, setValues] = useState({
        nome: '',
        email: '',
        senha: '',
        telefone: '',
        userType: 'cliente' as 'cliente' | 'profissional',
    })

    const [errors, setErrors] = useState({
        nome: '',
        email: '',
        senha: '',
        telefone: '',
        userType: '',
    })

    // Schema Zod para validação dinâmica
    const registerSchema = z.object({
        nome: z.string().min(1, 'Nome é obrigatório'),
        email: z.string().email('Email inválido'),
        senha: z.string().min(8, 'Senha deve ter no mínimo 8 caracteres'),
        telefone: z.string().refine(
            (val) => val.replace(/\D/g, '').length >= 10,
            { message: 'Telefone inválido' }
        ),
        userType: z.enum(['cliente', 'profissional']),
    })

    const handleFieldChange = (field: keyof typeof values, value: string) => {
        setValues(prev => ({ ...prev, [field]: value }))
        // Validação dinâmica ao digitar
        validateField(field, value)
    }

    const validateField = (field: keyof typeof values, value: string) => {
        try {
            const fieldSchema = registerSchema.shape[field] as unknown as z.ZodType<any, any, any>
            fieldSchema.parse(value)
            setErrors(prev => ({ ...prev, [field]: '' }))
        } catch (err: any) {
            // Extrai a mensa÷ão do primeiro erro do Zod
            let errorMsg = 'Campo inválido'
            if (err instanceof z.ZodError) {
                errorMsg = err.issues[0]?.message || 'Campo inválido'
            } else if (err?.errors && Array.isArray(err.errors)) {
                errorMsg = err.errors[0]?.message || 'Campo inválido'
            }
            setErrors(prev => ({ ...prev, [field]: errorMsg }))
        }
    }

    const validateAll = () => {
        try {
            registerSchema.parse(values)
            setErrors({ nome: '', email: '', senha: '', telefone: '', userType: '' })
            return true
        } catch (err: any) {
            const fieldErrors: any = { nome: '', email: '', senha: '', telefone: '', userType: '' }
            if (err instanceof z.ZodError) {
                err.issues.forEach((e: any) => {
                    if (e.path && e.path[0]) fieldErrors[e.path[0]] = e.message
                })
            } else if (err?.errors && Array.isArray(err.errors)) {
                err.errors.forEach((e: any) => {
                    if (e.path && e.path[0]) fieldErrors[e.path[0]] = e.message
                })
            }
            setErrors(fieldErrors)
            return false
        }
    }

    return (
        <View className="flex-1 w-full max-h-dvh">
            <Text className="color-[#EEEEEE] text-2xl font-bold mb-4">Registar</Text>

            <Text className="color-[#EEEEEE] mb-6 text-base">
                Bem vindo ao Book Me, o app de agendamento que conecta profissionais a seus clientes. Clientes podem buscar serviços e marcar horários diretamente no app, e os profissionais recebem notificações para organizar sua agenda.
            </Text>

            {/* Toggle de perfil */}
            <View className="flex-row gap-2 mb-6">
                <Pressable
                    className={`flex-1 py-3 rounded-lg ${values.userType === 'cliente' ? 'bg-blue-500' : 'bg-gray-700'}`}
                    onPress={() => handleFieldChange('userType', 'cliente')}
                >
                    <Text className="text-center text-white font-semibold">Cliente</Text>
                </Pressable>
                <Pressable
                    className={`flex-1 py-3 rounded-lg ${values.userType === 'profissional' ? 'bg-blue-500' : 'bg-gray-700'}`}
                    onPress={() => handleFieldChange('userType', 'profissional')}
                >
                    <Text className="text-center text-white font-semibold">Profissional</Text>
                </Pressable>
            </View>

            <View>
                <View>
                    <Text className="color-[#EEEEEE] mt-1">Nome</Text>
                    <TextInput
                        placeholder="Seu nome"
                        placeholderTextColor="#CCCCFF"
                        className="bg-white/10 rounded-md px-4 py-3"
                        value={values.nome}
                        onChangeText={text => handleFieldChange('nome', text)}
                        onBlur={() => validateField('nome', values.nome)}
                    />
                    <View className="h-6">
                        {errors.nome && <Text className="text-yellow-400 text-sm mt-1">{errors.nome}</Text>}
                    </View>
                </View>

                <View>
                    <Text className="color-[#EEEEEE] mt-1">Email</Text>
                    <TextInput
                        placeholder="email@exemplo.com"
                        placeholderTextColor="#CCCCFF"
                        keyboardType="email-address"
                        autoCapitalize="none"
                        className="bg-white/10 rounded-md px-4 py-3"
                        value={values.email}
                        onChangeText={text => handleFieldChange('email', text)}
                        onBlur={() => validateField('email', values.email)}
                    />
                    <View className="h-6">
                        {errors.email && <Text className="text-yellow-400 text-sm mt-1">{errors.email}</Text>}
                    </View>
                </View>

                <View>
                    <Text className="color-[#EEEEEE] mt-1">Senha</Text>
                    <TextInput
                        placeholder="••••••••"
                        placeholderTextColor="#CCCCFF"
                        secureTextEntry={true}
                        className="bg-white/10 rounded-md px-4 py-3"
                        value={values.senha}
                        onChangeText={text => handleFieldChange('senha', text)}
                        onBlur={() => validateField('senha', values.senha)}
                    />
                    <View className="h-6">
                        {errors.senha && <Text className="text-yellow-400 text-sm mt-1">{errors.senha}</Text>}
                    </View>
                </View>

                <View>
                    <Text className="color-[#EEEEEE] mt-1">Telefone</Text>
                    <TextInput
                        placeholder="(00) 00000-0000"
                        placeholderTextColor="#CCCCFF"
                        keyboardType="phone-pad"
                        className="bg-white/10 rounded-md px-4 py-3"
                        value={values.telefone}
                        onChangeText={text => handleFieldChange('telefone', text)}
                        onBlur={() => validateField('telefone', values.telefone)}
                    />
                    <View className="h-6">
                        {errors.telefone && <Text className="text-yellow-400 text-sm mt-1">{errors.telefone}</Text>}
                    </View>
                </View>

                <Pressable
                    className="bg-black px-6 py-3 rounded-lg items-center mt-4"
                    onPress={() => {
                        if (validateAll()) {
                            // Aqui você pode enviar os dados
                        }
                    }}
                >
                    <Text className="color-[#EEEEEE] text-lg">Enviar</Text>
                </Pressable>
            </View>
        </View>
    )
}

export default RegisterForm



