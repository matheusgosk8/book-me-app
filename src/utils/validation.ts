
import { z } from 'zod'

// Valida um campo individualmente
export function validateField<T extends z.ZodRawShape, K extends keyof T>(schema: z.ZodObject<T>,
    field: K,
    value: unknown,
    onError: (message: string) => void) {
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

