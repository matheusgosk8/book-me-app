import { Pressable, Text } from "react-native"

export const OptionButton = ({
  label,
  description,
  selected,
  onPress,
}: {
  label: string
  description: string
  selected: boolean
  onPress: () => void
}) => {
  return (
    <Pressable
      onPress={onPress}
      className={`flex-1 border rounded-2xl p-5 ${
        selected ? 'border-blue-500 bg-blue-500/10' : 'border-white/10 bg-white/5'
      }`}
    >
      <Text
        className={`text-lg font-bold mb-1 ${
          selected ? 'text-blue-400' : 'text-white'
        }`}
      >
        {label}
      </Text>
      <Text className="text-gray-400 text-sm">{description}</Text>
    </Pressable>
  )
}
