import { EntityMain, TypeGameScore } from './EntityMain';

export interface IRequestServiceSaveScore {
  playerName: string;
  gameType: TypeGameScore;
  score: number;
  levelOrLines: number;
  duration: number;
  extraData?: Record<string, unknown> | null;
}

export interface IResponseServiceSaveScore extends EntityMain {}
