import { EntityLogDocument } from '../EntityLogDocument';

export interface EntityTetrisScore {
  _id?: string | null | undefined;
  id?: string;
  player_name: string;
  score: number;
  lines_cleared: number;
  duration: number;
  created_at?: string | Date | null | undefined;
  registrar?: EntityLogDocument;
  actualizar?: EntityLogDocument;
  eliminar?: EntityLogDocument;
}
