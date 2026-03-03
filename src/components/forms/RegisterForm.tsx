import { Pressable, Text, TextInput, View, ScrollView } from 'react-native'
import { useState } from 'react'
import { z } from 'zod'

type Props = {}

const RegisterForm = (props: Props) => {
    const [values, setValues] = useState({
        nome: '',
        email: '',
        cpf: '',
        cnpj: '',
        senha: '',
        confirmaSenha: '',
        telefone: '',
        cep: '',
        userType: 'cliente' as 'cliente' | 'profissional',
    })

    const [errors, setErrors] = useState({
        nome: '',
        email: '',
        cpf: '',
        cnpj: '',
        senha: '',
        confirmaSenha: '',
        telefone: '',
        cep: '',
        userType: '',
    })

    // Schema Zod para validação dinâmica
    const registerSchema = z.object({
        nome: z.string().min(1, 'Nome é obrigatório'),
        email: z.string().email('Email inválido'),
        cpf: z.string().refine(
            (val) => {
                // CPF é obrigatório apenas para clientes
                if (values.userType === 'profissional') return true
                const cleanCPF = val.replace(/\D/g, '')
                if (cleanCPF.length !== 11) return false
                if (cleanCPF === cleanCPF[0].repeat(11)) return false
                return true
            },
            { message: 'CPF inválido' }
        ),
        cnpj: z.string().refine(
            (val) => {
                // CNPJ é obrigatório apenas para profissionais
                if (values.userType === 'cliente') return true
                const cleanCNPJ = val.replace(/\D/g, '')
                if (cleanCNPJ.length !== 14) return false
                if (cleanCNPJ === cleanCNPJ[0].repeat(14)) return false
                return true
            },
            { message: 'CNPJ inválido' }
        ),
        senha: z.string().min(8, 'Senha deve ter no mínimo 8 caracteres'),
        confirmaSenha: z.string().min(1, 'Confirmação é obrigatória'),
        telefone: z.string().refine(
            (val) => val.replace(/\D/g, '').length >= 10,
            { message: 'Telefone inválido' }
        ),
        cep: z.string().refine(
            (val) => val.replace(/\D/g, '').length === 8,
            { message: 'CEP inválido' }
        ),
        userType: z.enum(['cliente', 'profissional']),
    }).refine((data) => data.senha === data.confirmaSenha, {
        message: 'Senhas não coincidem',
        path: ['confirmaSenha'],
    })

    const handleFieldChange = (field: keyof typeof values, value: string) => {
        let finalValue = value
        
        // Formata CPF automaticamente
        if (field === 'cpf') {
            const cleanCPF = value.replace(/\D/g, '').slice(0, 11)
            if (cleanCPF.length <= 3) {
                finalValue = cleanCPF
            } else if (cleanCPF.length <= 6) {
                finalValue = `${cleanCPF.slice(0, 3)}.${cleanCPF.slice(3)}`
            } else if (cleanCPF.length <= 9) {
                finalValue = `${cleanCPF.slice(0, 3)}.${cleanCPF.slice(3, 6)}.${cleanCPF.slice(6)}`
            } else {
                finalValue = `${cleanCPF.slice(0, 3)}.${cleanCPF.slice(3, 6)}.${cleanCPF.slice(6, 9)}-${cleanCPF.slice(9)}`
            }
        }
        
        // Formata CEP automaticamente
        if (field === 'cep') {
            const cleanCEP = value.replace(/\D/g, '').slice(0, 8)
            if (cleanCEP.length <= 5) {
                finalValue = cleanCEP
            } else {
                finalValue = `${cleanCEP.slice(0, 5)}-${cleanCEP.slice(5)}`
            }
        }
        // Formata CNPJ automaticamente
        if (field === 'cnpj') {
            const cleanCNPJ = value.replace(/\D/g, '').slice(0, 14)
            if (cleanCNPJ.length <= 2) {
                finalValue = cleanCNPJ
            } else if (cleanCNPJ.length <= 5) {
                finalValue = `${cleanCNPJ.slice(0, 2)}.${cleanCNPJ.slice(2)}`
            } else if (cleanCNPJ.length <= 8) {
                finalValue = `${cleanCNPJ.slice(0, 2)}.${cleanCNPJ.slice(2, 5)}.${cleanCNPJ.slice(5)}`
            } else if (cleanCNPJ.length <= 12) {
                finalValue = `${cleanCNPJ.slice(0, 2)}.${cleanCNPJ.slice(2, 5)}.${cleanCNPJ.slice(5, 8)}/${cleanCNPJ.slice(8)}`
            } else {
                finalValue = `${cleanCNPJ.slice(0, 2)}.${cleanCNPJ.slice(2, 5)}.${cleanCNPJ.slice(5, 8)}/${cleanCNPJ.slice(8, 12)}-${cleanCNPJ.slice(12)}`
            }
        }
        
        setValues(prev => ({ ...prev, [field]: finalValue }))
        // Validação dinâmica ao digitar
        validateField(field, finalValue)
    }

    const validateField = (field: keyof typeof values, value: string) => {
        try {
            // Validação especial para confirmaSenha
            if (field === 'confirmaSenha') {
                if (!value) {
                    setErrors(prev => ({ ...prev, [field]: 'Confirmação é obrigatória' }))
                    return
                }
                if (value !== values.senha) {
                    setErrors(prev => ({ ...prev, [field]: 'Senhas não coincidem' }))
                    return
                }
                setErrors(prev => ({ ...prev, [field]: '' }))
                return
            }
            
            const fieldSchema = registerSchema.shape[field] as unknown as z.ZodType<any, any, any>
            fieldSchema.parse(value)
            setErrors(prev => ({ ...prev, [field]: '' }))
        } catch (err: any) {
            // Extrai a mensagem do primeiro erro do Zod
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
            setErrors({ nome: '', email: '', cpf: '', senha: '', confirmaSenha: '', telefone: '', cep: '', userType: '' })
            return true
        } catch (err: any) {
            const fieldErrors: any = { nome: '', email: '', cpf: '', senha: '', confirmaSenha: '', telefone: '', cep: '', userType: '' }
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
        <View className="flex-1 w-full">
            <ScrollView className="flex-1" contentContainerClassName="px-4 py-6">
                <Text className="color-[#EEEEEE] text-2xl font-bold mb-4">Registrar</Text>

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
                        className="bg-white/10 rounded-md px-4 py-3 text-white"
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
                        className="bg-white/10 rounded-md px-4 py-3 text-white"
                        value={values.email}
                        onChangeText={text => handleFieldChange('email', text)}
                        onBlur={() => validateField('email', values.email)}
                    />
                    <View className="h-6">
                        {errors.email && <Text className="text-yellow-400 text-sm mt-1">{errors.email}</Text>}
                    </View>
                </View>

                {values.userType === 'cliente' ? (
                    <View>
                        <Text className="color-[#EEEEEE] mt-1">CPF</Text>
                        <TextInput
                            placeholder="000.000.000-00"
                            placeholderTextColor="#CCCCFF"
                            keyboardType="numeric"
                            className="bg-white/10 rounded-md px-4 py-3 text-white"
                            value={values.cpf}
                            onChangeText={text => handleFieldChange('cpf', text)}
                            onBlur={() => validateField('cpf', values.cpf)}
                        />
                        <View className="h-6">
                            {errors.cpf && <Text className="text-yellow-400 text-sm mt-1">{errors.cpf}</Text>}
                        </View>
                    </View>
                ) : (
                    <View>
                        <Text className="color-[#EEEEEE] mt-1">CNPJ</Text>
                        <TextInput
                            placeholder="00.000.000/0000-00"
                            placeholderTextColor="#CCCCFF"
                            keyboardType="numeric"
                            className="bg-white/10 rounded-md px-4 py-3 text-white"
                            value={values.cnpj}
                            onChangeText={text => handleFieldChange('cnpj', text)}
                            onBlur={() => validateField('cnpj', values.cnpj)}
                        />
                        <View className="h-6">
                            {errors.cnpj && <Text className="text-yellow-400 text-sm mt-1">{errors.cnpj}</Text>}
                        </View>
                    </View>
                )}

                <View>
                    <Text className="color-[#EEEEEE] mt-1">Telefone</Text>
                    <TextInput
                        placeholder="(00) 00000-0000"
                        placeholderTextColor="#CCCCFF"
                        keyboardType="phone-pad"
                        className="bg-white/10 rounded-md px-4 py-3 text-white"
                        value={values.telefone}
                        onChangeText={text => handleFieldChange('telefone', text)}
                        onBlur={() => validateField('telefone', values.telefone)}
                    />
                    <View className="h-6">
                        {errors.telefone && <Text className="text-yellow-400 text-sm mt-1">{errors.telefone}</Text>}
                    </View>
                </View>

                <View>
                    <Text className="color-[#EEEEEE] mt-1">CEP</Text>
                    <TextInput
                        placeholder="00000-000"
                        placeholderTextColor="#CCCCFF"
                        keyboardType="numeric"
                        className="bg-white/10 rounded-md px-4 py-3 text-white"
                        value={values.cep}
                        onChangeText={text => handleFieldChange('cep', text)}
                        onBlur={() => validateField('cep', values.cep)}
                    />
                    <View className="h-6">
                        {errors.cep && <Text className="text-yellow-400 text-sm mt-1">{errors.cep}</Text>}
                    </View>
                </View>

                <View>
                    <Text className="color-[#EEEEEE] mt-1">Senha</Text>
                    <TextInput
                        placeholder="••••••••"
                        placeholderTextColor="#CCCCFF"
                        secureTextEntry={true}
                        className="bg-white/10 rounded-md px-4 py-3 text-white"
                        value={values.senha}
                        onChangeText={text => handleFieldChange('senha', text)}
                        onBlur={() => validateField('senha', values.senha)}
                    />
                    <View className="h-6">
                        {errors.senha && <Text className="text-yellow-400 text-sm mt-1">{errors.senha}</Text>}
                    </View>
                </View>

                <View>
                    <Text className="color-[#EEEEEE] mt-1">Confirmar Senha</Text>
                    <TextInput
                        placeholder="••••••••"
                        placeholderTextColor="#CCCCFF"
                        secureTextEntry={true}
                        className="bg-white/10 rounded-md px-4 py-3 text-white"
                        value={values.confirmaSenha}
                        onChangeText={text => handleFieldChange('confirmaSenha', text)}
                        onBlur={() => validateField('confirmaSenha', values.confirmaSenha)}
                    />
                    <View className="h-6">
                        {errors.confirmaSenha && <Text className="text-yellow-400 text-sm mt-1">{errors.confirmaSenha}</Text>}
                    </View>
                </View>

                <Pressable
                    className="bg-black px-6 py-3 rounded-lg items-center justify-center mt-4 mb-8 w-full"
                    onPress={() => {
                        if (validateAll()) {
                            // Aqui você pode enviar os dados
                        }
                    }}
                >
                    <Text className="color-[#EEEEEE] text-base font-semibold">Enviar</Text>
                </Pressable>
                </View>
            </ScrollView>
        </View>
    )
}

export default RegisterForm



