import type { GridNode, VivaSnapshot } from './types';
import { getUnvisitedNeighbors } from './dijkstra';

export interface PathfindingResult {
  visitedNodesInOrder: GridNode[];
  vivaSnapshots: VivaSnapshot[];
}

/**
 * Breadth-First Search (BFS) pathfinding algorithm.
 * Returns visited nodes in order and queue state snapshots.
 */
export function bfs(grid: GridNode[][], startNode: GridNode, endNode: GridNode): PathfindingResult {
  const visitedNodesInOrder: GridNode[] = [];
  const vivaSnapshots: VivaSnapshot[] = [];
  const queue: GridNode[] = [startNode];
  
  startNode.isVisited = true;

  while (queue.length > 0) {
    const currentNode = queue.shift();
    if (!currentNode) break;

    if (currentNode.isWall) continue;

    visitedNodesInOrder.push(currentNode);

    // Capture snapshot for Viva Mode
    vivaSnapshots.push({
      currentNode: {
        row: currentNode.row,
        col: currentNode.col,
        distance: currentNode.distance === Infinity ? 0 : currentNode.distance,
        totalDistance: 0,
        heuristicDistance: 0,
      },
      parentNode: currentNode.previousNode
        ? {
            row: currentNode.previousNode.row,
            col: currentNode.previousNode.col,
            distance: currentNode.previousNode.distance,
            totalDistance: 0,
            heuristicDistance: 0,
          }
        : null,
      openSet: queue.map(node => ({
        row: node.row,
        col: node.col,
        distance: node.distance === Infinity ? 0 : node.distance,
        totalDistance: 0,
        heuristicDistance: 0,
      })),
      visitedNodesCount: visitedNodesInOrder.length,
    });

    if (currentNode.row === endNode.row && currentNode.col === endNode.col) {
      break;
    }

    const neighbors = getUnvisitedNeighbors(currentNode, grid);
    for (const neighbor of neighbors) {
      if (neighbor.isWall) continue;
      neighbor.isVisited = true;
      neighbor.previousNode = currentNode;
      neighbor.distance = currentNode.distance === Infinity ? 1 : currentNode.distance + 1;
      queue.push(neighbor);
    }
  }

  return { visitedNodesInOrder, vivaSnapshots };
}
