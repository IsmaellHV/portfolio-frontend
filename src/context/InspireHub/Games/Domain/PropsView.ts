import { IScore } from './IScore';

export interface PropsView {
  end: () => void;
  init: () => void;
  handleGo: (route: string) => void;
  dataScores: IScore[];
}
