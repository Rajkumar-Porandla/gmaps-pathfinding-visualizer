import React from 'react';
import { Timer, Compass, Route, BarChart4, AlertTriangle, Layers, Activity } from 'lucide-react';
import type { AlgorithmStats } from '../algorithms/types';

interface StatsPanelProps {
  stats: AlgorithmStats | null;
  algorithmName: string;
}

export const StatsPanel: React.FC<StatsPanelProps> = ({ stats, algorithmName }) => {
  if (!stats) {
    return (
      <div className="glass-panel rounded-2xl p-6 shadow-lg flex flex-col items-center justify-center text-center h-full border border-zinc-200/50 dark:border-zinc-800/50 min-h-[220px]">
        <Compass className="w-10 h-10 text-zinc-400 dark:text-zinc-600 animate-spin-slow mb-3" style={{ animationDuration: '10s' }} />
        <h3 className="font-extrabold text-xs text-zinc-700 dark:text-zinc-350 uppercase tracking-wider">
          Telemetry Ready
        </h3>
        <p className="text-[10px] text-zinc-400 max-w-[200px] mt-1.5 leading-relaxed">
          Configure start/end locations and select <b>Navigate</b> to capture path metrics.
        </p>
      </div>
    );
  }

  return (
    <div className="glass-panel rounded-2xl p-6 shadow-lg border border-zinc-200/50 dark:border-zinc-800/50 space-y-4">
      {/* Title & Exploration Percentage block */}
      <div className="flex items-center justify-between">
        <div>
          <span className="text-[9px] font-extrabold px-2 py-0.5 rounded-md bg-blue-100 dark:bg-blue-900/35 text-blue-600 dark:text-blue-400 uppercase tracking-wider">
            Live Telemetry
          </span>
          <h3 className="text-sm font-extrabold text-zinc-850 dark:text-zinc-150 mt-1">{algorithmName}</h3>
        </div>
        <div className="text-right">
          <span className="text-[10px] text-zinc-400">Map Explored</span>
          <p className="text-xs font-mono font-bold text-blue-500">{stats.explorationRatio.toFixed(1)}%</p>
        </div>
      </div>

      {/* Primary Metrics Grid */}
      <div className="grid grid-cols-3 gap-2.5 pt-3 border-t border-zinc-200/50 dark:border-zinc-850">
        <div className="flex flex-col items-center p-2 rounded-xl bg-zinc-50 dark:bg-zinc-800/25">
          <Timer className="w-4 h-4 text-blue-500 mb-1" />
          <span className="text-[9px] text-zinc-400">CPU Time</span>
          <span className="text-xs font-mono font-extrabold text-zinc-800 dark:text-zinc-200">
            {stats.executionTime.toFixed(2)} ms
          </span>
        </div>

        <div className="flex flex-col items-center p-2 rounded-xl bg-zinc-50 dark:bg-zinc-800/25">
          <Compass className="w-4 h-4 text-amber-500 mb-1" />
          <span className="text-[9px] text-zinc-400">Visited</span>
          <span className="text-xs font-mono font-extrabold text-zinc-800 dark:text-zinc-200">
            {stats.visitedNodesCount}
          </span>
        </div>

        <div className="flex flex-col items-center p-2 rounded-xl bg-zinc-50 dark:bg-zinc-800/25">
          <Route className="w-4 h-4 text-green-500 mb-1" />
          <span className="text-[9px] text-zinc-400">Path Cost</span>
          <span className="text-xs font-mono font-extrabold text-zinc-800 dark:text-zinc-200">
            {stats.pathCost}
          </span>
        </div>
      </div>

      {/* Advanced Performance & Grid Details */}
      <div className="space-y-2 pt-3 border-t border-zinc-200/50 dark:border-zinc-850 text-[10px] text-zinc-500 dark:text-zinc-400">
        <div className="flex justify-between items-center">
          <span className="flex items-center gap-1">
            <BarChart4 className="w-3.5 h-3.5 text-zinc-400" />
            Expanded Nodes
          </span>
          <span className="font-mono font-bold text-zinc-700 dark:text-zinc-300">{stats.expandedNodesCount}</span>
        </div>

        <div className="flex justify-between items-center">
          <span className="flex items-center gap-1">
            <Activity className="w-3.5 h-3.5 text-purple-400" />
            Animation Duration
          </span>
          <span className="font-mono font-bold text-zinc-700 dark:text-zinc-300">{stats.animationDuration.toFixed(1)}s</span>
        </div>

        <div className="flex justify-between items-center">
          <span className="flex items-center gap-1">
            <Layers className="w-3.5 h-3.5 text-zinc-400" />
            Grid Size
          </span>
          <span className="font-mono font-bold text-zinc-700 dark:text-zinc-300">{stats.gridSize}</span>
        </div>

        <div className="flex justify-between items-center">
          <span className="flex items-center gap-1">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-500/80" />
            Obstacles (Walls / Traffic)
          </span>
          <span className="font-mono font-bold text-zinc-700 dark:text-zinc-300">
            {stats.wallCount} / {stats.weightCount}
          </span>
        </div>

        <div className="flex justify-between items-center">
          <span className="flex items-center gap-1">
            <Layers className="w-3.5 h-3.5 text-zinc-400" />
            RAM overhead (est.)
          </span>
          <span className="font-mono font-bold text-zinc-700 dark:text-zinc-300">
            {stats.memoryEstimate.toFixed(1)} KB
          </span>
        </div>

        <div className="flex justify-between items-center">
          <span className="flex items-center gap-1">
            <Activity className="w-3.5 h-3.5 text-green-500" />
            Frame Rate / Render Latency
          </span>
          <span className="font-mono font-bold text-green-600 dark:text-green-400">
            {stats.renderedFps} FPS / {stats.renderTime.toFixed(1)}ms
          </span>
        </div>
      </div>
    </div>
  );
};
