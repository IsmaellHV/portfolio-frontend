import { Realm } from '../Domain/Engine/types';
import { getRealm } from '../Domain/Engine/registry';
import { useTetraverseSettings } from '../Domain/Engine/SettingsContext';

type TetrisBoardProps = {
  board: number[][];
  currentShape: number[][] | null;
  position: { x: number; y: number };
  rowsToClear?: number[];
  className?: string;
};

export const TetrisBoard: React.FC<TetrisBoardProps> = ({ board, currentShape, position, rowsToClear = [], className }) => {
  const { settings } = useTetraverseSettings();
  const realm: Realm = getRealm(settings.realmId);

  const renderedBoard = board.map((row) => [...row]);

  if (currentShape) {
    currentShape.forEach((row, rowIndex) => {
      row.forEach((value, colIndex) => {
        if (value) {
          const y = position.y + rowIndex;
          const x = position.x + colIndex;
          if (y >= 0 && y < renderedBoard.length && x >= 0 && x < renderedBoard[0].length) {
            if (renderedBoard[y][x] === 0) {
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
              const cellFx =
                realm.cellClass?.({
                  pieceId: cell,
                  isClearing,
                  rowIndex,
                  colIndex: cellIndex,
                }) || '';
              const bg = cell ? realm.palette[cell] || realm.palette[1] : 'transparent';
              return (
                <div
                  key={cellIndex}
                  className={['tetris-cell', cell ? 'filled' : '', cellFx].filter(Boolean).join(' ')}
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
