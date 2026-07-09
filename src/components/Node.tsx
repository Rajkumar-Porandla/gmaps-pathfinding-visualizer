import React from 'react';
import { MapPin, Navigation, Construction, Flame } from 'lucide-react';
import type { GridNode } from '../algorithms/types';

interface NodeProps {
  node: GridNode;
  onMouseDown: (row: number, col: number) => void;
  onMouseEnter: (row: number, col: number) => void;
  onMouseUp: () => void;
  onKeyDown?: (e: React.KeyboardEvent, row: number, col: number) => void;
}

export const Node: React.FC<NodeProps> = React.memo(({
  node,
  onMouseDown,
  onMouseEnter,
  onMouseUp,
  onKeyDown,
}) => {
  const { row, col, isStart, isEnd, isWall, weight, isVisited, isShortestPath } = node;

  // Decide class names based on state
  let extraClassName = '';
  let ariaLabel = `Grid cell at row ${row + 1}, column ${col + 1}`;

  if (isStart) {
    extraClassName = 'bg-white dark:bg-zinc-800 z-10';
    ariaLabel = 'Start node. Drag to relocate.';
  } else if (isEnd) {
    extraClassName = 'bg-white dark:bg-zinc-800 z-10';
    ariaLabel = 'Destination node. Drag to relocate.';
  } else if (isWall) {
    extraClassName = 'bg-zinc-700 dark:bg-zinc-900 border-zinc-700 dark:border-zinc-900 scale-95 transition-all duration-200';
    ariaLabel = `Roadblock wall at row ${row + 1}, column ${col + 1}. Press to remove.`;
  } else if (weight > 1) {
    extraClassName = 'bg-amber-100 dark:bg-amber-950/40 border-amber-300 dark:border-amber-900/50';
    ariaLabel = `Heavy traffic delay node at row ${row + 1}, column ${col + 1}. Cost is 5x.`;
  } else if (isShortestPath) {
    extraClassName = 'node-shortest-path border-blue-400 dark:border-blue-300';
    ariaLabel = `Path block at row ${row + 1}, column ${col + 1}. Part of computed route.`;
  } else if (isVisited) {
    extraClassName = 'node-visited';
    ariaLabel = `Evaluated node at row ${row + 1}, column ${col + 1}.`;
  } else {
    extraClassName = 'bg-white dark:bg-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-750/30';
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (onKeyDown) {
      onKeyDown(e, row, col);
    }
  };

  return (
    <div
      id={`node-${row}-${col}`}
      className={`node-container w-full aspect-square border border-zinc-100 dark:border-zinc-800/40 flex items-center justify-center cursor-pointer select-none transition-colors duration-150 relative focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-1 dark:focus-visible:ring-offset-zinc-900 ${extraClassName}`}
      onMouseDown={() => onMouseDown(row, col)}
      onMouseEnter={() => onMouseEnter(row, col)}
      onMouseUp={onMouseUp}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="gridcell"
      aria-label={ariaLabel}
      style={{ contain: 'layout style paint' }}
    >
      {/* Visual content for Start/End/Wall/Weight nodes */}
      {isStart && (
        <div className="absolute inset-0 flex items-center justify-center p-0.5 animate-pulse">
          <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center">
            <Navigation className="w-5 h-5 text-blue-600 fill-blue-600 rotate-45 transform translate-x-px -translate-y-px" />
          </div>
        </div>
      )}

      {isEnd && (
        <div className="absolute inset-0 flex items-center justify-center p-0.5">
          <MapPin className="w-6 h-6 text-red-500 fill-red-500 animate-bounce" />
        </div>
      )}

      {isWall && !isStart && !isEnd && (
        <Construction className="w-4 h-4 text-zinc-400 dark:text-zinc-500 opacity-60" />
      )}

      {weight > 1 && !isStart && !isEnd && !isWall && (
        <div className="flex flex-col items-center justify-center text-amber-500 dark:text-amber-400">
          <Flame className="w-4 h-4 fill-amber-500/20" />
          <span className="text-[8px] font-bold leading-none mt-0.5">5x</span>
        </div>
      )}
    </div>
  );
}, (prevProps, nextProps) => {
  return (
    prevProps.node.isStart === nextProps.node.isStart &&
    prevProps.node.isEnd === nextProps.node.isEnd &&
    prevProps.node.isWall === nextProps.node.isWall &&
    prevProps.node.weight === nextProps.node.weight &&
    prevProps.node.isVisited === nextProps.node.isVisited &&
    prevProps.node.isShortestPath === nextProps.node.isShortestPath
  );
});

Node.displayName = 'Node';
