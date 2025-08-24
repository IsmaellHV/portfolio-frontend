import React from 'react';

interface NextPiecePreviewProps {
  shape: number[][] | null;
}

const NextPiecePreview: React.FC<NextPiecePreviewProps> = ({ shape }) => {
  // Crear una grilla de 4x4 para mostrar la pieza
  const createPreviewGrid = () => {
    const grid = Array(4).fill(null).map(() => Array(4).fill(0));
    
    if (!shape) return grid;

    // Obtener la forma de la pieza
    const shapeMatrix = shape;
    
    // Calcular el offset para centrar la pieza en la grilla 4x4
    const offsetX = Math.floor((4 - shapeMatrix[0].length) / 2);
    const offsetY = Math.floor((4 - shapeMatrix.length) / 2);
    
    // Colocar la pieza en la grilla centrada
    for (let y = 0; y < shapeMatrix.length; y++) {
      for (let x = 0; x < shapeMatrix[y].length; x++) {
        if (shapeMatrix[y][x] !== 0) {
          const gridY = y + offsetY;
          const gridX = x + offsetX;
          if (gridY >= 0 && gridY < 4 && gridX >= 0 && gridX < 4) {
            grid[gridY][gridX] = shapeMatrix[y][x];
          }
        }
      }
    }
    
    return grid;
  };

  const previewGrid = createPreviewGrid();

  return (
    <div className="next-piece-preview">
      {previewGrid.map((row, rowIndex) => (
        <div key={rowIndex} className="next-piece-row">
          {row.map((cell, cellIndex) => (
            <div
              key={cellIndex}
              className={`next-piece-cell ${
                cell !== 0 ? `next-piece-cell-filled next-piece-cell-${cell}` : 'next-piece-cell-empty'
              }`}
            />
          ))}
        </div>
      ))}
    </div>
  );
};

export default NextPiecePreview;