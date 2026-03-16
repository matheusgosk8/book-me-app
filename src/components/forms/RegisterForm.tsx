import { Pressable, Text, View, Platform } from "react-native";
import { useState } from "react";
import { createBasicsSchema, addressSchema, createRegisterSchema, RegisterType } from '@/schemas/register'
import BasicsInfo from "../register/BasicsInfo";
import {
  validateAll as validateSchema,
  validateField as validateSchemaField,
} from "@/utils/validation";
import AddressInfo from "../register/AddressInfo";
import { formatCEP, formatCNPJ, formatCPF } from "@/utils/formatter";
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { router } from "expo-router";
import ServiceForm from '@/components/forms/ServiceForm';
import { useLocalSearchParams } from "expo-router";


type Props = {
  onSubmit?: (values: Record<string, any>) => void
}

const RegisterForm = ({ onSubmit }: Props) => {

  const params = useLocalSearchParams();
  const [step, setStep] = useState(params.step === '4' ? 4 : 0);

  const [values, setValues] = useState<RegisterType>({
    nome: "",
    email: "",
    cpf: "",
    cnpj: "",
    senha: "",
    confirmaSenha: "",
    telefone: "",
    cep: "",
    rua: "",
    logradouro: "",
    cidade: "",
    estado: "",
    userType: "cliente",
  } as RegisterType);

  const emptyErrors = {
    nome: "",
    email: "",
    cpf: "",
    cnpj: "",
    senha: "",
    confirmaSenha: "",
    telefone: "",
    cep: "",
    rua: "",
    logradouro: "",
    cidade: "",
    estado: "",
    userType: "",
  } as Record<keyof RegisterType, string>;

  const [errors, setErrors] = useState<Record<keyof RegisterType, string>>(emptyErrors);

  const basicsSchema = createBasicsSchema(values.userType)
  const registerSchema = createRegisterSchema(values.userType)

  const validateField = (field: keyof typeof values, value: unknown) => {
    const schemaToUse: any = (addressSchema as any).shape?.[field] ? addressSchema : basicsSchema
    const fieldError = validateSchemaField(schemaToUse, field as any, value);

    const confirmPasswordError =
      field === "confirmaSenha" && !fieldError && String(value) !== values.senha
        ? "Senhas não coincidem"
        : "";

    setErrors((prev) => ({
      ...prev,
      [field]: fieldError || confirmPasswordError,
    }));
  };

  const handleFieldChange = (field: keyof typeof values, value: string) => {
    let finalValue = value;
    if (field === "cpf") finalValue = formatCPF(value);
    if (field === "cnpj") finalValue = formatCNPJ(value);
    if (field === "cep") finalValue = formatCEP(value);

    const newValues = { ...values, [field]: finalValue };
    setValues(newValues);
    validateField(field, finalValue);
  };

  const validateAll = () => {
    const result = validateSchema(registerSchema, values);
    if (result.valid) {
      setErrors(emptyErrors);
      return true;
    }
    const fieldErrors = { ...emptyErrors };
    Object.entries(result.errors).forEach(([key, message]) => {
      const path = key as keyof typeof emptyErrors;
      if (path) fieldErrors[path] = message;
    });
    setErrors(fieldErrors);
    return false;
  };

  const validateStep = (s: number) => {
    if (s === 1) {
      const res = validateSchema(basicsSchema, values);
      if (res.valid) {
        setErrors(prev => ({ ...prev, nome: '', email: '', cpf: '', cnpj: '', senha: '', confirmaSenha: '', telefone: '' }))
        return true;
      }
      return false;
    }
    if (s === 2) {
      const res = validateSchema(addressSchema, values);
      return res.valid;
    }
    return true;
  };

  return (
    <KeyboardAwareScrollView
      contentContainerStyle={{ flexGrow: 1, paddingBottom: 35 }}
      extraHeight={80}
      enableOnAndroid
      keyboardShouldPersistTaps="handled"
    >
      <View className="px-6 py-12">
        {step === 0 && (
          <View className="flex-1 justify-center py-10">
            <Text className="color-white text-3xl font-bold mb-2">Seja bem-vindo!</Text>
            <Text className="color-white/60 text-lg mb-10">Como você pretende utilizar o Book Me?</Text>

            <View className="gap-y-4">
              <Pressable
                onPress={() => { setValues({ ...values, userType: "cliente" }); setStep(1); }}
                className="bg-white/5 border border-white/10 p-6 rounded-2xl active:bg-white/10"
              >
                <Text className="color-white text-xl font-bold mb-1">Sou Cliente</Text>
                <Text className="color-white/50">Quero buscar serviços e agendar horários.</Text>
              </Pressable>

              <Pressable
                onPress={() => { setValues({ ...values, userType: "profissional" }); setStep(1); }}
                className="bg-white/5 border border-white/10 p-6 rounded-2xl active:bg-white/10"
              >
                <Text className="color-white text-xl font-bold mb-1">Sou Profissional</Text>
                <Text className="color-white/50">Quero oferecer meus serviços e gerenciar agenda.</Text>
              </Pressable>
            </View>

            <View className="mt-10 w-full px-4">
              <Pressable onPress={() => router.push("/login")} className="items-center justify-center">
                <Text className="text-white/60 text-base text-center">
                  Já possui uma conta? <Text className="text-white font-bold underline">Fazer Login</Text>
                </Text>
              </Pressable>
            </View>
          </View>
        )}

        {step === 1 && (
          <View>
            <Pressable onPress={() => setStep(0)} className="mb-6 py-2">
              <Text className="color-white font-bold">← Voltar e alterar perfil</Text>
            </Pressable>
            <Text className="color-[#EEEEEE] text-2xl font-bold mb-4">
              Cadastro de {values.userType === "cliente" ? "Cliente" : "Profissional"}
            </Text>
            <BasicsInfo values={values} errors={errors} handleFieldChange={handleFieldChange} validateField={validateField} />
            <Pressable
              className="bg-white px-6 py-3 rounded-xl items-center justify-center mt-6 w-full"
              onPress={() => { if (validateStep(1)) setStep(2) }}
            >
              <Text className="text-blue-600 text-lg font-bold">Próximo</Text>
            </Pressable>
          </View>
        )}

        {step === 2 && (
          <View>
            <Pressable onPress={() => setStep(1)} className="mb-6 py-2">
              <Text className="color-white font-bold">← Voltar para informações básicas</Text>
            </Pressable>
            <Text className="color-[#EEEEEE] text-2xl font-bold mb-4">
              Cadastro de {values.userType === "cliente" ? "Cliente" : "Profissional"} - Endereço
            </Text>
            <AddressInfo value={values} errors={errors} handleFieldChange={handleFieldChange} validateField={validateField} />
            <Pressable
              className="bg-white px-6 py-3 rounded-xl items-center justify-center mt-6 w-full"
              onPress={() => { if (validateStep(2)) setStep(3) }}
            >
              <Text className="text-blue-600 text-lg font-bold">Próximo</Text>
            </Pressable>
          </View>
        )}

        {step === 3 && (
          <View>
            <Text className="text-white/60 mb-6 text-center text-lg">
              {values.userType === 'profissional'
                ? "Quase lá! Agora vamos cadastrar seu primeiro serviço."
                : "Tudo pronto! Clique abaixo para criar sua conta."}
            </Text>
            <Pressable
              className="bg-white px-6 py-4 rounded-2xl items-center justify-center w-full shadow-lg active:bg-white/90"
              onPress={() => {
                if (validateAll()) {
                  onSubmit?.(values);
                  // Se for profissional, vai pro form de serviço. Se for cliente, vai pra Home.
                  if (values.userType === 'profissional') {
                    setStep(4);
                  } else {
                    router.replace("/home");
                  }
                }
              }}
            >
              <Text className="text-blue-600 text-lg font-bold">
                {values.userType === 'profissional' ? "Continuar" : "Criar Minha Conta"}
              </Text>
            </Pressable>
          </View>
        )}

        {step === 4 && (
          <View>
            {/* Botão opcional para voltar se o profissional desistir de cadastrar o serviço na hora */}
            <Pressable onPress={() => router.replace("/home")} className="mb-6 py-2">
              <Text className="color-white font-bold">← Voltar</Text>
            </Pressable>
            <ServiceForm />
          </View>
        )}
      </View>
    </KeyboardAwareScrollView>
  )
}
export default RegisterForm;

{/*Matheus, segue a estrutura para o BE em Go:
const dataToBackend = {
    nome: values.nome,           // string
    email: values.email,         // string
    cpf: values.cpf,             // string (mesmo sendo números, tratamos como string por causa da máscara)
    cnpj: values.cnpj,           // string (opcional/nullable se for cliente)
    telefone: values.telefone,   // string
    cep: values.cep,             // string
    rua: values.rua,             // string
    logradouro: values.logradouro, // string
    cidade: values.cidade,       // string
    estado: values.estado,       // string (2 caracteres)
    userType: values.userType,   // string (enum: 'cliente' | 'profissional')
};*/}

