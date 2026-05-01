import { useDispatch, useSelector } from 'react-redux';
import { Dispatch } from 'redux';
import { RootState } from '../../shared/Infraestructure/AdapterStore';
import { UseCaseGetGameStats } from './Aplication/UseCaseGetGameStats';
import { UseCaseGetPlayerStats } from './Aplication/UseCaseGetPlayerStats';
import { UseCaseGetScores } from './Aplication/UseCaseGetScores';
import { UseCaseGetTopScores } from './Aplication/UseCaseGetTopScores';
import { UseCaseSaveScore } from './Aplication/UseCaseSaveScore';
import { IRequestServiceGetGameStats } from './Domain/IServiceGetGameStats';
import { IRequestServiceGetPlayerStats } from './Domain/IServiceGetPlayerStats';
import { IRequestServiceGetScores } from './Domain/IServiceGetScores';
import { IRequestServiceGetTopScores } from './Domain/IServiceGetTopScores';
import { IRequestServiceSaveScore } from './Domain/IServiceSaveScore';
import { RepositoryImplMain } from './Infraestructure/RepositoryImplMain';

export const useGameScoresService = () => {
  const dispatch: Dispatch = useDispatch();
  const { dbLocal } = useSelector((state: RootState) => state.generic);
  const repository = new RepositoryImplMain(dbLocal, dispatch);

  return {
    saveScore: (params: IRequestServiceSaveScore) => new UseCaseSaveScore(repository).exec(params),
    getScores: (params: IRequestServiceGetScores) => new UseCaseGetScores(repository).exec(params),
    getTopScores: (params: IRequestServiceGetTopScores) => new UseCaseGetTopScores(repository).exec(params),
    getGameStats: (params: IRequestServiceGetGameStats) => new UseCaseGetGameStats(repository).exec(params),
    getPlayerStats: (params: IRequestServiceGetPlayerStats) => new UseCaseGetPlayerStats(repository).exec(params),
  };
};
