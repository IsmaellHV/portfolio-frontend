import { useEffect, useState, useCallback } from 'react';
import { PropsView } from '../Domain/PropsView';
import { useSEO } from '../../../shared/Hook/useSEO';
import { GameScoresService } from '../../../../lib/supabase';

interface Ball {
  x: number;
  y: number;
  velocityX: number;
  velocityY: number;
}

interface GameState {
  paddle1Y: number;
  paddle2Y: number;
  ball: Ball;
  score: number;
  isPlaying: boolean;
  isPaused: boolean;
  isGameOver: boolean;
  startTime: number;
}

export const Controller = (): PropsView => {
  // Game dimensions
  const gameWidth = 800;
  const gameHeight = 400;
  const paddleWidth = 10;
  const paddleHeight = 80;
  const ballSize = 10;
  const paddleSpeed = 8;
  const ballSpeed = 5;

  // Game state
  const [gameState, setGameState] = useState<GameState>({
    paddle1Y: gameHeight / 2 - paddleHeight / 2,
    paddle2Y: gameHeight / 2 - paddleHeight / 2,
    ball: {
      x: gameWidth / 2,
      y: gameHeight / 2,
      velocityX: ballSpeed,
      velocityY: ballSpeed
    },
    score: 0,
    isPlaying: false,
    isPaused: false,
    isGameOver: false,
    startTime: 0
  });

  const [timeElapsed, setTimeElapsed] = useState('0s');
  const [keys, setKeys] = useState<Set<string>>(new Set());

  // SEO
  useSEO({
    title: 'Pong Game - InspireHub',
    description: 'Juega al clásico Pong. Controla las paletas y anota puntos.'
  });

  // Reset game to initial state
  const resetGame = useCallback(() => {
    setGameState({
      paddle1Y: gameHeight / 2 - paddleHeight / 2,
      paddle2Y: gameHeight / 2 - paddleHeight / 2,
      ball: {
        x: gameWidth / 2,
        y: gameHeight / 2,
        velocityX: Math.random() > 0.5 ? ballSpeed : -ballSpeed,
        velocityY: (Math.random() - 0.5) * ballSpeed
      },
      score: 0,
      isPlaying: false,
      isPaused: false,
      isGameOver: false,
      startTime: Date.now()
    });
    setTimeElapsed('0s');
  }, [gameHeight, paddleHeight, gameWidth, ballSpeed]);

  // Start game
  const startGame = useCallback(() => {
    setGameState(prev => ({
      ...prev,
      isPlaying: true,
      isPaused: false,
      isGameOver: false,
      startTime: Date.now()
    }));
  }, []);

  // Pause game
  const pauseGame = useCallback(() => {
    setGameState(prev => ({ ...prev, isPaused: true }));
  }, []);

  // Resume game
  const resumeGame = useCallback(() => {
    setGameState(prev => ({ ...prev, isPaused: false }));
  }, []);

  // Restart game
  const restartGame = useCallback(() => {
    resetGame();
    startGame();
  }, [resetGame, startGame]);

  // End game
  const endGame = useCallback(async () => {
    setGameState(prev => ({ ...prev, isGameOver: true, isPlaying: false }));
    
    // Save score to Supabase
    try {
      await GameScoresService.saveScore({
        player_name: 'Player',
        game_type: 'pong',
        score: gameState.score,
        level_or_lines: 0,
        duration: 0,
        extra_data: {
          timeElapsed: timeElapsed,
          gameMode: 'classic'
        }
      });
    } catch (error) {
      console.error('Error saving Pong score:', error);
    }
  }, [gameState.score, timeElapsed]);

  // Ball collision with paddles
  const checkPaddleCollision = useCallback((ball: Ball, paddle1Y: number, paddle2Y: number) => {
    // Left paddle collision
    if (ball.x <= paddleWidth && 
        ball.y >= paddle1Y && 
        ball.y <= paddle1Y + paddleHeight) {
      return { hit: true, paddle: 'left' };
    }
    
    // Right paddle collision
    if (ball.x >= gameWidth - paddleWidth - ballSize && 
        ball.y >= paddle2Y && 
        ball.y <= paddle2Y + paddleHeight) {
      return { hit: true, paddle: 'right' };
    }
    
    return { hit: false, paddle: null };
  }, [paddleWidth, paddleHeight, gameWidth, ballSize]);

  // Update game logic
  const updateGame = useCallback(() => {
    if (!gameState.isPlaying || gameState.isPaused || gameState.isGameOver) return;

    setGameState(prev => {
      const newBall = { ...prev.ball };
      let newScore = prev.score;
      let newPaddle2Y = prev.paddle2Y;

      // Move ball
      newBall.x += newBall.velocityX;
      newBall.y += newBall.velocityY;

      // Ball collision with top/bottom walls
      if (newBall.y <= 0 || newBall.y >= gameHeight - ballSize) {
        newBall.velocityY = -newBall.velocityY;
      }

      // Ball collision with paddles
      const collision = checkPaddleCollision(newBall, prev.paddle1Y, prev.paddle2Y);
      if (collision.hit) {
        newBall.velocityX = -newBall.velocityX;
        newScore += 10;
      }

      // Ball out of bounds (scoring)
      if (newBall.x < 0) {
        // Player missed, reset ball
        newBall.x = gameWidth / 2;
        newBall.y = gameHeight / 2;
        newBall.velocityX = ballSpeed;
        newBall.velocityY = (Math.random() - 0.5) * ballSpeed;
      } else if (newBall.x > gameWidth) {
        // AI missed, player scores
        newScore += 50;
        newBall.x = gameWidth / 2;
        newBall.y = gameHeight / 2;
        newBall.velocityX = -ballSpeed;
        newBall.velocityY = (Math.random() - 0.5) * ballSpeed;
      }

      // Simple AI for right paddle
      const ballCenter = newBall.y + ballSize / 2;
      const paddleCenter = prev.paddle2Y + paddleHeight / 2;
      
      if (ballCenter < paddleCenter - 10) {
        newPaddle2Y = Math.max(0, prev.paddle2Y - paddleSpeed * 0.7);
      } else if (ballCenter > paddleCenter + 10) {
        newPaddle2Y = Math.min(gameHeight - paddleHeight, prev.paddle2Y + paddleSpeed * 0.7);
      }

      return {
        ...prev,
        ball: newBall,
        score: newScore,
        paddle2Y: newPaddle2Y
      };
    });
  }, [gameState.isPlaying, gameState.isPaused, gameState.isGameOver, checkPaddleCollision, gameHeight, ballSize, paddleHeight, paddleSpeed, gameWidth, ballSpeed]);

  // Paddle movement functions
  const movePaddle1Up = useCallback(() => {
    if (!gameState.isPlaying || gameState.isPaused) return;
    setGameState(prev => ({
      ...prev,
      paddle1Y: Math.max(0, prev.paddle1Y - paddleSpeed)
    }));
  }, [gameState.isPlaying, gameState.isPaused, paddleSpeed]);

  const movePaddle1Down = useCallback(() => {
    if (!gameState.isPlaying || gameState.isPaused) return;
    setGameState(prev => ({
      ...prev,
      paddle1Y: Math.min(gameHeight - paddleHeight, prev.paddle1Y + paddleSpeed)
    }));
  }, [gameState.isPlaying, gameState.isPaused, paddleSpeed, gameHeight, paddleHeight]);

  const movePaddle2Up = useCallback(() => {
    if (!gameState.isPlaying || gameState.isPaused) return;
    setGameState(prev => ({
      ...prev,
      paddle2Y: Math.max(0, prev.paddle2Y - paddleSpeed)
    }));
  }, [gameState.isPlaying, gameState.isPaused, paddleSpeed]);

  const movePaddle2Down = useCallback(() => {
    if (!gameState.isPlaying || gameState.isPaused) return;
    setGameState(prev => ({
      ...prev,
      paddle2Y: Math.min(gameHeight - paddleHeight, prev.paddle2Y + paddleSpeed)
    }));
  }, [gameState.isPlaying, gameState.isPaused, paddleSpeed, gameHeight, paddleHeight]);

  // Keyboard controls
  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    setKeys(prev => new Set(prev).add(event.key.toLowerCase()));
    
    switch (event.key.toLowerCase()) {
      case ' ':
        event.preventDefault();
        if (gameState.isPlaying && !gameState.isGameOver) {
          gameState.isPaused ? resumeGame() : pauseGame();
        }
        break;
      case 'r':
        event.preventDefault();
        restartGame();
        break;
      case 'escape':
        event.preventDefault();
        endGame();
        break;
    }
  }, [gameState.isPlaying, gameState.isPaused, gameState.isGameOver, resumeGame, pauseGame, restartGame, endGame]);

  const handleKeyUp = useCallback((event: KeyboardEvent) => {
    setKeys(prev => {
      const newKeys = new Set(prev);
      newKeys.delete(event.key.toLowerCase());
      return newKeys;
    });
  }, []);

  // Handle continuous key presses
  useEffect(() => {
    const interval = setInterval(() => {
      if (keys.has('w') || keys.has('arrowup')) {
        movePaddle1Up();
      }
      if (keys.has('s') || keys.has('arrowdown')) {
        movePaddle1Down();
      }
      if (keys.has('i')) {
        movePaddle2Up();
      }
      if (keys.has('k')) {
        movePaddle2Down();
      }
    }, 16); // ~60 FPS

    return () => clearInterval(interval);
  }, [keys, movePaddle1Up, movePaddle1Down, movePaddle2Up, movePaddle2Down]);

  // Game loop
  useEffect(() => {
    const gameLoop = setInterval(updateGame, 16); // ~60 FPS
    return () => clearInterval(gameLoop);
  }, [updateGame]);

  // Timer
  useEffect(() => {
    if (!gameState.isPlaying || gameState.isPaused) return;

    const timer = setInterval(() => {
      const elapsed = Math.floor((Date.now() - gameState.startTime) / 1000);
      setTimeElapsed(`${elapsed}s`);
    }, 1000);

    return () => clearInterval(timer);
  }, [gameState.isPlaying, gameState.isPaused, gameState.startTime]);

  // Event listeners
  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [handleKeyDown, handleKeyUp]);

  // Initialize game on mount
  useEffect(() => {
    resetGame();
  }, [resetGame]);

  return {
    // Game state
    isPlaying: gameState.isPlaying,
    isPaused: gameState.isPaused,
    isGameOver: gameState.isGameOver,
    score: gameState.score,
    timeElapsed,
    
    // Game objects
    paddle1Y: gameState.paddle1Y,
    paddle2Y: gameState.paddle2Y,
    ballX: gameState.ball.x,
    ballY: gameState.ball.y,
    
    // Game dimensions
    gameWidth,
    gameHeight,
    paddleWidth,
    paddleHeight,
    ballSize,
    
    // Game controls
    init: startGame,
    end: endGame,
    startGame,
    pauseGame,
    resumeGame,
    restartGame,
    
    // Player controls
    movePaddle1Up,
    movePaddle1Down,
    movePaddle2Up,
    movePaddle2Down
  };
};