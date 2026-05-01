import React from 'react';
import { Helmet } from 'react-helmet';
import { Button, Modal } from 'rsuite';
import { Play, Pause, RotateCcw, Square, Trophy, Clock } from 'lucide-react';
import { motion } from 'framer-motion';
import { BreadCrumb } from '../../UI/BreadCrumb/View';
import { AdapterConfigure } from '../Infraestructure/AdapterConfigure';
import { ENVIRONMENT } from '../../../../env';
import { PropsView } from '../Domain/PropsView';
import './Style.scss';

export const View = (props: PropsView) => {
  const {
    isPlaying,
    isPaused,
    isGameOver,
    score,
    timeElapsed,
    paddle1Y,
    paddle2Y,
    ballX,
    ballY,
    gameWidth,
    gameHeight,
    paddleWidth,
    paddleHeight,
    ballSize,
    startGame,
    pauseGame,
    resumeGame,
    restartGame,
    end,
    movePaddle1Up,
    movePaddle1Down,
    movePaddle2Up,
    movePaddle2Down
  } = props;

  return (
    <>
      <Helmet>
        <title>{ENVIRONMENT.APP.TITLE} - Pong Game</title>
        <meta name="description" content="Juega al clásico Pong. Controla las paletas y anota puntos." />
        <link rel="canonical" href={`${ENVIRONMENT.META.CANONICAL}${ENVIRONMENT.ROUTE.INSPIREHUBGAMESPONG}`} />
      </Helmet>

      <div className="pong-game">
        <BreadCrumb
          schemaCreateSpace={AdapterConfigure.SCHEMA_CREATESPACE}
          schema={AdapterConfigure.SCHEMA}
          entity={AdapterConfigure.ENTITY}
          schemaDesc={AdapterConfigure.SCHEMA_DESC}
          entityDesc={AdapterConfigure.ENTITY_DESC}
        />
        {/* Header */}
        <motion.header 
          className="game-header"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1>🏓 Pong Game</h1>
          <div className="game-info">
            <div className="info-item">
              <Trophy className="icon" />
              <span>Score: {score}</span>
            </div>
            <div className="info-item">
              <Clock className="icon" />
              <span>Time: {timeElapsed}</span>
            </div>
          </div>
        </motion.header>

        {/* Game Container */}
        <div className="game-container">
          {/* Game Board */}
          <div className="game-board-container">
            <svg 
              className="game-board" 
              width={gameWidth} 
              height={gameHeight}
              viewBox={`0 0 ${gameWidth} ${gameHeight}`}
            >
              {/* Background */}
              <rect
                width={gameWidth}
                height={gameHeight}
                fill="var(--g-surface)"
                stroke="var(--g-border-strong)"
                strokeWidth="1"
              />

              {/* Center line */}
              <line
                x1={gameWidth / 2}
                y1="0"
                x2={gameWidth / 2}
                y2={gameHeight}
                stroke="var(--g-border)"
                strokeWidth="1"
                strokeDasharray="4,8"
              />

              {/* Left paddle (Player) */}
              <motion.rect
                x="10"
                y={paddle1Y}
                width={paddleWidth}
                height={paddleHeight}
                fill="var(--g-fg)"
                rx="1"
                animate={{ y: paddle1Y }}
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              />

              {/* Right paddle (AI) */}
              <motion.rect
                x={gameWidth - paddleWidth - 10}
                y={paddle2Y}
                width={paddleWidth}
                height={paddleHeight}
                fill="var(--g-fg)"
                rx="1"
                animate={{ y: paddle2Y }}
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              />

              {/* Ball */}
              <motion.circle
                cx={ballX + ballSize / 2}
                cy={ballY + ballSize / 2}
                r={ballSize / 2}
                fill="var(--g-accent-pong)"
                animate={{
                  cx: ballX + ballSize / 2,
                  cy: ballY + ballSize / 2,
                }}
                transition={{}}
              />

              {/* Game status overlay */}
              {!isPlaying && !isGameOver && (
                <text x={gameWidth / 2} y={gameHeight / 2} textAnchor="middle" fill="currentColor" fontSize="14" letterSpacing="2" style={{ fontFamily: 'var(--g-mono)', color: 'var(--g-muted)' }}>
                  PRESS PLAY
                </text>
              )}

              {isPaused && (
                <text x={gameWidth / 2} y={gameHeight / 2} textAnchor="middle" fill="currentColor" fontSize="14" letterSpacing="2" style={{ fontFamily: 'var(--g-mono)', color: 'var(--g-muted)' }}>
                  PAUSED
                </text>
              )}
            </svg>
          </div>

          {/* Controls Panel */}
          <div className="controls-panel">
            {/* Game Controls */}
            <div className="control-section">
              <h3>Game Controls</h3>
              <div className="button-group">
                {!isPlaying ? (
                  <Button 
                    appearance="primary" 
                    startIcon={<Play />}
                    onClick={startGame}
                    size="lg"
                  >
                    Play
                  </Button>
                ) : (
                  <Button 
                    appearance="primary" 
                    startIcon={isPaused ? <Play /> : <Pause />}
                    onClick={isPaused ? resumeGame : pauseGame}
                    size="lg"
                  >
                    {isPaused ? 'Resume' : 'Pause'}
                  </Button>
                )}
                
                <Button 
                  appearance="ghost" 
                  startIcon={<RotateCcw />}
                  onClick={restartGame}
                  size="lg"
                >
                  Restart
                </Button>
                
                <Button 
                  appearance="subtle" 
                  startIcon={<Square />}
                  onClick={end}
                  size="lg"
                >
                  Stop
                </Button>
              </div>
            </div>

            {/* Stats */}
            <div className="control-section">
              <h3>Stats</h3>
              <div className="stats-grid">
                <div className="stat-item">
                  <span className="stat-label">Score</span>
                  <span className="stat-value">{score}</span>
                </div>
                <div className="stat-item">
                  <span className="stat-label">Time</span>
                  <span className="stat-value">{timeElapsed}</span>
                </div>
              </div>
            </div>

            {/* Keyboard Controls */}
            <div className="control-section">
              <h3>Keyboard Controls</h3>
              <div className="controls-info">
                <div className="control-row">
                  <span className="key">W/↑</span>
                  <span>Player Paddle Up</span>
                </div>
                <div className="control-row">
                  <span className="key">S/↓</span>
                  <span>Player Paddle Down</span>
                </div>
                <div className="control-row">
                  <span className="key">I</span>
                  <span>AI Paddle Up</span>
                </div>
                <div className="control-row">
                  <span className="key">K</span>
                  <span>AI Paddle Down</span>
                </div>
                <div className="control-row">
                  <span className="key">Space</span>
                  <span>Pause/Resume</span>
                </div>
                <div className="control-row">
                  <span className="key">R</span>
                  <span>Restart</span>
                </div>
                <div className="control-row">
                  <span className="key">Esc</span>
                  <span>Stop Game</span>
                </div>
              </div>
            </div>

            {/* Mobile Controls */}
            <div className="control-section mobile-controls">
              <h3>Player Controls</h3>
              <div className="mobile-buttons">
                <Button 
                  className="mobile-btn"
                  onMouseDown={movePaddle1Up}
                  disabled={isGameOver}
                  size="lg"
                >
                  ↑ Up
                </Button>
                <Button 
                  className="mobile-btn"
                  onMouseDown={movePaddle1Down}
                  disabled={isGameOver}
                  size="lg"
                >
                  ↓ Down
                </Button>
              </div>
              
              <h4>AI Controls (Optional)</h4>
              <div className="mobile-buttons">
                <Button 
                  className="mobile-btn ai-btn"
                  onMouseDown={movePaddle2Up}
                  disabled={isGameOver}
                  size="sm"
                >
                  I - AI Up
                </Button>
                <Button 
                  className="mobile-btn ai-btn"
                  onMouseDown={movePaddle2Down}
                  disabled={isGameOver}
                  size="sm"
                >
                  K - AI Down
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Game Over Modal */}
        {isGameOver && (
          <Modal
            open={isGameOver}
            onClose={() => {}}
            size="sm"
          >
            <Modal.Header>
              <Modal.Title>🏆 Game Over!</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <div className="game-over-content">
                <div className="final-stats">
                  <div className="stat">
                    <span className="label">Final Score:</span>
                    <span className="value">{score}</span>
                  </div>
                  <div className="stat">
                    <span className="label">Time Played:</span>
                    <span className="value">{timeElapsed}</span>
                  </div>
                </div>
              </div>
            </Modal.Body>
            <Modal.Footer>
              <Button 
                onClick={restartGame} 
                appearance="primary"
                startIcon={<Play />}
              >
                Play Again
              </Button>
              <Button 
                onClick={() => window.location.href = ENVIRONMENT.ROUTE.INSPIREHUBGAMES} 
                appearance="subtle"
              >
                Back to Games
              </Button>
            </Modal.Footer>
          </Modal>
        )}
      </div>
    </>
  );
};