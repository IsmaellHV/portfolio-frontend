import { useEffect, useState, useCallback } from 'react';
import { PropsView } from '../Domain/PropsView';
import { useSEO } from '../../../shared/Hook/useSEO';
import { useScoreSaver } from '../../GameScores/UseScoreSaver';

const BOARD_SIZE = 20;
const initialSnake = [{ x: 10, y: 10 }];
const initialFood = { x: Math.floor(Math.random() * BOARD_SIZE), y: Math.floor(Math.random() * BOARD_SIZE) };

interface SnakeSegment {
  x: number;
  y: number;
}

interface Food {
  x: number;
  y: number;
}

export const Controller = (): PropsView & {
  snake: SnakeSegment[];
  food: Food;
  boardSize: number;
  isGameOver: boolean;
  restartGame: () => void;
  togglePauseResumeGame: () => void;
  stopGame: () => void;
} => {
  //#region VARIABLES GLOBAL

  const [isPlaying, setIsPlaying] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState<number>(0);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [startTime, setStartTime] = useState<number | null>(null);

  const [snake, setSnake] = useState(initialSnake);
  const [food, setFood] = useState(initialFood);
  const [direction, setDirection] = useState('RIGHT');
  const [isPaused, setIsPaused] = useState(false);

  const scoreSaver = useScoreSaver();

  useSEO({
    title: `[${score.toString()}] Snake Game`,
    description: 'Snake game made with React',
  });

  // Timer para el tiempo transcurrido
  useEffect(() => {
    if (isPlaying && !isPaused && !gameOver && startTime) {
      const interval = setInterval(() => {
        setTimeElapsed(Math.floor((Date.now() - startTime) / 1000));
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [isPlaying, isPaused, gameOver, startTime]);

  const generateNewFood = useCallback((currentSnake: SnakeSegment[]): Food => {
    let newFood: Food;
    let attempts = 0;
    const maxAttempts = BOARD_SIZE * BOARD_SIZE;
    
    do {
      newFood = {
        x: Math.floor(Math.random() * BOARD_SIZE),
        y: Math.floor(Math.random() * BOARD_SIZE),
      };
      attempts++;
      
      // Prevenir bucle infinito si el tablero está casi lleno
      if (attempts >= maxAttempts) {
        // Buscar la primera posición libre
        for (let y = 0; y < BOARD_SIZE; y++) {
          for (let x = 0; x < BOARD_SIZE; x++) {
            if (!currentSnake.some(segment => segment.x === x && segment.y === y)) {
              return { x, y };
            }
          }
        }
        // Si no hay posiciones libres, retornar posición aleatoria
        break;
      }
    } while (currentSnake.some(segment => segment.x === newFood.x && segment.y === newFood.y));
    
    return newFood;
  }, []);

  const moveSnake = useCallback(() => {
    if (isPaused || gameOver || !isPlaying) return;

    setSnake(currentSnake => {
      const newSnake = [...currentSnake];
      const head = { ...newSnake[0] };

      // Calcular nueva posición de la cabeza
      switch (direction) {
        case 'UP':
          head.y -= 1;
          break;
        case 'DOWN':
          head.y += 1;
          break;
        case 'LEFT':
          head.x -= 1;
          break;
        case 'RIGHT':
          head.x += 1;
          break;
        default:
          return currentSnake; // No cambiar si dirección inválida
      }

      // Verificar colisiones con paredes ANTES de agregar la cabeza
      if (head.x < 0 || head.y < 0 || head.x >= BOARD_SIZE || head.y >= BOARD_SIZE) {
        setGameOver(true);
        setIsPlaying(false);
        saveScore();
        return currentSnake;
      }

      // Verificar colisión con el propio cuerpo ANTES de agregar la cabeza
      if (currentSnake.some((segment) => segment.x === head.x && segment.y === head.y)) {
        setGameOver(true);
        setIsPlaying(false);
        saveScore();
        return currentSnake;
      }

      // Agregar nueva cabeza
      newSnake.unshift(head);

      // Verificar colisión con comida
      if (head.x === food.x && head.y === food.y) {
        setFood(generateNewFood(newSnake));
        setScore(prevScore => prevScore + 1);
        // No remover la cola cuando come
      } else {
        // Remover la cola solo si no comió
        newSnake.pop();
      }

      return newSnake;
    });
  }, [direction, food, isPaused, gameOver, isPlaying, generateNewFood]);

  const saveScore = async () => {
    if (score > 0) {
      await scoreSaver.save({
        gameType: 'snake',
        score: score,
        levelOrLines: 0,
        duration: timeElapsed,
        extraData: { snakeLength: snake.length },
      });
    }
  };

  const startGame = useCallback(() => {
    if (!gameOver) {
      setIsPlaying(true);
      setStartTime(Date.now());
      setIsPaused(false);
    }
  }, [gameOver]);

  const togglePauseResumeGame = useCallback(() => {
    if (isPlaying && !gameOver) {
      setIsPaused(!isPaused);
      setStartTime(Date.now() - timeElapsed * 1000);
    }
  }, [isPaused, isPlaying, gameOver, timeElapsed]);

  const restartGame = useCallback(() => {
    const newSnake = [{ x: 10, y: 10 }];
    let newFood: Food;
    
    // Asegurar que la comida no aparezca en la serpiente inicial
    do {
      newFood = { 
        x: Math.floor(Math.random() * BOARD_SIZE), 
        y: Math.floor(Math.random() * BOARD_SIZE) 
      };
    } while (newFood.x === 10 && newFood.y === 10);
    
    setSnake(newSnake);
    setFood(newFood);
    setDirection('RIGHT');
    setScore(0);
    setTimeElapsed(0);
    setGameOver(false);
    setIsPaused(false);
    setStartTime(Date.now());
    setIsPlaying(true);
  }, []);

  const stopGame = useCallback(() => {
    setIsPlaying(false);
    setIsPaused(false);
  }, []);

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    e.preventDefault(); // Prevenir scroll y otros comportamientos por defecto
    
    if (gameOver && e.key !== 'r' && e.key !== 'R') return;
    
    switch (e.key) {
      case 'ArrowUp':
        if (!isPlaying) startGame();
        if (direction !== 'DOWN') setDirection('UP');
        break;
      case 'ArrowDown':
        if (!isPlaying) startGame();
        if (direction !== 'UP') setDirection('DOWN');
        break;
      case 'ArrowLeft':
        if (!isPlaying) startGame();
        if (direction !== 'RIGHT') setDirection('LEFT');
        break;
      case 'ArrowRight':
        if (!isPlaying) startGame();
        if (direction !== 'LEFT') setDirection('RIGHT');
        break;
      case ' ': // Spacebar para pausa
        if (isPlaying) togglePauseResumeGame();
        break;
      case 'r': // R para restart
      case 'R':
        restartGame();
        break;
      case 'Escape': // Escape para stop
        stopGame();
        break;
      default:
        break;
    }
  }, [direction, gameOver, isPlaying, startGame, restartGame, togglePauseResumeGame, stopGame]);

  const handleButtonPress = (dir: string) => {
    if (gameOver) return;
    
    // Iniciar juego si no está jugando
    if (!isPlaying) startGame();
    
    // Permitir cambio de dirección incluso si está pausado
    switch (dir) {
      case 'UP':
        if (direction !== 'DOWN') setDirection('UP');
        break;
      case 'DOWN':
        if (direction !== 'UP') setDirection('DOWN');
        break;
      case 'LEFT':
        if (direction !== 'RIGHT') setDirection('LEFT');
        break;
      case 'RIGHT':
        if (direction !== 'LEFT') setDirection('RIGHT');
        break;
      default:
        break;
    }
  };



  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  useEffect(() => {
    if (gameOver || isPaused || !isPlaying) return;
    const interval = setInterval(moveSnake, 200); // Velocidad más lenta y controlable
    return () => clearInterval(interval);
  }, [moveSnake, gameOver, isPaused, isPlaying]);

  // No auto-start - wait for user input

  //#endregion

  //#region INICIALITATION
  const init = async () => {
    // Solo inicializar el estado, no iniciar el juego automáticamente
    // El juego iniciará cuando el usuario presione una tecla de dirección
  };

  const end = async () => {
    stopGame();
  };
  //#endregion
  
  //#region EXPORT
  const controllerData = {
    end,
    init,
    isPlaying,
    gameOver,
    score,
    timeElapsed,
    handleButtonPress,
    snake,
    food,
    boardSize: BOARD_SIZE,
    isGameOver: gameOver,
    restartGame,
    togglePauseResumeGame,
    stopGame,
  };
  
  // Debug logs para verificar el estado
  console.log('🐍 Snake Controller State:', {
    boardSize: BOARD_SIZE,
    snakeLength: snake.length,
    snakePosition: snake[0],
    foodPosition: food,
    isPlaying,
    gameOver
  });
  
  return controllerData;
  //#endregion
};
