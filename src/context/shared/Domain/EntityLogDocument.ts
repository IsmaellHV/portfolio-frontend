import { EntityUsuario } from './EntityUsuario';

export interface EntityLogDocument {
  fecha: Date | string;
  origen: string;
  agente: any;
  ip: string;
  usuario: EntityUsuario;
}
