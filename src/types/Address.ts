import { z } from 'zod'

export const addressSchema = z.object({
    cep: z.string().refine(
        (val) => String(val).replace(/\D/g, '').length === 8,
        { message: 'CEP deve ter 8 dígitos' }
    ),
    rua: z.string().min(3, 'Rua é obrigatória'),
    logradouro: z.string().min(1, 'Número/Complemento é obrigatório'),
    cidade: z.string().min(2, 'Cidade é obrigatória'),
    estado: z.string().length(2, 'Estado deve ter 2 letras (ex: SP)'),
})

export type AddressType = z.infer<typeof addressSchema>

export default addressSchema
