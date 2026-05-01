import { IRequestServiceGetGameStats, IResponseServiceGetGameStats } from './IServiceGetGameStats';
import { IRequestServiceGetPlayerStats, IResponseServiceGetPlayerStats } from './IServiceGetPlayerStats';
import { IRequestServiceGetScores, IResponseServiceGetScores } from './IServiceGetScores';
import { IRequestServiceGetTopScores, IResponseServiceGetTopScores } from './IServiceGetTopScores';
import { IRequestServiceSaveScore, IResponseServiceSaveScore } from './IServiceSaveScore';

export interface RepositoryMain {
  saveScore(params: IRequestServiceSaveScore): Promise<IResponseServiceSaveScore>;
  getScores(params: IRequestServiceGetScores): Promise<IResponseServiceGetScores[]>;
  getTopScores(params: IRequestServiceGetTopScores): Promise<IResponseServiceGetTopScores[]>;
  getGameStats(params: IRequestServiceGetGameStats): Promise<IResponseServiceGetGameStats>;
  getPlayerStats(params: IRequestServiceGetPlayerStats): Promise<IResponseServiceGetPlayerStats[]>;
}
