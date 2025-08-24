import { EntityLogDocument } from '../EntityLogDocument';

export interface EntityContactMessage {
  _id?: string | null | undefined;
  name: string;
  email: string;
  message: string;
  read?: boolean;
  created_at?: string | Date | null | undefined;
  registrar?: EntityLogDocument;
  actualizar?: EntityLogDocument;
  eliminar?: EntityLogDocument;
}
