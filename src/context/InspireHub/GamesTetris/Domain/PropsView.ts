import { IFormSaveOneError, IFormSaveOneValues } from './IFormSaveOne';

export interface PropsView {
  end: () => void;
  init: () => void;
  handleGo: (route: string) => void;
  board: number[][];
  currentShape: number[][] | null;
  position: { x: number; y: number };
  rowsToClear: number[];
  moveShape: (direction: number) => void;
  dropShape: () => void;
  rotateShape: () => void;
  isPlaying: boolean;
  stopGame: () => void;
  togglePauseResumeGame: () => void;
  restartGame: (e: React.MouseEvent<HTMLButtonElement, MouseEvent> | React.KeyboardEvent<HTMLButtonElement>) => void;
  notificationGameOver: boolean;
  nextShape: number[][] | null;
  onChangeNotificationGameOver: (value: boolean) => void;
  lines: number;
  timeElapsed: number;
  score: number;
  formSaveOne: { values: IFormSaveOneValues; touched: any; errors: any; handleBlur: (name: keyof IFormSaveOneError) => void };
  onChangeValueSaveOne: <T extends keyof IFormSaveOneValues>(name: T, value: IFormSaveOneValues[T]) => void;
}
