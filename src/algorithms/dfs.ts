import type { GridNode, VivaSnapshot } from './types';
import { getUnvisitedNeighbors } from './dijkstra';
import type { PathfindingResult } from './bfs';

/**
 * Depth-First Search (DFS) pathfinding algorithm.
 * Returns visited nodes in order and stack state snapshots.
 */
export function dfs(grid: GridNode[][], startNode: GridNode, endNode: GridNode): PathfindingResult {
  const visitedNodesInOrder: GridNode[] = [];
  const vivaSnapshots: VivaSnapshot[] = [];
  const stack: GridNode[] = [startNode];

  while (stack.length > 0) {
    const currentNode = stack.pop();
    if (!currentNode) break;

    if (currentNode.isWall) continue;
    if (currentNode.isVisited) continue;

    currentNode.isVisited = true;
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
      openSet: stack.map(node => ({
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
      neighbor.previousNode = currentNode;
      neighbor.distance = currentNode.distance === Infinity ? 1 : currentNode.distance + 1;
      stack.push(neighbor);
    }
  }

  return { visitedNodesInOrder, vivaSnapshots };
}
