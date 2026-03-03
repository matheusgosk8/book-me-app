declare module 'react-native-mask-input' {
  import { ComponentType } from 'react'
  import { TextInputProps } from 'react-native'

  export interface MaskInputProps extends TextInputProps {
    mask?: Array<string | RegExp> | ((value: string) => Array<string | RegExp>)
    onChangeText?: (masked: string, unmasked: string) => void
  }

  const MaskInput: ComponentType<MaskInputProps>
  export default MaskInput
}
