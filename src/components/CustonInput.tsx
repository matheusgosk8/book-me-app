import { StyleSheet, Text, TextInput, View, TextInputProps, TouchableOpacity } from "react-native";
import React, { useState } from "react";
import FontAwesome5Icon from 'react-native-vector-icons/FontAwesome5'

type Props = {
    label?: string
    placeholder?: string
    value?: string
    error?: string
    onChange: (value: string) => void
    onBlur?: () => void
    errorMessage?: string,
} & Partial<Pick<TextInputProps, 'keyboardType' | 'secureTextEntry' | 'placeholderTextColor' | 'autoCapitalize'>> & {
  /**
   * Optional right-side adornment node (e.g. TouchableOpacity with icon).
   */
  rightAdornment?: React.ReactNode
  /**
   * If true, the input will render a built-in eye toggle to show/hide password.
   * When set, `secureTextEntry` is ignored and the toggle controls visibility.
   */
  showPasswordToggle?: boolean
}

const CustomInput = ({ label, placeholder, value, error, onChange, onBlur, errorMessage, keyboardType, secureTextEntry, placeholderTextColor, autoCapitalize, rightAdornment, showPasswordToggle }: Props) => {
  const [passwordVisible, setPasswordVisible] = useState(false)
  const secure = showPasswordToggle ? !passwordVisible : secureTextEntry
  return (
    <View>
      <Text className="color-[#EEEEEE] mt-1">{label}</Text>
      <View className="bg-white/10 rounded-md px-4 py-0 flex-row items-center">
        <TextInput
          placeholder={placeholder}
          placeholderTextColor={placeholderTextColor ?? "#CCCCFF"}
          className="text-white flex-1 py-3"
          value={value ?? ''}
          onChangeText={onChange}
          onBlur={onBlur}
          keyboardType={keyboardType}
          secureTextEntry={secure}
          autoCapitalize={autoCapitalize}
        />

        {showPasswordToggle ? (
          <TouchableOpacity onPress={() => setPasswordVisible(v => !v)} className="ml-2 p-2" hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
            <FontAwesome5Icon name={passwordVisible ? "eye" : "eye-slash"} size={16} color="#CCCCFF" />
          </TouchableOpacity>
        ) : rightAdornment ? (
          <View className="ml-2">{rightAdornment}</View>
        ) : null}
      </View>
      <View className="h-6">
        {errorMessage && (
          <Text className="text-yellow-400 text-sm mt-1">{errorMessage}</Text>
        )}
      </View>
    </View>
  );
};

export default CustomInput;

