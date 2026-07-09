import React from 'react';
import type { VivaSnapshot, AlgorithmType } from '../algorithms/types';
import { Cpu, Columns, ArrowRight, CornerDownRight } from 'lucide-react';

interface VivaPanelProps {
  snapshot: VivaSnapshot | null;
  algorithm: AlgorithmType;
  isVivaEnabled: boolean;
  setVivaEnabled: (enabled: boolean) => void;
}

export const VivaPanel: React.FC<VivaPanelProps> = ({
  snapshot,
  algorithm,
  isVivaEnabled,
  setVivaEnabled,
}) => {
  if (!isVivaEnabled) {
    return (
      <div className="glass-panel rounded-2xl p-5 shadow-md border border-zinc-200/50 dark:border-zinc-800/40 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Cpu className="w-5 h-5 text-green-500 animate-pulse" />
          <div>
            <h4 className="font-bold text-sm text-zinc-850 dark:text-zinc-150">
              Enable Viva Mode
            </h4>
            <p className="text-[10px] text-zinc-500">
              Interactive inspector for data structures (Queue/Stack/Heap).
            </p>
          </div>
        </div>
        <button
          onClick={() => setVivaEnabled(true)}
          className="px-3.5 py-1.5 text-xs font-bold bg-green-600 hover:bg-green-700 text-white rounded-xl shadow-sm transition-colors cursor-pointer"
        >
          Enable
        </button>
      </div>
    );
  }

  const openSetLimit = 15;
  const slicedOpenSet = snapshot?.openSet.slice(0, openSetLimit) || [];
  const excessCount = (snapshot?.openSet.length || 0) - openSetLimit;

  return (
    <div className="glass-panel rounded-2xl p-6 shadow-lg border border-green-200 dark:border-green-950/50 bg-green-50/10 space-y-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Cpu className="w-5 h-5 text-green-600 dark:text-green-400" />
          <h4 className="font-extrabold text-sm text-green-750 dark:text-green-400">
            Viva Mode Inspector
          </h4>
        </div>
        <button
          onClick={() => setVivaEnabled(false)}
          className="text-xs font-bold text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-200 cursor-pointer"
        >
          Disable
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
        {/* Node Status */}
        <div className="space-y-3 bg-zinc-50 dark:bg-zinc-800/20 p-3 rounded-xl border border-zinc-200/40 dark:border-zinc-850">
          <div>
            <span className="text-zinc-500 dark:text-zinc-300 block text-[10px] uppercase font-bold">Active Pathfinder</span>
            <span className="font-extrabold text-zinc-800 dark:text-zinc-100">{algorithm}</span>
          </div>

          <div className="flex items-center gap-4">
            <div>
              <span className="text-zinc-500 dark:text-zinc-300 block text-[10px] uppercase font-bold">Current Node</span>
              {snapshot?.currentNode ? (
                <span className="font-mono font-extrabold text-zinc-800 dark:text-zinc-100">
                  Node ({snapshot.currentNode.row}, {snapshot.currentNode.col})
                </span>
              ) : (
                <span className="text-zinc-450 font-mono">-</span>
              )}
            </div>
            {snapshot?.parentNode && (
              <div className="flex items-center gap-1">
                <ArrowRight className="w-3.5 h-3.5 text-zinc-400" />
                <div>
                  <span className="text-zinc-500 dark:text-zinc-300 block text-[10px] uppercase font-bold">Parent</span>
                  <span className="font-mono font-extrabold text-zinc-800 dark:text-zinc-100">
                    ({snapshot.parentNode.row}, {snapshot.parentNode.col})
                  </span>
                </div>
              </div>
            )}
          </div>

          <div className="grid grid-cols-3 gap-2 border-t border-zinc-200/50 dark:border-zinc-850 pt-2 font-mono text-[10px]">
            <div>
              <span className="text-zinc-500 dark:text-zinc-300 block font-bold">Distance (g)</span>
              <p className="font-extrabold text-zinc-800 dark:text-zinc-100 text-xs mt-0.5">
                {snapshot?.currentNode?.distance !== undefined && snapshot.currentNode.distance !== Infinity
                  ? snapshot.currentNode.distance
                  : '-'}
              </p>
            </div>
            <div>
              <span className="text-zinc-500 dark:text-zinc-300 block font-bold">Heuristic (h)</span>
              <p className="font-extrabold text-zinc-800 dark:text-zinc-100 text-xs mt-0.5">
                {snapshot?.currentNode?.heuristicDistance !== undefined
                  ? snapshot.currentNode.heuristicDistance
                  : '-'}
              </p>
            </div>
            <div>
              <span className="text-zinc-500 dark:text-zinc-300 block font-bold">Total (f)</span>
              <p className="font-extrabold text-green-600 dark:text-green-400 text-xs mt-0.5">
                {snapshot?.currentNode?.totalDistance !== undefined && snapshot.currentNode.totalDistance !== Infinity
                  ? snapshot.currentNode.totalDistance
                  : '-'}
              </p>
            </div>
          </div>
        </div>

        {/* Data Structure Contents */}
        <div className="space-y-2 flex flex-col justify-between">
          <div>
            <span className="text-zinc-500 dark:text-zinc-300 block text-[10px] uppercase flex items-center gap-1 mb-1 font-bold">
              <Columns className="w-3 h-3 text-purple-500" />
              Active Buffer / Heap Items ({snapshot?.openSet.length || 0})
            </span>
            
            {slicedOpenSet.length > 0 ? (
              <div className="flex flex-wrap gap-1 max-h-[85px] overflow-y-auto p-1.5 bg-zinc-50 dark:bg-zinc-800/20 rounded-lg border border-zinc-200/30 dark:border-zinc-850">
                {slicedOpenSet.map((node, idx) => (
                  <span
                    key={idx}
                    className="text-[9px] font-mono bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-800/80 px-1.5 py-0.5 rounded text-zinc-800 dark:text-zinc-200 font-semibold"
                  >
                    ({node.row},{node.col})
                    {node.totalDistance > 0 && ` f:${node.totalDistance}`}
                  </span>
                ))}
                {excessCount > 0 && (
                  <span className="text-[9px] font-mono text-zinc-400 px-1.5 py-0.5">
                    +{excessCount} more
                  </span>
                )}
              </div>
            ) : (
              <div className="text-[10px] text-zinc-400 italic py-3 text-center border border-dashed border-zinc-200 dark:border-zinc-850 rounded-lg">
                Empty (Idle state)
              </div>
            )}
          </div>

          <div className="flex gap-2 text-[10px] text-zinc-500 dark:text-zinc-400">
            <CornerDownRight className="w-3.5 h-3.5 text-green-500 shrink-0" />
            <span>
              Queue is FIFO (BFS), Stack is LIFO (DFS), and Heap is sorted by lowest f-score (Dijkstra/A*).
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
