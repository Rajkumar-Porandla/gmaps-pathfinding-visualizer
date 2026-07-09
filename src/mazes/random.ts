import type { Position } from '../algorithms/types';

export function randomWalls(
  width: number,
  height: number,
  startNode: Position,
  endNode: Position,
  density: number = 0.3
): Position[] {
  const walls: Position[] = [];

  for (let r = 0; r < height; r++) {
    for (let c = 0; c < width; c++) {
      // Don't place walls on start/end nodes
      if (r === startNode.row && c === startNode.col) continue;
      if (r === endNode.row && c === endNode.col) continue;

      if (Math.random() < density) {
        walls.push({ row: r, col: c });
      }
    }
  }

  return walls;
}

export function randomWeights(
  width: number,
  height: number,
  startNode: Position,
  endNode: Position,
  density: number = 0.25
): Position[] {
  const weights: Position[] = [];

  for (let r = 0; r < height; r++) {
    for (let c = 0; c < width; c++) {
      if (r === startNode.row && c === startNode.col) continue;
      if (r === endNode.row && c === endNode.col) continue;

      if (Math.random() < density) {
        weights.push({ row: r, col: c });
      }
    }
  }

  return weights;
}
