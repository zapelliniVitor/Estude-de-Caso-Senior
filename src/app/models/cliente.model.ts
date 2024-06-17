import { Contato } from "./contato.model";

export interface Cliente {
  id: number;
  nomeCompleto: string;
  emails: string[];
  telefones: string[];
  dataRegistro: Date | string;
  contatos: Contato[];
}
