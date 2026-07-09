import React from 'react';
import type { AlgorithmType } from '../algorithms/types';
import { ALGORITHM_DETAILS } from '../algorithms/types';
import { Info, Code, CheckCircle, AlertTriangle, Briefcase } from 'lucide-react';

interface InfoPanelProps {
  algorithm: AlgorithmType;
}

export const InfoPanel: React.FC<InfoPanelProps> = ({ algorithm }) => {
  const details = ALGORITHM_DETAILS[algorithm];

  return (
    <div className="glass-panel rounded-2xl p-6 shadow-lg border border-zinc-200/50 dark:border-zinc-800/50 space-y-5">
      {/* Header Info */}
      <div>
        <div className="flex items-center gap-2 text-xs font-semibold text-blue-500 bg-blue-50 dark:bg-blue-900/30 px-3 py-1 rounded-full w-fit mb-3">
          <Info className="w-3.5 h-3.5" />
          <span>Technical Reference</span>
        </div>
        <h3 className="text-lg font-bold text-zinc-850 dark:text-zinc-100">{details.name}</h3>
        <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1 leading-relaxed">
          {details.description}
        </p>
      </div>

      {/* Grid Properties */}
      <div className="grid grid-cols-2 gap-3 text-xs border-y border-zinc-250/50 dark:border-zinc-800/40 py-4">
        <div>
          <span className="text-zinc-400">Data Structure:</span>
          <p className="font-bold text-zinc-750 dark:text-zinc-200 mt-0.5">{details.dataStructure}</p>
        </div>
        <div>
          <span className="text-zinc-400">Heuristic:</span>
          <p className="font-bold text-zinc-750 dark:text-zinc-200 mt-0.5">{details.heuristic}</p>
        </div>
        <div>
          <span className="text-zinc-400">Guarantees Shortest Path?</span>
          <p className={`font-bold mt-0.5 ${details.shortestPath ? 'text-green-500' : 'text-red-500'}`}>
            {details.shortestPath ? 'Yes' : 'No'}
          </p>
        </div>
        <div>
          <span className="text-zinc-400">Weighted Graph Support?</span>
          <p className={`font-bold mt-0.5 ${details.weighted ? 'text-green-500' : 'text-red-500'}`}>
            {details.weighted ? 'Yes' : 'No'}
          </p>
        </div>
      </div>

      {/* Complexities */}
      <div className="space-y-2">
        <h4 className="text-xs font-bold text-zinc-500 dark:text-zinc-400 flex items-center gap-1.5">
          <Code className="w-3.5 h-3.5 text-purple-500" />
          Algorithmic Complexity
        </h4>
        <div className="grid grid-cols-4 gap-2 text-[10px] text-center font-mono">
          <div className="bg-zinc-50 dark:bg-zinc-800/30 p-2 rounded-lg">
            <span className="text-zinc-400 block mb-0.5">Best Case</span>
            <span className="font-bold text-zinc-750 dark:text-zinc-250">{details.complexity.best}</span>
          </div>
          <div className="bg-zinc-50 dark:bg-zinc-800/30 p-2 rounded-lg">
            <span className="text-zinc-400 block mb-0.5">Average</span>
            <span className="font-bold text-zinc-750 dark:text-zinc-250">{details.complexity.avg}</span>
          </div>
          <div className="bg-zinc-50 dark:bg-zinc-800/30 p-2 rounded-lg">
            <span className="text-zinc-400 block mb-0.5">Worst Case</span>
            <span className="font-bold text-zinc-750 dark:text-zinc-250">{details.complexity.worst}</span>
          </div>
          <div className="bg-zinc-50 dark:bg-zinc-800/30 p-2 rounded-lg">
            <span className="text-zinc-400 block mb-0.5">Space</span>
            <span className="font-bold text-zinc-750 dark:text-zinc-250">{details.complexity.space}</span>
          </div>
        </div>
      </div>

      {/* Advantages vs Disadvantages */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
        <div className="space-y-1.5">
          <h4 className="font-bold text-green-600 dark:text-green-400 flex items-center gap-1">
            <CheckCircle className="w-3.5 h-3.5" />
            Advantages
          </h4>
          <ul className="list-disc pl-4 space-y-1 text-zinc-500 dark:text-zinc-400 text-[11px] leading-tight">
            {details.advantages.map((adv, idx) => (
              <li key={idx}>{adv}</li>
            ))}
          </ul>
        </div>
        <div className="space-y-1.5">
          <h4 className="font-bold text-red-500 dark:text-red-400 flex items-center gap-1">
            <AlertTriangle className="w-3.5 h-3.5" />
            Disadvantages
          </h4>
          <ul className="list-disc pl-4 space-y-1 text-zinc-500 dark:text-zinc-400 text-[11px] leading-tight">
            {details.disadvantages.map((dis, idx) => (
              <li key={idx}>{dis}</li>
            ))}
          </ul>
        </div>
      </div>

      {/* Applications */}
      <div className="space-y-1.5 text-xs">
        <h4 className="font-bold text-zinc-700 dark:text-zinc-300 flex items-center gap-1.5">
          <Briefcase className="w-3.5 h-3.5 text-orange-500" />
          Real-World Applications
        </h4>
        <div className="flex flex-wrap gap-1.5">
          {details.applications.map((app, idx) => (
            <span
              key={idx}
              className="text-[10px] bg-zinc-100 dark:bg-zinc-800 text-zinc-650 dark:text-zinc-350 px-2 py-1 rounded-md"
            >
              {app}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};
