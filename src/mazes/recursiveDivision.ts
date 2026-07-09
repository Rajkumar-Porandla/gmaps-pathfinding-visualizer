import type { Position } from '../algorithms/types';

export function recursiveDivision(
  width: number,
  height: number,
  startNode: Position,
  endNode: Position
): Position[] {
  const walls: Position[] = [];

  // Initialize borders as walls (optional, but let's keep the borders open and build internal walls)
  function divide(
    rowStart: number,
    rowEnd: number,
    colStart: number,
    colEnd: number,
    orientation: 'horizontal' | 'vertical'
  ) {
    if (rowEnd - rowStart < 2 || colEnd - colStart < 2) {
      return;
    }

    const isHorizontal = orientation === 'horizontal';

    // Where to draw the wall
    const row = isHorizontal
      ? Math.floor(randomNum(rowStart + 1, rowEnd - 1) / 2) * 2
      : 0;
    const col = !isHorizontal
      ? Math.floor(randomNum(colStart + 1, colEnd - 1) / 2) * 2
      : 0;

    // Where to place the passage (must be odd so it aligns correctly with grid traversal)
    const passageRow = isHorizontal ? row : Math.floor(randomNum(rowStart, rowEnd) / 2) * 2 + 1;
    const passageCol = !isHorizontal ? col : Math.floor(randomNum(colStart, colEnd) / 2) * 2 + 1;

    // Length and direction of wall
    const length = isHorizontal ? colEnd - colStart + 1 : rowEnd - rowStart + 1;

    for (let i = 0; i < length; i++) {
      const currentRow = isHorizontal ? row : rowStart + i;
      const currentCol = !isHorizontal ? col : colStart + i;

      const isPassage = isHorizontal ? currentCol === passageCol : currentRow === passageRow;
      const isStart = currentRow === startNode.row && currentCol === startNode.col;
      const isEnd = currentRow === endNode.row && currentCol === endNode.col;

      if (!isPassage && !isStart && !isEnd) {
        walls.push({ row: currentRow, col: currentCol });
      }
    }

    // Recursively divide the subgrids
    if (isHorizontal) {
      // Top subgrid
      divide(
        rowStart,
        row - 1,
        colStart,
        colEnd,
        chooseOrientation(row - 1 - rowStart, colEnd - colStart)
      );
      // Bottom subgrid
      divide(
        row + 1,
        rowEnd,
        colStart,
        colEnd,
        chooseOrientation(rowEnd - (row + 1), colEnd - colStart)
      );
    } else {
      // Left subgrid
      divide(
        rowStart,
        rowEnd,
        colStart,
        col - 1,
        chooseOrientation(rowEnd - rowStart, col - 1 - colStart)
      );
      // Right subgrid
      divide(
        rowStart,
        rowEnd,
        col + 1,
        colEnd,
        chooseOrientation(rowEnd - rowStart, colEnd - (col + 1))
      );
    }
  }

  function chooseOrientation(width: number, height: number): 'horizontal' | 'vertical' {
    if (width < height) {
      return 'horizontal';
    } else if (height < width) {
      return 'vertical';
    } else {
      return Math.random() < 0.5 ? 'horizontal' : 'vertical';
    }
  }

  // Choose initial orientation based on grid size
  divide(0, height - 1, 0, width - 1, chooseOrientation(height, width));

  return walls;
}

function randomNum(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}
