import { Realm } from '../Domain/Engine/types';
import { getRealm } from '../Domain/Engine/registry';
import { useTetraverseSettings } from '../Domain/Engine/SettingsContext';

type TetrisBoardProps = {
  board: number[][];
  currentShape: number[][] | null;
  position: { x: number; y: number };
  ghostY?: number | null;
  rowsToClear?: number[];
  className?: string;
};

export const TetrisBoard: React.FC<TetrisBoardProps> = ({ board, currentShape, position, ghostY, rowsToClear = [], className }) => {
  const { settings } = useTetraverseSettings();
  const realm: Realm = getRealm(settings.realmId);

  // 0 = empty, >0 = filled (settled or active piece), -1 = ghost preview
  const renderedBoard: number[][] = board.map((row) => [...row]);

  // Paint ghost first; active piece pass below overrides any overlap.
  if (currentShape && typeof ghostY === 'number') {
    currentShape.forEach((row, rowIndex) => {
      row.forEach((value, colIndex) => {
        if (!value) return;
        const gy = ghostY + rowIndex;
        const gx = position.x + colIndex;
        if (gy >= 0 && gy < renderedBoard.length && gx >= 0 && gx < renderedBoard[0].length) {
          if (renderedBoard[gy][gx] === 0) {
            renderedBoard[gy][gx] = -1; // ghost marker
          }
        }
      });
    });
  }

  // Paint active piece on top of ghost
  if (currentShape) {
    currentShape.forEach((row, rowIndex) => {
      row.forEach((value, colIndex) => {
        if (value) {
          const y = position.y + rowIndex;
          const x = position.x + colIndex;
          if (y >= 0 && y < renderedBoard.length && x >= 0 && x < renderedBoard[0].length) {
            // Active piece overrides ghost (-1) or empty (0); keep settled cells.
            if (renderedBoard[y][x] <= 0) {
              renderedBoard[y][x] = value;
            }
          }
        }
      });
    });
  }

  const shaking = settings.shakeEnabled && rowsToClear.length > 0;

  return (
    <div
      className={[
        'tetris-board',
        realm.rootClass,
        shaking ? 'fx-shake' : '',
        className || '',
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {renderedBoard.map((row, rowIndex) => {
        const isClearing = rowsToClear.includes(rowIndex);
        return (
          <div key={rowIndex} className={`tetris-row ${isClearing ? 'row-clearing' : ''}`}>
            {row.map((cell, cellIndex) => {
              const isGhost = cell === -1;
              const realCell = isGhost ? 0 : cell;
              const cellFx =
                realm.cellClass?.({
                  pieceId: realCell,
                  isClearing,
                  rowIndex,
                  colIndex: cellIndex,
                }) || '';
              const bg = realCell ? realm.palette[realCell] || realm.palette[1] : 'transparent';
              return (
                <div
                  key={cellIndex}
                  className={['tetris-cell', realCell ? 'filled' : '', isGhost ? 'ghost' : '', cellFx].filter(Boolean).join(' ')}
                  style={{ backgroundColor: bg, ['--cell-color' as never]: bg }}
                ></div>
              );
            })}
          </div>
        );
      })}
      {realm.overlayClass && <div className={`realm-overlay ${realm.overlayClass}`} aria-hidden />}
    </div>
  );
};
