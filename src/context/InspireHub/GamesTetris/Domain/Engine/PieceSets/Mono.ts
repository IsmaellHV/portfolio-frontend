import { PieceSet } from '../types';

// Hard mode: only the I-piece. Tests pure stacking skill.
export const PieceSetMono: PieceSet = {
  id: 'mono',
  name: 'Mono (I-piece only)',
  pieces: [{ id: 1, key: 'I', matrix: [[1, 1, 1, 1]] }],
};
