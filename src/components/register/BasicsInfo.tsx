import { View, Text, TextInput } from 'react-native'
import React from 'react'
import { BasicsInfoType } from '@/types/User'

type Props = {
    values: BasicsInfoType

    errors: Omit<BasicsInfoType, 'userType'>    

    handleFieldChange: (field: keyof BasicsInfoType, value: string) => void
    validateField: (field: keyof BasicsInfoType, value: string) => void  
}

export default function BasicsInfo({ values, errors, handleFieldChange, validateField }: Props) {
    return (
        <View>
            <View>
                <Text className="color-[#EEEEEE] mt-1">Nome</Text>
                <TextInput
                    placeholder="Seu nome"
                    placeholderTextColor="#CCCCFF"
                    className="bg-white/10 rounded-md px-4 py-3 text-white"
                    value={values.nome}
                    onChangeText={text => handleFieldChange('nome', text)}
                />
                <View className="h-6">
                    {errors.nome && <Text className="text-yellow-400 text-sm mt-1">{errors.nome}</Text>}
                </View>
            </View>

            <View>
                <Text className="color-[#EEEEEE] mt-1">Email</Text>
                <TextInput
                    placeholder="email@exemplo.com"
                    placeholderTextColor="#CCCCFF"
                    keyboardType="email-address"
                    autoCapitalize="none"
                    className="bg-white/10 rounded-md px-4 py-3 text-white"
                    value={values.email}
                    onChangeText={text => handleFieldChange('email', text)}
                    onBlur={() => validateField('email', values.email)}
                />
                <View className="h-6">
                    {errors.email && <Text className="text-yellow-400 text-sm mt-1">{errors.email}</Text>}
                </View>
            </View>

            {values.userType === 'cliente' ? (
                <View>
                    <Text className="color-[#EEEEEE] mt-1">CPF</Text>
                    <TextInput
                        placeholder="000.000.000-00"
                        placeholderTextColor="#CCCCFF"
                        keyboardType="numeric"
                        className="bg-white/10 rounded-md px-4 py-3 text-white"
                        value={values.cpf}
                        onChangeText={text => handleFieldChange('cpf', text)}
                        onBlur={() => validateField('cpf', values.cpf)}
                    />
                    <View className="h-6">
                        {errors.cpf && <Text className="text-yellow-400 text-sm mt-1">{errors.cpf}</Text>}
                    </View>
                </View>
            ) : (
                <View>
                    <Text className="color-[#EEEEEE] mt-1">CNPJ</Text>
                    <TextInput
                        placeholder="00.000.000/0000-00"
                        placeholderTextColor="#CCCCFF"
                        keyboardType="numeric"
                        className="bg-white/10 rounded-md px-4 py-3 text-white"
                        value={values.cnpj}
                        onChangeText={text => handleFieldChange('cnpj', text)}
                        onBlur={() => validateField('cnpj', values.cnpj)}
                    />
                    <View className="h-6">
                        {errors.cnpj && <Text className="text-yellow-400 text-sm mt-1">{errors.cnpj}</Text>}
                    </View>
                </View>
            )}

            <View>
                <Text className="color-[#EEEEEE] mt-1">Telefone</Text>
                <TextInput
                    placeholder="(00) 00000-0000"
                    placeholderTextColor="#CCCCFF"
                    keyboardType="phone-pad"
                    className="bg-white/10 rounded-md px-4 py-3 text-white"
                    value={values.telefone}
                    onChangeText={text => handleFieldChange('telefone', text)}
                    onBlur={() => validateField('telefone', values.telefone)}
                />
                <View className="h-6">
                    {errors.telefone && <Text className="text-yellow-400 text-sm mt-1">{errors.telefone}</Text>}
                </View>
            </View>

            <View>
                <Text className="color-[#EEEEEE] mt-1">CEP</Text>
                <TextInput
                    placeholder="00000-000"
                    placeholderTextColor="#CCCCFF"
                    keyboardType="numeric"
                    className="bg-white/10 rounded-md px-4 py-3 text-white"
                    value={values.cep}
                    onChangeText={text => handleFieldChange('cep', text)}
                    onBlur={() => validateField('cep', values.cep)}
                />
                <View className="h-6">
                    {errors.cep && <Text className="text-yellow-400 text-sm mt-1">{errors.cep}</Text>}
                </View>
            </View>

            <View>
                <Text className="color-[#EEEEEE] mt-1">Senha</Text>
                <TextInput
                    placeholder="••••••••"
                    placeholderTextColor="#CCCCFF"
                    secureTextEntry={true}
                    className="bg-white/10 rounded-md px-4 py-3 text-white"
                    value={values.senha}
                    onChangeText={text => handleFieldChange('senha', text)}
                    onBlur={() => validateField('senha', values.senha)}
                />
                <View className="h-6">
                    {errors.senha && <Text className="text-yellow-400 text-sm mt-1">{errors.senha}</Text>}
                </View>
            </View>

            <View>
                <Text className="color-[#EEEEEE] mt-1">Confirmar Senha</Text>
                <TextInput
                    placeholder="••••••••"
                    placeholderTextColor="#CCCCFF"
                    secureTextEntry={true}
                    className="bg-white/10 rounded-md px-4 py-3 text-white"
                    value={values.confirmaSenha}
                    onChangeText={text => handleFieldChange('confirmaSenha', text)}
                    onBlur={() => validateField('confirmaSenha', values.confirmaSenha)}
                />
                <View className="h-6">
                    {errors.confirmaSenha && <Text className="text-yellow-400 text-sm mt-1">{errors.confirmaSenha}</Text>}
                </View>
            </View>

        </View>
    )
}

