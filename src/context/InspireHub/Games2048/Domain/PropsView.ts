export interface PropsView {
  // Game state
  board: number[][];
  score: number;
  bestScore: number;
  isGameOver: boolean;
  isWon: boolean;
  canUndo: boolean;
  moves: number;
  time: number;
  
  // Game controls
  startGame: () => void;
  restartGame: () => void;
  undoMove: () => void;
  stopGame: () => void;
  
  // Movement functions
  moveUp: () => void;
  moveDown: () => void;
  moveLeft: () => void;
  moveRight: () => void;
  
  // Navigation
  end: () => void;
  init: () => void;
}