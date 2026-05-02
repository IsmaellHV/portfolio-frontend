export interface IRequestServiceChangePassword {
  currentPassword: string;
  newPassword: string;
}

export interface IResponseServiceChangePassword {
  ok: true;
}
