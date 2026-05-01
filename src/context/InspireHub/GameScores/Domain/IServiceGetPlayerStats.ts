import { EntityMain } from './EntityMain';

export interface IRequestServiceGetPlayerStats {
  playerName: string;
}

export interface IResponseServiceGetPlayerStats extends EntityMain {}
