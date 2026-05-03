export type BasicsInfoType = {
    nome: string
    email: string
    cpf: string
    cnpj: string
    telefone: string
    senha: string
    confirmaSenha: string
    cep: string
    userType: 'cliente' | 'profissional'
}

export type LoginResponse = {
    message: string,
    access_token: string,
    refresh_token: string,
    user: {
        id: string,
        nome: string,
        email: string
        role: 'customer' | 'provider'
    }
}