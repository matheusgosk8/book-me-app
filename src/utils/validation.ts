
import { z } from 'zod'

// Valida um campo individualmente
export function validateField<T extends z.ZodRawShape, K extends keyof T>(schema: z.ZodObject<T>,
    field: K,
    value: unknown) {
    const fieldSchema = schema.shape[field] as unknown as z.ZodType<any, any, any>
    const result = fieldSchema.safeParse(value)
    if (result.success) return ''
    return result.error.issues?.[0]?.message || 'Campo inválido'
}

// Validação genérica para qualquer schema Zod
export function validateAll<T extends z.ZodTypeAny>(schema: T, values: unknown) {
    const result = schema.safeParse(values)
    if (result.success) {
        return { valid: true, errors: {} }
    }

    // Monta objeto de erros baseado nos paths do Zod
    const fieldErrors: Record<string, string> = {}
    result.error.issues.forEach((e) => {
        const key = e.path?.[0]
        if (key && typeof key === 'string') {
            fieldErrors[key] = e.message
        }
    })
    return { valid: false, errors: fieldErrors }
}

