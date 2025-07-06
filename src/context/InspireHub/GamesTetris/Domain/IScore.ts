export interface IScore {
  id?: string | null | undefined;
  player_name: string;
  score: number;
  lines_cleared: number;
  duration: number;
  created_at?: string | Date | null | undefined;
}
