import { Realm } from '../types';

// Minimal monochrome. CRT scanlines overlay. Glitch tear on line clear.
export const RealmVoid: Realm = {
  id: 'void',
  name: 'Void (Glitch)',
  rootClass: 'realm-void',
  palette: {
    1: '#ffffff',
    2: '#e0e0e0',
    3: '#cccccc',
    4: '#ffffff',
    5: '#e0e0e0',
    6: '#cccccc',
    7: '#ffffff',
    8: '#e0e0e0',
    9: '#cccccc',
    10: '#ffffff',
    11: '#e0e0e0',
    12: '#cccccc',
  },
  cellClass: ({ isClearing }) => (isClearing ? 'fx-glitch' : 'fx-void-cell'),
  onLineClear: (rows) => [{ kind: 'glitch', rows, durationMs: 250 }],
  overlayClass: 'realm-void-scanlines',
};
