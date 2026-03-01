import RegisterForm from '@/components/forms/RegisterForm'
import { ScrollView } from 'react-native'

type Props = {}

const Signup = (props: Props) => {
    return (
        <ScrollView contentContainerStyle={{ flexGrow: 1 }} className="px-4 py-6">
            <RegisterForm/>
        </ScrollView>
    )
}

export default Signup



