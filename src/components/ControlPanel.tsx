import React, { useRef } from 'react';
import {
  Play,
  Pause,
  Square,
  RefreshCw,
  RotateCcw,
  Trash2,
  MapPin,
  Sparkles,
  Layers,
  Sliders,
  Download,
  Upload,
  Cpu,
  BarChart3,
  HelpCircle,
} from 'lucide-react';
import type { AlgorithmType, MazeType, SpeedType } from '../algorithms/types';

interface ControlPanelProps {
  algorithm: AlgorithmType;
  setAlgorithm: (algo: AlgorithmType) => void;
  maze: MazeType;
  setMaze: (maze: MazeType) => void;
  speed: SpeedType;
  setSpeed: (speed: SpeedType) => void;
  isAnimating: boolean;
  isPaused: boolean;
  drawMode: 'WALL' | 'WEIGHT';
  setDrawMode: (mode: 'WALL' | 'WEIGHT') => void;
  onRun: () => void;
  onPause: () => void;
  onStop: () => void;
  onRestart: () => void;
  onReset: () => void;
  onGenerateMaze: () => void;
  onClearPath: () => void;
  onClearWalls: () => void;

  // New Feature integration
  gridSize: string;
  setGridSize: (size: string) => void;
  onSaveMaze: () => void;
  onLoadMaze: (e: React.ChangeEvent<HTMLInputElement>) => void;
  isVivaEnabled: boolean;
  setVivaEnabled: (enabled: boolean) => void;
  isComparisonEnabled: boolean;
  setComparisonEnabled: (enabled: boolean) => void;
  onOpenTutorial: () => void;
}

export const ControlPanel: React.FC<ControlPanelProps> = ({
  algorithm,
  setAlgorithm,
  maze,
  setMaze,
  speed,
  setSpeed,
  isAnimating,
  isPaused,
  drawMode,
  setDrawMode,
  onRun,
  onPause,
  onStop,
  onRestart,
  onReset,
  onGenerateMaze,
  onClearPath,
  onClearWalls,
  gridSize,
  setGridSize,
  onSaveMaze,
  onLoadMaze,
  isVivaEnabled,
  setVivaEnabled,
  isComparisonEnabled,
  setComparisonEnabled,
  onOpenTutorial,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="glass-panel rounded-2xl p-6 shadow-lg border border-zinc-200/50 dark:border-zinc-800/50 space-y-5">
      {/* Tutorial & Onboarding Header link */}
      <div className="flex justify-between items-center pb-2 border-b border-zinc-200/50 dark:border-zinc-800/40">
        <span className="text-xs font-extrabold text-zinc-550 dark:text-zinc-400">visualizer options</span>
        <button
          onClick={onOpenTutorial}
          className="text-xs font-bold text-blue-500 hover:text-blue-600 flex items-center gap-1 cursor-pointer"
        >
          <HelpCircle className="w-3.5 h-3.5" />
          Guide
        </button>
      </div>

      {/* Select Algorithm */}
      <div className="space-y-1.5">
        <label className="text-xs font-bold text-zinc-500 dark:text-zinc-400 flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-blue-500" />
          Navigation Engine
        </label>
        <div className="grid grid-cols-2 gap-1.5">
          {(['ASTAR', 'DIJKSTRA', 'BFS', 'DFS'] as AlgorithmType[]).map(algo => (
            <button
              key={algo}
              disabled={isAnimating && !isPaused}
              onClick={() => setAlgorithm(algo)}
              className={`px-3 py-2 text-xs font-bold rounded-xl border text-center transition-all cursor-pointer ${
                algorithm === algo
                  ? 'bg-blue-500 border-blue-500 text-white shadow-md shadow-blue-500/25'
                  : 'bg-zinc-50 dark:bg-zinc-800/40 border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800'
              }`}
            >
              {algo === 'ASTAR' ? 'A* Search' : algo === 'DIJKSTRA' ? 'Dijkstra' : algo}
            </button>
          ))}
        </div>
      </div>

      {/* Draw Mode Tool */}
      <div className="space-y-1.5">
        <label className="text-xs font-bold text-zinc-500 dark:text-zinc-400 flex items-center gap-1.5">
          <Layers className="w-3.5 h-3.5 text-orange-500" />
          Grid Marker Tool
        </label>
        <div className="grid grid-cols-2 gap-1.5">
          <button
            disabled={isAnimating && !isPaused}
            onClick={() => setDrawMode('WALL')}
            className={`px-3 py-2 text-xs font-bold rounded-xl border text-center transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              drawMode === 'WALL'
                ? 'bg-zinc-750 border-zinc-750 dark:bg-zinc-100 dark:border-zinc-100 text-white dark:text-zinc-900 shadow-sm'
                : 'bg-zinc-50 dark:bg-zinc-800/40 border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800'
            }`}
          >
            <span>Roadblock (Wall)</span>
          </button>
          <button
            disabled={isAnimating && !isPaused}
            onClick={() => setDrawMode('WEIGHT')}
            className={`px-3 py-2 text-xs font-bold rounded-xl border text-center transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              drawMode === 'WEIGHT'
                ? 'bg-amber-500 border-amber-500 text-white shadow-sm'
                : 'bg-zinc-50 dark:bg-zinc-800/40 border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800'
            }`}
          >
            <span>Traffic (5x Cost)</span>
          </button>
        </div>
      </div>

      {/* Grid Settings & Terrains */}
      <div className="space-y-1.5">
        <label className="text-xs font-bold text-zinc-500 dark:text-zinc-400 flex items-center gap-1.5">
          <MapPin className="w-3.5 h-3.5 text-green-500" />
          Map Settings
        </label>
        
        {/* Dynamic Grid size */}
        <div className="grid grid-cols-2 gap-1.5">
          <div className="flex flex-col gap-1">
            <span className="text-[9px] font-bold text-zinc-400">GRID SIZE</span>
            <select
              disabled={isAnimating}
              value={gridSize}
              onChange={e => setGridSize(e.target.value)}
              className="px-2.5 py-1.5 text-xs font-bold rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800/40 text-zinc-700 dark:text-zinc-300 focus:outline-none cursor-pointer"
            >
              <option value="20x20">20 x 20</option>
              <option value="25x25">25 x 25</option>
              <option value="30x30">30 x 30</option>
              <option value="40x25">40 x 25</option>
              <option value="50x30">50 x 30</option>
              <option value="60x40">60 x 40</option>
            </select>
          </div>

          <div className="flex flex-col gap-1">
            <span className="text-[9px] font-bold text-zinc-400">TERRAIN MAZE</span>
            <select
              disabled={isAnimating}
              value={maze}
              onChange={e => setMaze(e.target.value as MazeType)}
              className="px-2.5 py-1.5 text-xs font-bold rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800/40 text-zinc-700 dark:text-zinc-300 focus:outline-none cursor-pointer"
            >
              <option value="RECURSIVE_DIVISION">Recursive Division</option>
              <option value="RANDOM_WALLS">Random Roadblocks</option>
              <option value="RANDOM_WEIGHTS">Random Traffic Jams</option>
            </select>
          </div>
        </div>

        <button
          disabled={isAnimating}
          onClick={onGenerateMaze}
          className="w-full py-2 text-xs font-bold bg-green-600 hover:bg-green-700 text-white rounded-xl shadow-sm transition-colors cursor-pointer"
        >
          Generate Map Terrain
        </button>
      </div>

      {/* Speed Slider */}
      <div className="space-y-1.5">
        <div className="flex justify-between text-xs font-bold text-zinc-500 dark:text-zinc-400">
          <span className="flex items-center gap-1.5">
            <Sliders className="w-3.5 h-3.5 text-purple-500" />
            Route Speed
          </span>
          <span className="text-zinc-650 dark:text-zinc-300">{speed}</span>
        </div>
        <select
          value={speed}
          onChange={e => setSpeed(e.target.value as SpeedType)}
          className="w-full px-3 py-2 text-xs font-bold rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800/40 text-zinc-700 dark:text-zinc-300 focus:outline-none cursor-pointer"
        >
          <option value="VERY_SLOW">Very Slow (150ms)</option>
          <option value="SLOW">Slow (75ms)</option>
          <option value="NORMAL">Normal (30ms)</option>
          <option value="FAST">Fast (10ms)</option>
          <option value="VERY_FAST">Very Fast (2ms)</option>
          <option value="INSTANT">Instant (0ms)</option>
        </select>
      </div>

      {/* Interactive Options - Viva & Comparison dashboard */}
      <div className="grid grid-cols-2 gap-1.5 border-t border-zinc-200/50 dark:border-zinc-850 pt-3">
        <button
          onClick={() => setVivaEnabled(!isVivaEnabled)}
          className={`py-2 px-2 text-[10px] font-extrabold rounded-xl border text-center flex items-center justify-center gap-1 transition-colors cursor-pointer ${
            isVivaEnabled
              ? 'bg-green-50 border-green-300 text-green-700 dark:bg-green-950/20 dark:border-green-900/40 dark:text-green-400'
              : 'bg-zinc-50 dark:bg-zinc-800/40 border-zinc-200 dark:border-zinc-800 text-zinc-650 dark:text-zinc-300 hover:bg-zinc-100'
          }`}
        >
          <Cpu className="w-3.5 h-3.5" />
          <span>Viva Mode</span>
        </button>

        <button
          onClick={() => setComparisonEnabled(!isComparisonEnabled)}
          className={`py-2 px-2 text-[10px] font-extrabold rounded-xl border text-center flex items-center justify-center gap-1 transition-colors cursor-pointer ${
            isComparisonEnabled
              ? 'bg-purple-50 border-purple-300 text-purple-700 dark:bg-purple-950/20 dark:border-purple-900/40 dark:text-purple-400'
              : 'bg-zinc-50 dark:bg-zinc-800/40 border-zinc-200 dark:border-zinc-800 text-zinc-650 dark:text-zinc-300 hover:bg-zinc-100'
          }`}
        >
          <BarChart3 className="w-3.5 h-3.5" />
          <span>Compare Mode</span>
        </button>
      </div>

      {/* Save & Load files */}
      <div className="grid grid-cols-2 gap-1.5">
        <button
          disabled={isAnimating && !isPaused}
          onClick={onSaveMaze}
          className="py-2 px-2 text-[10px] font-bold rounded-xl border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-650 dark:text-zinc-350 flex items-center justify-center gap-1 cursor-pointer"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Save Map</span>
        </button>

        <button
          disabled={isAnimating && !isPaused}
          onClick={triggerFileInput}
          className="py-2 px-2 text-[10px] font-bold rounded-xl border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-650 dark:text-zinc-350 flex items-center justify-center gap-1 cursor-pointer"
        >
          <Upload className="w-3.5 h-3.5" />
          <span>Load Map</span>
        </button>
        <input
          type="file"
          ref={fileInputRef}
          onChange={onLoadMaze}
          accept=".json"
          className="hidden"
        />
      </div>

      {/* Playback & Reset Controller */}
      <div className="pt-3 border-t border-zinc-200/50 dark:border-zinc-850 space-y-2">
        <div className="flex gap-1.5">
          {!isAnimating || isPaused ? (
            <button
              onClick={onRun}
              className="flex-1 py-2.5 px-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs shadow-md shadow-blue-500/10 flex items-center justify-center gap-1.5 transition-all cursor-pointer animate-pulse-slow"
            >
              <Play className="w-3.5 h-3.5 fill-white" />
              <span>{isPaused ? 'Resume' : 'Navigate'}</span>
            </button>
          ) : (
            <button
              onClick={onPause}
              className="flex-1 py-2.5 px-3 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-extrabold text-xs shadow-md shadow-amber-500/10 flex items-center justify-center gap-1.5 transition-all cursor-pointer"
            >
              <Pause className="w-3.5 h-3.5 fill-white" />
              <span>Pause</span>
            </button>
          )}

          {isAnimating && (
            <>
              <button
                onClick={onStop}
                className="p-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-950/20 text-zinc-600 dark:text-zinc-400 transition-colors shadow-sm cursor-pointer"
                title="Stop Animation"
              >
                <Square className="w-3.5 h-3.5 fill-current" />
              </button>
              <button
                onClick={onRestart}
                className="p-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 hover:bg-blue-50 hover:text-blue-500 dark:hover:bg-blue-950/20 text-zinc-600 dark:text-zinc-400 transition-colors shadow-sm cursor-pointer"
                title="Restart Animation"
              >
                <RefreshCw className="w-3.5 h-3.5" />
              </button>
            </>
          )}

          <button
            onClick={onReset}
            className="p-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-650 dark:text-zinc-450 transition-colors shadow-sm cursor-pointer"
            title="Reset Grid Map"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-2 gap-1.5">
          <button
            disabled={isAnimating && !isPaused}
            onClick={onClearPath}
            className="py-2 px-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-650 dark:text-zinc-400 font-bold text-[10px] transition-colors flex items-center justify-center gap-1 cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear Route</span>
          </button>
          <button
            disabled={isAnimating && !isPaused}
            onClick={onClearWalls}
            className="py-2 px-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-650 dark:text-zinc-400 font-bold text-[10px] transition-colors flex items-center justify-center gap-1 cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear Obstacles</span>
          </button>
        </div>
      </div>
    </div>
  );
};
