import React from 'react';
import { BreadCrumb } from '../../UI/BreadCrumb/View';
import { AdapterConfigure } from '../Infraestructure/AdapterConfigure';
import { PropsView } from '../Domain/PropsView';
import './Style.scss';

interface Props {
  controller: PropsView;
}

const View: React.FC<Props> = ({ controller }) => {
  const {
    board,
    score,
    bestScore,
    isGameOver,
    isWon,
    canUndo,
    moves,
    time,
    startGame,
    restartGame,
    undoMove,
    stopGame,
    moveUp,
    moveDown,
    moveLeft,
    moveRight,
    end
  } = controller;

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getTileClass = (value: number): string => {
    if (value === 0) return 'tile-empty';
    return `tile-${value}`;
  };

  const getTileValue = (value: number): string => {
    return value === 0 ? '' : value.toString();
  };

  const gameStarted = board.some(row => row.some(cell => cell !== 0));

  return (
    <div className="games-2048">
      <BreadCrumb
        schemaCreateSpace={AdapterConfigure.SCHEMA_CREATESPACE}
        schema={AdapterConfigure.SCHEMA}
        entity={AdapterConfigure.ENTITY}
        schemaDesc={AdapterConfigure.SCHEMA_DESC}
        entityDesc={AdapterConfigure.ENTITY_DESC}
      />
      {/* Header */}
      <div className="games-2048__header">
        <h1 className="games-2048__title">2048</h1>
        <div className="games-2048__scores">
          <div className="score-box">
            <div className="score-label">Score</div>
            <div className="score-value">{score.toLocaleString()}</div>
          </div>
          <div className="score-box">
            <div className="score-label">Best</div>
            <div className="score-value">{bestScore.toLocaleString()}</div>
          </div>
        </div>
      </div>

      {/* Game Info */}
      <div className="games-2048__info">
        <div className="info-item">
          <span className="info-label">Moves:</span>
          <span className="info-value">{moves}</span>
        </div>
        <div className="info-item">
          <span className="info-label">Time:</span>
          <span className="info-value">{formatTime(time)}</span>
        </div>
      </div>

      {/* Game Board */}
      <div className="games-2048__board-container">
        <div className="games-2048__board">
          {board.map((row, rowIndex) =>
            row.map((cell, colIndex) => (
              <div
                key={`${rowIndex}-${colIndex}`}
                className={`games-2048__tile ${getTileClass(cell)}`}
              >
                {getTileValue(cell)}
              </div>
            ))
          )}
        </div>
      </div>

      {/* Controls */}
      <div className="games-2048__controls">
        {!gameStarted ? (
          <button className="btn btn-primary" onClick={startGame}>
            Start Game
          </button>
        ) : (
          <>
            <button className="btn btn-secondary" onClick={restartGame}>
              Restart
            </button>
            <button 
              className="btn btn-secondary" 
              onClick={undoMove}
              disabled={!canUndo}
            >
              Undo
            </button>
            <button className="btn btn-danger" onClick={stopGame}>
              Stop
            </button>
          </>
        )}
        <button className="btn btn-outline" onClick={end}>
          Back to Games
        </button>
      </div>

      {/* Mobile Controls */}
      {gameStarted && (
        <div className="games-2048__mobile-controls">
          <div className="mobile-controls-row">
            <button className="mobile-btn" onClick={moveUp}>
              ↑
            </button>
          </div>
          <div className="mobile-controls-row">
            <button className="mobile-btn" onClick={moveLeft}>
              ←
            </button>
            <button className="mobile-btn" onClick={moveDown}>
              ↓
            </button>
            <button className="mobile-btn" onClick={moveRight}>
              →
            </button>
          </div>
        </div>
      )}

      {/* Keyboard Controls Info */}
      <div className="games-2048__keyboard-info">
        <h3>Keyboard Controls:</h3>
        <div className="controls-grid">
          <div className="control-item">
            <span className="key">↑ W</span>
            <span className="action">Move Up</span>
          </div>
          <div className="control-item">
            <span className="key">↓ S</span>
            <span className="action">Move Down</span>
          </div>
          <div className="control-item">
            <span className="key">← A</span>
            <span className="action">Move Left</span>
          </div>
          <div className="control-item">
            <span className="key">→ D</span>
            <span className="action">Move Right</span>
          </div>
          <div className="control-item">
            <span className="key">R</span>
            <span className="action">Restart</span>
          </div>
          <div className="control-item">
            <span className="key">U</span>
            <span className="action">Undo</span>
          </div>
          <div className="control-item">
            <span className="key">Esc</span>
            <span className="action">Stop Game</span>
          </div>
        </div>
      </div>

      {/* Game Over Modal */}
      {(isGameOver || isWon) && (
        <div className="games-2048__modal-overlay">
          <div className="games-2048__modal">
            <div className="modal-content">
              <h2 className="modal-title">
                {isWon ? '🎉 You Won!' : '💀 Game Over!'}
              </h2>
              {isWon && (
                <p className="modal-subtitle">
                  Congratulations! You reached 2048!
                </p>
              )}
              <div className="modal-stats">
                <div className="stat-item">
                  <span className="stat-label">Final Score:</span>
                  <span className="stat-value">{score.toLocaleString()}</span>
                </div>
                <div className="stat-item">
                  <span className="stat-label">Moves:</span>
                  <span className="stat-value">{moves}</span>
                </div>
                <div className="stat-item">
                  <span className="stat-label">Time:</span>
                  <span className="stat-value">{formatTime(time)}</span>
                </div>
                <div className="stat-item">
                  <span className="stat-label">Highest Tile:</span>
                  <span className="stat-value">
                    {Math.max(...board.flat()).toLocaleString()}
                  </span>
                </div>
              </div>
              <div className="modal-actions">
                <button className="btn btn-primary" onClick={restartGame}>
                  Play Again
                </button>
                <button className="btn btn-outline" onClick={end}>
                  Back to Games
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Instructions */}
      <div className="games-2048__instructions">
        <h3>How to Play:</h3>
        <ul>
          <li>Use arrow keys or WASD to move tiles</li>
          <li>When two tiles with the same number touch, they merge into one</li>
          <li>Try to reach the 2048 tile to win!</li>
          <li>The game ends when you can't make any more moves</li>
        </ul>
      </div>
    </div>
  );
};

export default View;