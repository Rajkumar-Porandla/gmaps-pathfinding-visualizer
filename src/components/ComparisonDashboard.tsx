import React, { useState } from 'react';
import type { Position, GridNode, AlgorithmType } from '../algorithms/types';
import { bfs } from '../algorithms/bfs';
import { dfs } from '../algorithms/dfs';
import { dijkstra, getNodesInShortestPathOrder } from '../algorithms/dijkstra';
import { astar } from '../algorithms/astar';
import { Play, Download, Check, AlertCircle } from 'lucide-react';

interface ComparisonDashboardProps {
  grid: GridNode[][];
  startNodePos: Position;
  endNodePos: Position;
  onExportComparison: (format: 'JSON' | 'CSV', data: ComparisonResult[]) => void;
}

export interface ComparisonResult {
  algorithm: AlgorithmType;
  name: string;
  executionTime: number; // ms
  visitedNodesCount: number;
  pathLength: number;
  pathCost: number;
  memoryEstimate: number; // KB
  shortestPathFound: boolean;
  status: 'SUCCESS' | 'NO_PATH' | 'FAILED';
}

export const ComparisonDashboard: React.FC<ComparisonDashboardProps> = ({
  grid,
  startNodePos,
  endNodePos,
  onExportComparison,
}) => {
  const [results, setResults] = useState<ComparisonResult[] | null>(null);
  const [isRunning, setIsRunning] = useState(false);

  const runComparison = () => {
    setIsRunning(true);
    setResults(null);

    // Run in a small timeout to let loading state render
    setTimeout(() => {
      try {
        const algorithms: AlgorithmType[] = ['ASTAR', 'DIJKSTRA', 'BFS', 'DFS'];
        const comparisonResults: ComparisonResult[] = [];

        // Establish optimal shortest path cost from Dijkstra
        let optimalPathCost = Infinity;

        algorithms.forEach(algo => {
          // Clone grid
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
          let visitedNodesCount = 0;

          if (algo === 'BFS') {
            const res = bfs(tempGrid, startNode, endNode);
            visitedNodesCount = res.visitedNodesInOrder.length;
          } else if (algo === 'DFS') {
            const res = dfs(tempGrid, startNode, endNode);
            visitedNodesCount = res.visitedNodesInOrder.length;
          } else if (algo === 'DIJKSTRA') {
            const res = dijkstra(tempGrid, startNode, endNode);
            visitedNodesCount = res.visitedNodesInOrder.length;
          } else if (algo === 'ASTAR') {
            const res = astar(tempGrid, startNode, endNode);
            visitedNodesCount = res.visitedNodesInOrder.length;
          }

          const endTime = performance.now();
          const executionTime = endTime - startTime;

          const shortestPath = getNodesInShortestPathOrder(endNode);
          const hasPath = shortestPath.length > 0 && shortestPath[0].isStart;
          
          let pathLength = 0;
          let pathCost = 0;

          if (hasPath) {
            pathLength = shortestPath.length;
            pathCost = shortestPath.reduce((acc, curr) => acc + curr.weight, 0);
            if (algo === 'DIJKSTRA') {
              optimalPathCost = pathCost;
            }
          }

          // Memory estimate: estimated number of nodes loaded in memory * node size (approx 0.15KB)
          const memoryEstimate = visitedNodesCount * 0.15 + (hasPath ? pathLength * 0.12 : 0);

          comparisonResults.push({
            algorithm: algo,
            name:
              algo === 'ASTAR'
                ? 'A* Search'
                : algo === 'DIJKSTRA'
                ? "Dijkstra's Algorithm"
                : algo === 'BFS'
                ? 'Breadth-First Search'
                : 'Depth-First Search',
            executionTime,
            visitedNodesCount,
            pathLength,
            pathCost,
            memoryEstimate,
            shortestPathFound: hasPath && (algo === 'DIJKSTRA' || algo === 'ASTAR' || algo === 'BFS' || pathCost <= optimalPathCost),
            status: hasPath ? 'SUCCESS' : 'NO_PATH',
          });
        });

        setResults(comparisonResults);
      } catch (err) {
        console.error(err);
      } finally {
        setIsRunning(false);
      }
    }, 100);
  };

  // Find best candidates (only check successful runs)
  const getHighlights = () => {
    if (!results) return { fastest: '', shortest: '', efficient: '' };
    const successList = results.filter(r => r.status === 'SUCCESS');
    if (successList.length === 0) return { fastest: '', shortest: '', efficient: '' };

    let fastest = successList[0];
    let shortest = successList[0];
    let efficient = successList[0];

    successList.forEach(r => {
      if (r.executionTime < fastest.executionTime) fastest = r;
      if (r.pathCost < shortest.pathCost) shortest = r;
      if (r.visitedNodesCount < efficient.visitedNodesCount) efficient = r;
    });

    return {
      fastest: fastest.algorithm,
      shortest: shortest.algorithm,
      efficient: efficient.algorithm,
    };
  };

  const highlights = getHighlights();

  return (
    <div className="glass-panel rounded-2xl p-6 shadow-lg border border-zinc-200/50 dark:border-zinc-800/50 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-base font-bold text-zinc-850 dark:text-zinc-150">
            Algorithm Comparison Dashboard
          </h3>
          <p className="text-xs text-zinc-500 dark:text-zinc-400">
            Compare performance metrics of all pathfinders on the current map layout.
          </p>
        </div>
        
        <div className="flex gap-2">
          <button
            onClick={runComparison}
            disabled={isRunning}
            className="px-4 py-2 text-xs font-bold rounded-xl bg-blue-600 hover:bg-blue-700 text-white shadow-sm flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Play className="w-3.5 h-3.5 fill-white" />
            <span>{isRunning ? 'Benchmarking...' : 'Run Benchmark'}</span>
          </button>

          {results && (
            <div className="flex gap-1">
              <button
                onClick={() => onExportComparison('JSON', results)}
                className="p-2 rounded-xl border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-850 text-zinc-650 dark:text-zinc-350 transition-colors cursor-pointer"
                title="Export as JSON"
              >
                <Download className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>

      {isRunning && (
        <div className="space-y-3 py-6">
          <div className="h-4 bg-zinc-100 dark:bg-zinc-800 animate-pulse rounded-md w-full"></div>
          <div className="h-4 bg-zinc-100 dark:bg-zinc-800 animate-pulse rounded-md w-5/6"></div>
          <div className="h-4 bg-zinc-100 dark:bg-zinc-800 animate-pulse rounded-md w-4/5"></div>
        </div>
      )}

      {!isRunning && !results && (
        <div className="flex flex-col items-center justify-center py-8 text-center bg-zinc-50/50 dark:bg-zinc-900/10 rounded-2xl border border-dashed border-zinc-200 dark:border-zinc-850">
          <AlertCircle className="w-8 h-8 text-zinc-450 dark:text-zinc-600 mb-2" />
          <h4 className="text-xs font-bold text-zinc-750 dark:text-zinc-300">Ready to Benchmark</h4>
          <p className="text-[11px] text-zinc-500 max-w-[250px] mt-0.5">
            Click Run Benchmark to compare speed, paths, and memory.
          </p>
        </div>
      )}

      {results && !isRunning && (
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left border-collapse">
            <thead>
              <tr className="border-b border-zinc-200 dark:border-zinc-800 text-[10px] uppercase text-zinc-450">
                <th className="py-2.5 px-3">Algorithm</th>
                <th className="py-2.5 px-3 text-right">Time (ms)</th>
                <th className="py-2.5 px-3 text-right">Visited Nodes</th>
                <th className="py-2.5 px-3 text-right">Route Cost</th>
                <th className="py-2.5 px-3 text-right">Est. Memory</th>
                <th className="py-2.5 px-3 text-center">Shortest Path?</th>
              </tr>
            </thead>
            <tbody>
              {results.map(r => (
                <tr
                  key={r.algorithm}
                  className="border-b border-zinc-100 dark:border-zinc-850 hover:bg-zinc-50 dark:hover:bg-zinc-800/10"
                >
                  <td className="py-3 px-3 font-semibold text-zinc-800 dark:text-zinc-250">
                    {r.name}
                  </td>
                  <td className="py-3 px-3 text-right font-mono">
                    <span
                      className={`px-1.5 py-0.5 rounded ${
                        highlights.fastest === r.algorithm
                          ? 'bg-green-150 text-green-700 dark:bg-green-950/40 dark:text-green-400 font-bold'
                          : 'text-zinc-600 dark:text-zinc-400'
                      }`}
                    >
                      {r.executionTime.toFixed(2)} ms
                    </span>
                  </td>
                  <td className="py-3 px-3 text-right font-mono">
                    <span
                      className={`px-1.5 py-0.5 rounded ${
                        highlights.efficient === r.algorithm
                          ? 'bg-purple-100 text-purple-700 dark:bg-purple-950/30 dark:text-purple-400 font-bold'
                          : 'text-zinc-600 dark:text-zinc-400'
                      }`}
                    >
                      {r.visitedNodesCount}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-right font-mono">
                    <span
                      className={`px-1.5 py-0.5 rounded ${
                        highlights.shortest === r.algorithm
                          ? 'bg-blue-100 text-blue-700 dark:bg-blue-950/30 dark:text-blue-400 font-bold'
                          : 'text-zinc-600 dark:text-zinc-400'
                      }`}
                    >
                      {r.status === 'NO_PATH' ? '-' : r.pathCost}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-right font-mono text-zinc-500 dark:text-zinc-450">
                    {r.memoryEstimate.toFixed(1)} KB
                  </td>
                  <td className="py-3 px-3 text-center">
                    {r.status === 'NO_PATH' ? (
                      <span className="text-red-500">No Path</span>
                    ) : r.shortestPathFound ? (
                      <Check className="w-4 h-4 text-green-500 mx-auto" />
                    ) : (
                      <span className="text-zinc-450 text-[10px]">Suboptimal</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
