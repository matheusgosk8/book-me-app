import RegisterForm from '@/components/forms/RegisterForm'
import { ScrollView } from 'react-native'

type Props = {}

const Signup = (props: Props) => {
    const handleSubmit = (values: any) => {
        // aqui você pode enviar para a API ou navegar
        console.log('Registro submetido:', values)
    }

    return (
        <ScrollView contentContainerStyle={{ flexGrow: 1 }} className="px-4 py-6">
            <RegisterForm onSubmit={handleSubmit} />
        </ScrollView>
    )
}

export default Signup



