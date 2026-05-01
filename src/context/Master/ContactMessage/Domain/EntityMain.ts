export interface EntityMain {
  _id: string;
  name: string;
  email: string;
  message: string;
  read: boolean;
  estado: boolean;
  registrar: { fecha: string };
}
