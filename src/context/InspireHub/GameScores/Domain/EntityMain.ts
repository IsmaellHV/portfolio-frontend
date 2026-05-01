export type TypeGameScore = 'tetris' | 'snake' | 'pong' | '2048' | 'memory';

export interface EntityMain {
  _id: string;
  playerName: string;
  gameType: TypeGameScore;
  score: number;
  levelOrLines: number;
  duration: number;
  extraData: Record<string, unknown> | null;
  estado: boolean;
  registrar: { fecha: string };
}
