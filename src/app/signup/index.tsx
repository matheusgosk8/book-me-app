import RegisterForm from '@/components/forms/RegisterForm'
import BasicsInfo from '@/components/register/BasicsInfo'
import { publicApi } from '@/services/api'
import addressSchema, { AddressType } from '@/types/Address'
import { BasicsInfoType } from '@/types/User'
import { ScrollView, Alert } from 'react-native'
import { useRouter } from 'expo-router'

type Props = {}

const Signup = (props: Props) => {
    const router = useRouter();

 type SignupResponse = {
        User: BasicsInfoType & AddressType,
        Code: number,
        Message: string

    }


    const handleSubmit = async(values: any) => {
        console.log('Registro submetido:', values)

        const cleanPayload = (v: any) => {
            const out = { ...v }
            if (typeof out.cpf === 'string') out.cpf = out.cpf.replace(/\D/g, '')
            if (typeof out.cep === 'string') out.cep = out.cep.replace(/\D/g, '')
            if (typeof out.cnpj === 'string') out.cnpj = out.cnpj.replace(/\D/g, '')
            if (typeof out.telefone === 'string') out.telefone = out.telefone.replace(/\D/g, '')
            return out
        }

        try {
            const payload = cleanPayload(values)
            const response = await publicApi.post<SignupResponse>('/public/register', payload)

            if (response.status === 200 || response.data.Code === 200) {
                console.log('Registro bem-sucedido:', response.data)
                router.replace('/home')
                return
            }

            const msg = response.data?.Message || 'Erro ao registrar usuário.'
            Alert.alert('Erro', msg)

        } catch (err: any) {
            console.error('Erro na requisição de registro:', err)
            const serverMsg = err?.response?.data?.Message || err?.message || 'Erro de conexão'
            Alert.alert('Erro', String(serverMsg))
        }

    }

    return (
        <ScrollView contentContainerStyle={{ flexGrow: 1 }} className="px-4 py-6">
            <RegisterForm onSubmit={handleSubmit} />
        </ScrollView>
    )
}

export default Signup



