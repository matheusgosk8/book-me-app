import { AddressType } from "@/types/Address"
import { View } from "react-native"
import CustomInput from "../CustonInput"

type Props = {
  value: AddressType
  errors: Partial<Record<keyof AddressType, string>>
  handleFieldChange: (field: keyof AddressType, value: string) => void
  validateField: (field: keyof AddressType, value: unknown) => void
}

const AddressInfo = ({ value, errors, handleFieldChange, validateField }: Props) => {
  return (
    <View>
      <CustomInput
        label="CEP"
        placeholder="00000-000"
        value={value.cep}
        onChange={(v) => handleFieldChange('cep', v)}
        onBlur={() => validateField('cep', value.cep)}
        errorMessage={errors.cep}
      />

      <CustomInput
        label="Rua"
        placeholder="Nome da rua"
        value={value.rua}
        onChange={(v) => handleFieldChange('rua', v)}
        onBlur={() => validateField('rua', value.rua)}
        errorMessage={errors.rua}
      />

      <CustomInput
        label="Número / Complemento"
        placeholder="123, apto 4"
        value={value.logradouro}
        onChange={(v) => handleFieldChange('logradouro', v)}
        onBlur={() => validateField('logradouro', value.logradouro)}
        errorMessage={errors.logradouro}
      />

      <CustomInput
        label="Cidade"
        placeholder="Cidade"
        value={value.cidade}
        onChange={(v) => handleFieldChange('cidade', v)}
        onBlur={() => validateField('cidade', value.cidade)}
        errorMessage={errors.cidade}
      />

      <CustomInput
        label="Estado"
        placeholder="SP"
        value={value.estado}
        onChange={(v) => handleFieldChange('estado', v)}
        onBlur={() => validateField('estado', value.estado)}
        errorMessage={errors.estado}
      />
    </View>
  )
}

export default AddressInfo
