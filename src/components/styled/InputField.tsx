import { Text, TextInput, View } from "react-native"

export const InputField =({
  label,
  placeholder,
  value,
  onChangeText,
  onBlur,
  error,
  keyboardType = 'default',
  secureTextEntry = false,
  autoCapitalize = 'sentences',
  maxLength,
}: {
  label: string
  placeholder: string
  value: string
  onChangeText: (text: string) => void
  onBlur?: () => void
  error?: string
  keyboardType?: 'default' | 'email-address' | 'numeric' | 'phone-pad'
  secureTextEntry?: boolean
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters'
  maxLength?: number
}) =>{
  return (
    <View className="mb-1">
      <Text className="text-gray-300 text-sm mb-2">{label}</Text>
      <TextInput
        placeholder={placeholder}
        placeholderTextColor="#6b7280"
        value={value}
        onChangeText={onChangeText}
        onBlur={onBlur}
        keyboardType={keyboardType}
        secureTextEntry={secureTextEntry}
        autoCapitalize={autoCapitalize}
        maxLength={maxLength}
        className={`bg-white/5 border rounded-xl px-4 py-3.5 text-white text-base ${
          error ? 'border-red-500/50' : 'border-white/10'
        }`}
      />
      <View className="h-5 mt-1">
        {error && <Text className="text-red-400 text-xs">{error}</Text>}
      </View>
    </View>
  )
}