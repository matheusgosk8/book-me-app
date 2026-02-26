import LoginForm from '@/components/forms/LoginForm'
import { Pressable, Text, TextInput, View, ScrollView } from 'react-native'

type Props = {}

const Signup = (props: Props) => {
    return (
        <ScrollView contentContainerStyle={{ flexGrow: 1 }} className="px-4 py-6">
            <LoginForm/>
        </ScrollView>
    )
}

export default Signup



