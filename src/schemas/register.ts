import { z } from "zod";

// Basics schema depends on userType for CPF/CNPJ rules
export function createBasicsSchema(
  userType: "cliente" | "profissional" = "cliente",
) {
  return z.object({
    nome: z.string().min(1, "Nome é obrigatório"),
    email: z.string().email("Email inválido"),
    userType: z.enum(["cliente", "profissional"]),
    cpf: z
      .string()
      .optional()
      .refine(
        (val) => {
          if (userType === "profissional") return true;
          const clean = (val || "").replace(/\D/g, "");
          return clean.length === 11 && clean !== clean[0]?.repeat(11);
        },
        { message: "CPF inválido" },
      ),
    cnpj: z
      .string()
      .optional()
      .refine(
        (val) => {
          if (userType === "cliente") return true;
          const clean = (val || "").replace(/\D/g, "");
          return clean.length === 14 && clean !== clean[0]?.repeat(14);
        },
        { message: "CNPJ inválido" },
      ),
    senha: z.string().min(8, "Senha deve ter no mínimo 8 caracteres"),
    confirmaSenha: z.string().min(1, "Confirmação é obrigatória"),
    telefone: z
      .string()
      .refine((v) => String(v).replace(/\D/g, "").length >= 10, {
        message: "Telefone inválido",
      }),
  });
}

export const addressSchema = z.object({
  cep: z
    .string()
    .refine((v) => String(v).replace(/\D/g, "").length === 8, {
      message: "CEP inválido",
    }),
  rua: z.string().min(3, "Rua é obrigatória"),
  logradouro: z.string().min(1, "Número/Complemento é obrigatório"),
  cidade: z.string().min(2, "Cidade é obrigatória"),
  estado: z.string().length(2, "Estado deve ter 2 letras (ex: SP)"),
});

export function createRegisterSchema(
  userType: "cliente" | "profissional" = "cliente",
) {
  const basics = createBasicsSchema(userType);
  return basics.merge(addressSchema).superRefine((data, ctx) => {
    if (data.senha !== data.confirmaSenha) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["confirmaSenha"],
        message: "Senhas não coincidem",
      });
    }

    if (data.userType === "cliente") {
      const clean = (data.cpf || "").replace(/\D/g, "");
      if (clean.length !== 11)
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["cpf"],
          message: "CPF inválido",
        });
    } else {
      const clean = (data.cnpj || "").replace(/\D/g, "");
      if (clean.length !== 14)
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["cnpj"],
          message: "CNPJ inválido",
        });
    }
  });
}

export default createRegisterSchema;

// Export a canonical schema instance and the inferred TypeScript type
export const registerSchema = createRegisterSchema("cliente");
export type RegisterType = z.infer<typeof registerSchema>;
