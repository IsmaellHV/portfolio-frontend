import { Realm } from '../types';

// Heavy textured brick walls. Cells inset, mortar joints, dust + shake on clear.
export const RealmBrick: Realm = {
  id: 'brick',
  name: 'Brick (Shatter)',
  rootClass: 'realm-brick',
  palette: {
    1: '#b03a2e',
    2: '#a04000',
    3: '#7e5109',
    4: '#6e2c00',
    5: '#922b21',
    6: '#873600',
    7: '#7b241c',
    8: '#5d4037',
    9: '#a04000',
    10: '#cb4335',
    11: '#a93226',
    12: '#784212',
  },
  cellClass: ({ isClearing }) => (isClearing ? 'fx-shatter' : 'fx-brick'),
  onLineClear: (rows) => [
    { kind: 'shatter', rows, durationMs: 350 },
    { kind: 'shake', intensity: 8, durationMs: 220 },
  ],
};
