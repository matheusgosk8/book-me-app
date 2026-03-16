// ============================================================
// RegisterForm.tsx  (React Native / Expo + NativeWind + Zod)
// ============================================================
// Formulário de cadastro multi-step com validação Zod
// Fluxo Cliente: Seleção -> Dados Básicos -> Endereço -> Concluído
// Fluxo Colaborador: Seleção -> Dados Básicos -> Área de Atuação -> Concluído
// ============================================================

import React, { useState } from 'react'
import {
  View,
  Text,
  TextInput,
  Pressable,
  ScrollView,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
  Switch,
} from 'react-native'
import { z } from 'zod'

// ============================================================
// SCHEMAS ZOD
// ============================================================

const cpfIsValid = (val: string) => {
  const clean = val.replace(/\D/g, '')
  if (clean.length !== 11) return false
  if (clean === clean[0].repeat(11)) return false
  return true
}

const cnpjIsValid = (val: string) => {
  const clean = val.replace(/\D/g, '')
  if (clean.length !== 14) return false
  if (clean === clean[0].repeat(14)) return false
  return true
}

const dadosBasicosBaseSchema = z.object({
  nomeCompleto: z.string().min(3, 'Nome deve ter no mínimo 3 caracteres'),
  idade: z.string().refine(
    (val) => {
      const num = parseInt(val, 10)
      return !isNaN(num) && num >= 18 && num <= 120
    },
    { message: 'Idade deve ser entre 18 e 120 anos' }
  ),
  email: z.string().email('E-mail inválido'),
  cpf: z.string().optional(),
  cnpj: z.string().optional(),
  senha: z.string().min(8, 'Senha deve ter no mínimo 8 caracteres'),
  confirmarSenha: z.string().min(1, 'Confirmação de senha é obrigatória'),
})

const dadosBasicosClienteSchema = dadosBasicosBaseSchema.safeExtend({
  cpf: z.string().refine(cpfIsValid, { message: 'CPF inválido' }),
}).refine((data) => data.senha === data.confirmarSenha, {
  message: 'As senhas não coincidem',
  path: ['confirmarSenha'],
})

const dadosBasicosColaboradorSchema = dadosBasicosBaseSchema.safeExtend({
  cnpj: z.string().refine(cnpjIsValid, { message: 'CNPJ inválido' }),
}).refine((data) => data.senha === data.confirmarSenha, {
  message: 'As senhas não coincidem',
  path: ['confirmarSenha'],
})

const enderecoClienteSchema = z.object({
  cep: z.string().refine(
    (val) => val.replace(/\D/g, '').length === 8,
    { message: 'CEP deve ter 8 dígitos' }
  ),
  rua: z.string().min(3, 'Rua é obrigatória'),
  logradouro: z.string().min(1, 'Número/Complemento é obrigatório'),
  cidade: z.string().min(2, 'Cidade é obrigatória'),
  estado: z.string().length(2, 'Estado deve ter 2 letras (ex: SP)'),
})

const areaAtuacaoSchema = z.object({
  areaAtuacao: z.string(),
  outraArea: z.string().optional(),
  atendeADomicilio: z.boolean(),
  cep: z.string().refine(
    (val) => val.replace(/\D/g, '').length === 8,
    { message: 'CEP deve ter 8 dígitos' }
  ),
  rua: z.string().min(3, 'Rua é obrigatória'),
  logradouro: z.string().min(1, 'Número/Complemento é obrigatório'),
  setor: z.string().min(2, 'Setor/Bairro é obrigatório'),
  cidade: z.string().min(2, 'Cidade é obrigatória'),
  estado: z.string().length(2, 'Estado deve ter 2 letras (ex: SP)'),
}).refine(
  (data) => data.areaAtuacao !== 'outro' || (data.outraArea && data.outraArea.length >= 3),
  {
    message: 'Especifique a área de atuação (mínimo 3 caracteres)',
    path: ['outraArea'],
  }
)

// ============================================================
// TIPOS
// ============================================================

type UserType = 'cliente' | 'colaborador' | null
type Step = 'selecao' | 'dados' | 'endereco' | 'areaAtuacao' | 'concluido'

type DadosBasicos = z.infer<typeof dadosBasicosBaseSchema>
type EnderecoCliente = z.infer<typeof enderecoClienteSchema>
type AreaAtuacao = z.infer<typeof areaAtuacaoSchema>

type Errors<T> = Partial<Record<keyof T, string>>

// ============================================================
// COMPONENTES AUXILIARES
// ============================================================

function StepIndicator({
  steps,
  currentIndex,
}: {
  steps: string[]
  currentIndex: number
}) {
  return (
    <View className="flex-row items-center justify-center mb-8">
      {steps.map((label, index) => (
        <React.Fragment key={label}>
          <View className="items-center">
            <View
              className={`w-8 h-8 rounded-full items-center justify-center`}
            >
              <Text
                className={`text-sm font-bold ${
                  index <= currentIndex ? 'text-white' : 'text-gray-500'
                }`}
              >
                {index + 1}
              </Text>
            </View>
            <Text
              className={`text-xs mt-1 ${
                index <= currentIndex ? 'text-gray-300' : 'text-gray-600'
              }`}
            >
              {label}
            </Text>
          </View>
          {index < steps.length - 1 && (
            <View
              className={`w-12 h-0.5 mx-2 ${
                index < currentIndex ? 'bg-blue-500' : 'bg-white/10'
              }`}
            />
          )}
        </React.Fragment>
      ))}
    </View>
  )
}

function InputField({
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
}) {
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

function OptionButton({
  label,
  description,
  selected,
  onPress,
}: {
  label: string
  description: string
  selected: boolean
  onPress: () => void
}) {
  return (
    <Pressable
      onPress={onPress}
      className={`flex-1 border rounded-2xl p-5 ${
        selected ? 'border-blue-500 bg-blue-500/10' : 'border-white/10 bg-white/5'
      }`}
    >
      <Text
        className={`text-lg font-bold mb-1 ${
          selected ? 'text-blue-400' : 'text-white'
        }`}
      >
        {label}
      </Text>
      <Text className="text-gray-400 text-sm">{description}</Text>
    </Pressable>
  )
}

function AreaChip({
  label,
  value,
  selected,
  onPress,
}: {
  label: string
  value: string
  selected: boolean
  onPress: () => void
}) {
  return (
    <Pressable
      onPress={onPress}
      className={`px-4 py-3 rounded-xl mr-2 mb-2 ${
        selected ? 'bg-blue-500' : 'bg-white/10'
      }`}
    >
      <Text
        className={`text-sm font-medium ${
          selected ? 'text-white' : 'text-gray-300'
        }`}
      >
        {label}
      </Text>
    </Pressable>
  )
}

// ============================================================
// COMPONENTE PRINCIPAL
// ============================================================

export default function RegisterForm() {
  // Estado global do form
  const [userType, setUserType] = useState<UserType>(null)
  const [step, setStep] = useState<Step>('selecao')

  // Dados Básicos
  const [dadosBasicos, setDadosBasicos] = useState<DadosBasicos>({
    nomeCompleto: '',
    idade: '',
    email: '',
    cpf: '',
    cnpj: '',
    senha: '',
    confirmarSenha: '',
  })
  const [dadosBasicosErrors, setDadosBasicosErrors] = useState<Errors<DadosBasicos>>({})

  // Endereço Cliente
  const [enderecoCliente, setEnderecoCliente] = useState<EnderecoCliente>({
    cep: '',
    rua: '',
    logradouro: '',
    cidade: '',
    estado: '',
  })
  const [enderecoClienteErrors, setEnderecoClienteErrors] = useState<Errors<EnderecoCliente>>({})

  // Área de Atuação Colaborador
  const [areaAtuacao, setAreaAtuacao] = useState<AreaAtuacao>({
    areaAtuacao: 'servicos',
    outraArea: '',
    atendeADomicilio: false,
    cep: '',
    rua: '',
    logradouro: '',
    setor: '',
    cidade: '',
    estado: '',
  })
  const [areaAtuacaoErrors, setAreaAtuacaoErrors] = useState<Errors<AreaAtuacao>>({})

  // ============================================================
  // HANDLERS
  // ============================================================

  const handleDadosBasicosChange = (field: keyof DadosBasicos, value: string) => {
    setDadosBasicos((prev) => ({ ...prev, [field]: value }))
    if (dadosBasicosErrors[field]) {
      setDadosBasicosErrors((prev) => ({ ...prev, [field]: undefined }))
    }
  }

  const handleEnderecoClienteChange = (field: keyof EnderecoCliente, value: string) => {
    let finalValue = value

    if (field === 'cep') {
      const clean = value.replace(/\D/g, '').slice(0, 8)
      finalValue = clean.length > 5 ? `${clean.slice(0, 5)}-${clean.slice(5)}` : clean
    }
    if (field === 'estado') {
      finalValue = value.toUpperCase().slice(0, 2)
    }

    setEnderecoCliente((prev) => ({ ...prev, [field]: finalValue }))
    if (enderecoClienteErrors[field]) {
      setEnderecoClienteErrors((prev) => ({ ...prev, [field]: undefined }))
    }
  }

  const handleAreaAtuacaoChange = (
    field: keyof AreaAtuacao,
    value: string | boolean
  ) => {
    let finalValue = value

    if (field === 'cep' && typeof value === 'string') {
      const clean = value.replace(/\D/g, '').slice(0, 8)
      finalValue = clean.length > 5 ? `${clean.slice(0, 5)}-${clean.slice(5)}` : clean
    }
    if (field === 'estado' && typeof value === 'string') {
      finalValue = value.toUpperCase().slice(0, 2)
    }

    setAreaAtuacao((prev) => ({ ...prev, [field]: finalValue }))
    if (areaAtuacaoErrors[field as keyof AreaAtuacao]) {
      setAreaAtuacaoErrors((prev) => ({ ...prev, [field]: undefined }))
    }
  }

  // ============================================================
  // VALIDAÇÕES
  // ============================================================

  const validateDadosBasicos = (): boolean => {
    const schema = userType === 'cliente' ? dadosBasicosClienteSchema : dadosBasicosColaboradorSchema
    const result = schema.safeParse(dadosBasicos)
    if (!result.success) {
      const errors: Errors<DadosBasicos> = {}
      result.error.issues.forEach((issue) => {
        const field = issue.path[0] as keyof DadosBasicos
        if (!errors[field]) errors[field] = issue.message
      })
      setDadosBasicosErrors(errors)
      return false
    }
    setDadosBasicosErrors({})
    return true
  }

  const validateDadosBasicosField = (field: keyof DadosBasicos) => {
    const schema = userType === 'cliente' ? dadosBasicosClienteSchema : dadosBasicosColaboradorSchema
    const result = schema.safeParse(dadosBasicos)
    if (result.success) {
      setDadosBasicosErrors((prev) => ({ ...prev, [field]: undefined }))
      return
    }

    const issue = result.error.issues.find((i) => i.path[0] === field)
    setDadosBasicosErrors((prev) => ({
      ...prev,
      [field]: issue?.message,
    }))
  }

  const validateEnderecoCliente = (): boolean => {
    const result = enderecoClienteSchema.safeParse(enderecoCliente)
    if (!result.success) {
      const errors: Errors<EnderecoCliente> = {}
      result.error.issues.forEach((issue) => {
        const field = issue.path[0] as keyof EnderecoCliente
        if (!errors[field]) errors[field] = issue.message
      })
      setEnderecoClienteErrors(errors)
      return false
    }
    setEnderecoClienteErrors({})
    return true
  }

  const validateEnderecoClienteField = (field: keyof EnderecoCliente) => {
    const result = enderecoClienteSchema.safeParse(enderecoCliente)
    if (result.success) {
      setEnderecoClienteErrors((prev) => ({ ...prev, [field]: undefined }))
      return
    }

    const issue = result.error.issues.find((i) => i.path[0] === field)
    setEnderecoClienteErrors((prev) => ({
      ...prev,
      [field]: issue?.message,
    }))
  }

  const validateAreaAtuacao = (): boolean => {
    const result = areaAtuacaoSchema.safeParse(areaAtuacao)
    if (!result.success) {
      const errors: Errors<AreaAtuacao> = {}
      result.error.issues.forEach((issue) => {
        const field = issue.path[0] as keyof AreaAtuacao
        if (!errors[field]) errors[field] = issue.message
      })
      setAreaAtuacaoErrors(errors)
      return false
    }
    setAreaAtuacaoErrors({})
    return true
  }

  const validateAreaAtuacaoField = (field: keyof AreaAtuacao) => {
    const result = areaAtuacaoSchema.safeParse(areaAtuacao)
    if (result.success) {
      setAreaAtuacaoErrors((prev) => ({ ...prev, [field]: undefined }))
      return
    }

    const issue = result.error.issues.find((i) => i.path[0] === field)
    setAreaAtuacaoErrors((prev) => ({
      ...prev,
      [field]: issue?.message,
    }))
  }

  const dadosBasicosIsValid =
    (userType === 'cliente' ? dadosBasicosClienteSchema : dadosBasicosColaboradorSchema).safeParse(
      dadosBasicos
    ).success

  const enderecoClienteIsValid = enderecoClienteSchema.safeParse(enderecoCliente).success
  const areaAtuacaoIsValid = areaAtuacaoSchema.safeParse(areaAtuacao).success

  // ============================================================
  // NAVEGAÇÃO
  // ============================================================

  const handleNext = () => {
    if (step === 'selecao' && userType) {
      setStep('dados')
    } else if (step === 'dados') {
      if (validateDadosBasicos()) {
        setStep(userType === 'cliente' ? 'endereco' : 'areaAtuacao')
      }
    } else if (step === 'endereco') {
      if (validateEnderecoCliente()) {
        setStep('concluido')
      }
    } else if (step === 'areaAtuacao') {
      if (validateAreaAtuacao()) {
        setStep('concluido')
      }
    }
  }

  const handleBack = () => {
    if (step === 'dados') {
      setStep('selecao')
    } else if (step === 'endereco' || step === 'areaAtuacao') {
      setStep('dados')
    }
  }

  const handleReset = () => {
    setUserType(null)
    setStep('selecao')
    setDadosBasicos({
      nomeCompleto: '',
      idade: '',
      email: '',
      cpf: '',
      cnpj: '',
      senha: '',
      confirmarSenha: '',
    })
    setEnderecoCliente({
      cep: '',
      rua: '',
      logradouro: '',
      cidade: '',
      estado: '',
    })
    setAreaAtuacao({
      areaAtuacao: 'servicos',
      outraArea: '',
      atendeADomicilio: false,
      cep: '',
      rua: '',
      logradouro: '',
      setor: '',
      cidade: '',
      estado: '',
    })
    setDadosBasicosErrors({})
    setEnderecoClienteErrors({})
    setAreaAtuacaoErrors({})
  }

  // ============================================================
  // STEP LABELS
  // ============================================================

  const stepsCliente = ['Dados', 'Endereço', 'Concluído']
  const stepsColaborador = ['Dados', 'Atuação', 'Concluído']

  const getCurrentStepIndex = (): number => {
    if (step === 'dados') return 0
    if (step === 'endereco' || step === 'areaAtuacao') return 1
    if (step === 'concluido') return 2
    return 0
  }

  // ============================================================
  // RENDER STEPS
  // ============================================================

  const renderSelecao = () => (
    <View className="flex-1">
      <Text className="text-3xl font-bold text-white mb-2">Criar conta</Text>
      <Text className="text-gray-400 text-base mb-8 leading-6">
        Escolha o tipo de perfil que você deseja criar. Clientes podem buscar e
        agendar serviços, enquanto colaboradores oferecem seus serviços na
        plataforma.
      </Text>

      <View className="flex-row gap-3 mb-8">
        <OptionButton
          label="Cliente"
          description="Busco serviços para contratar"
          selected={userType === 'cliente'}
          onPress={() => setUserType('cliente')}
        />
        <OptionButton
          label="Colaborador"
          description="Ofereço meus serviços"
          selected={userType === 'colaborador'}
          onPress={() => setUserType('colaborador')}
        />
      </View>

      <Pressable
        onPress={handleNext}
        disabled={!userType}
        className={`py-4 rounded-xl items-center ${
          userType ? 'bg-blue-500' : 'bg-white/10'
        }`}
      >
        <Text
          className={`text-base font-bold ${
            userType ? 'text-white' : 'text-gray-500'
          }`}
        >
          Continuar
        </Text>
      </Pressable>
    </View>
  )

  const renderDadosBasicos = () => (
    <View className="flex-1">
      <StepIndicator
        steps={userType === 'cliente' ? stepsCliente : stepsColaborador}
        currentIndex={getCurrentStepIndex()}
      />

      <Text className="text-2xl font-bold text-white mb-2">Dados básicos</Text>
      <Text className="text-gray-400 text-sm mb-6">
        Preencha suas informações pessoais para criar sua conta.
      </Text>

      <InputField
        label="Nome completo"
        placeholder="João da Silva"
        value={dadosBasicos.nomeCompleto}
        onChangeText={(text) => handleDadosBasicosChange('nomeCompleto', text)}
        onBlur={() => validateDadosBasicosField('nomeCompleto')}
        error={dadosBasicosErrors.nomeCompleto}
        autoCapitalize="words"
      />

      <InputField
        label="Idade"
        placeholder="25"
        value={dadosBasicos.idade}
        onChangeText={(text) => handleDadosBasicosChange('idade', text)}
        onBlur={() => validateDadosBasicosField('idade')}
        error={dadosBasicosErrors.idade}
        keyboardType="numeric"
        maxLength={3}
      />

      <InputField
        label="E-mail"
        placeholder="seu@email.com"
        value={dadosBasicos.email}
        onChangeText={(text) => handleDadosBasicosChange('email', text)}
        onBlur={() => validateDadosBasicosField('email')}
        error={dadosBasicosErrors.email}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      {userType === 'cliente' ? (
        <InputField
          label="CPF"
          placeholder="000.000.000-00"
          value={dadosBasicos.cpf || ''}
          onChangeText={(text) => handleDadosBasicosChange('cpf', text)}
          onBlur={() => validateDadosBasicosField('cpf')}
          error={dadosBasicosErrors.cpf}
          keyboardType="numeric"
          maxLength={14}
        />
      ) : (
        <InputField
          label="CNPJ"
          placeholder="00.000.000/0000-00"
          value={dadosBasicos.cnpj || ''}
          onChangeText={(text) => handleDadosBasicosChange('cnpj', text)}
          onBlur={() => validateDadosBasicosField('cnpj')}
          error={dadosBasicosErrors.cnpj}
          keyboardType="numeric"
          maxLength={18}
        />
      )}

      <InputField
        label="Senha"
        placeholder="Mínimo 8 caracteres"
        value={dadosBasicos.senha}
        onChangeText={(text) => handleDadosBasicosChange('senha', text)}
        onBlur={() => validateDadosBasicosField('senha')}
        error={dadosBasicosErrors.senha}
        secureTextEntry
      />

      <InputField
        label="Confirmar senha"
        placeholder="Repita a senha"
        value={dadosBasicos.confirmarSenha}
        onChangeText={(text) => handleDadosBasicosChange('confirmarSenha', text)}
        onBlur={() => validateDadosBasicosField('confirmarSenha')}
        error={dadosBasicosErrors.confirmarSenha}
        secureTextEntry
      />

      <View className="flex-row gap-3 mt-4">
        <Pressable
          onPress={handleBack}
          className="flex-1 py-4 rounded-xl items-center border border-white/10"
        >
          <Text className="text-gray-300 text-base font-semibold">Voltar</Text>
        </Pressable>
        <Pressable
          onPress={handleNext}
          disabled={!dadosBasicosIsValid}
          className={`flex-1 py-4 rounded-xl items-center ${
            dadosBasicosIsValid ? 'bg-blue-500' : 'bg-white/10'
          }`}
        >
          <Text
            className={`text-base font-bold ${
              dadosBasicosIsValid ? 'text-white' : 'text-gray-500'
            }`}
          >
            Continuar
          </Text>
        </Pressable>
      </View>
    </View>
  )

  const renderEnderecoCliente = () => (
    <View className="flex-1">
      <StepIndicator steps={stepsCliente} currentIndex={getCurrentStepIndex()} />

      <Text className="text-2xl font-bold text-white mb-2">Endereço</Text>
      <Text className="text-gray-400 text-sm mb-6">
        Informe seu endereço para encontrarmos profissionais perto de você.
      </Text>

      <InputField
        label="CEP"
        placeholder="00000-000"
        value={enderecoCliente.cep}
        onChangeText={(text) => handleEnderecoClienteChange('cep', text)}
        onBlur={() => validateEnderecoClienteField('cep')}
        error={enderecoClienteErrors.cep}
        keyboardType="numeric"
        maxLength={9}
      />

      <InputField
        label="Rua"
        placeholder="Nome da rua"
        value={enderecoCliente.rua}
        onChangeText={(text) => handleEnderecoClienteChange('rua', text)}
        onBlur={() => validateEnderecoClienteField('rua')}
        error={enderecoClienteErrors.rua}
      />

      <InputField
        label="Número / Complemento"
        placeholder="123, Apto 4B"
        value={enderecoCliente.logradouro}
        onChangeText={(text) => handleEnderecoClienteChange('logradouro', text)}
        onBlur={() => validateEnderecoClienteField('logradouro')}
        error={enderecoClienteErrors.logradouro}
      />

      <View className="flex-row gap-3">
        <View className="flex-1">
          <InputField
            label="Cidade"
            placeholder="São Paulo"
            value={enderecoCliente.cidade}
            onChangeText={(text) => handleEnderecoClienteChange('cidade', text)}
            onBlur={() => validateEnderecoClienteField('cidade')}
            error={enderecoClienteErrors.cidade}
          />
        </View>
        <View className="w-24">
          <InputField
            label="Estado"
            placeholder="SP"
            value={enderecoCliente.estado}
            onChangeText={(text) => handleEnderecoClienteChange('estado', text)}
            onBlur={() => validateEnderecoClienteField('estado')}
            error={enderecoClienteErrors.estado}
            autoCapitalize="characters"
            maxLength={2}
          />
        </View>
      </View>

      <View className="flex-row gap-3 mt-4">
        <Pressable
          onPress={handleBack}
          className="flex-1 py-4 rounded-xl items-center border border-white/10"
        >
          <Text className="text-gray-300 text-base font-semibold">Voltar</Text>
        </Pressable>
        <Pressable
          onPress={handleNext}
          disabled={!enderecoClienteIsValid}
          className={`flex-1 py-4 rounded-xl items-center ${
            enderecoClienteIsValid ? 'bg-blue-500' : 'bg-white/10'
          }`}
        >
          <Text
            className={`text-base font-bold ${
              enderecoClienteIsValid ? 'text-white' : 'text-gray-500'
            }`}
          >
            Finalizar
          </Text>
        </Pressable>
      </View>
    </View>
  )

  const renderAreaAtuacao = () => {
    const areas = [
      { label: 'Serviços', value: 'servicos' },
      { label: 'Comércio', value: 'comercio' },
      { label: 'Limpeza', value: 'limpeza' },
      { label: 'Manutenção', value: 'manutencao' },
      { label: 'Outro', value: 'outro' },
    ] as const

    return (
      <View className="flex-1">
        <StepIndicator steps={stepsColaborador} currentIndex={getCurrentStepIndex()} />

        <Text className="text-2xl font-bold text-white mb-2">Área de atuação</Text>
        <Text className="text-gray-400 text-sm mb-6">
          Informe sua área de atuação e região de atendimento.
        </Text>

        {/* Área de Atuação */}
        <Text className="text-gray-300 text-sm mb-3">Selecione sua área</Text>
        <View className="flex-row flex-wrap mb-1">
          {areas.map((area) => (
            <AreaChip
              key={area.value}
              label={area.label}
              value={area.value}
              selected={areaAtuacao.areaAtuacao === area.value}
              onPress={() => handleAreaAtuacaoChange('areaAtuacao', area.value)}
            />
          ))}
        </View>
        <View className="h-5">
          {areaAtuacaoErrors.areaAtuacao && (
            <Text className="text-red-400 text-xs">{areaAtuacaoErrors.areaAtuacao}</Text>
          )}
        </View>

        {areaAtuacao.areaAtuacao === 'outro' && (
          <InputField
            label="Especifique a área"
            placeholder="Ex: Consultoria, Design..."
            value={areaAtuacao.outraArea || ''}
            onChangeText={(text) => handleAreaAtuacaoChange('outraArea', text)}
            onBlur={() => validateAreaAtuacaoField('outraArea')}
            error={areaAtuacaoErrors.outraArea}
          />
        )}

        {/* Atende a domicílio */}
        <View className="flex-row items-center justify-between bg-white/5 rounded-xl p-4 mb-5">
          <View className="flex-1 mr-4">
            <Text className="text-white text-base font-medium">Atende a domicílio?</Text>
            <Text className="text-gray-400 text-sm mt-0.5">
              Você vai até o local do cliente
            </Text>
          </View>
          <Switch
            value={areaAtuacao.atendeADomicilio}
            onValueChange={(val) => handleAreaAtuacaoChange('atendeADomicilio', val)}
            trackColor={{ false: '#374151', true: '#3b82f6' }}
            thumbColor={areaAtuacao.atendeADomicilio ? '#ffffff' : '#9ca3af'}
          />
        </View>

        {/* Região */}
        <Text className="text-gray-300 text-sm mb-3">Região de atendimento</Text>

        <InputField
          label="CEP"
          placeholder="00000-000"
          value={areaAtuacao.cep}
          onChangeText={(text) => handleAreaAtuacaoChange('cep', text)}
          onBlur={() => validateAreaAtuacaoField('cep')}
          error={areaAtuacaoErrors.cep}
          keyboardType="numeric"
          maxLength={9}
        />

        <InputField
          label="Rua"
          placeholder="Nome da rua"
          value={areaAtuacao.rua}
          onChangeText={(text) => handleAreaAtuacaoChange('rua', text)}
          onBlur={() => validateAreaAtuacaoField('rua')}
          error={areaAtuacaoErrors.rua}
        />

        <InputField
          label="Número / Complemento"
          placeholder="123, Sala 5"
          value={areaAtuacao.logradouro}
          onChangeText={(text) => handleAreaAtuacaoChange('logradouro', text)}
          onBlur={() => validateAreaAtuacaoField('logradouro')}
          error={areaAtuacaoErrors.logradouro}
        />

        <InputField
          label="Setor / Bairro"
          placeholder="Centro"
          value={areaAtuacao.setor}
          onChangeText={(text) => handleAreaAtuacaoChange('setor', text)}
          onBlur={() => validateAreaAtuacaoField('setor')}
          error={areaAtuacaoErrors.setor}
        />

        <View className="flex-row gap-3">
          <View className="flex-1">
            <InputField
              label="Cidade"
              placeholder="São Paulo"
              value={areaAtuacao.cidade}
              onChangeText={(text) => handleAreaAtuacaoChange('cidade', text)}
              onBlur={() => validateAreaAtuacaoField('cidade')}
              error={areaAtuacaoErrors.cidade}
            />
          </View>
          <View className="w-24">
            <InputField
              label="Estado"
              placeholder="SP"
              value={areaAtuacao.estado}
              onChangeText={(text) => handleAreaAtuacaoChange('estado', text)}
              onBlur={() => validateAreaAtuacaoField('estado')}
              error={areaAtuacaoErrors.estado}
              autoCapitalize="characters"
              maxLength={2}
            />
          </View>
        </View>

        <View className="flex-row gap-3 mt-4">
          <Pressable
            onPress={handleBack}
            className="flex-1 py-4 rounded-xl items-center border border-white/10"
          >
            <Text className="text-gray-300 text-base font-semibold">Voltar</Text>
          </Pressable>
          <Pressable
            onPress={handleNext}
            disabled={!areaAtuacaoIsValid}
            className={`flex-1 py-4 rounded-xl items-center ${
              areaAtuacaoIsValid ? 'bg-blue-500' : 'bg-white/10'
            }`}
          >
            <Text
              className={`text-base font-bold ${
                areaAtuacaoIsValid ? 'text-white' : 'text-gray-500'
              }`}
            >
              Finalizar
            </Text>
          </Pressable>
        </View>
      </View>
    )
  }

  const renderConcluido = () => (
    <View className="flex-1 items-center justify-center py-12">
      <View className="w-20 h-20 bg-green-500/20 rounded-full items-center justify-center mb-6">
        <Text className="text-4xl">✓</Text>
      </View>

      <Text className="text-3xl font-bold text-white mb-3 text-center">
        Cadastro concluído!
      </Text>
      <Text className="text-gray-400 text-base text-center px-4 leading-6 mb-8">
        {userType === 'cliente'
          ? 'Sua conta foi criada com sucesso. Agora você pode explorar e agendar serviços com os melhores profissionais.'
          : 'Sua conta de colaborador foi criada com sucesso. Agora você pode receber agendamentos e expandir sua carteira de clientes.'}
      </Text>

      <View className="w-full bg-white/5 rounded-2xl p-5 mb-6">
        <Text className="text-gray-400 text-sm mb-3">Resumo do cadastro</Text>
        <View className="flex-row justify-between mb-2">
          <Text className="text-gray-500 text-sm">Tipo de conta</Text>
          <Text className="text-white text-sm font-medium capitalize">{userType}</Text>
        </View>
        <View className="flex-row justify-between mb-2">
          <Text className="text-gray-500 text-sm">Nome</Text>
          <Text className="text-white text-sm font-medium">{dadosBasicos.nomeCompleto}</Text>
        </View>
        <View className="flex-row justify-between">
          <Text className="text-gray-500 text-sm">E-mail</Text>
          <Text className="text-white text-sm font-medium">{dadosBasicos.email}</Text>
        </View>
      </View>

      <Pressable
        onPress={handleReset}
        className="w-full py-4 rounded-xl items-center bg-blue-500"
      >
        <Text className="text-white text-base font-bold">Fazer novo cadastro</Text>
      </Pressable>
    </View>
  )

  // ============================================================
  // RENDER PRINCIPAL
  // ============================================================

  const renderCurrentStep = () => {
    switch (step) {
      case 'selecao':
        return renderSelecao()
      case 'dados':
        return renderDadosBasicos()
      case 'endereco':
        return renderEnderecoCliente()
      case 'areaAtuacao':
        return renderAreaAtuacao()
      case 'concluido':
        return renderConcluido()
      default:
        return renderSelecao()
    }
  }

  return (
    <View className="flex-1 bg-[#0a0a0f]">
      <StatusBar barStyle="light-content" backgroundColor="#0a0a0f" />
      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          className="flex-1"
          contentContainerClassName="px-6 py-10"
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {renderCurrentStep()}
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  )
}
