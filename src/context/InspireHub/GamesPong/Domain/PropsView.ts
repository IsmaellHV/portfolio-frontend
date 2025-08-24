export interface PropsView {
  // Game state
  isPlaying: boolean;
  isPaused: boolean;
  isGameOver: boolean;
  score: number;
  timeElapsed: string;
  
  // Game objects
  paddle1Y: number;
  paddle2Y: number;
  ballX: number;
  ballY: number;
  
  // Game dimensions
  gameWidth: number;
  gameHeight: number;
  paddleWidth: number;
  paddleHeight: number;
  ballSize: number;
  
  // Game controls
  init: () => void;
  end: () => void;
  startGame: () => void;
  pauseGame: () => void;
  resumeGame: () => void;
  restartGame: () => void;
  
  // Player controls
  movePaddle1Up: () => void;
  movePaddle1Down: () => void;
  movePaddle2Up: () => void;
  movePaddle2Down: () => void;
}