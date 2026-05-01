import { EntityMain } from './EntityMain';

export interface IRequestServiceCreateMessage {
  name: string;
  email: string;
  message: string;
  captcha: string;
}

export interface IResponseServiceCreateMessage extends EntityMain {}
