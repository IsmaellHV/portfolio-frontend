import { EntityLogDocument } from '../EntityLogDocument';

export interface EntityUtilitieFastLink {
  _id: string;
  code: string;
  originalLink: string;
  shortLink: string;
  estado: boolean;
  registrar: EntityLogDocument;
  actualizar: EntityLogDocument | null;
  eliminar: EntityLogDocument | null;
}
