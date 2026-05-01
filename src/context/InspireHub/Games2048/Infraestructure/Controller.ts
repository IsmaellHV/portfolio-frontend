import { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSEO } from '../../../shared/Hook/useSEO';
import { useScoreSaver } from '../../GameScores/UseScoreSaver';
import { ENVIRONMENT } from '../../../../env';
import { PropsView } from '../Domain/PropsView';

const BOARD_SIZE = 4;
const INITIAL_TILES = 2;

export const Controller = (): PropsView => {
  const navigate = useNavigate();
  const gameLoopRef = useRef<number | null>(null);
  const [board, setBoard] = useState<number[][]>(() => createEmptyBoard());
  const [score, setScore] = useState(0);
  const [bestScore, setBestScore] = useState(() => {
    const saved = localStorage.getItem('2048-best-score');
    return saved ? parseInt(saved) : 0;
  });
  const [isGameOver, setIsGameOver] = useState(false);
  const [isWon, setIsWon] = useState(false);
  const [canUndo, setCanUndo] = useState(false);
  const [moves, setMoves] = useState(0);
  const [time, setTime] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const [previousState, setPreviousState] = useState<{
    board: number[][];
    score: number;
    moves: number;
  } | null>(null);

  // SEO configuration
  useSEO({
    title: '2048 Game - InspireHub',
    description: 'Juega al clásico 2048. Combina números para llegar a 2048.',
  });

  // Create empty board
  function createEmptyBoard(): number[][] {
    return Array(BOARD_SIZE)
      .fill(null)
      .map(() => Array(BOARD_SIZE).fill(0));
  }

  // Get empty cells
  function getEmptyCells(board: number[][]): { row: number; col: number }[] {
    const emptyCells: { row: number; col: number }[] = [];
    for (let row = 0; row < BOARD_SIZE; row++) {
      for (let col = 0; col < BOARD_SIZE; col++) {
        if (board[row][col] === 0) {
          emptyCells.push({ row, col });
        }
      }
    }
    return emptyCells;
  }

  // Add random tile
  function addRandomTile(board: number[][]): number[][] {
    const emptyCells = getEmptyCells(board);
    if (emptyCells.length === 0) return board;

    const randomCell = emptyCells[Math.floor(Math.random() * emptyCells.length)];
    const newBoard = board.map((row) => [...row]);
    newBoard[randomCell.row][randomCell.col] = Math.random() < 0.9 ? 2 : 4;
    return newBoard;
  }

  // Initialize board with random tiles
  function initializeBoard(): number[][] {
    let newBoard = createEmptyBoard();
    for (let i = 0; i < INITIAL_TILES; i++) {
      newBoard = addRandomTile(newBoard);
    }
    return newBoard;
  }

  // Move and merge logic
  function moveLeft(board: number[][]): { board: number[][]; score: number; moved: boolean } {
    const newBoard = board.map((row) => [...row]);
    let totalScore = 0;
    let moved = false;

    for (let row = 0; row < BOARD_SIZE; row++) {
      const filteredRow = newBoard[row].filter((cell) => cell !== 0);
      const mergedRow: number[] = [];
      let i = 0;

      while (i < filteredRow.length) {
        if (i < filteredRow.length - 1 && filteredRow[i] === filteredRow[i + 1]) {
          const mergedValue = filteredRow[i] * 2;
          mergedRow.push(mergedValue);
          totalScore += mergedValue;
          i += 2;
        } else {
          mergedRow.push(filteredRow[i]);
          i++;
        }
      }

      while (mergedRow.length < BOARD_SIZE) {
        mergedRow.push(0);
      }

      for (let col = 0; col < BOARD_SIZE; col++) {
        if (newBoard[row][col] !== mergedRow[col]) {
          moved = true;
        }
        newBoard[row][col] = mergedRow[col];
      }
    }

    return { board: newBoard, score: totalScore, moved };
  }

  function moveRight(board: number[][]): { board: number[][]; score: number; moved: boolean } {
    const reversedBoard = board.map((row) => [...row].reverse());
    const result = moveLeft(reversedBoard);
    return {
      board: result.board.map((row) => row.reverse()),
      score: result.score,
      moved: result.moved,
    };
  }

  function moveUp(board: number[][]): { board: number[][]; score: number; moved: boolean } {
    const transposedBoard = transpose(board);
    const result = moveLeft(transposedBoard);
    return {
      board: transpose(result.board),
      score: result.score,
      moved: result.moved,
    };
  }

  function moveDown(board: number[][]): { board: number[][]; score: number; moved: boolean } {
    const transposedBoard = transpose(board);
    const result = moveRight(transposedBoard);
    return {
      board: transpose(result.board),
      score: result.score,
      moved: result.moved,
    };
  }

  function transpose(board: number[][]): number[][] {
    return board[0].map((_, colIndex) => board.map((row) => row[colIndex]));
  }

  // Check if game is over
  function isGameOverCheck(board: number[][]): boolean {
    // Check for empty cells
    if (getEmptyCells(board).length > 0) return false;

    // Check for possible merges
    for (let row = 0; row < BOARD_SIZE; row++) {
      for (let col = 0; col < BOARD_SIZE; col++) {
        const current = board[row][col];
        if (
          (row < BOARD_SIZE - 1 && current === board[row + 1][col]) ||
          (col < BOARD_SIZE - 1 && current === board[row][col + 1])
        ) {
          return false;
        }
      }
    }

    return true;
  }

  // Check if won (reached 2048)
  function checkWin(board: number[][]): boolean {
    return board.some((row) => row.some((cell) => cell === 2048));
  }

  // Save previous state for undo
  function savePreviousState() {
    setPreviousState({
      board: board.map((row) => [...row]),
      score,
      moves,
    });
    setCanUndo(true);
  }

  // Game movement functions
  const handleMoveLeft = useCallback(() => {
    if (isGameOver || isWon) return;

    savePreviousState();
    const result = moveLeft(board);
    if (result.moved) {
      const newBoard = addRandomTile(result.board);
      setBoard(newBoard);
      setScore((prev) => prev + result.score);
      setMoves((prev) => prev + 1);

      if (checkWin(newBoard) && !isWon) {
        setIsWon(true);
      }

      if (isGameOverCheck(newBoard)) {
        setIsGameOver(true);
        saveScore();
      }
    }
  }, [board, isGameOver, isWon, score, moves]);

  const handleMoveRight = useCallback(() => {
    if (isGameOver || isWon) return;

    savePreviousState();
    const result = moveRight(board);
    if (result.moved) {
      const newBoard = addRandomTile(result.board);
      setBoard(newBoard);
      setScore((prev) => prev + result.score);
      setMoves((prev) => prev + 1);

      if (checkWin(newBoard) && !isWon) {
        setIsWon(true);
      }

      if (isGameOverCheck(newBoard)) {
        setIsGameOver(true);
        saveScore();
      }
    }
  }, [board, isGameOver, isWon, score, moves]);

  const handleMoveUp = useCallback(() => {
    if (isGameOver || isWon) return;

    savePreviousState();
    const result = moveUp(board);
    if (result.moved) {
      const newBoard = addRandomTile(result.board);
      setBoard(newBoard);
      setScore((prev) => prev + result.score);
      setMoves((prev) => prev + 1);

      if (checkWin(newBoard) && !isWon) {
        setIsWon(true);
      }

      if (isGameOverCheck(newBoard)) {
        setIsGameOver(true);
        saveScore();
      }
    }
  }, [board, isGameOver, isWon, score, moves]);

  const handleMoveDown = useCallback(() => {
    if (isGameOver || isWon) return;

    savePreviousState();
    const result = moveDown(board);
    if (result.moved) {
      const newBoard = addRandomTile(result.board);
      setBoard(newBoard);
      setScore((prev) => prev + result.score);
      setMoves((prev) => prev + 1);

      if (checkWin(newBoard) && !isWon) {
        setIsWon(true);
      }

      if (isGameOverCheck(newBoard)) {
        setIsGameOver(true);
        saveScore();
      }
    }
  }, [board, isGameOver, isWon, score, moves]);

  // Keyboard controls
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (!gameStarted) return;

      switch (event.key) {
        case 'ArrowLeft':
        case 'a':
        case 'A':
          event.preventDefault();
          handleMoveLeft();
          break;
        case 'ArrowRight':
        case 'd':
        case 'D':
          event.preventDefault();
          handleMoveRight();
          break;
        case 'ArrowUp':
        case 'w':
        case 'W':
          event.preventDefault();
          handleMoveUp();
          break;
        case 'ArrowDown':
        case 's':
        case 'S':
          event.preventDefault();
          handleMoveDown();
          break;
        case 'r':
        case 'R':
          event.preventDefault();
          restartGame();
          break;
        case 'u':
        case 'U':
          event.preventDefault();
          undoMove();
          break;
        case 'Escape':
          event.preventDefault();
          stopGame();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [gameStarted, handleMoveLeft, handleMoveRight, handleMoveUp, handleMoveDown]);

  // Timer
  useEffect(() => {
    if (gameStarted && !isGameOver && !isWon) {
      gameLoopRef.current = window.setInterval(() => {
        setTime((prev) => prev + 1);
      }, 1000);
    } else if (gameLoopRef.current) {
      clearInterval(gameLoopRef.current);
      gameLoopRef.current = null;
    }

    return () => {
      if (gameLoopRef.current) {
        clearInterval(gameLoopRef.current);
      }
    };
  }, [gameStarted, isGameOver, isWon]);

  const scoreSaver = useScoreSaver();

  const saveScore = async () => {
    if (score > 0) {
      await scoreSaver.save({
        gameType: '2048',
        score,
        levelOrLines: moves,
        duration: time,
        extraData: {
          boardState: board,
          highestTile: Math.max(...board.flat()),
          won: isWon,
        },
      });
    }
  };

  // Update best score
  useEffect(() => {
    if (score > bestScore) {
      setBestScore(score);
      localStorage.setItem('2048-best-score', score.toString());
    }
  }, [score, bestScore]);

  // Game control functions
  const startGame = useCallback(() => {
    setBoard(initializeBoard());
    setScore(0);
    setMoves(0);
    setTime(0);
    setIsGameOver(false);
    setIsWon(false);
    setCanUndo(false);
    setPreviousState(null);
    setGameStarted(true);
  }, []);

  const restartGame = useCallback(() => {
    if (gameLoopRef.current) {
      clearInterval(gameLoopRef.current);
    }
    startGame();
  }, [startGame]);

  const undoMove = useCallback(() => {
    if (previousState && canUndo) {
      setBoard(previousState.board);
      setScore(previousState.score);
      setMoves(previousState.moves);
      setCanUndo(false);
      setPreviousState(null);
    }
  }, [previousState, canUndo]);

  const stopGame = useCallback(() => {
    if (gameLoopRef.current) {
      clearInterval(gameLoopRef.current);
    }
    setGameStarted(false);
    setIsGameOver(true);
    if (score > 0) {
      saveScore();
    }
  }, [score]);

  const end = useCallback(() => {
    if (gameLoopRef.current) {
      clearInterval(gameLoopRef.current);
    }
    navigate(ENVIRONMENT.ROUTE.INSPIREHUBGAMES);
  }, [navigate]);

  const init = useCallback(() => {
    // Initialize game on component mount
  }, []);

  return {
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
    moveUp: handleMoveUp,
    moveDown: handleMoveDown,
    moveLeft: handleMoveLeft,
    moveRight: handleMoveRight,
    end,
    init,
  };
};
