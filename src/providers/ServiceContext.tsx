import React, { createContext, useState, useContext } from 'react';

export type Service = {
  id: string;
  titulo: string;
  profissional: string;
  preco: string;
  categoria: string;
};

type ServiceContextType = {
  servicos: Service[];
  addService: (s: Omit<Service, 'id'>) => void;
};

const ServiceContext = createContext<ServiceContextType | undefined>(undefined);

export function ServiceProvider({ children }: { children: React.ReactNode }) {
  const [servicos, setServicos] = useState<Service[]>([
    { id: '1', titulo: 'Corte de Cabelo', profissional: 'João Silva', preco: 'R$ 50,00', categoria: 'Beleza' },
  ]);

  const addService = (novo: Omit<Service, 'id'>) => {
    const serviceWithId = { ...novo, id: Math.random().toString() };
    setServicos((prev) => [serviceWithId, ...prev]); // Adiciona no topo da lista
  };

  return (
    <ServiceContext.Provider value={{ servicos, addService }}>
      {children}
    </ServiceContext.Provider>
  );
}

export const useServices = () => {
  const context = useContext(ServiceContext);
  if (!context) throw new Error("useServices deve ser usado dentro de ServiceProvider");
  return context;
};