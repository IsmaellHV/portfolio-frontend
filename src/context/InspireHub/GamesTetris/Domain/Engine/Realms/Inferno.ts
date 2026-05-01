import { Realm } from '../types';

// Burning bricks. Embers + ash on clear.
export const RealmInferno: Realm = {
  id: 'inferno',
  name: 'Inferno (Burn)',
  rootClass: 'realm-inferno',
  palette: {
    1: '#ff3d00',
    2: '#ff6f00',
    3: '#ffab00',
    4: '#ffd54f',
    5: '#bf360c',
    6: '#dd2c00',
    7: '#ff6e40',
    8: '#e65100',
    9: '#ff8a65',
    10: '#ffab40',
    11: '#ff5722',
    12: '#ffd180',
  },
  cellClass: ({ isClearing }) => (isClearing ? 'fx-burn' : 'fx-inferno'),
  onLineClear: (rows) => [
    { kind: 'burn', rows, durationMs: 450 },
    { kind: 'shake', intensity: 4, durationMs: 200 },
  ],
};
