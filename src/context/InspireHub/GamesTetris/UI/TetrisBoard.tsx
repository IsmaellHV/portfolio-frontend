type TetrisBoardProps = {
  board: number[][];
  currentShape: number[][] | null;
  position: { x: number; y: number };
  rowsToClear?: number[];
  className?: string;
};

export const TetrisBoard: React.FC<TetrisBoardProps> = ({ board, currentShape, position, rowsToClear = [], className }) => {
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

  return (
    <div className={'tetris-board' + (className ? ` ${className}` : '')}>
      {renderedBoard.map((row, rowIndex) => {
        const isClearing = rowsToClear.includes(rowIndex);
        return (
          <div key={rowIndex} className={`tetris-row ${isClearing ? 'row-clearing' : ''}`}>
            {row.map((cell, cellIndex) => (
              <div key={cellIndex} className={`tetris-cell ${cell ? 'filled' : ''}`} style={{ backgroundColor: getColorForCell(cell) }}></div>
            ))}
          </div>
        );
      })}
    </div>
  );
};

const getColorForCell = (cell: number) => {
  switch (cell) {
    case 1:
      return '#ff6347';
    case 2:
      return '#3cb371';
    case 3:
      return '#1e90ff';
    case 4:
      return '#ffd700';
    case 5:
      return '#ee82ee';
    case 6:
      return '#ffa500';
    case 7:
      return '#00ced1';
    default:
      return 'transparent';
  }
};
