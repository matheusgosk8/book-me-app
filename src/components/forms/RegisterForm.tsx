import { Pressable, Text, TextInput, View, ScrollView } from 'react-native'
import { useState } from 'react'
import { z } from 'zod'

type Props = {}

const RegisterForm = (props: Props) => {
    const [values, setValues] = useState({
        nome: '',
        email: '',
        senha: '',
        telefone: ''
    })

    const [errors, setErrors] = useState({
        nome: '',
        email: '',
        senha: '',
        telefone: ''
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
            setErrors(prev => ({ ...prev, [field]: err.errors?.[0]?.message || 'Campo inválido' }))
        }
    }

    const validateAll = () => {
        try {
            registerSchema.parse(values)
            setErrors({ nome: '', email: '', senha: '', telefone: '' })
            return true
        } catch (err: any) {
            const fieldErrors: any = { nome: '', email: '', senha: '', telefone: '' }
            err.errors?.forEach((e: any) => {
                if (e.path && e.path[0]) fieldErrors[e.path[0]] = e.message
            })
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
                        {errors.nome && <Text className="text-red-400 text-sm mt-1">{errors.nome}</Text>}
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
                        {errors.email && <Text className="text-red-400 text-sm mt-1">{errors.email}</Text>}
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
                        {errors.senha && <Text className="text-red-400 text-sm mt-1">{errors.senha}</Text>}
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
                        {errors.telefone && <Text className="text-red-400 text-sm mt-1">{errors.telefone}</Text>}
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



