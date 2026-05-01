import { PieceSet } from '../types';

// 12 free pentominoes (5-cell pieces). Piece IDs 1..12 keyed by canonical letters.
export const PieceSetPento: PieceSet = {
  id: 'pento',
  name: 'Pentominoes',
  pieces: [
    { id: 1, key: 'F', matrix: [[0, 1, 1], [1, 1, 0], [0, 1, 0]] },
    { id: 2, key: 'I', matrix: [[2, 2, 2, 2, 2]] },
    { id: 3, key: 'L', matrix: [[3, 0], [3, 0], [3, 0], [3, 3]] },
    { id: 4, key: 'N', matrix: [[0, 4], [0, 4], [4, 4], [4, 0]] },
    { id: 5, key: 'P', matrix: [[5, 5], [5, 5], [5, 0]] },
    { id: 6, key: 'T', matrix: [[6, 6, 6], [0, 6, 0], [0, 6, 0]] },
    { id: 7, key: 'U', matrix: [[7, 0, 7], [7, 7, 7]] },
    { id: 8, key: 'V', matrix: [[8, 0, 0], [8, 0, 0], [8, 8, 8]] },
    { id: 9, key: 'W', matrix: [[9, 0, 0], [9, 9, 0], [0, 9, 9]] },
    { id: 10, key: 'X', matrix: [[0, 10, 0], [10, 10, 10], [0, 10, 0]] },
    { id: 11, key: 'Y', matrix: [[0, 11], [11, 11], [0, 11], [0, 11]] },
    { id: 12, key: 'Z', matrix: [[12, 12, 0], [0, 12, 0], [0, 12, 12]] },
  ],
};
