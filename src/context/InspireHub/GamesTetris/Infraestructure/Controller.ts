import { useFormik } from 'formik';
import { useEffect, useRef, useState } from 'react';
import { useMediaQuery } from 'react-responsive';
import { NavigateFunction, useNavigate } from 'react-router-dom';
import * as Yup from 'yup';
import collisionSoundFile from '../../../../assets/audio/tetris-collision.mp3';
import tetrisSoundFile from '../../../../assets/audio/tetris-porta.mp3';
import { AdapterSupabase } from '../../../shared/Infraestructure/AdapterSupabase';
import { IFormSaveOneValues } from '../Domain/IFormSaveOne';
import { IScore } from '../Domain/IScore';
import { PropsView } from '../Domain/PropsView';
import { AdapterValidator } from '../../../shared/Infraestructure/AdapterValidator';
import { AdapterGeneric } from '../../../shared/Infraestructure/AdapterGeneric';
import { RootState } from '../../../shared/Infraestructure/AdapterStore';
import { useSelector } from 'react-redux';

export const Controller = (): PropsView => {
  //#region VARIABLES GLOBAL
  const isScreen_480 = useMediaQuery({ maxWidth: 480 });
  const isScreen_768 = useMediaQuery({ maxWidth: 768 });
  const isScreen_992 = useMediaQuery({ maxWidth: 992 });
  const [isSubmitting, setIsSubmitting] = useState(false);

  let BOARD_WIDTH, BOARD_HEIGHT;

  if (isScreen_480) {
    // Pantallas menores a 480px
    BOARD_WIDTH = 8;
    BOARD_HEIGHT = 16;
  } else if (isScreen_768) {
    // Pantallas entre 481px y 768px
    BOARD_WIDTH = 9;
    BOARD_HEIGHT = 18;
  } else if (isScreen_992) {
    // Pantallas entre 769px y 1024px
    BOARD_WIDTH = 10;
    BOARD_HEIGHT = 20;
  } else {
    // Pantallas mayores a 1024px
    BOARD_WIDTH = 12;
    BOARD_HEIGHT = 24;
  }

  const TETRIS_SHAPES = {
    I: [[1, 1, 1, 1]],
    O: [
      [2, 2],
      [2, 2],
    ],
    T: [
      [0, 3, 0],
      [3, 3, 3],
    ],
    S: [
      [0, 4, 4],
      [4, 4, 0],
    ],
    Z: [
      [5, 5, 0],
      [0, 5, 5],
    ],
    J: [
      [6, 0, 0],
      [6, 6, 6],
    ],
    L: [
      [0, 0, 7],
      [7, 7, 7],
    ],
  };

  const [board, setBoard] = useState(Array.from({ length: BOARD_HEIGHT }, () => Array(BOARD_WIDTH).fill(0)));
  const [currentShape, setCurrentShape] = useState<number[][] | null>(null);
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

  //#region Actions Games
  const startGame = () => {
    setBoard(Array.from({ length: BOARD_HEIGHT }, () => Array(BOARD_WIDTH).fill(0)));
    setPosition({ x: Math.floor(BOARD_WIDTH / 2) - 1, y: 0 });
    setIsPlaying(true);
    setNotificationGameOver(false);
    setScore(0);
    setLines(0);
    setTimeElapsed(0);

    const initialCurrentShape = generateRandomShape();
    const initialNextShape = generateRandomShape();
    setNextShape(initialNextShape);
    generateCurrentShape(initialCurrentShape);

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
        if (newIsPlaying) {
          tetrisAudioRef.current.play();
        } else {
          tetrisAudioRef.current.pause();
        }
      }
      return newIsPlaying;
    });
  };

  const stopGame = () => {
    setIsPlaying(false);
    setNotificationGameOver(true);
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

        const entityScore: IScore = {
          player_name: formSaveOne.values['name'],
          score: score,
          duration: timeElapsed,
          lines_cleared: lines,
        };

        await AdapterSupabase.insertData('tetris_scores', entityScore);
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

  //#region Función de intervalo
  function useInterval(callback: () => void, delay: number | null) {
    const savedCallback = useRef<() => void>();

    // Guardar la última versión de la función de callback.
    useEffect(() => {
      savedCallback.current = callback;
    }, [callback]);

    // Configurar el intervalo.
    useEffect(() => {
      if (delay !== null) {
        const id = setInterval(() => {
          if (savedCallback.current) {
            savedCallback.current();
          }
        }, delay);
        return () => clearInterval(id);
      }
    }, [delay]);
  }

  useInterval(
    () => {
      if (isPlaying && !notificationGameOver) {
        const newPosition = { ...position, y: position.y + 1 };

        if (checkCollision(newPosition)) {
          fixShapeToBoard(position);
          generateCurrentShape(nextShape!);
        } else {
          setPosition(newPosition);
        }
      }
    },
    isPlaying && !notificationGameOver ? 500 : null,
  );

  useEffect(() => {
    if (isPlaying && !notificationGameOver) {
      const timer = setInterval(() => setTimeElapsed((prev) => prev + 1), 1000);
      return () => clearInterval(timer);
    }
  }, [isPlaying, notificationGameOver]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!isPlaying || notificationGameOver) return;
      switch (event.key) {
        case 'ArrowLeft':
          moveShape(-1);
          break;
        case 'ArrowRight':
          moveShape(1);
          break;
        case 'ArrowDown':
          dropShape();
          break;
        case 'ArrowUp':
          rotateShape();
          break;
        default:
          break;
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isPlaying, notificationGameOver, currentShape, position]);

  //#endregion

  //#region Game
  const generateRandomShape = (): number[][] => {
    const shapes = Object.values(TETRIS_SHAPES);
    const randomShape = shapes[Math.floor(Math.random() * shapes.length)];
    return randomShape;
  };

  const generateCurrentShape = (shape: number[][]) => {
    const initialPosition = { x: Math.floor(BOARD_WIDTH / 2) - 1, y: 0 };

    if (checkCollision(initialPosition, shape)) {
      if (isPlaying) stopGame();
      return;
    }

    setCurrentShape(shape);
    const newNextShape = generateRandomShape();
    setNextShape(newNextShape);
    setPosition(initialPosition);
  };

  const checkCollision = (newPosition: { x: number; y: number }, shape = currentShape) => {
    if (!shape) return false; // No hay colisión si no hay forma actual

    for (let row = 0; row < shape.length; row++) {
      for (let col = 0; col < shape[row].length; col++) {
        if (shape[row][col]) {
          const newY = newPosition.y + row;
          const newX = newPosition.x + col;

          if (
            newY >= BOARD_HEIGHT || // Límite inferior del tablero
            newX < 0 || // Límite izquierdo del tablero
            newX >= BOARD_WIDTH || // Límite derecho del tablero
            (newY >= 0 && board[newY]?.[newX] !== 0) // Colisión con otra pieza
          ) {
            return true;
          }
        }
      }
    }

    return false; // No hay colisión
  };

  const moveShape = (direction: number) => {
    const newPosition = { ...position, x: position.x + direction };

    if (!checkCollision(newPosition)) {
      setPosition(newPosition);
    }
  };

  const rotateShape = () => {
    if (!currentShape) return;

    const rotatedShape = currentShape[0].map((_, index) => currentShape.map((row) => row[index]).reverse());

    if (!checkCollision(position, rotatedShape)) {
      setCurrentShape(rotatedShape);
    }
  };

  const dropShape = () => {
    let newY = position.y;

    while (!checkCollision({ x: position.x, y: newY + 1 })) {
      newY++;
    }

    setPosition({ x: position.x, y: newY });
    fixShapeToBoard({ x: position.x, y: newY });

    // Ahora, luego de colocar la pieza, llamamos a generateCurrentShape()
    // solamente aquí (o en la lógica del intervalo, pero no en ambos lugares).
    if (!notificationGameOver) {
      generateCurrentShape(nextShape!);
    }
  };

  const fixShapeToBoard = (position: { x: number; y: number }) => {
    if (!currentShape) return;
    const newBoard = board.map((row) => [...row]);

    currentShape.forEach((row, rowIndex) => {
      row.forEach((value, colIndex) => {
        if (value) {
          const y = position.y + rowIndex;
          const x = position.x + colIndex;
          if (y >= 0 && y < BOARD_HEIGHT && x >= 0 && x < BOARD_WIDTH) {
            newBoard[y][x] = value;
          }
        }
      });
    });

    setBoard(newBoard);

    if (!notificationGameOver) {
      if (collisionAudioRef.current) {
        collisionAudioRef.current.currentTime = 0;
        collisionAudioRef.current.play();
      }
      clearFullRows(newBoard);
      // Quitar aquí la llamada a generateCurrentShape(nextShape!)
      // Ya no la llamamos aquí.
    }
  };

  const clearFullRows = (newBoard: number[][]) => {
    const fullRows: number[] = [];
    for (let y = 0; y < BOARD_HEIGHT; y++) {
      if (newBoard[y].every((cell) => cell !== 0)) {
        fullRows.push(y);
      }
    }

    if (fullRows.length === 0) {
      return; // No hay filas completas
    }

    // Marcamos las filas a limpiar para la animación
    setRowsToClear(fullRows);

    // Asignar puntos según el número de filas eliminadas a la vez
    const linesCleared = fullRows.length;
    let points = 0;
    switch (linesCleared) {
      case 1:
        points = 100;
        break;
      case 2:
        points = 300;
        break;
      case 3:
        points = 600;
        break;
      case 4:
        points = 1000;
        break;
      default:
        points = 1000 * linesCleared;
        break;
    }

    // Esperamos un poco (ej. 500ms) para mostrar el efecto visual antes de eliminar
    setTimeout(() => {
      const clearedBoard = newBoard.filter((_, rowIndex) => !fullRows.includes(rowIndex));
      const updatedBoard = [...Array.from({ length: linesCleared }, () => Array(BOARD_WIDTH).fill(0)), ...clearedBoard];

      setBoard(updatedBoard);
      setScore((prevScore) => prevScore + points);
      setLines((prevLines) => prevLines + linesCleared);

      // Limpiamos el estado de filas a eliminar después de la animación
      setRowsToClear([]);
    }, 100);
  };
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
    score,
    onChangeNotificationGameOver,
    lines,
    timeElapsed,
    formSaveOne,
    onChangeValueSaveOne,
  };
  //#endregion
};
