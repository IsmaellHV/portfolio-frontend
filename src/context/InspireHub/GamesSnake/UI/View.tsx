import React, { useRef } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Button, Panel, Modal } from 'rsuite';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faArrowDown,
  faArrowLeft,
  faArrowRight,
  faArrowUp,
  faPause,
  faPlay,
  faRotate,
  faStop,
} from '@fortawesome/free-solid-svg-icons';
import { BreadCrumb } from '../../../shared/Components/Element/BreadCrumb/View';
import { AdapterConfigure } from '../Infraestructure/AdapterConfigure';
import { ENVIRONMENT } from '../../../../env/index';
import './Style.scss';

interface ViewProps {
  end: () => void;
  init: () => void;
  isPlaying: boolean;
  timeElapsed: number;
  score: number;
  gameOver: boolean;
  handleButtonPress: (dir: string) => void;
  snake: Array<{ x: number; y: number }>;
  food: { x: number; y: number };
  boardSize: number;
  isGameOver: boolean;
  restartGame: () => void;
  togglePauseResumeGame: () => void;
  stopGame: () => void;
}

export const View: React.FC<ViewProps> = (props) => {
  const boardRef = useRef(null);

  // Debug logs para verificar props
  console.log('🎮 Snake View Props:', {
    boardSize: props.boardSize,
    snakeLength: props.snake.length,
    snakeHead: props.snake[0],
    food: props.food,
    isPlaying: props.isPlaying,
    gameOver: props.gameOver,
  });

  // Verificar que el tablero se renderice
  const totalCells = props.boardSize * props.boardSize;
  console.log(`🎯 Rendering ${totalCells} cells (${props.boardSize}x${props.boardSize})`);

  return (
    <>
      <Helmet>
        <title>[{props.score.toString()}] Snake game</title>
        <meta name="description" content="Snake game made with React" />
        <link rel="canonical" href={`${ENVIRONMENT.META.CANONICAL}${ENVIRONMENT.ROUTE.INSPIREHUBGAMESSNAKE}`} />
      </Helmet>
      <BreadCrumb
        list={[
          { navigate: false, path: '', text: AdapterConfigure.SCHEMA_DESC },
          { navigate: false, path: '', text: AdapterConfigure.ENTITY_DESC },
        ]}
      />
      <section className="inspireHub-gameSnake">
        <motion.header initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.5 }}>
          <div className="control-score">
            <h2 style={{ fontSize: '1.5rem', margin: '5px 0' }}>🐍 Snake Game</h2>
            <div className="score-display" style={{ fontSize: '0.9rem', margin: '5px 0' }}>
              <span>
                <strong>Score:</strong> {props.score} |{' '}
              </span>
              <span>
                <strong>Time:</strong> {props.timeElapsed}s |{' '}
              </span>
              <span>
                <strong>Length:</strong> {props.snake.length}
              </span>
            </div>
            {!props.isPlaying && !props.gameOver && (
              <div className="game-instructions" style={{ fontSize: '0.8rem', margin: '8px 0' }}>
                <p style={{ margin: '2px 0' }}>
                  🎮 <strong>Controls:</strong> Arrow keys to move | Space: Pause | R: Restart
                </p>
                <p style={{ margin: '2px 0' }}>
                  🎯 <strong>Goal:</strong> Eat yellow food, avoid walls & yourself
                </p>
                <p className="start-message" style={{ margin: '5px 0', fontWeight: 'bold' }}>
                  🚀 Press any arrow key to start!
                </p>
              </div>
            )}
            {props.isPlaying && !props.gameOver && (
              <p className="game-status playing" style={{ margin: '5px 0' }}>
                🎯 Playing - Use arrows to move!
              </p>
            )}
            {props.gameOver && (
              <p className="game-status game-over" style={{ margin: '5px 0' }}>
                💀 Game Over! Press R to restart
              </p>
            )}
          </div>
        </motion.header>
        <main>
          <section>
            <div
              className="board"
              style={{
                gridTemplateColumns: `repeat(${props.boardSize}, 1fr)`,
                display: 'grid',
                width: '350px',
                height: '350px',
                backgroundColor: 'rgba(26, 32, 44, 0.9)', // Fondo oscuro semi-transparente
                border: '3px solid rgba(255, 255, 255, 0.3)',
                borderRadius: '12px',
                margin: '10px auto',
                gap: '1px',
                position: 'relative',
                zIndex: 9999,
                boxSizing: 'border-box',
                boxShadow: '0 10px 30px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
                backdropFilter: 'blur(10px)',
              }}
              ref={boardRef}
            >
              {(() => {
                const cells = [];
                let cellCount = 0;

                for (let row = 0; row < props.boardSize; row++) {
                  for (let col = 0; col < props.boardSize; col++) {
                    cellCount++;
                    const isSnake = props.snake.some((segment) => segment.x === col && segment.y === row);
                    const isFood = props.food.x === col && props.food.y === row;
                    const isHead = props.snake.length > 0 && props.snake[0].x === col && props.snake[0].y === row;

                    // Debug para celdas especiales
                    if (isSnake || isFood) {
                      console.log(`🔍 Special cell at (${col}, ${row}):`, { isSnake, isFood, isHead });
                    }

                    cells.push(
                      <motion.div
                        key={`${row}-${col}`}
                        className={`cell ${isHead ? 'snake-head' : isSnake ? 'snake' : isFood ? 'food' : 'empty'}`}
                        style={{
                          width: '100%',
                          height: '100%',
                          backgroundColor: isHead
                            ? '#ff6b35' // Cabeza naranja brillante
                            : isSnake
                              ? '#4ecdc4' // Cuerpo verde azulado
                              : isFood
                                ? '#ffe66d' // Comida amarillo brillante
                                : 'rgba(255, 255, 255, 0.1)', // Celdas vacías semi-transparentes
                          border: isSnake || isFood ? '2px solid #ffffff' : '1px solid rgba(255, 255, 255, 0.2)',
                          display: 'block',
                          boxSizing: 'border-box',
                          borderRadius: isFood ? '50%' : isHead ? '8px' : '4px',
                          boxShadow: isHead
                            ? '0 0 15px rgba(255, 107, 53, 0.8)' // Glow para la cabeza
                            : isSnake
                              ? '0 0 8px rgba(78, 205, 196, 0.6)' // Glow para el cuerpo
                              : isFood
                                ? '0 0 20px rgba(255, 230, 109, 0.9)' // Glow para la comida
                                : 'none',
                          transform: isFood ? 'scale(0.9)' : 'scale(1)',
                          transition: 'all 0.2s ease',
                        }}
                        initial={{ scale: 0.8 }}
                        animate={{ scale: 1 }}
                        transition={{ duration: 0.1 }}
                      />,
                    );
                  }
                }

                console.log(`🎲 Generated ${cellCount} cells for ${props.boardSize}x${props.boardSize} board`);
                return cells;
              })()}
            </div>
          </section>
          <aside>
            <div className="controls-actions">
              <Button
                title={props.isPlaying ? 'Pause game' : 'Resume game'}
                appearance="ghost"
                onClick={props.togglePauseResumeGame}
                className="pause-button control-action-button"
                disabled={props.gameOver}
              >
                {props.isPlaying ? <FontAwesomeIcon icon={faPause} /> : <FontAwesomeIcon icon={faPlay} />}
              </Button>
              <Button
                title="Restart game"
                appearance="ghost"
                onClick={props.restartGame}
                className="restart-button control-action-button"
              >
                <FontAwesomeIcon icon={faRotate} />
              </Button>
              <Button
                title="Stop game"
                appearance="ghost"
                onClick={props.stopGame}
                className="stop-button control-action-button"
                disabled={props.gameOver}
              >
                <FontAwesomeIcon icon={faStop} />
              </Button>
            </div>

            <Panel bordered header="Stats" className="stats-panel">
              <p>Score: {props.score}</p>
              <p>Snake Length: {props.snake.length}</p>
              <p>Time: {props.timeElapsed}s</p>
            </Panel>

            <Panel bordered header="Controls" className="controls-panel">
              <div className="keyboard-controls">
                <p>
                  <strong>Keyboard:</strong>
                </p>
                <p>Arrow Keys - Move</p>
                <p>Space - Pause/Resume</p>
                <p>R - Restart</p>
                <p>Esc - Stop Game</p>
              </div>
            </Panel>
          </aside>
        </main>
        <footer>
          <div className="controls-moves">
            <div className="mobile-controls">
              <div className="control-row">
                <Button
                  appearance="ghost"
                  onClick={() => props.handleButtonPress('UP')}
                  className="control-move-button"
                  disabled={props.gameOver}
                >
                  <FontAwesomeIcon icon={faArrowUp} />
                </Button>
              </div>
              <div className="control-row">
                <Button
                  appearance="ghost"
                  onClick={() => props.handleButtonPress('LEFT')}
                  className="control-move-button"
                  disabled={props.gameOver}
                >
                  <FontAwesomeIcon icon={faArrowLeft} />
                </Button>
                <Button
                  appearance="ghost"
                  onClick={() => props.handleButtonPress('DOWN')}
                  className="control-move-button"
                  disabled={props.gameOver}
                >
                  <FontAwesomeIcon icon={faArrowDown} />
                </Button>
                <Button
                  appearance="ghost"
                  onClick={() => props.handleButtonPress('RIGHT')}
                  className="control-move-button"
                  disabled={props.gameOver}
                >
                  <FontAwesomeIcon icon={faArrowRight} />
                </Button>
              </div>
            </div>
          </div>
        </footer>

        {/* Game Over Modal */}
        <Modal open={props.gameOver} onClose={() => {}} size="sm" backdrop="static">
          <Modal.Header>
            <Modal.Title>Game Over!</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className="game-over-content">
              <h4>Final Score: {props.score}</h4>
              <p>Snake Length: {props.snake.length}</p>
              <p>Time Played: {props.timeElapsed}s</p>
              <p>Great job! Your score has been saved.</p>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button onClick={props.restartGame} appearance="primary">
              Play Again
            </Button>
            <Button onClick={props.stopGame} appearance="subtle">
              Back to Games
            </Button>
          </Modal.Footer>
        </Modal>
      </section>
    </>
  );
};
