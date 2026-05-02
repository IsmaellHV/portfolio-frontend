import { useFormik } from 'formik';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useMediaQuery } from 'react-responsive';
import { NavigateFunction, useNavigate } from 'react-router-dom';
import * as Yup from 'yup';
import collisionSoundFile from '../../../../assets/audio/tetris-collision.mp3';
import tetrisSoundFile from '../../../../assets/audio/tetris-porta.mp3';
import { useGameScoresService } from '../../GameScores/UseGameScoresService';
import { IFormSaveOneValues } from '../Domain/IFormSaveOne';
import { PropsView } from '../Domain/PropsView';
import { AdapterValidator } from '../../../shared/Infraestructure/AdapterValidator';
import { AdapterGeneric } from '../../../shared/Infraestructure/AdapterGeneric';
import { RootState } from '../../../shared/Infraestructure/AdapterStore';
import { useSelector } from 'react-redux';
import { getPieceSet } from '../Domain/Engine/registry';
import { useTetraverseSettings } from '../Domain/Engine/SettingsContext';

// === Tunables ===
const LOCK_DELAY_MS = 500;        // grace period to slide before piece locks
const MAX_LOCK_RESETS = 15;        // max times lock-delay can be reset (anti-infinity)
const DAS_DELAY_MS = 170;          // ms before auto-shift kicks in
const ARR_INTERVAL_MS = 50;        // ms between auto-shift moves
const SOFT_DROP_INTERVAL_MS = 50;  // ms between soft-drop steps when ArrowDown held
const BASE_GRAVITY_MS = 500;       // gravity at level 1
const GRAVITY_PER_LEVEL_MS = 40;   // speedup per level
const MIN_GRAVITY_MS = 80;         // floor speed

export const Controller = (): PropsView => {
  //#region VARIABLES GLOBAL
  const isScreen_480 = useMediaQuery({ maxWidth: 480 });
  const isScreen_768 = useMediaQuery({ maxWidth: 768 });
  const isScreen_992 = useMediaQuery({ maxWidth: 992 });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const gameScores = useGameScoresService();
  const { settings } = useTetraverseSettings();
  const activePieceSet = getPieceSet(settings.pieceSetId);

  let BOARD_WIDTH, BOARD_HEIGHT;

  if (isScreen_480) {
    BOARD_WIDTH = 8;
    BOARD_HEIGHT = 16;
  } else if (isScreen_768) {
    BOARD_WIDTH = 9;
    BOARD_HEIGHT = 18;
  } else if (isScreen_992) {
    BOARD_WIDTH = 10;
    BOARD_HEIGHT = 20;
  } else {
    BOARD_WIDTH = 12;
    BOARD_HEIGHT = 24;
  }

  // Active piece pool comes from selected PieceSet (registry).
  const PIECE_SHAPES = activePieceSet.pieces.map((p) => p.matrix);

  const [board, setBoard] = useState(Array.from({ length: BOARD_HEIGHT }, () => Array(BOARD_WIDTH).fill(0)));
  const [currentShape, setCurrentShape] = useState<number[][] | null>(null);
  const [holdShape, setHoldShape] = useState<number[][] | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [lines, setLines] = useState(0);
  const [nextShape, setNextShape] = useState<number[][] | null>(null);
  const [notificationGameOver, setNotificationGameOver] = useState(false);
  const [position, setPosition] = useState({ x: Math.floor(BOARD_WIDTH / 2) - 1, y: 0 });
  const [rowsToClear, setRowsToClear] = useState<number[]>([]);
  const [score, setScore] = useState<number>(0);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const { user } = useSelector((state: RootState) => state.authInspireHub);
  const collisionAudioRef = useRef<HTMLAudioElement | null>(null);
  const navigate: NavigateFunction = useNavigate();
  const tetrisAudioRef = useRef<HTMLAudioElement | null>(null);

  // Refs that mirror the live state for use inside timers/event handlers
  // (avoids stale closures for lock-delay, DAS, soft drop loops).
  const boardRef = useRef(board);
  const positionRef = useRef(position);
  const currentShapeRef = useRef(currentShape);
  const nextShapeRef = useRef(nextShape);
  const isPlayingRef = useRef(isPlaying);
  const gameOverRef = useRef(notificationGameOver);

  useEffect(() => { boardRef.current = board; }, [board]);
  useEffect(() => { positionRef.current = position; }, [position]);
  useEffect(() => { currentShapeRef.current = currentShape; }, [currentShape]);
  useEffect(() => { nextShapeRef.current = nextShape; }, [nextShape]);
  useEffect(() => { isPlayingRef.current = isPlaying; }, [isPlaying]);
  useEffect(() => { gameOverRef.current = notificationGameOver; }, [notificationGameOver]);

  // Lock delay
  const lockTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lockResetsRef = useRef(0);

  // Hold tracking — single use per piece (until next spawn).
  const holdUsedRef = useRef(false);

  // DAS / ARR for horizontal movement
  const dasTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const arrIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const heldDirRef = useRef<number | null>(null);

  // Soft drop
  const softDropIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  //#endregion

  //#region INICIALITATION
  const init = async () => {
    startGame();

    const collisionAudio = new Audio(collisionSoundFile);
    collisionAudio.volume = 0.02;
    collisionAudioRef.current = collisionAudio;
  };

  const end = async () => {
    if (tetrisAudioRef.current) {
      tetrisAudioRef.current.currentTime = 0;
      tetrisAudioRef.current.pause();
    }
    cancelLockTimer();
    cancelDasArr();
    cancelSoftDrop();
  };
  //#endregion

  //#region FORM SAVE ONE
  const formSaveOne = useFormik<IFormSaveOneValues>({
    initialValues: {
      name: !user?.email ? '' : user.email,
    },
    validationSchema: Yup.object({
      name: Yup.string().required('Enter your name here').max(100, 'Max 100 characters'),
    }),

    onSubmit: () => {},
  });

  const onChangeValueSaveOne = <T extends keyof IFormSaveOneValues>(name: T, value: IFormSaveOneValues[T]) => {
    if (value === null) return;
    formSaveOne.setFieldValue(name, value);
  };
  //#endregion

  //#region Juegos
  const handleGo = (route: string) => {
    navigate(route, { replace: true });
  };
  //#endregion

  //#region Level / gravity
  const level = Math.floor(lines / 10) + 1;
  const gravityMs = Math.max(MIN_GRAVITY_MS, BASE_GRAVITY_MS - (level - 1) * GRAVITY_PER_LEVEL_MS);
  //#endregion

  //#region Actions Games
  const startGame = () => {
    cancelLockTimer();
    cancelDasArr();
    cancelSoftDrop();
    setBoard(Array.from({ length: BOARD_HEIGHT }, () => Array(BOARD_WIDTH).fill(0)));
    setPosition({ x: Math.floor(BOARD_WIDTH / 2) - 1, y: 0 });
    setIsPlaying(true);
    setNotificationGameOver(false);
    setScore(0);
    setLines(0);
    setTimeElapsed(0);
    setHoldShape(null);
    holdUsedRef.current = false;

    const initialCurrentShape = generateRandomShape();
    const initialNextShape = generateRandomShape();
    setNextShape(initialNextShape);
    nextShapeRef.current = initialNextShape;
    spawnShape(initialCurrentShape);

    if (tetrisAudioRef.current) {
      tetrisAudioRef.current.currentTime = 0;
      tetrisAudioRef.current.play();
    } else {
      const audio = new Audio(tetrisSoundFile);
      audio.volume = 0.5;
      audio.loop = true;
      tetrisAudioRef.current = audio;
      tetrisAudioRef.current.currentTime = 0;
      audio.play();
    }
  };

  const onChangeNotificationGameOver = (value: boolean) => {
    setNotificationGameOver(value);
  };

  const togglePauseResumeGame = () => {
    setIsPlaying((prevIsPlaying) => {
      const newIsPlaying = !prevIsPlaying;
      if (tetrisAudioRef.current) {
        if (newIsPlaying) tetrisAudioRef.current.play();
        else tetrisAudioRef.current.pause();
      }
      // Pause cancels active timers
      if (!newIsPlaying) {
        cancelLockTimer();
        cancelDasArr();
        cancelSoftDrop();
      }
      return newIsPlaying;
    });
  };

  const stopGame = () => {
    setIsPlaying(false);
    setNotificationGameOver(true);
    cancelLockTimer();
    cancelDasArr();
    cancelSoftDrop();
    if (tetrisAudioRef.current) {
      tetrisAudioRef.current.pause();
      tetrisAudioRef.current.currentTime = 0;
    }
  };

  const restartGame = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent> | React.KeyboardEvent<HTMLButtonElement>) => {
    try {
      e.preventDefault();
      e.stopPropagation();
      if (isSubmitting) return;
      setIsSubmitting(true);
      setNotificationGameOver(false);
      await stopGame();

      if (score > 0) {
        await formSaveOne.submitForm();
        try {
          AdapterValidator.validate(await formSaveOne.validateForm());
        } catch {
          return;
        }

        await gameScores.saveScore({
          playerName: formSaveOne.values['name'],
          gameType: 'tetris',
          score: score,
          levelOrLines: lines,
          duration: timeElapsed,
          extraData: null,
        });
        AdapterGeneric.createToast({ message: 'Saved score', icon: 'success' });
        formSaveOne.resetForm();
      }

      setTimeout(async () => {
        startGame();
      }, 0);
    } catch (error) {
      AdapterGeneric.createToast({ message: (error as Error).message, icon: 'error' });
    } finally {
      setIsSubmitting(false);
    }
  };
  // #endregion

  //#region Lock delay
  const cancelLockTimer = () => {
    if (lockTimerRef.current) {
      clearTimeout(lockTimerRef.current);
      lockTimerRef.current = null;
    }
  };

  const scheduleLockTimer = () => {
    if (lockTimerRef.current) return;
    lockTimerRef.current = setTimeout(() => {
      lockTimerRef.current = null;
      lockResetsRef.current = 0;
      // Lock at the current position with current shape
      lockCurrentPiece();
    }, LOCK_DELAY_MS);
  };

  // Call after every successful piece movement/rotation/spawn
  // to keep lock-delay consistent with grounded state.
  const updateLockDelay = (pos: { x: number; y: number }, shape: number[][] | null, fromMove: boolean) => {
    if (!shape) return;
    const grounded = checkCollision({ x: pos.x, y: pos.y + 1 }, shape);
    if (grounded) {
      if (lockTimerRef.current) {
        // Already armed — moving while grounded resets timer up to MAX_LOCK_RESETS.
        if (fromMove) {
          if (lockResetsRef.current >= MAX_LOCK_RESETS) {
            // Force lock now
            cancelLockTimer();
            lockCurrentPiece();
            return;
          }
          lockResetsRef.current++;
          cancelLockTimer();
          scheduleLockTimer();
        }
      } else {
        lockResetsRef.current = 0;
        scheduleLockTimer();
      }
    } else {
      cancelLockTimer();
      lockResetsRef.current = 0;
    }
  };

  const lockCurrentPiece = () => {
    const shape = currentShapeRef.current;
    const pos = positionRef.current;
    if (!shape || gameOverRef.current) return;
    fixShapeToBoard(pos, shape);
    if (!gameOverRef.current) spawnShape(nextShapeRef.current!);
  };
  //#endregion

  //#region Game timers
  function useInterval(callback: () => void, delay: number | null) {
    const savedCallback = useRef<() => void>();
    useEffect(() => { savedCallback.current = callback; }, [callback]);
    useEffect(() => {
      if (delay !== null) {
        const id = setInterval(() => { savedCallback.current?.(); }, delay);
        return () => clearInterval(id);
      }
    }, [delay]);
  }

  // Gravity tick: try y+1; if blocked, leave to lock-delay; if free, move + refresh lock state.
  useInterval(
    () => {
      if (!isPlaying || notificationGameOver) return;
      const shape = currentShapeRef.current;
      const pos = positionRef.current;
      if (!shape) return;
      const newPos = { ...pos, y: pos.y + 1 };
      if (checkCollision(newPos, shape)) {
        // Grounded — arm lock if not yet armed (no reset since this is gravity, not player move)
        if (!lockTimerRef.current) {
          lockResetsRef.current = 0;
          scheduleLockTimer();
        }
      } else {
        setPosition(newPos);
        updateLockDelay(newPos, shape, false);
      }
    },
    isPlaying && !notificationGameOver ? gravityMs : null,
  );

  useEffect(() => {
    if (isPlaying && !notificationGameOver) {
      const timer = setInterval(() => setTimeElapsed((prev) => prev + 1), 1000);
      return () => clearInterval(timer);
    }
  }, [isPlaying, notificationGameOver]);
  //#endregion

  //#region Keyboard handling — DAS/ARR + soft drop hold + actions
  const cancelDasArr = useCallback(() => {
    if (dasTimerRef.current) { clearTimeout(dasTimerRef.current); dasTimerRef.current = null; }
    if (arrIntervalRef.current) { clearInterval(arrIntervalRef.current); arrIntervalRef.current = null; }
    heldDirRef.current = null;
  }, []);

  const cancelSoftDrop = useCallback(() => {
    if (softDropIntervalRef.current) { clearInterval(softDropIntervalRef.current); softDropIntervalRef.current = null; }
  }, []);

  const startHorizontalRepeat = useCallback((dir: number) => {
    if (heldDirRef.current === dir) return;
    cancelDasArr();
    heldDirRef.current = dir;
    moveShape(dir);
    dasTimerRef.current = setTimeout(() => {
      arrIntervalRef.current = setInterval(() => {
        moveShape(dir);
      }, ARR_INTERVAL_MS);
    }, DAS_DELAY_MS);
  }, [cancelDasArr]);

  const startSoftDropRepeat = useCallback(() => {
    if (softDropIntervalRef.current) return;
    softDrop();
    softDropIntervalRef.current = setInterval(() => {
      softDrop();
    }, SOFT_DROP_INTERVAL_MS);
  }, []);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Always block scroll on game keys regardless of state to avoid surprises
      const blockScrollKeys = ['ArrowLeft', 'ArrowRight', 'ArrowDown', 'ArrowUp', ' ', 'Space'];
      if (blockScrollKeys.includes(event.key)) event.preventDefault();

      // Restart / Stop work even on game over
      if (event.key === 'Escape') {
        stopGame();
        return;
      }
      if (!isPlayingRef.current || gameOverRef.current) {
        if (event.key.toLowerCase() === 'p' && !gameOverRef.current) togglePauseResumeGame();
        return;
      }

      // Repeat-suppress: ignore native auto-repeat for our own DAS/ARR
      if (event.repeat) return;

      switch (event.key) {
        case 'ArrowLeft':
        case 'a':
        case 'A':
          startHorizontalRepeat(-1);
          break;
        case 'ArrowRight':
        case 'd':
        case 'D':
          startHorizontalRepeat(1);
          break;
        case 'ArrowDown':
        case 's':
        case 'S':
          startSoftDropRepeat();
          break;
        case 'ArrowUp':
        case 'w':
        case 'W':
          rotateShape();
          break;
        case ' ':
        case 'Space':
        case 'Spacebar':
          hardDrop();
          break;
        case 'c':
        case 'C':
          holdPiece();
          break;
        case 'p':
        case 'P':
          togglePauseResumeGame();
          break;
        default:
          break;
      }
    };

    const handleKeyUp = (event: KeyboardEvent) => {
      switch (event.key) {
        case 'ArrowLeft':
        case 'a':
        case 'A':
          if (heldDirRef.current === -1) cancelDasArr();
          break;
        case 'ArrowRight':
        case 'd':
        case 'D':
          if (heldDirRef.current === 1) cancelDasArr();
          break;
        case 'ArrowDown':
        case 's':
        case 'S':
          cancelSoftDrop();
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown, { passive: false });
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
    // Stable handler — refs read live state, so deps only callbacks
  }, [startHorizontalRepeat, startSoftDropRepeat, cancelDasArr, cancelSoftDrop]);
  //#endregion

  //#region Game core
  const generateRandomShape = (): number[][] => {
    const randomShape = PIECE_SHAPES[Math.floor(Math.random() * PIECE_SHAPES.length)];
    return randomShape;
  };

  const spawnShape = (shape: number[][]) => {
    const initialPosition = { x: Math.floor(BOARD_WIDTH / 2) - 1, y: 0 };
    if (checkCollision(initialPosition, shape)) {
      if (isPlayingRef.current) stopGame();
      return;
    }
    setCurrentShape(shape);
    currentShapeRef.current = shape;
    const newNextShape = generateRandomShape();
    setNextShape(newNextShape);
    nextShapeRef.current = newNextShape;
    setPosition(initialPosition);
    positionRef.current = initialPosition;
    holdUsedRef.current = false;
    cancelLockTimer();
    lockResetsRef.current = 0;
    // Spawning at top is normally not grounded, but check just in case
    updateLockDelay(initialPosition, shape, false);
  };

  const checkCollision = (
    newPosition: { x: number; y: number },
    shape: number[][] | null = currentShapeRef.current,
    activeBoard: number[][] = boardRef.current,
  ) => {
    if (!shape) return false;
    for (let row = 0; row < shape.length; row++) {
      for (let col = 0; col < shape[row].length; col++) {
        if (shape[row][col]) {
          const newY = newPosition.y + row;
          const newX = newPosition.x + col;
          if (
            newY >= BOARD_HEIGHT ||
            newX < 0 ||
            newX >= BOARD_WIDTH ||
            (newY >= 0 && activeBoard[newY]?.[newX] !== 0)
          ) {
            return true;
          }
        }
      }
    }
    return false;
  };

  const moveShape = (direction: number) => {
    const pos = positionRef.current;
    const shape = currentShapeRef.current;
    if (!shape) return;
    const newPosition = { ...pos, x: pos.x + direction };
    if (!checkCollision(newPosition, shape)) {
      setPosition(newPosition);
      positionRef.current = newPosition;
      updateLockDelay(newPosition, shape, true);
    }
  };

  const rotateShape = () => {
    const shape = currentShapeRef.current;
    const pos = positionRef.current;
    if (!shape) return;
    const rotated = shape[0].map((_, index) => shape.map((row) => row[index]).reverse());
    // Wall-kick: try 0, ±1, ±2 horizontal nudge
    const offsets = [0, -1, 1, -2, 2];
    for (const dx of offsets) {
      const tryPos = { x: pos.x + dx, y: pos.y };
      if (!checkCollision(tryPos, rotated)) {
        setCurrentShape(rotated);
        currentShapeRef.current = rotated;
        if (dx !== 0) {
          setPosition(tryPos);
          positionRef.current = tryPos;
        }
        updateLockDelay(tryPos, rotated, true);
        return;
      }
    }
  };

  const softDrop = () => {
    const pos = positionRef.current;
    const shape = currentShapeRef.current;
    if (!shape) return;
    const newPosition = { ...pos, y: pos.y + 1 };
    if (!checkCollision(newPosition, shape)) {
      setPosition(newPosition);
      positionRef.current = newPosition;
      setScore((s) => s + 1);
      updateLockDelay(newPosition, shape, false);
    } else {
      // Grounded — arm lock if not yet armed
      if (!lockTimerRef.current) {
        lockResetsRef.current = 0;
        scheduleLockTimer();
      }
    }
  };

  const hardDrop = () => {
    const pos = positionRef.current;
    const shape = currentShapeRef.current;
    if (!shape) return;
    let newY = pos.y;
    let cells = 0;
    while (!checkCollision({ x: pos.x, y: newY + 1 }, shape)) {
      newY++;
      cells++;
    }
    setScore((s) => s + cells * 2);
    cancelLockTimer();
    fixShapeToBoard({ x: pos.x, y: newY }, shape);
    if (!gameOverRef.current) spawnShape(nextShapeRef.current!);
  };

  // Public dropShape (button & legacy callers) → hard drop
  const dropShape = () => hardDrop();

  const holdPiece = () => {
    if (holdUsedRef.current) return;
    const shape = currentShapeRef.current;
    if (!shape) return;
    holdUsedRef.current = true;
    cancelLockTimer();
    if (holdShape === null) {
      setHoldShape(shape);
      spawnShape(nextShapeRef.current!);
      holdUsedRef.current = true; // re-flag, spawnShape resets it
    } else {
      const incoming = holdShape;
      setHoldShape(shape);
      spawnShape(incoming);
      holdUsedRef.current = true; // re-flag
    }
  };

  const fixShapeToBoard = (pos: { x: number; y: number }, shape: number[][] | null = currentShapeRef.current) => {
    if (!shape) return;
    const newBoard = boardRef.current.map((row) => [...row]);
    shape.forEach((row, rowIndex) => {
      row.forEach((value, colIndex) => {
        if (value) {
          const y = pos.y + rowIndex;
          const x = pos.x + colIndex;
          if (y >= 0 && y < BOARD_HEIGHT && x >= 0 && x < BOARD_WIDTH) {
            newBoard[y][x] = value;
          }
        }
      });
    });
    setBoard(newBoard);
    boardRef.current = newBoard;

    if (!gameOverRef.current) {
      if (collisionAudioRef.current) {
        collisionAudioRef.current.currentTime = 0;
        collisionAudioRef.current.play();
      }
      clearFullRows(newBoard);
    }
  };

  const clearFullRows = (newBoard: number[][]) => {
    const fullRows: number[] = [];
    for (let y = 0; y < BOARD_HEIGHT; y++) {
      if (newBoard[y].every((cell) => cell !== 0)) {
        fullRows.push(y);
      }
    }
    if (fullRows.length === 0) return;
    setRowsToClear(fullRows);

    const linesCleared = fullRows.length;
    const baseTable = [0, 100, 300, 600, 1000];
    const basePoints = baseTable[linesCleared] ?? 1000 * linesCleared;
    const currentLevel = Math.floor(lines / 10) + 1;
    const points = basePoints * currentLevel;

    setTimeout(() => {
      const clearedBoard = newBoard.filter((_, rowIndex) => !fullRows.includes(rowIndex));
      const updatedBoard = [...Array.from({ length: linesCleared }, () => Array(BOARD_WIDTH).fill(0)), ...clearedBoard];
      setBoard(updatedBoard);
      boardRef.current = updatedBoard;
      setScore((prevScore) => prevScore + points);
      setLines((prevLines) => prevLines + linesCleared);
      setRowsToClear([]);
    }, 100);
  };
  //#endregion

  //#region Ghost piece (translucent landing preview)
  const computeGhostY = (): number | null => {
    const pos = position;
    const shape = currentShape;
    if (!shape) return null;
    let y = pos.y;
    while (!checkCollision({ x: pos.x, y: y + 1 }, shape, board)) y++;
    return y === pos.y ? null : y;
  };
  const ghostY = computeGhostY();
  //#endregion

  //#region EXPORT
  return {
    end,
    init,
    handleGo,
    board,
    currentShape,
    position,
    rowsToClear,
    moveShape,
    dropShape,
    rotateShape,
    isPlaying,
    stopGame,
    togglePauseResumeGame,
    restartGame,
    notificationGameOver,
    nextShape,
    holdShape,
    holdPiece,
    ghostY,
    level,
    score,
    onChangeNotificationGameOver,
    lines,
    timeElapsed,
    formSaveOne,
    onChangeValueSaveOne,
  };
  //#endregion
};
