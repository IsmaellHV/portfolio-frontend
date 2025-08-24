import { useEffect, useState, useCallback, useRef } from 'react';
import { NavigateFunction, useNavigate } from 'react-router-dom';
import { ENVIRONMENT } from '../../../../env';
import { useSEO } from '../../../shared/Hook/useSEO';
import { GameScoresService } from '../../../../lib/supabase';
import { Card, PropsView } from '../Domain/PropsView';
import { AdapterConfigure } from './AdapterConfigure';

const CARD_EMOJIS = {
  easy: ['🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼'],
  medium: ['🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼', '🐨', '🐯', '🦁', '🐸'],
  hard: ['🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼', '🐨', '🐯', '🦁', '🐸', '🐵', '🐔', '🐧', '🐦']
};

const GRID_SIZES = {
  easy: { rows: 4, cols: 4 }, // 8 pairs
  medium: { rows: 4, cols: 6 }, // 12 pairs
  hard: { rows: 4, cols: 8 } // 16 pairs
};

export const Controller = (): PropsView => {
  const navigate: NavigateFunction = useNavigate();
  const gameScoresService = new GameScoresService();
  
  // Game state
  const [cards, setCards] = useState<Card[]>([]);
  const [flippedCards, setFlippedCards] = useState<number[]>([]);
  const [matchedCards, setMatchedCards] = useState<number[]>([]);
  const [score, setScore] = useState(0);
  const [bestScore, setBestScore] = useState(0);
  const [moves, setMoves] = useState(0);
  const [time, setTime] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameWon, setGameWon] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>('easy');
  const [isPaused, setIsPaused] = useState(false);
  
  // Refs
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const flipTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  // SEO
  useSEO({
    title: `${ENVIRONMENT.APP.TITLE} - Memory Game`,
    description: AdapterConfigure.SCHEMA_DESC
  });
  
  // Load best score from localStorage
  useEffect(() => {
    const savedBestScore = localStorage.getItem(`memory-best-score-${difficulty}`);
    if (savedBestScore) {
      setBestScore(parseInt(savedBestScore));
    }
  }, [difficulty]);
  
  // Generate cards based on difficulty
  const generateCards = useCallback((diff: 'easy' | 'medium' | 'hard'): Card[] => {
    const emojis = CARD_EMOJIS[diff];
    const gridSize = GRID_SIZES[diff];
    const totalCards = gridSize.rows * gridSize.cols;
    const pairs = totalCards / 2;
    
    const selectedEmojis = emojis.slice(0, pairs);
    const cardPairs = [...selectedEmojis, ...selectedEmojis];
    
    // Shuffle cards
    const shuffled = cardPairs.sort(() => Math.random() - 0.5);
    
    return shuffled.map((emoji, index) => ({
      id: index,
      value: emoji,
      isFlipped: false,
      isMatched: false,
      emoji
    }));
  }, []);
  
  // Initialize game
  const initializeGame = useCallback(() => {
    const newCards = generateCards(difficulty);
    setCards(newCards);
    setFlippedCards([]);
    setMatchedCards([]);
    setScore(0);
    setMoves(0);
    setTime(0);
    setGameStarted(false);
    setGameWon(false);
    setGameOver(false);
    setIsPaused(false);
    
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
  }, [difficulty, generateCards]);
  
  // Start game
  const startGame = useCallback(() => {
    if (!gameStarted) {
      setGameStarted(true);
      setIsPaused(false);
      
      // Start timer
      timerRef.current = setInterval(() => {
        setTime(prev => prev + 1);
      }, 1000);
    }
  }, [gameStarted]);
  
  // Pause game
  const pauseGame = useCallback(() => {
    setIsPaused(true);
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
  }, []);
  
  // Resume game
  const resumeGame = useCallback(() => {
    setIsPaused(false);
    if (gameStarted && !gameWon && !gameOver) {
      timerRef.current = setInterval(() => {
        setTime(prev => prev + 1);
      }, 1000);
    }
  }, [gameStarted, gameWon, gameOver]);
  
  // Restart game
  const restartGame = useCallback(() => {
    initializeGame();
  }, [initializeGame]);
  
  // Stop game
  const stopGame = useCallback(() => {
    setGameOver(true);
    setGameStarted(false);
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
  }, []);
  
  // Flip card
  const flipCard = useCallback((index: number) => {
    if (!gameStarted || isPaused || gameWon || gameOver) return;
    if (flippedCards.length >= 2) return;
    if (flippedCards.includes(index)) return;
    if (matchedCards.includes(index)) return;
    
    const newFlippedCards = [...flippedCards, index];
    setFlippedCards(newFlippedCards);
    
    // Update cards to show flipped state
    setCards(prev => prev.map((card, i) => 
      i === index ? { ...card, isFlipped: true } : card
    ));
    
    // If this is the first card of the game, start the game
    if (!gameStarted) {
      startGame();
    }
    
    // Check for match when two cards are flipped
    if (newFlippedCards.length === 2) {
      setMoves(prev => prev + 1);
      
      const [firstIndex, secondIndex] = newFlippedCards;
      const firstCard = cards[firstIndex];
      const secondCard = cards[secondIndex];
      
      if (firstCard.value === secondCard.value) {
        // Match found
        const newMatchedCards = [...matchedCards, firstIndex, secondIndex];
        setMatchedCards(newMatchedCards);
        
        // Update score
        const timeBonus = Math.max(0, 100 - time);
        const moveBonus = Math.max(0, 50 - moves);
        const matchScore = 100 + timeBonus + moveBonus;
        setScore(prev => prev + matchScore);
        
        // Update cards to show matched state
        setCards(prev => prev.map((card, i) => 
          (i === firstIndex || i === secondIndex) 
            ? { ...card, isMatched: true }
            : card
        ));
        
        setFlippedCards([]);
        
        // Check if game is won
        if (newMatchedCards.length === cards.length) {
          setGameWon(true);
          setGameStarted(false);
          if (timerRef.current) {
            clearInterval(timerRef.current);
          }
          
          // Save score and update best score
          const finalScore = score + matchScore;
          if (finalScore > bestScore) {
            setBestScore(finalScore);
            localStorage.setItem(`memory-best-score-${difficulty}`, finalScore.toString());
          }
          
          // Save to Supabase
          GameScoresService.saveScore({
            player_name: 'Player',
            game_type: 'memory',
            score: finalScore,
            level_or_lines: moves + 1,
            duration: time,
            extra_data: {
              difficulty,
              moves: moves + 1,
              time,
              perfect: moves + 1 === cards.length / 2
            }
          });
        }
      } else {
        // No match - flip cards back after delay
        flipTimeoutRef.current = setTimeout(() => {
          setCards(prev => prev.map((card, i) => 
            (i === firstIndex || i === secondIndex) 
              ? { ...card, isFlipped: false }
              : card
          ));
          setFlippedCards([]);
        }, 1000);
      }
    }
  }, [gameStarted, isPaused, gameWon, gameOver, flippedCards, matchedCards, cards, time, moves, score, bestScore, difficulty, startGame, gameScoresService]);
  
  // Handle difficulty change
  const handleSetDifficulty = useCallback((newDifficulty: 'easy' | 'medium' | 'hard') => {
    setDifficulty(newDifficulty);
  }, []);
  
  // Navigation handlers
  const handleEnd = useCallback(() => {
    navigate(ENVIRONMENT.ROUTE.INSPIREHUBGAMES, { replace: true });
  }, [navigate]);
  
  const handleInit = useCallback(() => {
    initializeGame();
  }, [initializeGame]);
  
  // Initialize game on mount and difficulty change
  useEffect(() => {
    initializeGame();
  }, [initializeGame]);
  
  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      if (flipTimeoutRef.current) {
        clearTimeout(flipTimeoutRef.current);
      }
    };
  }, []);
  
  // Keyboard controls
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (!gameStarted || isPaused) return;
      
      switch (event.key.toLowerCase()) {
        case 'p':
        case ' ':
          event.preventDefault();
          if (isPaused) {
            resumeGame();
          } else {
            pauseGame();
          }
          break;
        case 'r':
          event.preventDefault();
          restartGame();
          break;
        case 'escape':
          event.preventDefault();
          stopGame();
          break;
      }
    };
    
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [gameStarted, isPaused, pauseGame, resumeGame, restartGame, stopGame]);
  
  return {
    // Game state
    cards,
    flippedCards,
    matchedCards,
    score,
    bestScore,
    moves,
    time,
    gameStarted,
    gameWon,
    gameOver,
    difficulty,
    
    // Game controls
    startGame,
    restartGame,
    pauseGame,
    resumeGame,
    stopGame,
    
    // Card interactions
    flipCard,
    
    // Difficulty settings
    setDifficulty: handleSetDifficulty,
    
    // Navigation
    handleEnd,
    handleInit
  };
};