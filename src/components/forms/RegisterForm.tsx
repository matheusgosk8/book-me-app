import { Pressable, Text, View, ScrollView } from 'react-native'
import { useState } from 'react'
import { z } from 'zod'
import BasicsInfo from '../register/BasicsInfo'

const RegisterForm = () => {
    // Controla se o usuário já escolheu o perfil (Etapa 0) ou está no form (Etapa 1)
    const [step, setStep] = useState(0)

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

    const emptyErrors = {
        nome: '',
        email: '',
        cpf: '',
        cnpj: '',
        senha: '',
        confirmaSenha: '',
        telefone: '',
        cep: '',
        userType: '',
    }

    const [errors, setErrors] = useState(emptyErrors)

    const registerSchema = z.object({
        nome: z.string().min(1, 'Nome é obrigatório'),
        email: z.string().email('Email inválido'),
        userType: z.enum(['cliente', 'profissional']),
        cpf: z.string().optional().refine((val) => {
            if (values.userType === 'profissional') return true
            const clean = (val || '').replace(/\D/g, '')
            return clean.length === 11 && clean !== clean[0].repeat(11)
        }, { message: 'CPF inválido' }),
        cnpj: z.string().optional().refine((val) => {
            if (values.userType === 'cliente') return true
            const clean = (val || '').replace(/\D/g, '')
            return clean.length === 14 && clean !== clean[0].repeat(14)
        }, { message: 'CNPJ inválido' }),
        senha: z.string().min(8, 'Senha deve ter no mínimo 8 caracteres'),
        confirmaSenha: z.string().min(1, 'Confirmação é obrigatória'),
        telefone: z.string().refine(
            (v) => v.replace(/\D/g, '').length >= 10,
            { message: 'Telefone inválido' }
        ),
        cep: z.string().refine(
            (v) => v.replace(/\D/g, '').length === 8,
            { message: 'CEP inválido' }
        ),
    }).refine((data) => data.senha === data.confirmaSenha, {
        message: 'Senhas não coincidem',
        path: ['confirmaSenha'],
    })

    const formatCPF = (v: string) => v.replace(/\D/g, '').replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4').slice(0, 14)
    const formatCNPJ = (v: string) => v.replace(/\D/g, '').replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5').slice(0, 18)
    const formatCEP = (v: string) => v.replace(/\D/g, '').replace(/(\d{5})(\d{3})/, '$1-$2').slice(0, 9)

    const validateField = (field: keyof typeof values, currentValues: typeof values,) => {
        const result = registerSchema.safeParse(currentValues)
        if (!result.success) {
            const error = result.error.issues.find(issue => issue.path.includes(field))
            setErrors(prev => ({ ...prev, [field]: error ? error.message : '' }))
        } else {
            setErrors(prev => ({ ...prev, [field]: '' }))
        }
    }

    const handleFieldChange = (field: keyof typeof values, value: string) => {
        let finalValue = value
        if (field === 'cpf') finalValue = formatCPF(value)
        if (field === 'cnpj') finalValue = formatCNPJ(value)
        if (field === 'cep') finalValue = formatCEP(value)

        const newValues = { ...values, [field]: finalValue }
        setValues(newValues)
        validateField(field, newValues)
    }

    const validateAll = () => {
        const result = registerSchema.safeParse(values)
        if (result.success) {
            setErrors(emptyErrors)
            return true
        }
        const fieldErrors = { ...emptyErrors }
        result.error.issues.forEach(e => {
            const path = e.path[0] as keyof typeof emptyErrors
            if (path) fieldErrors[path] = e.message
        })
        setErrors(fieldErrors)
        return false
    }

    return (
        <ScrollView>
            <View className="px-6 py-12">
                
                {/* ETAPA 0: SELEÇÃO DE PERFIL */}
                {step === 0 && (
                    <View className="flex-1 justify-center py-10">
                        <Text className="color-white text-3xl font-bold mb-2">Seja bem-vindo!</Text>
                        <Text className="color-white/60 text-lg mb-10">Como você pretende utilizar o Book Me?</Text>
                        
                        <View className="gap-y-4">
                            <Pressable 
                                onPress={() => { setValues({...values, userType: 'cliente'}); setStep(1); }}
                                className="bg-white/5 border border-white/10 p-6 rounded-2xl active:bg-white/10"
                            >
                                <Text className="color-white text-xl font-bold mb-1">Sou Cliente</Text>
                                <Text className="color-white/50">Quero buscar serviços e agendar horários.</Text>
                            </Pressable>

                            <Pressable 
                                onPress={() => { setValues({...values, userType: 'profissional'}); setStep(1); }}
                                className="bg-white/5 border border-white/10 p-6 rounded-2xl active:bg-white/10"
                            >
                                <Text className="color-white text-xl font-bold mb-1">Sou Profissional</Text>
                                <Text className="color-white/50">Quero oferecer meus serviços e gerenciar agenda.</Text>
                            </Pressable>
                        </View>
                    </View>
                )}

                {/* ETAPA 1: FORMULÁRIO DE DADOS */}
                {step === 1 && (
                    <View>
                        <Pressable onPress={() => setStep(0)} className="mb-6 py-2">
                            <Text className="color-white font-bold">← Voltar e alterar perfil</Text>
                        </Pressable>

                        <Text className="color-[#EEEEEE] text-2xl font-bold mb-4">
                            Cadastro de {values.userType === 'cliente' ? 'Cliente' : 'Profissional'}
                        </Text>

                        <BasicsInfo
                            values={values}
                            errors={errors}
                            handleFieldChange={handleFieldChange}
                            validateField={() => validateField}
                        />

                        <Pressable
                            className="bg-blue-600 px-6 py-4 rounded-xl items-center justify-center mt-6 mb-8 w-full active:bg-blue-700"
                            onPress={() => {
                                if (validateAll()) {
                                    console.log("Sucesso!", values)
                                }
                            }}
                        >
                            <Text className="color-white text-lg font-bold">Criar Minha Conta</Text>
                        </Pressable>
                    </View>
                )}
            </View>
        </ScrollView>
    )
}

export default RegisterForm