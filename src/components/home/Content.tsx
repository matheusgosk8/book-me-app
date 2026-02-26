import { View, Text, TouchableOpacity } from 'react-native'
import { Link } from 'expo-router'

const  Content =()=> {



  return (
    <View className="flex-1 justify-center items-center px-4">
      <View className="max-w-[700px] w-full flex flex-col items-center gap-6 text-center ">

        {/* Título */}
        <Text className="text-5xl font-roboto font-bold text-white">
          Book Me 
        </Text>

        {/* Descrição */}
        <Text className="text-lg md:text-xl text-gray-300 dark:text-gray-400 text-center">
          Book Me é um app de agendamento que conecta profissionais a seus clientes. 
          Clientes podem buscar serviços e marcar horários diretamente no app, 
          e os profissionais recebem notificações para organizar sua agenda.
        </Text>

        {/* Botões de ação */}
        <View className="flex flex-row gap-4 mt-4">
          <TouchableOpacity className="bg-black px-6 py-3 rounded-lg">
            <Link href="/sobre" asChild>
              <Text className="text-white text-lg font-roboto font-medium">
                Saiba Mais
              </Text>
            </Link>
          </TouchableOpacity>

          <TouchableOpacity className="bg-gray-200 px-6 py-3 rounded-lg">
            {/* <Link href="/signup" asChild>
              <Text className="text-black text-lg font-roboto font-medium">
                Comece Agora
              </Text>
            </Link> */}
          </TouchableOpacity>
        </View>
      </View>
    </View>
  )
}

export default Content