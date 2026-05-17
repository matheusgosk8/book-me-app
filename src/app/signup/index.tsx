import RegisterForm from '@/components/forms/RegisterForm'
import { RegisterType } from '@/schemas/register'
import { publicApi } from '@/services/api'
import { ScrollView, Alert } from 'react-native'
import { useRouter } from 'expo-router'
import { useDispatch } from 'react-redux'
import { setAuth } from '@/store/slices/authSlice'
import { ApiResponse } from '@/types/Api'
import { RegisterSuccessData } from '@/types/User'
import * as SecureStore from 'expo-secure-store'

type Props = {}

function mapUserTypeToApi(userType: 'cliente' | 'profissional'): 'CUSTOMER' | 'PROVIDER' {
    return userType === 'cliente' ? 'CUSTOMER' : 'PROVIDER'
}

/** Monta corpo conforme contrato da API; no formulário, `rua` é o nome da via e `logradouro` é número/complemento. */
function buildRegisterPayload(values: RegisterType) {
    const digits = (s: string) => String(s).replace(/\D/g, '')
    const cep = digits(values.cep)
    const telefone = digits(values.telefone)
    const estado = values.estado.trim().toUpperCase()
    const streetLine = values.rua.trim()
    const streetNumber = values.logradouro.trim()

    const userCommon = {
        nome: values.nome.trim(),
        email: values.email.trim().toLowerCase(),
        senha: values.senha,
        userType: mapUserTypeToApi(values.userType),
        telefone,
        cep,
        cidade: values.cidade.trim(),
        estado,
        logradouro: streetLine,
        rua: streetNumber,
    }

    const user =
        values.userType === 'cliente'
            ? { ...userCommon, cpf: digits(values.cpf) }
            : { ...userCommon, cnpj: digits(values.cnpj) }

    return {
        user,
        address: {
            street: `${streetLine}, ${streetNumber}`,
            city: values.cidade.trim(),
            state: estado,
            postal_code: cep,
            country: 'BR',
        },
    }
}

const Signup = (props: Props) => {
    const router = useRouter()
    const dispatch = useDispatch()

    const handleSubmit = async (values: RegisterType) => {
        console.log('Registro submetido')

        try {
            const payload = buildRegisterPayload(values)
            const response = await publicApi.post<ApiResponse<RegisterSuccessData>>(
                '/public/register',
                payload,
            )

            const envelope = response.data?.data
            const statusOk =
                response.status === 200 &&
                envelope?.access_token &&
                envelope?.user

            if (!statusOk) {
                const msg =
                    envelope?.message ||
                    (response.data as { message?: string })?.message ||
                    'Erro ao registrar usuário.'
                Alert.alert('Erro', msg)
                return
            }

            const { user, access_token, refresh_token } = envelope

            const role = values.userType === 'profissional' ? 'provider' : 'customer'

            dispatch(
                setAuth({
                    token: access_token,
                    user: {
                        id: Number.parseInt(user.id, 10) || 0,
                        name: user.nome,
                        email: user.email,
                        role,
                    },
                }),
            )

            try {
                if (refresh_token) {
                    await SecureStore.setItemAsync('refreshToken', refresh_token)
                }
            } catch (e) {
                console.warn('[signup] falha ao salvar refresh token no SecureStore', e)
            }

            router.replace('/home')
        } catch (err: any) {
            console.error('Erro na requisição de registro:', err)
            const serverMsg =
                err?.response?.data?.message ||
                err?.response?.data?.Message ||
                err?.message ||
                'Erro de conexão'
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



