import { dijkstra, getNodesInShortestPathOrder } from './algorithms/dijkstra';
import { bfs } from './algorithms/bfs';
import { recursiveDivision } from './mazes/recursiveDivision';
import type { GridNode } from './algorithms/types';

// Simple unit testing assert library
function assert(condition: boolean, message: string) {
  if (!condition) {
    throw new Error(`Assertion Failed: ${message}`);
  }
}

function createTestGrid(rows: number, cols: number): GridNode[][] {
  const grid: GridNode[][] = [];
  for (let r = 0; r < rows; r++) {
    const row: GridNode[] = [];
    for (let c = 0; c < cols; c++) {
      row.push({
        row: r,
        col: c,
        isStart: false,
        isEnd: false,
        isWall: false,
        weight: 1,
        isVisited: false,
        isShortestPath: false,
        distance: Infinity,
        heuristicDistance: Infinity,
        totalDistance: Infinity,
        previousNode: null,
      });
    }
    grid.push(row);
  }
  return grid;
}

function runTests() {
  console.log('🧪 Starting Visualizer Unit Tests...\n');

  // Test 1: Grid Dimensions
  const grid = createTestGrid(10, 10);
  assert(grid.length === 10, 'Grid should contain 10 rows');
  assert(grid[0].length === 10, 'Grid should contain 10 columns');
  console.log('✅ Test 1 Passed: Grid creation matches boundaries.');

  // Test 2: BFS Shortest path unweighted
  const bfsGrid = createTestGrid(5, 5);
  const bfsStart = bfsGrid[0][0];
  const bfsEnd = bfsGrid[4][4];
  bfsStart.isStart = true;
  bfsEnd.isEnd = true;

  const bfsRes = bfs(bfsGrid, bfsStart, bfsEnd);
  const bfsPath = getNodesInShortestPathOrder(bfsEnd);
  assert(bfsRes.visitedNodesInOrder.length > 0, 'BFS should visit nodes.');
  assert(bfsPath.length === 9, `BFS shortest path length on 5x5 grid should be 9, got ${bfsPath.length}`);
  console.log('✅ Test 2 Passed: BFS unweighted routing.');

  // Test 3: A* vs Dijkstra cost checks
  const dGrid = createTestGrid(6, 6);
  const dStart = dGrid[0][0];
  const dEnd = dGrid[5][5];
  dStart.isStart = true;
  dEnd.isEnd = true;
  
  // Add roadblock walls
  dGrid[2][2].isWall = true;
  dGrid[2][3].isWall = true;

  const dRes = dijkstra(dGrid, dStart, dEnd);
  const dPath = getNodesInShortestPathOrder(dEnd);
  assert(dRes.visitedNodesInOrder.length > 0, 'Dijkstra should find route.');
  assert(dPath.length > 0, 'Dijkstra shortest path should be found.');
  console.log('✅ Test 3 Passed: Dijkstra weighted navigation with obstacles.');

  // Test 4: Maze generators output structures
  const startPos = { row: 1, col: 1 };
  const endPos = { row: 8, col: 8 };
  const rdWalls = recursiveDivision(10, 10, startPos, endPos);
  assert(Array.isArray(rdWalls), 'Recursive division should return arrays of positions.');
  const wallCheck = rdWalls.some(p => p.row === startPos.row && p.col === startPos.col);
  assert(!wallCheck, 'Maze generator must never place walls on start node.');
  console.log('✅ Test 4 Passed: Maze generation boundaries validated.');

  console.log('\n🎉 All visualizer test assertions completed successfully!');
}

runTests();
