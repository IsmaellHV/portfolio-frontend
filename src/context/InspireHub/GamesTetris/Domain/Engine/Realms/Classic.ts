import { Realm } from '../types';

export const RealmClassic: Realm = {
  id: 'classic',
  name: 'Classic',
  rootClass: 'realm-classic',
  palette: {
    1: '#ff6347',
    2: '#3cb371',
    3: '#1e90ff',
    4: '#ffd700',
    5: '#ee82ee',
    6: '#ffa500',
    7: '#00ced1',
    8: '#9b59b6',
    9: '#16a085',
    10: '#e74c3c',
    11: '#2ecc71',
    12: '#f39c12',
  },
  onLineClear: (rows) => [{ kind: 'flash', rows, durationMs: 100 }],
};
