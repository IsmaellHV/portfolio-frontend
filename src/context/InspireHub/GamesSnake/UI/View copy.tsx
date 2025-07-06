import './Style.scss';
import { useSEO } from '../../../shared/Hook/useSEO';
import { PropsView } from '../Domain/PropsView';
import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';

const BOARD_SIZE = 20;
const initialSnake = [{ x: 10, y: 10 }];
const initialFood = { x: Math.floor(Math.random() * BOARD_SIZE), y: Math.floor(Math.random() * BOARD_SIZE) };

//eslint-disable-next-line
export const View = (props: PropsView) => {
  const [snake, setSnake] = useState(initialSnake);
  const [food, setFood] = useState(initialFood);
  const [direction, setDirection] = useState('RIGHT');
  const [isGameOver, setIsGameOver] = useState(false);
  const [score, setScore] = useState(0);

  useSEO({
    title: `[${score.toString()}] Snake Game`,
    description: 'Snake game made with React',
  });

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
      setIsGameOver(true);
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

  // const handleButtonPress = (dir: string) => {
  //   switch (dir) {
  //     case 'UP':
  //       if (direction !== 'DOWN') setDirection('UP');
  //       break;
  //     case 'DOWN':
  //       if (direction !== 'UP') setDirection('DOWN');
  //       break;
  //     case 'LEFT':
  //       if (direction !== 'RIGHT') setDirection('LEFT');
  //       break;
  //     case 'RIGHT':
  //       if (direction !== 'LEFT') setDirection('RIGHT');
  //       break;
  //     default:
  //       break;
  //   }
  // };

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [direction]);

  useEffect(() => {
    if (isGameOver) return;
    const interval = setInterval(moveSnake, 200);
    return () => clearInterval(interval);
  }, [snake, direction, isGameOver]);

  return (
    <div className="inspireHub-gameSnakew">
      <header className="header">
        <div className="score">Score: {score}</div>
      </header>
      <aside className="controls">
        <button
          onClick={() => {
            setSnake(initialSnake);
            setFood(initialFood);
            setDirection('RIGHT');
            setIsGameOver(false);
            setScore(0);
          }}
          className="button play"
        >
          Play
        </button>
        <button onClick={() => setIsGameOver(true)} className="button pause">
          Pause
        </button>
        <button
          onClick={() => {
            setSnake(initialSnake);
            setFood(initialFood);
            setDirection('RIGHT');
            setIsGameOver(false);
            setScore(0);
          }}
          className="button restart"
        >
          Restart
        </button>
      </aside>
      <section
        className="board"
        style={{
          gridTemplateColumns: `repeat(${BOARD_SIZE}, 1fr)`,
        }}
        ref={boardRef}
      >
        {[...Array(BOARD_SIZE)].map((_, row) =>
          [...Array(BOARD_SIZE)].map((_, col) => {
            const isSnake = snake.some((segment) => segment.x === col && segment.y === row);
            const isFood = food.x === col && food.y === row;
            return (
              <motion.div
                //motion
                key={`${row}-${col}`}
                className={`cell ${isSnake ? 'snake' : isFood ? 'food' : 'empty'}`}
                layout
                transition={{ duration: 0.1 }}
              />
            );
          }),
        )}
      </section>

      {/* {window.innerWidth < 768 && (
        <div className="mobile-controls">
          <button onClick={() => handleButtonPress('UP')} className="button up">
            Up
          </button>
          <div className="horizontal-buttons">
            <button onClick={() => handleButtonPress('LEFT')} className="button left">
              Left
            </button>
            <button onClick={() => handleButtonPress('RIGHT')} className="button right">
              Right
            </button>
          </div>
          <button onClick={() => handleButtonPress('DOWN')} className="button down">
            Down
          </button>
        </div>
      )} */}
    </div>
  );
};
