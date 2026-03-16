import React, { useState } from 'react';
import { View, Text, Pressable, TextInput } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

function ForgotPasswordForm() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [step, setStep] = useState(0); 
  const [method, setMethod] = useState<'email' | 'telefone' | null>(null);
  const [inputValue, setInputValue] = useState('');
  const [code, setCode] = useState('');

  return (
    <View 
      className="flex-1 px-6" 
      style={{ paddingTop: insets.top > 0 ? insets.top + 20 : 40 }}
    >
      {/* ETAPA 0: SELEÇÃO */}
      {step === 0 && (
        <View className="flex-1">
          <Text className="text-white text-3xl font-bold mb-2">Esqueceu a senha?</Text>
          <Text className="text-white/60 text-lg mb-10">
            Escolha como deseja receber o código de validação.
          </Text>

          <View className="gap-y-4">
            <Pressable
              onPress={() => { setMethod('email'); setStep(1); }}
              className="bg-white/10 border border-white/10 p-6 rounded-2xl active:bg-white/20"
            >
              <Text className="text-white text-xl font-bold mb-1">Via E-mail</Text>
              <Text className="text-white/50">Enviaremos um link para seu e-mail cadastrado.</Text>
            </Pressable>

            <Pressable
              onPress={() => { setMethod('telefone'); setStep(1); }}
              className="bg-white/10 border border-white/10 p-6 rounded-2xl active:bg-white/20"
            >
              <Text className="text-white text-xl font-bold mb-1">Via Telefone (SMS)</Text>
              <Text className="text-white/50">Receba um código via SMS no seu celular.</Text>
            </Pressable>
          </View>

          <Pressable onPress={() => router.back()} className="mt-10 items-center">
            <Text className="text-white/60 text-base underline">Lembrei minha senha</Text>
          </Pressable>
        </View>
      )}

      {/* ETAPA 1: INPUT */}
      {step === 1 && (
        <View>
          <Pressable onPress={() => setStep(0)} className="mb-6 py-2">
            <Text className="text-white font-bold">← Voltar e alterar método</Text>
          </Pressable>

          <Text className="text-white text-2xl font-bold mb-2">
            Recuperação via {method === 'email' ? 'E-mail' : 'Telefone'}
          </Text>
          <Text className="text-white/60 mb-8 text-base">
            Digite seu {method === 'email' ? 'e-mail' : 'número de telefone'} para continuar.
          </Text>

          <View>
            <Text className="text-white/80 ml-1 mb-2 font-medium">
              {method === 'email' ? 'E-mail cadastrado' : 'Celular com DDD'}
            </Text>
            <TextInput
              placeholder={method === 'email' ? "exemplo@email.com" : "(00) 00000-0000"}
              placeholderTextColor="rgba(255,255,255,0.4)"
              keyboardType={method === 'email' ? "email-address" : "phone-pad"}
              className="bg-white/10 border border-white/10 rounded-2xl px-4 py-4 text-white text-base focus:border-white/30"
              value={inputValue}
              onChangeText={setInputValue}
            />
          </View>

          <Pressable
            className="bg-white py-4 rounded-2xl items-center justify-center mt-8 active:bg-white/90"
            onPress={() => setStep(2)}
          >
            <Text className="text-blue-600 text-lg font-bold">Enviar Código</Text>
          </Pressable>
        </View>
      )}

      {/* ETAPA 2: CÓDIGO */}
      {step === 2 && (
        <View>
          <Pressable onPress={() => setStep(1)} className="mb-6 py-2">
            <Text className="text-white font-bold">← Corrigir {method === 'email' ? 'e-mail' : 'telefone'}</Text>
          </Pressable>

          <Text className="text-white text-2xl font-bold mb-2">Verifique seu {method === 'email' ? 'E-mail' : 'SMS'}</Text>
          <Text className="text-white/60 mb-8 text-base leading-5">
            Insira o código enviado para <Text className="text-white font-bold">{inputValue}</Text>.
          </Text>

          <TextInput
            placeholder="0 0 0 0 0 0"
            placeholderTextColor="rgba(255,255,255,0.2)"
            keyboardType="number-pad"
            maxLength={6}
            className="bg-white/10 border border-white/10 rounded-2xl px-4 py-6 text-white text-3xl font-bold text-center tracking-[10px] focus:border-white/30"
            value={code}
            onChangeText={setCode}
          />

          <Pressable
            className="bg-white py-4 rounded-2xl items-center justify-center mt-8 active:bg-white/90"
            onPress={() => console.log("Validando:", code)}
          >
            <Text className="text-blue-600 text-lg font-bold">Validar Código</Text>
          </Pressable>
        </View>
      )}
    </View>
  );
}

export default ForgotPasswordForm;