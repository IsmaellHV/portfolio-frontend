export interface PropsView {
  end: () => void
  init: () => void
  isPlaying: boolean
  timeElapsed: number
  score: number
  gameOver: boolean
  handleButtonPress: (dir: string) => void
  snake: Array<{ x: number; y: number }>
  food: { x: number; y: number }
  boardSize: number
  isGameOver: boolean
  restartGame: () => void
  togglePauseResumeGame: () => void
  stopGame: () => void
}
