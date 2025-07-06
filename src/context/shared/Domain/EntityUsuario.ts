export interface EntityUsuario {
  _id: string;
  username: string | null;
  tipoDocumentoIdentidad: string;
  numeroDocumentoIdentidad: string;
  primerApellido: string;
  segundoApellido: string;
  nombres: string;
  telefono: string;
  correoElectronico: string;
}
