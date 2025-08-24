import { useState } from 'react';
import { AdapterSupabase } from '../../../shared/Infraestructure/AdapterSupabase';
import { PropsView } from '../Domain/PropsView';
import { NavigateFunction, useNavigate } from 'react-router-dom';
import { IScore } from '../Domain/IScore';

export const Controller = (): PropsView => {
  //#region VARIABLES GLOBAL
  const navigate: NavigateFunction = useNavigate();
  const [dataScores, setDataScores] = useState<any[]>([]);
  //#endregion

  //#region INICIALITATION
  const init = async () => {
    const dataScores: IScore[] = await getDataScores();

    dataScores.sort((a: IScore, b: IScore) => {
      return b.score - a.score;
    });

    dataScores.forEach((item: IScore, index: number) => {
      item.i = index + 1;
      item.created_at = new Date(item.created_at).toLocaleString();
    });

    setDataScores(dataScores);
  };

  const end = async () => {};
  //#endregion

  //# region Data Scores
  const getDataScores = async (): Promise<IScore[]> => {
    try {
      const response = await AdapterSupabase.fetchData('tetris_scores');
      // Si la respuesta es null o un array de errores, retornar array vacío
      if (!response || !Array.isArray(response)) {
        return [];
      }
      return response as unknown as IScore[];
    } catch (error) {
      console.error('Error fetching scores:', error);
      return [];
    }
  };
  // #endregion

  //#region Juegos
  const handleGo = (route: string) => {
    navigate(route, { replace: true });
  };
  //#endregion

  //#region EXPORT
  return {
    end,
    init,
    handleGo,
    dataScores,
  };
  //#endregion
};
