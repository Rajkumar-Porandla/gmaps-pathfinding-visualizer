import type { GridNode, VivaSnapshot } from './types';
import { MinHeap } from './heap';
import type { PathfindingResult } from './bfs';

/**
 * Dijkstra's pathfinding algorithm (weighted).
 * Uses a binary min-heap for optimal performance.
 */
export function dijkstra(grid: GridNode[][], startNode: GridNode, endNode: GridNode): PathfindingResult {
  const visitedNodesInOrder: GridNode[] = [];
  const vivaSnapshots: VivaSnapshot[] = [];
  
  startNode.distance = 0;
  
  const heap = new MinHeap();
  heap.insert(startNode);

  const inHeap = new Set<string>();
  inHeap.add(`${startNode.row},${startNode.col}`);

  while (!heap.isEmpty()) {
    const closestNode = heap.extractMin();
    if (!closestNode) break;

    if (closestNode.isWall) continue;
    if (closestNode.isVisited) continue; // Extract node might already have been visited if inserted multiple times

    closestNode.isVisited = true;
    visitedNodesInOrder.push(closestNode);

    // Capture snapshot for Viva Mode
    vivaSnapshots.push({
      currentNode: {
        row: closestNode.row,
        col: closestNode.col,
        distance: closestNode.distance,
        totalDistance: closestNode.distance,
        heuristicDistance: 0,
      },
      parentNode: closestNode.previousNode
        ? {
            row: closestNode.previousNode.row,
            col: closestNode.previousNode.col,
            distance: closestNode.previousNode.distance,
            totalDistance: closestNode.previousNode.distance,
            heuristicDistance: 0,
          }
        : null,
      openSet: heap.getElements().map(node => ({
        row: node.row,
        col: node.col,
        distance: node.distance,
        totalDistance: node.distance,
        heuristicDistance: 0,
      })),
      visitedNodesCount: visitedNodesInOrder.length,
    });

    if (closestNode.row === endNode.row && closestNode.col === endNode.col) {
      break;
    }

    const unvisitedNeighbors = getUnvisitedNeighbors(closestNode, grid);
    for (const neighbor of unvisitedNeighbors) {
      const tentativeDistance = closestNode.distance + neighbor.weight;
      if (tentativeDistance < neighbor.distance) {
        neighbor.distance = tentativeDistance;
        neighbor.previousNode = closestNode;
        
        const key = `${neighbor.row},${neighbor.col}`;
        heap.insert(neighbor);
        inHeap.add(key);
      }
    }
  }

  return { visitedNodesInOrder, vivaSnapshots };
}

export function getUnvisitedNeighbors(node: GridNode, grid: GridNode[][]): GridNode[] {
  const neighbors: GridNode[] = [];
  const { row, col } = node;
  if (row > 0) neighbors.push(grid[row - 1][col]);
  if (row < grid.length - 1) neighbors.push(grid[row + 1][col]);
  if (col > 0) neighbors.push(grid[row][col - 1]);
  if (col < grid[0].length - 1) neighbors.push(grid[row][col + 1]);
  return neighbors.filter(neighbor => !neighbor.isVisited);
}

// Backtracks from the endNode to find the shortest path
export function getNodesInShortestPathOrder(endNode: GridNode): GridNode[] {
  const nodesInShortestPathOrder: GridNode[] = [];
  let currentNode: GridNode | null = endNode;
  while (currentNode !== null) {
    nodesInShortestPathOrder.unshift(currentNode);
    currentNode = currentNode.previousNode;
  }
  return nodesInShortestPathOrder;
}
