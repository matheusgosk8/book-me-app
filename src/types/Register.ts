import z from "zod"

export const dadosBasicosBaseSchema = z.object({
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


export const enderecoClienteSchema = z.object({
  cep: z.string().refine(
    (val) => val.replace(/\D/g, '').length === 8,
    { message: 'CEP deve ter 8 dígitos' }
  ),
  rua: z.string().min(3, 'Rua é obrigatória'),
  logradouro: z.string().min(1, 'Número/Complemento é obrigatório'),
  cidade: z.string().min(2, 'Cidade é obrigatória'),
  estado: z.string().length(2, 'Estado deve ter 2 letras (ex: SP)'),
})

export const areaAtuacaoSchema = z.object({
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



export type UserType = 'cliente' | 'colaborador' | null
export type Step = 'selecao' | 'dados' | 'endereco' | 'areaAtuacao' | 'concluido'
export type DadosBasicos = z.infer<typeof dadosBasicosBaseSchema>
export type EnderecoCliente = z.infer<typeof enderecoClienteSchema>
export type AreaAtuacao = z.infer<typeof areaAtuacaoSchema>