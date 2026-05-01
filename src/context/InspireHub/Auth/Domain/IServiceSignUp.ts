import { EntityUser } from './EntityUser';

export interface IRequestServiceSignUp {
  email: string;
  password: string;
  displayName: string;
  captcha: string;
}

export interface IResponseServiceSignUp {
  user: EntityUser;
  accessToken: string;
  refreshToken: string;
}
