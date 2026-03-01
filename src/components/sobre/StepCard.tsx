import { Text } from "react-native";
import { View } from "react-native";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";


function StepCard({
  step,
  title,
  description,
  icon,
  color,
  isLast,
}: {
  step: number;
  title: string;
  description: string;
  icon: string;
  color: string;
  isLast?: boolean;
}) {
  return (
    <View className="flex-row mb-1">
      {/* Linha vertical + número */}
      <View className="items-center mr-4">
        <View
          className="w-10 h-10 rounded-full items-center justify-center"
          style={{ backgroundColor: color }}
        >
          <Text className="text-white font-bold text-sm">{step}</Text>
        </View>
        {!isLast && <View className="w-0.5 flex-1 bg-white/10 mt-1" />}
      </View>

      {/* Conteúdo */}
      <View className="flex-1 pb-8">
        <View className="flex-row items-center mb-1">
          <FontAwesome5 name={icon} size={14} color={color} />
          <Text className="text-white font-bold text-base ml-2">{title}</Text>
        </View>
        <Text className="text-gray-400 text-sm leading-5">{description}</Text>
      </View>
    </View>
  );
}

export default StepCard;