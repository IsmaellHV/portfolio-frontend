import { TypeGameScore } from './EntityMain';

export interface IRequestServiceGetGameStats {
  gameType: TypeGameScore;
}

export interface IResponseServiceGetGameStats {
  totalPlayers: number;
  averageScore: number;
  highestScore: number;
  totalGames: number;
}
