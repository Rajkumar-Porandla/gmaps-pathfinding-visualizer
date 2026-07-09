export interface GridNode {
  row: number;
  col: number;
  isStart: boolean;
  isEnd: boolean;
  isWall: boolean;
  weight: number; // 1 for normal, 5 for heavy traffic (weighted nodes)
  isVisited: boolean;
  isShortestPath: boolean;
  distance: number;
  heuristicDistance: number;
  totalDistance: number;
  previousNode: GridNode | null;
}

export interface Position {
  row: number;
  col: number;
}

export type AlgorithmType = 'BFS' | 'DFS' | 'DIJKSTRA' | 'ASTAR';
export type MazeType = 'RECURSIVE_DIVISION' | 'RANDOM_WALLS' | 'RANDOM_WEIGHTS';
export type SpeedType = 'VERY_SLOW' | 'SLOW' | 'NORMAL' | 'FAST' | 'VERY_FAST' | 'INSTANT';

export interface VivaSnapshotNode {
  row: number;
  col: number;
  distance: number;
  totalDistance: number;
  heuristicDistance: number;
}

export interface VivaSnapshot {
  currentNode: VivaSnapshotNode | null;
  parentNode: VivaSnapshotNode | null;
  openSet: VivaSnapshotNode[]; // Current contents of queue/stack/priority-queue
  visitedNodesCount: number;
}

export interface AlgorithmStats {
  executionTime: number; // in milliseconds
  animationDuration: number; // in seconds
  visitedNodesCount: number;
  expandedNodesCount: number; // Total nodes placed in open set
  pathLength: number;
  pathCost: number; // Sum of node weights on path
  wallCount: number;
  weightCount: number;
  gridSize: string;
  explorationRatio: number; // (visitedNodesCount / traversableNodes) * 100
  memoryEstimate: number; // in KB
  renderedFps: number;
  renderTime: number; // in ms
}

export const SPEED_MS: Record<SpeedType, number> = {
  VERY_SLOW: 150,
  SLOW: 75,
  NORMAL: 30,
  FAST: 10,
  VERY_FAST: 2,
  INSTANT: 0,
};

export interface AlgorithmExtendedDetails {
  name: string;
  description: string;
  dataStructure: string;
  shortestPath: boolean;
  weighted: boolean;
  heuristic: string;
  complexity: {
    best: string;
    avg: string;
    worst: string;
    space: string;
  };
  advantages: string[];
  disadvantages: string[];
  applications: string[];
}

export const ALGORITHM_DETAILS: Record<AlgorithmType, AlgorithmExtendedDetails> = {
  BFS: {
    name: 'Breadth-First Search',
    description: 'Explores all nodes at the current depth level before moving to nodes at the next level. Utilizes a FIFO queue.',
    dataStructure: 'Queue (First-In-First-Out)',
    shortestPath: true,
    weighted: false,
    heuristic: 'None (Unweighted)',
    complexity: {
      best: 'O(V + E)',
      avg: 'O(V + E)',
      worst: 'O(V + E)',
      space: 'O(V)',
    },
    advantages: [
      'Guarantees the shortest path on unweighted graphs.',
      'Optimal for searching nodes close to the source.',
    ],
    disadvantages: [
      'High memory overhead as it stores all nodes of the current level.',
      'Does not support edge weights or traffic penalties.',
    ],
    applications: [
      'Social network connections (degrees of separation).',
      'P2P networks.',
      'GPS systems finding initial nearby structures.',
    ],
  },
  DFS: {
    name: 'Depth-First Search',
    description: 'Explores as far as possible along each branch before backtracking. Utilizes a LIFO stack.',
    dataStructure: 'Stack (Last-In-First-Out)',
    shortestPath: false,
    weighted: false,
    heuristic: 'None (Unweighted)',
    complexity: {
      best: 'O(V + E)',
      avg: 'O(V + E)',
      worst: 'O(V + E)',
      space: 'O(V)',
    },
    advantages: [
      'Low memory footprint compared to BFS (depends on tree depth).',
      'Fast for finding *any* solution in dense graphs.',
    ],
    disadvantages: [
      'Does NOT guarantee the shortest path.',
      'Can get stuck in deep or infinite loops in cyclic graphs.',
    ],
    applications: [
      'Solving maze puzzles with single solutions.',
      'Topological sorting.',
      'Detecting cycles in network topologies.',
    ],
  },
  DIJKSTRA: {
    name: "Dijkstra's Algorithm",
    description: 'The standard weighted pathfinder. Computes shortest path by repeatedly extracting the node with minimum cost.',
    dataStructure: 'Min-Heap / Priority Queue',
    shortestPath: true,
    weighted: true,
    heuristic: 'None (Dijkstra is uniform cost search)',
    complexity: {
      best: 'O((V + E) log V)',
      avg: 'O((V + E) log V)',
      worst: 'O((V + E) log V)',
      space: 'O(V)',
    },
    advantages: [
      'Guarantees the absolute shortest path on weighted graphs.',
      'Robust and handles varying traffic delays correctly.',
    ],
    disadvantages: [
      'Explores in all directions equally (radial search).',
      'Slower than heuristics-guided algorithms like A*.',
    ],
    applications: [
      'Google Maps navigation and routing.',
      'Open Shortest Path First (OSPF) internet routing protocol.',
      'Telephone network traffic analysis.',
    ],
  },
  ASTAR: {
    name: 'A* Search',
    description: 'Heuristics-guided weighted pathfinder. Estimates the total distance f(n) = g(n) + h(n) to reach the destination.',
    dataStructure: 'Min-Heap / Priority Queue',
    shortestPath: true,
    weighted: true,
    heuristic: 'Manhattan Distance (|x1 - x2| + |y1 - y2|)',
    complexity: {
      best: 'O(V)',
      avg: 'O(E log V)',
      worst: 'O(b^d) exponential in worst heuristic choice',
      space: 'O(b^d)',
    },
    advantages: [
      'Guarantees the shortest path (with an admissible heuristic).',
      'Significantly faster and more targeted than Dijkstra.',
    ],
    disadvantages: [
      'Can consume substantial memory as it retains open nodes.',
      'Accuracy depends highly on the quality of the heuristic.',
    ],
    applications: [
      'Video game pathfinding (AI movement).',
      'Robotics navigation planning.',
      'Real-time traffic route recalculations.',
    ],
  },
};
