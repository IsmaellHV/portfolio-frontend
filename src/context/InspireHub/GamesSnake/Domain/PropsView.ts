export interface PropsView {
  end: () => void;
  init: () => void;

  isPlaying: boolean;
  timeElapsed: number;
  score: number;
  gameOver: boolean;
  handleButtonPress: (dir: string) => void;
}
