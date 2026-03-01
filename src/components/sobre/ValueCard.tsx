import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";


import { Text, View } from "react-native";

function ValueCard({
  icon,
  title,
  description,
  color,
}: {
  icon: string;
  title: string;
  description: string;
  color: string;
}) {
  return (
    <View className="flex-row items-start bg-white/5 rounded-2xl p-4 mb-3">
      <View
        className="w-11 h-11 rounded-xl items-center justify-center mr-4"
        style={{ backgroundColor: color + "20" }}
      >
        <MaterialCommunityIcons name={icon} size={22} color={color} />
      </View>
      <View className="flex-1">
        <Text className="text-white font-bold text-base mb-1">{title}</Text>
        <Text className="text-gray-400 text-sm leading-5">{description}</Text>
      </View>
    </View>
  );
}


export default ValueCard;
