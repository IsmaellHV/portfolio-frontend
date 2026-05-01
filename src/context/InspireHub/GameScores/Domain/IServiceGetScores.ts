import { EntityMain, TypeGameScore } from './EntityMain';

export interface IRequestServiceGetScores {
  gameType?: TypeGameScore;
  limit?: number;
}

export interface IResponseServiceGetScores extends EntityMain {}
