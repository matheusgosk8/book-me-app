
import { z } from 'zod'

// Função para validar CPF
function isValidCPF(cpf: string): boolean {
    const cleanCPF = cpf.replace(/\D/g, '')
    
    // Verifica se tem 11 dígitos
    if (cleanCPF.length !== 11) return false
    
    // Verifica se todos os dígitos são iguais (inválido)
    if (/^\d{11}$/.test(cleanCPF) === false) return false
    if (cleanCPF === cleanCPF[0].repeat(11)) return false
    
    return true
}

export const registerSchema = z.object({
    nome: z.string().min(1, 'Nome é obrigatório'),
    email: z.string().email('Email inválido'),
    cpf: z.string().refine(
        (val) => isValidCPF(val),
        { message: 'CPF inválido' }
    ),
    senha: z.string().min(8, 'Senha deve ter no mínimo 8 caracteres'),
    telefone: z.string().refine(
        (val) => val.replace(/\D/g, '').length >= 10,
        { message: 'Telefone inválido' }
    ),
})

export type RegisterFormValues = z.infer<typeof registerSchema>

// Valida um campo individualmente
export function validateField<T extends z.ZodRawShape, K extends keyof T>(schema: z.ZodObject<T>, field: K, value: unknown) {
    try {
        const fieldSchema = schema.shape[field] as unknown as z.ZodType<any, any, any>
        fieldSchema.parse(value)
        return ''
    } catch (err: any) {
        return err.errors?.[0]?.message || 'Campo inválido'
    }
}

// Validação genérica para qualquer schema Zod
export function validateAll<T extends z.ZodTypeAny>(schema: T, values: unknown) {
    try {
        schema.parse(values)
        return { valid: true, errors: {} }
    } catch (err: any) {
        // Monta objeto de erros baseado nos paths do Zod
        const fieldErrors: Record<string, string> = {}
        err.errors?.forEach((e: any) => {
            const key = e.path && e.path[0]
            if (key && typeof key === 'string') {
                fieldErrors[key] = e.message
            }
        })
        return { valid: false, errors: fieldErrors }
    }
}
