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


type Props = {
  onSubmit?: (values: Record<string, any>) => void
}

const RegisterForm = ({ onSubmit }: Props) => {
  // Controla se o usuário já escolheu o perfil (Etapa 0) ou está no form (Etapa 1)
  const [step, setStep] = useState(0);

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
    // choose schema that contains the field
    const schemaToUse: any = (addressSchema as any).shape?.[field] ? addressSchema : basicsSchema
    const fieldError = validateSchemaField(schemaToUse, field as any, value);

    // Confirmação de senha depende de mais de um campo.
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

  // Schemas por etapa
  const step1Schema = basicsSchema
  const step2Schema = addressSchema

  const validateStep = (s: number) => {
    if (s === 1) {
      const res = validateSchema(step1Schema, values);
      if (res.valid) {
        // limpa erros dessa etapa
        setErrors(prev => ({ ...prev, nome: '', email: '', cpf: '', cnpj: '', senha: '', confirmaSenha: '', telefone: '' }))
        return true;
      }
      const fieldErrors = { ...emptyErrors };
      Object.entries(res.errors).forEach(([k, msg]) => {
        const path = k as keyof typeof emptyErrors;
        if (path) fieldErrors[path] = msg;
      });
      setErrors(fieldErrors);
      return false;
    }

    if (s === 2) {
      const res = validateSchema(step2Schema, values);
      if (res.valid) {
        setErrors(prev => ({ ...prev, rua: '', logradouro: '', cidade: '', estado: '', cep: '' }))
        return true;
      }
      const fieldErrors = { ...emptyErrors };
      Object.entries(res.errors).forEach(([k, msg]) => {
        const path = k as keyof typeof emptyErrors;
        if (path) fieldErrors[path] = msg;
      });
      setErrors(fieldErrors);
      return false;
    }

    return true;
  };

  return (


<KeyboardAwareScrollView
  contentContainerStyle={{ flexGrow: 1, paddingBottom: 35}}
  extraHeight={80}
  enableOnAndroid
  enableAutomaticScroll
  extraScrollHeight={Platform.OS === 'ios' ? 20 : 0}
  keyboardOpeningTime={0}
  keyboardShouldPersistTaps="handled"
>
      <View className="px-6 py-12">
        {/* ETAPA 0: SELEÇÃO DE PERFIL */}
        {step === 0 && (
          <View className="flex-1 justify-center py-10">
            <Text className="color-white text-3xl font-bold mb-2">
              Seja bem-vindo!
            </Text>
            <Text className="color-white/60 text-lg mb-10">
              Como você pretende utilizar o Book Me?
            </Text>

            <View className="gap-y-4">
              <Pressable
                onPress={() => {
                  setValues({ ...values, userType: "cliente" });
                  setStep(1);
                }}
                className="bg-white/5 border border-white/10 p-6 rounded-2xl active:bg-white/10"
              >
                <Text className="color-white text-xl font-bold mb-1">
                  Sou Cliente
                </Text>
                <Text className="color-white/50">
                  Quero buscar serviços e agendar horários.
                </Text>
              </Pressable>

              <Pressable
                onPress={() => {
                  setValues({ ...values, userType: "profissional" });
                  setStep(1);
                }}
                className="bg-white/5 border border-white/10 p-6 rounded-2xl active:bg-white/10"
              >
                <Text className="color-white text-xl font-bold mb-1">
                  Sou Profissional
                </Text>
                <Text className="color-white/50">
                  Quero oferecer meus serviços e gerenciar agenda.
                </Text>
              </Pressable>
            </View>
          </View>
        )}

        {/* ETAPA 1: FORMULÁRIO DE DADOS */}
        {step === 1 && (
          <View>
            <Pressable onPress={() => setStep(0)} className="mb-6 py-2">
              <Text className="color-white font-bold">
                ← Voltar e alterar perfil
              </Text>
            </Pressable>

            <Text className="color-[#EEEEEE] text-2xl font-bold mb-4">
              Cadastro de{" "}
              {values.userType === "cliente" ? "Cliente" : "Profissional"}
            </Text>

            <BasicsInfo
              values={values}
              errors={errors}
              handleFieldChange={handleFieldChange}
              validateField={validateField}
            />
            <Pressable
              className="bg-blue-600 px-6 py-3 rounded-xl items-center justify-center mt-6 mb-4 w-full active:bg-blue-700"
              onPress={() => {
                if (validateStep(1)) setStep(2)
              }}
            >
              <Text className="color-white text-lg font-bold">Próximo</Text>
            </Pressable>
          </View>
        )}
        {step === 2 && (
          <View>
            <Pressable onPress={() => setStep(1)} className="mb-6 py-2">
              <Text className="color-white font-bold">
                ← Voltar para infomrações básicas
              </Text>
            </Pressable>

            <Text className="color-[#EEEEEE] text-2xl font-bold mb-4">
              Cadastro de{" "}
              {values.userType === "cliente" ? "Cliente" : "Profissional"}
              - endereço
            </Text>

            <AddressInfo
              value={values}
              errors={errors}
              handleFieldChange={handleFieldChange}
              validateField={validateField}
            />
            <Pressable
              className="bg-blue-600 px-6 py-3 rounded-xl items-center justify-center mt-6 mb-4 w-full active:bg-blue-700"
              disabled={!validateSchema(step2Schema, values).valid}
              onPress={() => {
                if (validateStep(2)) setStep(3)
              }}
            >
              <Text className="color-white text-lg font-bold">Próximo</Text>
            </Pressable>
          </View>
        )}


        {step === 3 && (
          <Pressable
            className="bg-blue-600 px-6 py-4 rounded-xl items-center justify-center mt-6 mb-8 w-full active:bg-blue-700"
            onPress={() => {
              if (validateAll()) {
                onSubmit?.(values)
              }
            }}
          >
            <Text className="color-white text-lg font-bold">
              Criar Minha Conta
            </Text>
          </Pressable>
        )}
      </View>
  </KeyboardAwareScrollView>  );
};

export default RegisterForm;
