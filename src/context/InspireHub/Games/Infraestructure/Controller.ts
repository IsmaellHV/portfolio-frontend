import { useState } from 'react';
import { NavigateFunction, useNavigate } from 'react-router-dom';
import { IScore } from '../Domain/IScore';
import { PropsView } from '../Domain/PropsView';
import { useGameScoresService } from '../../GameScores/UseGameScoresService';

export const Controller = (): PropsView => {
  const navigate: NavigateFunction = useNavigate();
  const [dataScores, setDataScores] = useState<IScore[]>([]);
  const gameScores = useGameScoresService();

  const init = async () => {
    const scores = await getDataScores();
    scores.sort((a, b) => b.score - a.score);
    scores.forEach((item, index) => {
      item.i = index + 1;
    });
    setDataScores(scores);
  };

  const end = async () => {};

  const getDataScores = async (): Promise<IScore[]> => {
    try {
      const response = await gameScores.getScores({ gameType: 'tetris', limit: 100 });
      return response.map(row => ({
        id: 0,
        player_name: row.playerName,
        score: row.score,
        lines_cleared: row.levelOrLines,
        created_at: new Date((row.registrar?.fecha as unknown as string) || Date.now()).toLocaleString(),
      }));
    } catch (error) {
      console.error('Error fetching scores:', error);
      return [];
    }
  };

  const handleGo = (route: string) => {
    navigate(route, { replace: true });
  };

  return {
    end,
    init,
    handleGo,
    dataScores,
  };
};
