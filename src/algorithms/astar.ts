import type { GridNode, VivaSnapshot } from './types';
import { MinHeap } from './heap';
import { getUnvisitedNeighbors } from './dijkstra';
import type { PathfindingResult } from './bfs';

/**
 * A* Search pathfinding algorithm (weighted).
 * Uses a binary min-heap for optimal performance.
 */
export function astar(grid: GridNode[][], startNode: GridNode, endNode: GridNode): PathfindingResult {
  const visitedNodesInOrder: GridNode[] = [];
  const vivaSnapshots: VivaSnapshot[] = [];
  
  startNode.distance = 0;
  startNode.heuristicDistance = getManhattanDistance(startNode, endNode);
  startNode.totalDistance = startNode.heuristicDistance;

  const heap = new MinHeap();
  heap.insert(startNode);

  const inHeap = new Set<string>();
  inHeap.add(`${startNode.row},${startNode.col}`);

  while (!heap.isEmpty()) {
    const currentNode = heap.extractMin();
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
        distance: currentNode.distance,
        totalDistance: currentNode.totalDistance,
        heuristicDistance: currentNode.heuristicDistance,
      },
      parentNode: currentNode.previousNode
        ? {
            row: currentNode.previousNode.row,
            col: currentNode.previousNode.col,
            distance: currentNode.previousNode.distance,
            totalDistance: currentNode.previousNode.totalDistance,
            heuristicDistance: currentNode.previousNode.heuristicDistance,
          }
        : null,
      openSet: heap.getElements().map(node => ({
        row: node.row,
        col: node.col,
        distance: node.distance,
        totalDistance: node.totalDistance,
        heuristicDistance: node.heuristicDistance,
      })),
      visitedNodesCount: visitedNodesInOrder.length,
    });

    if (currentNode.row === endNode.row && currentNode.col === endNode.col) {
      break;
    }

    const neighbors = getUnvisitedNeighbors(currentNode, grid);
    for (const neighbor of neighbors) {
      if (neighbor.isWall) continue;

      const tentativeGScore = currentNode.distance + neighbor.weight;

      if (tentativeGScore < neighbor.distance) {
        neighbor.previousNode = currentNode;
        neighbor.distance = tentativeGScore;
        neighbor.heuristicDistance = getManhattanDistance(neighbor, endNode);
        neighbor.totalDistance = neighbor.distance + neighbor.heuristicDistance;

        const key = `${neighbor.row},${neighbor.col}`;
        heap.insert(neighbor);
        inHeap.add(key);
      }
    }
  }

  return { visitedNodesInOrder, vivaSnapshots };
}

function getManhattanDistance(nodeA: GridNode, nodeB: GridNode): number {
  return Math.abs(nodeA.row - nodeB.row) + Math.abs(nodeA.col - nodeB.col);
}
