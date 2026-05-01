import { EntityMain, TypeGameScore } from './EntityMain';

export interface IRequestServiceGetTopScores {
  gameType: TypeGameScore;
  limit?: number;
}

export interface IResponseServiceGetTopScores extends EntityMain {}
