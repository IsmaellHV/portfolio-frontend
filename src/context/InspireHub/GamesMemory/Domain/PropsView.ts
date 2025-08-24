export interface PropsView {
  // Game state
  cards: Card[];
  flippedCards: number[];
  matchedCards: number[];
  score: number;
  bestScore: number;
  moves: number;
  time: number;
  gameStarted: boolean;
  gameWon: boolean;
  gameOver: boolean;
  difficulty: 'easy' | 'medium' | 'hard';
  
  // Game controls
  startGame: () => void;
  restartGame: () => void;
  pauseGame: () => void;
  resumeGame: () => void;
  stopGame: () => void;
  
  // Card interactions
  flipCard: (index: number) => void;
  
  // Difficulty settings
  setDifficulty: (difficulty: 'easy' | 'medium' | 'hard') => void;
  
  // Navigation
  handleEnd: () => void;
  handleInit: () => void;
}

export interface Card {
  id: number;
  value: string;
  isFlipped: boolean;
  isMatched: boolean;
  emoji: string;
}

export interface GameStats {
  totalGames: number;
  gamesWon: number;
  bestScore: number;
  averageScore: number;
  bestTime: number;
  totalMoves: number;
}