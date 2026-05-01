import { useSelector } from 'react-redux';
import { RootState } from '../../shared/Infraestructure/AdapterStore';
import { AdapterStorage } from '../../shared/Infraestructure/AdapterStorage';
import { TypeGameScore } from './Domain/EntityMain';
import { useGameScoresService } from './UseGameScoresService';

const KEY_PLAYER_NAME = 'playerName_default';

interface SaveScoreInput {
  gameType: TypeGameScore;
  score: number;
  levelOrLines: number;
  duration: number;
  extraData?: Record<string, unknown> | null;
  /** Override player name (e.g. when game has its own name input). */
  playerName?: string;
}

const promptForName = (): string => {
  const stored = AdapterStorage.get([KEY_PLAYER_NAME])[KEY_PLAYER_NAME];
  if (typeof stored === 'string' && stored.trim()) return stored.trim();

  const input = typeof window !== 'undefined' ? window.prompt('Enter your name (saved for next time):', '') : '';
  const name = (input || 'Anonymous').trim().slice(0, 50);
  AdapterStorage.set(KEY_PLAYER_NAME, name);
  return name;
};

export const useScoreSaver = () => {
  const gameScores = useGameScoresService();
  const { user } = useSelector((state: RootState) => state.authInspireHub);

  const resolveName = (override?: string): string => {
    if (override && override.trim()) return override.trim().slice(0, 50);
    if (user?.displayName) return user.displayName.slice(0, 50);
    return promptForName();
  };

  return {
    save: async (input: SaveScoreInput) => {
      const playerName = resolveName(input.playerName);
      try {
        await gameScores.saveScore({
          playerName,
          gameType: input.gameType,
          score: input.score,
          levelOrLines: input.levelOrLines,
          duration: input.duration,
          extraData: input.extraData ?? null,
        });
      } catch (error) {
        console.error('Error saving score:', error);
      }
    },
  };
};
