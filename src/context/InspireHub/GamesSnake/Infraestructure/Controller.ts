import { useEffect, useRef, useState } from 'react';
import { PropsView } from '../Domain/PropsView';
import { useSEO } from '../../../shared/Hook/useSEO';

const BOARD_SIZE = 20;
const initialSnake = [{ x: 10, y: 10 }];
const initialFood = { x: Math.floor(Math.random() * BOARD_SIZE), y: Math.floor(Math.random() * BOARD_SIZE) };

export const Controller = (): PropsView => {
  //#region VARIABLES GLOBAL

  //eslint-disable-next-line
  const [isPlaying, setIsPlaying] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState<number>(0);
  //eslint-disable-next-line
  const [timeElapsed, setTimeElapsed] = useState(0);

  const [snake, setSnake] = useState(initialSnake);
  const [food, setFood] = useState(initialFood);
  const [direction, setDirection] = useState('RIGHT');

  useSEO({
    title: `[${score.toString()}] Snake Game`,
    description: 'Snake game made with React',
  });

  //eslint-disable-next-line
  const boardRef = useRef(null);

  const moveSnake = () => {
    const newSnake = [...snake];
    const head = { ...newSnake[0] };

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
        break;
    }

    newSnake.unshift(head);

    if (head.x === food.x && head.y === food.y) {
      setFood({
        x: Math.floor(Math.random() * BOARD_SIZE),
        y: Math.floor(Math.random() * BOARD_SIZE),
      });
      setScore(score + 1);
    } else {
      newSnake.pop();
    }

    if (head.x < 0 || head.y < 0 || head.x >= BOARD_SIZE || head.y >= BOARD_SIZE || newSnake.slice(1).some((segment) => segment.x === head.x && segment.y === head.y)) {
      setGameOver(true);
      return;
    }

    setSnake(newSnake);
  };

  const handleKeyDown = (e: any) => {
    switch (e.key) {
      case 'ArrowUp':
        if (direction !== 'DOWN') setDirection('UP');
        break;
      case 'ArrowDown':
        if (direction !== 'UP') setDirection('DOWN');
        break;
      case 'ArrowLeft':
        if (direction !== 'RIGHT') setDirection('LEFT');
        break;
      case 'ArrowRight':
        if (direction !== 'LEFT') setDirection('RIGHT');
        break;
      default:
        break;
    }
  };

  const handleButtonPress = (dir: string) => {
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
  }, [direction]);

  useEffect(() => {
    if (gameOver) return;
    const interval = setInterval(moveSnake, 200);
    return () => clearInterval(interval);
  }, [snake, direction, gameOver]);

  //#endregion

  //#region INICIALITATION
  const init = async () => {};

  const end = async () => {};
  //#endregion
  //#region EXPORT
  return {
    end,
    init,
    isPlaying,
    gameOver,
    score,
    timeElapsed,
    handleButtonPress,
  };
  //#endregion
};
