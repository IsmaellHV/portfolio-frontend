import { Realm } from '../types';

// Faux 3D via CSS transforms + glow. Shockwave + flash on clear.
export const RealmNeon3D: Realm = {
  id: 'neon3d',
  name: 'Neon 3D',
  rootClass: 'realm-neon3d',
  palette: {
    1: '#ff2d95',
    2: '#39ff14',
    3: '#00d9ff',
    4: '#ffea00',
    5: '#bd00ff',
    6: '#ff8800',
    7: '#00ffd1',
    8: '#ff5edf',
    9: '#84ffc9',
    10: '#ff4d4d',
    11: '#aaff00',
    12: '#ffaa00',
  },
  cellClass: ({ isClearing }) => (isClearing ? 'fx-implode' : 'fx-neon3d'),
  onLineClear: (rows) => [
    { kind: 'implode', rows, durationMs: 400 },
    { kind: 'flash', rows, durationMs: 150, intensity: 1 },
  ],
};
