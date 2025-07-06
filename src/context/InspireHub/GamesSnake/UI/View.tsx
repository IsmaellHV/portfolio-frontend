import './Style.scss';
import { useSEO } from '../../../shared/Hook/useSEO';
import { PropsView } from '../Domain/PropsView';
import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Button, Panel } from 'rsuite';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowDown, faArrowLeft, faArrowRight, faArrowsSpin, faPause, faPlay, faStop } from '@fortawesome/free-solid-svg-icons';
import { BreadCrumb } from '../../../shared/Components/Element/BreadCrumb/View';
import { Helmet } from 'react-helmet';
import { ENVIRONMENT } from '../../../../env';
import { AdapterConfigure } from '../Infraestructure/AdapterConfigure';

const BOARD_SIZE = 20;
const initialSnake = [{ x: 10, y: 10 }];
const initialFood = { x: Math.floor(Math.random() * BOARD_SIZE), y: Math.floor(Math.random() * BOARD_SIZE) };

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
    <>
      <Helmet>
        <title>[{props.score.toString()}] Snake game</title>
        <meta name="description" content="Snake game made with React" />
        <link rel="canonical" href={`${ENVIRONMENT.META.CANONICAL}${ENVIRONMENT.ROUTE.INSPIREHUBGAMESTETRIS}`} />
      </Helmet>
      <BreadCrumb
        list={[
          { navigate: false, path: '', text: AdapterConfigure.SCHEMA_DESC },
          { navigate: false, path: '', text: AdapterConfigure.ENTITY_DESC },
        ]}
      />
      <section className="inspireHub-gameSnake">
        {/* Header */}
        {/* <motion.header
        style={{
          background: '#2c3e50',
          color: 'white',
          padding: '1rem',
          borderRadius: '8px',
        }}
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, type: 'spring' }}
      >
        <h1>Mi Header Animado</h1>
      </motion.header> */}

        <header>
          <div className="control-score">
            <p>Score: {props.score}</p>
          </div>
        </header>
        <main>
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
          <aside>
            <div className="controls-actions">
              <Button
                title={props.isPlaying ? 'Pause game' : 'Resumen game'}
                appearance="ghost"
                // onClick={props.togglePauseResumeGame}
                className="pause-button control-action-button"
                disabled={props.gameOver}
              >
                {props.isPlaying ? <FontAwesomeIcon icon={faPause} /> : <FontAwesomeIcon icon={faPlay} />}
              </Button>
              {/* <Button title="Restart game" appearance="ghost" onClick={(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => props.restartGame(e)} className="restart-button control-action-button" disabled={props.gameOver}>
              <FontAwesomeIcon icon={faRotate} />
            </Button> */}
              <Button
                title="Stop game"
                appearance="ghost"
                // onClick={props.stopGame}
                className="stop-button control-action-button"
                disabled={props.gameOver}
              >
                <FontAwesomeIcon icon={faStop} />
              </Button>
            </div>

            <Panel bordered header="Stats" className="stats-panel">
              <p>Score: {props.score}</p>
              <p>Time: {props.timeElapsed}s</p>
            </Panel>
          </aside>
        </main>
        <footer>
          <div className="controls-moves">
            <Button appearance="ghost" onClick={() => props.handleButtonPress('LEFT')} className="control-move-button">
              <FontAwesomeIcon icon={faArrowLeft} />
            </Button>
            <Button appearance="ghost" onClick={() => props.handleButtonPress('LEFT')} className="control-move-button">
              <FontAwesomeIcon icon={faArrowDown} />
            </Button>
            <Button appearance="ghost" onClick={() => props.handleButtonPress('LEFT')} className="control-move-button">
              <FontAwesomeIcon icon={faArrowRight} />
            </Button>
            <Button appearance="ghost" onClick={() => props.handleButtonPress('UP')} className="control-move-button">
              <FontAwesomeIcon icon={faArrowsSpin} />
            </Button>
          </div>
        </footer>

        {/* Contenedor de dos columnas */}
        {/* <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr', // Dos columnas de igual ancho
          gap: '1rem',
        }}
      >
        <motion.div
          style={{
            background: '#3498db',
            padding: '2rem',
            borderRadius: '8px',
            color: 'white',
          }}
          initial={{ opacity: 0, x: -100 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          whileHover={{ scale: 1.02 }}
        >
          <h2>Columna Izquierda</h2>
          <p>Contenido de la primera columna</p>
        </motion.div>

        <motion.div
          style={{
            background: '#e74c3c',
            padding: '2rem',
            borderRadius: '8px',
            color: 'white',
          }}
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          whileHover={{ scale: 1.02 }}
        >
          <h2>Columna Derecha</h2>
          <p>Contenido de la segunda columna</p>
          <motion.button style={{ padding: '0.5rem 1rem', marginTop: '1rem' }} whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
            Botón Animado
          </motion.button>
        </motion.div>
      </div> */}
      </section>
    </>
  );
};
