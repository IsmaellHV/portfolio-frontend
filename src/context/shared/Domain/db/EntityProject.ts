import { EntityLogDocument } from '../EntityLogDocument';

export interface EntityProject {
  _id?: string | null | undefined;
  title: string;
  description: string;
  image_url?: string;
  project_url?: string;
  github_url?: string;
  technologies: string[];
  featured?: boolean;
  created_at?: string | Date | null | undefined;
  updated_at?: string | Date | null | undefined;
  registrar?: EntityLogDocument;
  actualizar?: EntityLogDocument;
  eliminar?: EntityLogDocument;
}
