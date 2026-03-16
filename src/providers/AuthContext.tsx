import React, { createContext, useState, useContext, ReactNode } from 'react';

interface User {
  nome: string;
  email: string;
}

interface AuthContextData {
  user: User | null;
  signIn: (nome: string, email: string) => void;
  signOut: () => void;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  function signIn(nome: string, email: string) {
    setUser({ nome, email });
  }

  function signOut() {
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}