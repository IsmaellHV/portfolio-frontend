import React from 'react';
import { Button, Modal, Text, Badge, ButtonGroup, SelectPicker } from 'rsuite';
import { Play, Pause, RotateCcw, Square, Trophy, Clock, Target, Gamepad2 } from 'lucide-react';
import { BreadCrumb } from '../../UI/BreadCrumb/View';
import { AdapterConfigure } from '../Infraestructure/AdapterConfigure';
import { PropsView } from '../Domain/PropsView';
import './Style.scss';

interface ViewProps {
  controller: PropsView;
}

const GRID_SIZES = {
  easy: { rows: 4, cols: 4 },
  medium: { rows: 4, cols: 6 },
  hard: { rows: 4, cols: 8 }
};

const difficultyOptions = [
  { label: 'Fácil (4x4)', value: 'easy' },
  { label: 'Medio (4x6)', value: 'medium' },
  { label: 'Difícil (4x8)', value: 'hard' }
];

export const View: React.FC<ViewProps> = ({ controller }) => {
  const {
    cards,
    flippedCards,
    score,
    bestScore,
    moves,
    time,
    gameStarted,
    gameWon,
    gameOver,
    difficulty,
    startGame,
    restartGame,
    pauseGame,
    resumeGame,
    stopGame,
    flipCard,
    setDifficulty,
    handleEnd
  } = controller;

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const gridSize = GRID_SIZES[difficulty];
  const isPaused = gameStarted && !gameWon && !gameOver && flippedCards.length === 0;

  return (
    <div className="memory-game">
      <BreadCrumb
        schemaCreateSpace={AdapterConfigure.SCHEMA_CREATESPACE}
        schema={AdapterConfigure.SCHEMA}
        entity={AdapterConfigure.ENTITY}
        schemaDesc={AdapterConfigure.SCHEMA_DESC}
        entityDesc={AdapterConfigure.ENTITY_DESC}
      />
      {/* Game Header */}
      <div className="game-header">
        <div className="header-left">
          <h1 className="game-title">
            <Gamepad2 className="title-icon" />
            Memory Game
          </h1>
          <Badge 
            className={`difficulty-badge ${difficulty}`}
            color={difficulty === 'easy' ? 'green' : difficulty === 'medium' ? 'orange' : 'red'}
          >
            {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
          </Badge>
        </div>
        
        <div className="header-right">
          <SelectPicker
            data={difficultyOptions}
            value={difficulty}
            onChange={(value) => value && setDifficulty(value as 'easy' | 'medium' | 'hard')}
            placeholder="Dificultad"
            cleanable={false}
            disabled={gameStarted}
            className="difficulty-selector"
          />
        </div>
      </div>

      {/* Game Stats */}
      <div className="game-stats">
        <div className="stat-item">
          <Target className="stat-icon" />
          <div className="stat-content">
            <Text className="stat-value">{score.toLocaleString()}</Text>
            <Text className="stat-label">Puntuación</Text>
          </div>
        </div>
        
        <div className="stat-item">
          <Trophy className="stat-icon" />
          <div className="stat-content">
            <Text className="stat-value">{bestScore.toLocaleString()}</Text>
            <Text className="stat-label">Mejor</Text>
          </div>
        </div>
        
        <div className="stat-item">
          <Clock className="stat-icon" />
          <div className="stat-content">
            <Text className="stat-value">{formatTime(time)}</Text>
            <Text className="stat-label">Tiempo</Text>
          </div>
        </div>
        
        <div className="stat-item">
          <div className="stat-content">
            <Text className="stat-value">{moves}</Text>
            <Text className="stat-label">Movimientos</Text>
          </div>
        </div>
      </div>

      {/* Game Board */}
      <div className="game-board-container">
        <div 
          className={`memory-board ${difficulty}`}
          style={{
            gridTemplateColumns: `repeat(${gridSize.cols}, 1fr)`,
            gridTemplateRows: `repeat(${gridSize.rows}, 1fr)`
          }}
        >
          {cards.map((card, index) => (
            <div
              key={card.id}
              className={`memory-card ${
                card.isFlipped || card.isMatched ? 'flipped' : ''
              } ${
                card.isMatched ? 'matched' : ''
              } ${
                flippedCards.includes(index) ? 'selected' : ''
              }`}
              onClick={() => flipCard(index)}
            >
              <div className="card-inner">
                <div className="card-front">
                  <div className="card-pattern">?</div>
                </div>
                <div className="card-back">
                  <div className="card-emoji">{card.emoji}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Game Controls */}
      <div className="game-controls">
        <ButtonGroup>
          {!gameStarted && !gameWon && !gameOver ? (
            <Button 
              appearance="primary" 
              size="lg"
              onClick={startGame}
              startIcon={<Play />}
            >
              Iniciar Juego
            </Button>
          ) : (
            <>
              <Button 
                appearance="ghost" 
                onClick={isPaused ? resumeGame : pauseGame}
                startIcon={isPaused ? <Play /> : <Pause />}
                disabled={gameWon || gameOver}
              >
                {isPaused ? 'Reanudar' : 'Pausar'}
              </Button>
              
              <Button 
                appearance="ghost" 
                onClick={restartGame}
                startIcon={<RotateCcw />}
              >
                Reiniciar
              </Button>
              
              <Button 
                appearance="ghost" 
                onClick={stopGame}
                startIcon={<Square />}
              >
                Detener
              </Button>
            </>
          )}
        </ButtonGroup>
        
        <Button 
          appearance="subtle" 
          onClick={handleEnd}
          className="back-button"
        >
          Volver a Juegos
        </Button>
      </div>

      {/* Mobile Controls Info */}
      <div className="mobile-controls">
        <Text size="sm" muted>
          Toca las cartas para voltearlas y encuentra las parejas
        </Text>
      </div>

      {/* Keyboard Controls Info */}
      <div className="keyboard-info">
        <Text weight="bold" size="sm">Controles de Teclado:</Text>
        <div className="controls-grid">
          <div className="control-item">
            <kbd>Espacio</kbd>
            <span>Pausar/Reanudar</span>
          </div>
          <div className="control-item">
            <kbd>R</kbd>
            <span>Reiniciar</span>
          </div>
          <div className="control-item">
            <kbd>Esc</kbd>
            <span>Detener Juego</span>
          </div>
        </div>
      </div>

      {/* Game Won Modal */}
      <Modal 
        open={gameWon} 
        onClose={() => {}} 
        size="sm"
        className="game-modal win-modal"
      >
        <Modal.Header>
          <Modal.Title>
            <Trophy className="modal-icon win" />
            ¡Felicitaciones!
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="modal-content">
            <Text className="modal-message">
              ¡Has completado el juego de memoria!
            </Text>
            
            <div className="final-stats">
              <div className="final-stat">
                <Text weight="bold">Puntuación Final:</Text>
                <Text className="stat-highlight">{score.toLocaleString()}</Text>
              </div>
              <div className="final-stat">
                <Text weight="bold">Tiempo:</Text>
                <Text>{formatTime(time)}</Text>
              </div>
              <div className="final-stat">
                <Text weight="bold">Movimientos:</Text>
                <Text>{moves}</Text>
              </div>
              {score > bestScore && (
                <div className="new-record">
                  <Trophy className="record-icon" />
                  <Text className="record-text">¡Nuevo récord!</Text>
                </div>
              )}
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <ButtonGroup>
            <Button 
              appearance="primary" 
              onClick={restartGame}
              startIcon={<RotateCcw />}
            >
              Jugar de Nuevo
            </Button>
            <Button 
              appearance="subtle" 
              onClick={handleEnd}
            >
              Volver a Juegos
            </Button>
          </ButtonGroup>
        </Modal.Footer>
      </Modal>

      {/* Game Over Modal */}
      <Modal 
        open={gameOver} 
        onClose={() => {}} 
        size="sm"
        className="game-modal over-modal"
      >
        <Modal.Header>
          <Modal.Title>
            <Square className="modal-icon over" />
            Juego Detenido
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="modal-content">
            <Text className="modal-message">
              El juego ha sido detenido.
            </Text>
            
            <div className="final-stats">
              <div className="final-stat">
                <Text weight="bold">Puntuación:</Text>
                <Text>{score.toLocaleString()}</Text>
              </div>
              <div className="final-stat">
                <Text weight="bold">Tiempo:</Text>
                <Text>{formatTime(time)}</Text>
              </div>
              <div className="final-stat">
                <Text weight="bold">Movimientos:</Text>
                <Text>{moves}</Text>
              </div>
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <ButtonGroup>
            <Button 
              appearance="primary" 
              onClick={restartGame}
              startIcon={<RotateCcw />}
            >
              Nuevo Juego
            </Button>
            <Button 
              appearance="subtle" 
              onClick={handleEnd}
            >
              Volver a Juegos
            </Button>
          </ButtonGroup>
        </Modal.Footer>
      </Modal>

      {/* Instructions */}
      <div className="game-instructions">
        <Text weight="bold" size="sm">Cómo Jugar:</Text>
        <ul>
          <li>Haz clic en las cartas para voltearlas</li>
          <li>Encuentra las parejas de emojis iguales</li>
          <li>Completa todas las parejas para ganar</li>
          <li>Menos movimientos = mayor puntuación</li>
          <li>Tiempo rápido = bonificación extra</li>
        </ul>
      </div>
    </div>
  );
};