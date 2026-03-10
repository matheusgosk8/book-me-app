import { View, Text } from "react-native";
import React from "react";
import { RegisterType } from "@/schemas/register";
import CustomInput from "../CustonInput";
import FontAwesome5Icon from "react-native-vector-icons/FontAwesome5";

type Props = {
  values: RegisterType;

  errors: Omit<Record<keyof RegisterType, string>, "userType">;

  handleFieldChange: (field: keyof RegisterType, value: string) => void;
  validateField: (field: keyof RegisterType, value: unknown) => void;
};

export default function BasicsInfo({
  values,
  errors,
  handleFieldChange,
  validateField,
}: Props) {
  return (
    <View>
      <View>
        <CustomInput
          label="Nome"
          placeholder="Seu nome"
          value={values.nome}
          onChange={(text) => handleFieldChange("nome", text)}
          onBlur={() => validateField("nome", values.nome)}
          errorMessage={errors.nome}
        />
      </View>

      <View>
        <CustomInput
          label="Email"
          placeholder="email@exemplo.com"
          keyboardType="email-address"
          autoCapitalize="none"
          value={values.email}
          onChange={(text) => handleFieldChange("email", text)}
          onBlur={() => validateField("email", values.email)}
          errorMessage={errors.email}
        />
      </View>

      {values.userType === "cliente" ? (
        <View>
          <CustomInput
            label="CPF"
            placeholder="000.000.000-00"
            keyboardType="numeric"
            value={values.cpf}
            onChange={(text) => handleFieldChange("cpf", text)}
            onBlur={() => validateField("cpf", values.cpf)}
            errorMessage={errors.cpf}
          />
        </View>
      ) : (
        <View>
          <CustomInput
            label="CNPJ"
            placeholder="00.000.000/0000-00"
            keyboardType="numeric"
            value={values.cnpj}
            onChange={(text) => handleFieldChange("cnpj", text)}
            onBlur={() => validateField("cnpj", values.cnpj)}
            errorMessage={errors.cnpj}
          />
        </View>
      )}

      <View>
        <CustomInput
          label="Telefone"
          placeholder="(00) 00000-0000"
          keyboardType="phone-pad"
          value={values.telefone}
          onChange={(text) => handleFieldChange("telefone", text)}
          onBlur={() => validateField("telefone", values.telefone)}
          errorMessage={errors.telefone}
        />
      </View>

      <View>
        <CustomInput
          label="CEP"
          placeholder="00000-000"
          keyboardType="numeric"
          value={values.cep}
          onChange={(text) => handleFieldChange("cep", text)}
          onBlur={() => validateField("cep", values.cep)}
          errorMessage={errors.cep}
        />
      </View>

      <View>
        <CustomInput
          label="Senha"
          placeholder="••••••••"
          secureTextEntry={true}
          showPasswordToggle={true}
          value={values.senha}
          onChange={(text) => handleFieldChange("senha", text)}
          onBlur={() => validateField("senha", values.senha)}
          errorMessage={errors.senha}
        />
      </View>

      <View>
        <CustomInput
          label="Confirmar Senha"
          placeholder="••••••••"
          secureTextEntry={true}
          showPasswordToggle={true}
          value={values.confirmaSenha}
          onChange={(text) => handleFieldChange("confirmaSenha", text)}
          onBlur={() => validateField("confirmaSenha", values.confirmaSenha)}
          errorMessage={errors.confirmaSenha}
        />
      </View>
    </View>
  );
}
