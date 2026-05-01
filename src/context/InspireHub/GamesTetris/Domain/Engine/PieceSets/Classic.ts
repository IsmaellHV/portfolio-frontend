import { PieceSet } from '../types';

export const PieceSetClassic: PieceSet = {
  id: 'classic',
  name: 'Classic Tetrominoes',
  pieces: [
    { id: 1, key: 'I', matrix: [[1, 1, 1, 1]] },
    {
      id: 2,
      key: 'O',
      matrix: [
        [2, 2],
        [2, 2],
      ],
    },
    {
      id: 3,
      key: 'T',
      matrix: [
        [0, 3, 0],
        [3, 3, 3],
      ],
    },
    {
      id: 4,
      key: 'S',
      matrix: [
        [0, 4, 4],
        [4, 4, 0],
      ],
    },
    {
      id: 5,
      key: 'Z',
      matrix: [
        [5, 5, 0],
        [0, 5, 5],
      ],
    },
    {
      id: 6,
      key: 'J',
      matrix: [
        [6, 0, 0],
        [6, 6, 6],
      ],
    },
    {
      id: 7,
      key: 'L',
      matrix: [
        [0, 0, 7],
        [7, 7, 7],
      ],
    },
  ],
};
