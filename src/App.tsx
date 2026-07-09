import { useState, useEffect, useRef, useCallback } from 'react';
import { Header } from './components/Header';
import { ControlPanel } from './components/ControlPanel';
import { StatsPanel } from './components/StatsPanel';
import { Grid } from './components/Grid';
import { InfoPanel } from './components/InfoPanel';
import { ComparisonDashboard } from './components/ComparisonDashboard';
import { VivaPanel } from './components/VivaPanel';
import { Tutorial } from './components/Tutorial';
import { ToastContainer, type ToastMessage } from './components/Toast';
import { useTheme } from './hooks/useTheme';
import {
  type GridNode,
  type Position,
  type AlgorithmType,
  type MazeType,
  type SpeedType,
  type AlgorithmStats,
  type VivaSnapshot,
  SPEED_MS,
  ALGORITHM_DETAILS,
} from './algorithms/types';
import { dijkstra, getNodesInShortestPathOrder } from './algorithms/dijkstra';
import { astar } from './algorithms/astar';
import { bfs } from './algorithms/bfs';
import { dfs } from './algorithms/dfs';
import { recursiveDivision } from './mazes/recursiveDivision';
import { randomWalls, randomWeights } from './mazes/random';

export default function App() {
  const { theme, toggleTheme } = useTheme();

  // Onboarding & Dashboard states
  const [isTutorialOpen, setIsTutorialOpen] = useState(false);
  const [isVivaEnabled, setVivaEnabled] = useState(false);
  const [isComparisonEnabled, setComparisonEnabled] = useState(false);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Telemetry trackers
  const [fps, setFps] = useState(60);

  // Settings state
  const [algorithm, setAlgorithm] = useState<AlgorithmType>('ASTAR');
  const [maze, setMaze] = useState<MazeType>('RECURSIVE_DIVISION');
  const [speed, setSpeed] = useState<SpeedType>('FAST');
  const [drawMode, setDrawMode] = useState<'WALL' | 'WEIGHT'>('WALL');
  const [gridSize, setGridSize] = useState<string>('50x30');

  // Dynamic grid dimensions
  const getRowsCols = (sizeStr: string): { rows: number; cols: number } => {
    const [cols, rows] = sizeStr.split('x').map(Number);
    return { rows, cols };
  };

  const { rows: ROWS, cols: COLS } = getRowsCols(gridSize);

  // Node placements
  const [startNodePos, setStartNodePos] = useState<Position>({ row: 5, col: 5 });
  const [endNodePos, setEndNodePos] = useState<Position>({ row: 15, col: 25 });

  // Mouse interaction state
  const [mouseIsPressed, setMouseIsPressed] = useState(false);
  const [draggedNode, setDraggedNode] = useState<'START' | 'END' | null>(null);

  // Core Grid State
  const [grid, setGrid] = useState<GridNode[][]>([]);

  // Animation playback states
  const [isAnimating, setIsAnimating] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [stats, setStats] = useState<AlgorithmStats | null>(null);

  // Viva snapshot inspection
  const [currentSnapshot, setCurrentSnapshot] = useState<VivaSnapshot | null>(null);

  // Ref tracking node DOM manipulation & timers
  const animationStateRef = useRef<{
    visitedInOrder: GridNode[];
    shortestPath: GridNode[];
    vivaSnapshots: VivaSnapshot[];
    visitedIdx: number;
    pathIdx: number;
    timer: ReturnType<typeof setTimeout> | null;
    startTime: number;
  }>({
    visitedInOrder: [],
    shortestPath: [],
    vivaSnapshots: [],
    visitedIdx: 0,
    pathIdx: 0,
    timer: null,
    startTime: 0,
  });

  const fpsRef = useRef<{
    lastTime: number;
    frames: number;
  }>({
    lastTime: performance.now(),
    frames: 0,
  });

  // Setup onboarding tutorial check
  useEffect(() => {
    const completed = localStorage.getItem('tutorialCompleted');
    if (!completed) {
      setIsTutorialOpen(true);
    }
  }, []);

  // Toast utility helper
  const addToast = useCallback((message: string, type: 'success' | 'error' | 'warning' = 'success') => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts(prev => [...prev, { id, type, message }]);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  // Update dynamic grid dimensions when size setting changes
  useEffect(() => {
    const { rows, cols } = getRowsCols(gridSize);
    const start = { row: Math.floor(rows / 2), col: Math.floor(cols / 4) };
    const end = { row: Math.floor(rows / 2), col: Math.floor((3 * cols) / 4) };
    setStartNodePos(start);
    setEndNodePos(end);
    initializeGrid(start, end, false, rows, cols);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gridSize]);

  // Frame rate tracking recursion
  useEffect(() => {
    let frameId: number;
    const calcFps = () => {
      const now = performance.now();
      fpsRef.current.frames++;
      if (now >= fpsRef.current.lastTime + 1000) {
        setFps(Math.round((fpsRef.current.frames * 1000) / (now - fpsRef.current.lastTime)));
        fpsRef.current.frames = 0;
        fpsRef.current.lastTime = now;
      }
      frameId = requestAnimationFrame(calcFps);
    };
    frameId = requestAnimationFrame(calcFps);
    return () => cancelAnimationFrame(frameId);
  }, []);

  // Initialize/Reset grid structure
  const initializeGrid = useCallback((
    start = startNodePos,
    end = endNodePos,
    keepWallsAndWeights = false,
    rowsCount = ROWS,
    colsCount = COLS
  ) => {
    const newGrid: GridNode[][] = [];
    for (let r = 0; r < rowsCount; r++) {
      const currentRow: GridNode[] = [];
      for (let c = 0; c < colsCount; c++) {
        const isStart = r === start.row && c === start.col;
        const isEnd = r === end.row && c === end.col;

        let isWall = false;
        let weight = 1;

        if (keepWallsAndWeights && grid[r]?.[c]) {
          isWall = !!grid[r][c].isWall;
          weight = grid[r][c].weight || 1;
        }

        currentRow.push({
          row: r,
          col: c,
          isStart,
          isEnd,
          isWall,
          weight,
          isVisited: false,
          isShortestPath: false,
          distance: Infinity,
          heuristicDistance: Infinity,
          totalDistance: Infinity,
          previousNode: null,
        });
      }
      newGrid.push(currentRow);
    }
    setGrid(newGrid);
  }, [grid, startNodePos, endNodePos, ROWS, COLS]);

  // Node placements
  const handleNodeMove = (newRow: number, newCol: number, type: 'START' | 'END') => {
    if (type === 'START') {
      setStartNodePos({ row: newRow, col: newCol });
      initializeGrid({ row: newRow, col: newCol }, endNodePos, true);
    } else {
      setEndNodePos({ row: newRow, col: newCol });
      initializeGrid(startNodePos, { row: newRow, col: newCol }, true);
    }
  };

  // Node mouse interaction triggers
  const handleMouseDown = (row: number, col: number) => {
    if (isAnimating) return;
    setMouseIsPressed(true);

    const node = grid[row][col];
    if (node.isStart) {
      setDraggedNode('START');
    } else if (node.isEnd) {
      setDraggedNode('END');
    } else {
      toggleWallOrWeight(row, col);
    }
  };

  const handleMouseEnter = (row: number, col: number) => {
    if (!mouseIsPressed || isAnimating) return;

    const node = grid[row][col];
    if (draggedNode === 'START') {
      if (!node.isEnd && !node.isWall) {
        handleNodeMove(row, col, 'START');
      }
    } else if (draggedNode === 'END') {
      if (!node.isStart && !node.isWall) {
        handleNodeMove(row, col, 'END');
      }
    } else {
      toggleWallOrWeight(row, col);
    }
  };

  const handleMouseUp = () => {
    setMouseIsPressed(false);
    setDraggedNode(null);
  };

  const toggleWallOrWeight = (row: number, col: number) => {
    const newGrid = [...grid];
    const node = { ...newGrid[row][col] };

    if (node.isStart || node.isEnd) return;

    if (drawMode === 'WALL') {
      node.isWall = !node.isWall;
      node.weight = 1;
    } else {
      node.weight = node.weight === 5 ? 1 : 5;
      node.isWall = false;
    }

    newGrid[row][col] = node;
    setGrid(newGrid);
  };

  // Keyboard accessibility handler for grid navigation
  const handleKeyDown = (e: React.KeyboardEvent, row: number, col: number) => {
    if (isAnimating) return;
    const { key } = e;
    let nextRow = row;
    let nextCol = col;

    if (key === 'ArrowUp') nextRow = Math.max(0, row - 1);
    else if (key === 'ArrowDown') nextRow = Math.min(ROWS - 1, row + 1);
    else if (key === 'ArrowLeft') nextCol = Math.max(0, col - 1);
    else if (key === 'ArrowRight') nextCol = Math.min(COLS - 1, col + 1);
    else if (key === ' ' || key === 'Enter') {
      e.preventDefault();
      toggleWallOrWeight(row, col);
      return;
    } else {
      return;
    }

    e.preventDefault();
    const targetEl = document.getElementById(`node-${nextRow}-${nextCol}`);
    targetEl?.focus();
  };

  // Terrain generation
  const handleGenerateMaze = () => {
    if (isAnimating) return;

    const cleanGrid = grid.map(row =>
      row.map(node => ({
        ...node,
        isWall: false,
        weight: 1,
        isVisited: false,
        isShortestPath: false,
        distance: Infinity,
        heuristicDistance: Infinity,
        totalDistance: Infinity,
        previousNode: null,
      }))
    );

    let wallsOrWeights: Position[] = [];
    if (maze === 'RECURSIVE_DIVISION') {
      wallsOrWeights = recursiveDivision(COLS, ROWS, startNodePos, endNodePos);
    } else if (maze === 'RANDOM_WALLS') {
      wallsOrWeights = randomWalls(COLS, ROWS, startNodePos, endNodePos, 0.3);
    } else if (maze === 'RANDOM_WEIGHTS') {
      wallsOrWeights = randomWeights(COLS, ROWS, startNodePos, endNodePos, 0.25);
    }

    const nextGrid = cleanGrid.map(row => row.map(node => ({ ...node })));

    wallsOrWeights.forEach(pos => {
      const node = nextGrid[pos.row]?.[pos.col];
      if (node) {
        if (maze === 'RANDOM_WEIGHTS') {
          node.weight = 5;
        } else {
          node.isWall = true;
        }
      }
    });

    setGrid(nextGrid);
    setStats(null);
    addToast('Map layout generated successfully!', 'success');
  };

  // Clear visual results only
  const handleClearPath = () => {
    if (isAnimating && !isPaused) return;

    stopAnimationTimer();
    clearDOMClasses();
    setIsAnimating(false);
    setIsPaused(false);
    setStats(null);
    setCurrentSnapshot(null);

    const nextGrid = grid.map(row =>
      row.map(node => ({
        ...node,
        isVisited: false,
        isShortestPath: false,
        distance: Infinity,
        heuristicDistance: Infinity,
        totalDistance: Infinity,
        previousNode: null,
      }))
    );
    setGrid(nextGrid);
  };

  const handleClearWalls = () => {
    if (isAnimating && !isPaused) return;
    clearDOMClasses();
    initializeGrid(startNodePos, endNodePos, false);
    setStats(null);
    setCurrentSnapshot(null);
    addToast('All obstacles cleared.', 'warning');
  };

  const handleReset = () => {
    stopAnimationTimer();
    clearDOMClasses();
    setIsAnimating(false);
    setIsPaused(false);
    setStats(null);
    setCurrentSnapshot(null);
    const defaultStart = { row: Math.floor(ROWS / 2), col: Math.floor(COLS / 4) };
    const defaultEnd = { row: Math.floor(ROWS / 2), col: Math.floor((3 * COLS) / 4) };
    setStartNodePos(defaultStart);
    setEndNodePos(defaultEnd);
    initializeGrid(defaultStart, defaultEnd, false);
  };

  const stopAnimationTimer = () => {
    if (animationStateRef.current.timer) {
      clearTimeout(animationStateRef.current.timer);
      animationStateRef.current.timer = null;
    }
  };

  // Clear animation markup classes from the DOM
  const clearDOMClasses = () => {
    for (let r = 0; r < ROWS; r++) {
      for (let c = 0; c < COLS; c++) {
        const el = document.getElementById(`node-${r}-${c}`);
        if (el) {
          el.classList.remove('node-visited', 'node-shortest-path');
        }
      }
    }
  };

  // DOM direct class injection to maintain high-speed FPS rendering
  const updateNodeDOM = (row: number, col: number, type: 'VISITED' | 'PATH' | 'CLEAR') => {
    const el = document.getElementById(`node-${row}-${col}`);
    if (!el) return;
    
    // Don't styles over Start/End indicators
    if ((row === startNodePos.row && col === startNodePos.col) || (row === endNodePos.row && col === endNodePos.col)) {
      return;
    }

    if (type === 'VISITED') {
      el.classList.add('node-visited');
    } else if (type === 'PATH') {
      el.classList.remove('node-visited');
      el.classList.add('node-shortest-path');
    } else {
      el.classList.remove('node-visited', 'node-shortest-path');
    }
  };

  // Run Route Pathfinder
  const handleRun = () => {
    if (isAnimating && !isPaused) return;

    if (isPaused) {
      setIsPaused(false);
      animateNodes();
      return;
    }

    // Run pathfinder
    const tempGrid = grid.map(row =>
      row.map(node => ({
        ...node,
        isVisited: false,
        isShortestPath: false,
        distance: Infinity,
        heuristicDistance: Infinity,
        totalDistance: Infinity,
        previousNode: null,
      }))
    );

    const startNode = tempGrid[startNodePos.row][startNodePos.col];
    const endNode = tempGrid[endNodePos.row][endNodePos.col];

    const startTime = performance.now();
    let visitedInOrder: GridNode[] = [];
    let vivaSnapshots: VivaSnapshot[] = [];

    if (algorithm === 'BFS') {
      const res = bfs(tempGrid, startNode, endNode);
      visitedInOrder = res.visitedNodesInOrder;
      vivaSnapshots = res.vivaSnapshots;
    } else if (algorithm === 'DFS') {
      const res = dfs(tempGrid, startNode, endNode);
      visitedInOrder = res.visitedNodesInOrder;
      vivaSnapshots = res.vivaSnapshots;
    } else if (algorithm === 'DIJKSTRA') {
      const res = dijkstra(tempGrid, startNode, endNode);
      visitedInOrder = res.visitedNodesInOrder;
      vivaSnapshots = res.vivaSnapshots;
    } else if (algorithm === 'ASTAR') {
      const res = astar(tempGrid, startNode, endNode);
      visitedInOrder = res.visitedNodesInOrder;
      vivaSnapshots = res.vivaSnapshots;
    }

    const executionTime = performance.now() - startTime;
    const shortestPath = getNodesInShortestPathOrder(endNode);

    const hasPath = shortestPath.length > 0 && shortestPath[0].isStart;
    if (!hasPath) {
      addToast('No navigation route exists. Place fewer obstacles!', 'error');
    } else {
      addToast('Route search completed. Animating...', 'success');
    }

    // Remove start and end nodes from arrays to prevent graphic conflicts
    const filteredVisited = visitedInOrder.filter(
      node =>
        !(node.row === startNodePos.row && node.col === startNodePos.col) &&
        !(node.row === endNodePos.row && node.col === endNodePos.col)
    );

    const filteredShortestPath = hasPath
      ? shortestPath.filter(
          node =>
            !(node.row === startNodePos.row && node.col === startNodePos.col) &&
            !(node.row === endNodePos.row && node.col === endNodePos.col)
        )
      : [];

    animationStateRef.current = {
      visitedInOrder: filteredVisited,
      shortestPath: filteredShortestPath,
      vivaSnapshots,
      visitedIdx: 0,
      pathIdx: 0,
      timer: null,
      startTime: executionTime,
    };

    setIsAnimating(true);
    setIsPaused(false);
    clearDOMClasses();

    animateNodes();
  };

  const handlePause = () => {
    stopAnimationTimer();
    setIsPaused(true);
    addToast('Animation suspended.', 'warning');
  };

  const handleStop = () => {
    stopAnimationTimer();
    clearDOMClasses();
    setIsAnimating(false);
    setIsPaused(false);
    setStats(null);
    setCurrentSnapshot(null);
    animationStateRef.current.visitedIdx = 0;
    animationStateRef.current.pathIdx = 0;
  };

  const handleRestart = () => {
    stopAnimationTimer();
    clearDOMClasses();
    animationStateRef.current.visitedIdx = 0;
    animationStateRef.current.pathIdx = 0;
    setIsAnimating(true);
    setIsPaused(false);
    animateNodes();
  };

  // Main playback recurrence loop
  const animateNodes = () => {
    const { visitedInOrder, shortestPath, vivaSnapshots, visitedIdx, pathIdx } = animationStateRef.current;
    const speedMs = SPEED_MS[speed];

    if (visitedIdx < visitedInOrder.length) {
      const targetNode = visitedInOrder[visitedIdx];
      
      // Update UI directly via DOM to bypass React render bottleneck
      updateNodeDOM(targetNode.row, targetNode.col, 'VISITED');
      
      if (isVivaEnabled && vivaSnapshots[visitedIdx]) {
        setCurrentSnapshot(vivaSnapshots[visitedIdx]);
      }

      animationStateRef.current.visitedIdx++;
      
      if (speed === 'INSTANT') {
        animateNodes();
      } else {
        animationStateRef.current.timer = setTimeout(animateNodes, speedMs);
      }
    } else if (pathIdx < shortestPath.length) {
      const targetNode = shortestPath[pathIdx];
      
      // Draw shortest path using DOM
      updateNodeDOM(targetNode.row, targetNode.col, 'PATH');
      
      animationStateRef.current.pathIdx++;

      if (speed === 'INSTANT') {
        animateNodes();
      } else {
        animationStateRef.current.timer = setTimeout(animateNodes, speedMs * 1.5);
      }
    } else {
      // Completed animation sequence: Write state back to React core state once
      setIsAnimating(false);
      setIsPaused(false);
      stopAnimationTimer();

      const finalGrid = grid.map(row =>
        row.map(node => {
          const visitedMatch = visitedInOrder.some(vn => vn.row === node.row && vn.col === node.col);
          const pathMatch = shortestPath.some(sp => sp.row === node.row && sp.col === node.col);
          return {
            ...node,
            isVisited: visitedMatch,
            isShortestPath: pathMatch,
          };
        })
      );
      
      const tStart = performance.now();
      setGrid(finalGrid);

      // Save statistics metrics
      let totalWalls = 0;
      let totalWeights = 0;
      grid.forEach(row =>
        row.forEach(node => {
          if (node.isWall) totalWalls++;
          if (node.weight > 1) totalWeights++;
        })
      );

      const pathCost = shortestPath.reduce((acc, curr) => acc + curr.weight, 0);

      const totalNodesCount = ROWS * COLS;
      const explorationRatio = (visitedInOrder.length / totalNodesCount) * 100;
      const memoryEstimate = (visitedInOrder.length * 0.15) + (shortestPath.length * 0.12);

      const computedStats: AlgorithmStats = {
        executionTime: animationStateRef.current.startTime,
        animationDuration: (visitedInOrder.length * speedMs + shortestPath.length * speedMs * 1.5) / 1000,
        visitedNodesCount: visitedInOrder.length + 2,
        expandedNodesCount: visitedInOrder.length + 2,
        pathLength: shortestPath.length > 0 ? shortestPath.length + 2 : 0,
        pathCost: shortestPath.length > 0 ? pathCost + 2 : 0,
        wallCount: totalWalls,
        weightCount: totalWeights,
        gridSize: `${COLS}x${ROWS}`,
        explorationRatio,
        memoryEstimate,
        renderedFps: speed === 'INSTANT' ? 60 : fps,
        renderTime: performance.now() - tStart,
      };

      setStats(computedStats);
      addToast('Path calculation completed!', 'success');
    }
  };

  // Keyboard Shortcuts listener
  useEffect(() => {
    const handleKeyDownGlobal = (e: KeyboardEvent) => {
      const activeElement = document.activeElement;
      // Do not trigger shortcuts when user is typing in forms or selects
      if (activeElement && (activeElement.tagName === 'INPUT' || activeElement.tagName === 'SELECT')) {
        return;
      }

      const key = e.key.toLowerCase();
      if (e.key === ' ') {
        e.preventDefault();
        handleRun();
      } else if (key === 'p') {
        handlePause();
      } else if (key === 'r') {
        handleReset();
      } else if (key === 'c') {
        handleClearPath();
      } else if (key === 'w') {
        handleClearWalls();
      } else if (key === 'm') {
        handleGenerateMaze();
      } else if (key === 'b') {
        setAlgorithm('BFS');
        addToast('Switched to BFS Pathfinder.', 'success');
      } else if (key === 'f') {
        setAlgorithm('DFS');
        addToast('Switched to DFS Pathfinder.', 'success');
      } else if (key === 'd') {
        setAlgorithm('DIJKSTRA');
        addToast('Switched to Dijkstra Pathfinder.', 'success');
      } else if (key === 'a') {
        setAlgorithm('ASTAR');
        addToast('Switched to A* Pathfinder.', 'success');
      } else if (key === 't') {
        toggleTheme();
      } else if (key === 'h') {
        setIsTutorialOpen(true);
      }
    };

    window.addEventListener('keydown', handleKeyDownGlobal);
    return () => window.removeEventListener('keydown', handleKeyDownGlobal);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [grid, algorithm, speed, startNodePos, endNodePos, isPaused, isAnimating]);

  // Save Maze to JSON File
  const handleSaveMaze = () => {
    let walls: Position[] = [];
    let weights: Position[] = [];

    grid.forEach(row =>
      row.forEach(node => {
        if (node.isWall) walls.push({ row: node.row, col: node.col });
        if (node.weight > 1) weights.push({ row: node.row, col: node.col });
      })
    );

    const mazeData = {
      gridSize,
      start: startNodePos,
      end: endNodePos,
      walls,
      weights,
    };

    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(mazeData));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `gmaps-route-${gridSize}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();

    addToast('Map config saved successfully.', 'success');
  };

  // Load Custom JSON Map
  const handleLoadMaze = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = event => {
      try {
        const result = event.target?.result;
        if (typeof result !== 'string') throw new Error('Invalid format');
        const data = JSON.parse(result);

        if (!data.gridSize || !data.start || !data.end || !Array.isArray(data.walls) || !Array.isArray(data.weights)) {
          throw new Error('Config missing attributes');
        }

        // Apply parameters
        setGridSize(data.gridSize);
        setStartNodePos(data.start);
        setEndNodePos(data.end);

        // Grid re-initializes on gridSize change, so let's load layout
        const { rows, cols } = getRowsCols(data.gridSize);
        const nextGrid: GridNode[][] = [];
        for (let r = 0; r < rows; r++) {
          const currentRow: GridNode[] = [];
          for (let c = 0; c < cols; c++) {
            const isStart = r === data.start.row && c === data.start.col;
            const isEnd = r === data.end.row && c === data.end.col;
            const isWall = data.walls.some((w: Position) => w.row === r && w.col === c);
            const weight = data.weights.some((wt: Position) => wt.row === r && wt.col === c) ? 5 : 1;

            currentRow.push({
              row: r,
              col: c,
              isStart,
              isEnd,
              isWall,
              weight,
              isVisited: false,
              isShortestPath: false,
              distance: Infinity,
              heuristicDistance: Infinity,
              totalDistance: Infinity,
              previousNode: null,
            });
          }
          nextGrid.push(currentRow);
        }

        setGrid(nextGrid);
        setStats(null);
        setCurrentSnapshot(null);
        addToast('Custom Map config restored!', 'success');
      } catch (err) {
        addToast('Corrupted or invalid JSON configuration file.', 'error');
        console.error(err);
      }
    };
    reader.readAsText(file);
    // Clear file selection target to allow consecutive uploads of identical files
    e.target.value = '';
  };

  const handleExportComparison = (format: 'JSON' | 'CSV', comparisonList: any[]) => {
    let dataStr = '';
    let fileName = '';

    if (format === 'JSON') {
      dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(comparisonList, null, 2));
      fileName = 'gmaps-compare.json';
    } else {
      const headers = ['Algorithm', 'Time (ms)', 'Visited Nodes', 'Path Cost', 'Est Memory (KB)', 'Shortest Path Found'];
      const csvRows = [headers.join(',')];
      
      comparisonList.forEach(item => {
        csvRows.push([
          item.name,
          item.executionTime.toFixed(2),
          item.visitedNodesCount,
          item.pathCost,
          item.memoryEstimate.toFixed(2),
          item.shortestPathFound ? 'Yes' : 'No'
        ].join(','));
      });

      dataStr = 'data:text/csv;charset=utf-8,' + encodeURIComponent(csvRows.join('\n'));
      fileName = 'gmaps-compare.csv';
    }

    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', fileName);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();

    addToast(`Benchmark results exported as ${format}.`, 'success');
  };

  const handleCloseTutorial = () => {
    setIsTutorialOpen(false);
    localStorage.setItem('tutorialCompleted', 'true');
  };

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-900 transition-colors duration-300 flex flex-col font-sans">
      <Header theme={theme} toggleTheme={toggleTheme} isAnimating={isAnimating && !isPaused} />

      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
        {/* Left Column - Controls & Info Panels */}
        <div className="lg:col-span-1 space-y-6">
          <ControlPanel
            algorithm={algorithm}
            setAlgorithm={setAlgorithm}
            maze={maze}
            setMaze={setMaze}
            speed={speed}
            setSpeed={setSpeed}
            isAnimating={isAnimating}
            isPaused={isPaused}
            drawMode={drawMode}
            setDrawMode={setDrawMode}
            onRun={handleRun}
            onPause={handlePause}
            onStop={handleStop}
            onRestart={handleRestart}
            onReset={handleReset}
            onGenerateMaze={handleGenerateMaze}
            onClearPath={handleClearPath}
            onClearWalls={handleClearWalls}
            gridSize={gridSize}
            setGridSize={setGridSize}
            onSaveMaze={handleSaveMaze}
            onLoadMaze={handleLoadMaze}
            isVivaEnabled={isVivaEnabled}
            setVivaEnabled={setVivaEnabled}
            isComparisonEnabled={isComparisonEnabled}
            setComparisonEnabled={setComparisonEnabled}
            onOpenTutorial={() => setIsTutorialOpen(true)}
          />

          <StatsPanel stats={stats} algorithmName={ALGORITHM_DETAILS[algorithm].name} />
          <InfoPanel algorithm={algorithm} />
        </div>

        {/* Right Column - Map Canvas & Live Inspector Cards */}
        <div className="lg:col-span-3 space-y-6">
          <Grid
            grid={grid}
            onNodeMouseDown={handleMouseDown}
            onNodeMouseEnter={handleMouseEnter}
            onNodeMouseUp={handleMouseUp}
            onNodeKeyDown={handleKeyDown}
            isAnimating={isAnimating && !isPaused}
          />

          {isVivaEnabled && (
            <VivaPanel
              snapshot={currentSnapshot}
              algorithm={algorithm}
              isVivaEnabled={isVivaEnabled}
              setVivaEnabled={setVivaEnabled}
            />
          )}

          {isComparisonEnabled && (
            <ComparisonDashboard
              grid={grid}
              startNodePos={startNodePos}
              endNodePos={endNodePos}
              onExportComparison={handleExportComparison}
            />
          )}
        </div>
      </main>

      {/* Tutorial Overlay Guide Modal */}
      <Tutorial isOpen={isTutorialOpen} onClose={handleCloseTutorial} />

      {/* Toast Notifications Panel */}
      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </div>
  );
}
