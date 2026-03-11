import React, { useState } from 'react';
import { View, Text, Pressable, TextInput } from 'react-native';
import { useRouter } from 'expo-router';

export default function ForgotPasswordForm() {
  const router = useRouter();
  const [step, setStep] = useState(0); // 0: Escolha, 1: Input, 2: Código
  const [method, setMethod] = useState<'email' | 'telefone' | null>(null);
  const [inputValue, setInputValue] = useState('');
  const [code, setCode] = useState('');

  return (
    <View className="px-6 py-12">
      
      {/* ETAPA 0: SELEÇÃO DO MÉTODO DE RECUPERAÇÃO */}
      {step === 0 && (
        <View className="flex-1 justify-center py-10">
          <Text className="color-white text-3xl font-bold mb-2">
            Esqueceu a senha?
          </Text>
          <Text className="color-white/60 text-lg mb-10">
            Escolha como deseja receber o código de validação.
          </Text>

          <View className="gap-y-4">
            <Pressable
              onPress={() => {
                setMethod('email');
                setStep(1);
              }}
              className="bg-white/5 border border-white/10 p-6 rounded-2xl active:bg-white/10"
            >
              <Text className="color-white text-xl font-bold mb-1">Via E-mail</Text>
              <Text className="color-white/50">Enviaremos um link para seu e-mail cadastrado.</Text>
            </Pressable>

            <Pressable
              onPress={() => {
                setMethod('telefone');
                setStep(1);
              }}
              className="bg-white/5 border border-white/10 p-6 rounded-2xl active:bg-white/10"
            >
              <Text className="color-white text-xl font-bold mb-1">Via Telefone (SMS)</Text>
              <Text className="color-white/50">Receba um código via SMS no seu celular.</Text>
            </Pressable>
          </View>

          <Pressable onPress={() => router.back()} className="mt-10 items-center">
            <Text className="text-white/60 text-base underline">Lembrei minha senha</Text>
          </Pressable>
        </View>
      )}

      {/* ETAPA 1: ENTRADA DO DADO (EMAIL OU TELEFONE) */}
      {step === 1 && (
        <View>
          <Pressable onPress={() => setStep(0)} className="mb-6 py-2">
            <Text className="color-white font-bold">← Voltar e alterar método</Text>
          </Pressable>

          <Text className="color-white text-2xl font-bold mb-2">
            Recuperação via {method === 'email' ? 'E-mail' : 'Telefone'}
          </Text>
          <Text className="color-white/60 mb-8 text-base">
            Digite seu {method === 'email' ? 'e-mail' : 'número de telefone'} para continuar.
          </Text>

          <View>
            <Text className="color-white/80 ml-1 mb-2 font-medium">
              {method === 'email' ? 'E-mail cadastrado' : 'Celular com DDD'}
            </Text>
            <TextInput
              placeholder={method === 'email' ? "exemplo@email.com" : "(00) 00000-0000"}
              placeholderTextColor="rgba(255,255,255,0.3)"
              keyboardType={method === 'email' ? "email-address" : "phone-pad"}
              className="bg-white/10 border border-white/10 rounded-2xl px-4 py-4 text-white text-base"
              value={inputValue}
              onChangeText={setInputValue}
            />
          </View>

          <Pressable
            className="bg-white px-6 py-4 rounded-xl items-center justify-center mt-8 active:bg-white/90"
            onPress={() => setStep(2)}
          >
            <Text className="text-blue-600 text-lg font-bold">Enviar Código</Text>
          </Pressable>
        </View>
      )}

      {/* ETAPA 2: VALIDAÇÃO DO CÓDIGO */}
      {step === 2 && (
        <View>
          <Pressable onPress={() => setStep(1)} className="mb-6 py-2">
            <Text className="color-white font-bold">← Corrigir {method === 'email' ? 'e-mail' : 'telefone'}</Text>
          </Pressable>

          <Text className="color-white text-2xl font-bold mb-2">Verifique seu {method === 'email' ? 'E-mail' : 'SMS'}</Text>
          <Text className="color-white/60 mb-8 text-base leading-5">
            Insira o código de 6 dígitos que enviamos para <Text className="text-white font-bold">{inputValue}</Text>.
          </Text>

          <View>
            <TextInput
              placeholder="0 0 0 0 0 0"
              placeholderTextColor="rgba(255,255,255,0.3)"
              keyboardType="number-pad"
              maxLength={6}
              className="bg-white/5 border border-white/10 rounded-2xl px-4 py-6 text-white text-3xl font-bold text-center tracking-[10px]"
              value={code}
              onChangeText={setCode}
            />
          </View>

          <Pressable
            className="bg-white px-6 py-4 rounded-xl items-center justify-center mt-8 active:bg-white/90"
            onPress={() => {
              // Aqui entraria a lógica de validação final
              console.log("Validando código:", code);
            }}
          >
            <Text className="text-blue-600 text-lg font-bold">Validar Código</Text>
          </Pressable>

          <Pressable className="mt-6 items-center">
            <Text className="text-white/50">Não recebeu? <Text className="text-white font-bold">Reenviar código</Text></Text>
          </Pressable>
        </View>
      )}

    </View>
  );
}