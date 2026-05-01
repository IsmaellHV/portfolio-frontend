import { EntityUser } from './EntityUser';

export interface IRequestServiceSignIn {
  email: string;
  password: string;
  captcha: string;
}

export interface IResponseServiceSignIn {
  user: EntityUser;
  accessToken: string;
  refreshToken: string;
}
