import RegisterForm from '@/components/forms/RegisterForm'
import BasicsInfo from '@/components/register/BasicsInfo'
import { publicApi } from '@/services/api'
import addressSchema, { AddressType } from '@/types/Address'
import { BasicsInfoType } from '@/types/User'
import { ScrollView, Alert } from 'react-native'
import { useRouter } from 'expo-router'
import { RootState } from '@/store/store'
import { useDispatch, useSelector } from 'react-redux'
import { setAuth } from '@/store/slices/authSlice'

type Props = {}

const Signup = (props: Props) => {

    const router = useRouter();
    const dispatch = useDispatch()

    //Assim que ajustar o backend, esse tipo de resposta deve ser ajustado para refletir a resposta real da API
    /*
        type SignupResponse = {
          data: {
            id: string,
            token: string,
          },
            code: number,
            message: string
          }
    
          2 - Melhorar a aparência dos toasts
          3- / book-me-app\src\services\api.ts - colocar o token no interceptador de requisições privadas
    */
    
    type SignupResponse = {
        user: {
            id: string,
            cep: string,
            cidade: string,
            cnpj: string,
            confirmaSenha: string,
            cpf: string,
            email: string,
            estado: string,
            logradouro: string,
            nome: string,
            rua: string,
            senha: string,
            telefone: string,
            userType: string,
        },
        token: string,
        code: number,
        message: string
}


const handleSubmit = async (values: any) => {
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

        if (response.status === 200 || response.data.code === 200) {
            console.log('Registro bem-sucedido:', response.data)


            dispatch(setAuth({
                token: response.data.token,
                userId: response.data.user.id
            }))

            router.replace('/home')
            return
        }

        const msg = response.data?.message || 'Erro ao registrar usuário.'
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



