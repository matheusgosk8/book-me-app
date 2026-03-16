  export const formatCPF = (v: string) =>
    v
      .replace(/\D/g, "")
      .replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4")
      .slice(0, 14);
  export const formatCNPJ = (v: string) =>
    v
      .replace(/\D/g, "")
      .replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, "$1.$2.$3/$4-$5")
      .slice(0, 18);
  export const formatCEP = (v: string) =>
    v
      .replace(/\D/g, "")
      .replace(/(\d{5})(\d{3})/, "$1-$2")
      .slice(0, 9);