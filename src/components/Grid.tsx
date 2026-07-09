import React, { useRef } from 'react';
import type { GridNode } from '../algorithms/types';
import { Node } from './Node';

interface GridProps {
  grid: GridNode[][];
  onNodeMouseDown: (row: number, col: number) => void;
  onNodeMouseEnter: (row: number, col: number) => void;
  onNodeMouseUp: () => void;
  onNodeKeyDown?: (e: React.KeyboardEvent, row: number, col: number) => void;
  isAnimating: boolean;
}

export const Grid: React.FC<GridProps> = ({
  grid,
  onNodeMouseDown,
  onNodeMouseEnter,
  onNodeMouseUp,
  onNodeKeyDown,
  isAnimating,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  const handleDragStart = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const rows = grid.length;
  const cols = grid[0]?.length || 0;

  return (
    <div
      ref={containerRef}
      onDragStart={handleDragStart}
      className={`glass-panel p-4 rounded-2xl shadow-lg border border-zinc-200/50 dark:border-zinc-800/50 overflow-auto max-w-full flex items-center justify-center ${
        isAnimating ? 'pointer-events-none opacity-90' : ''
      }`}
      role="grid"
      aria-label="Pathfinding Navigation Grid"
      aria-readonly="true"
      aria-rowcount={rows}
      aria-colcount={cols}
    >
      <div
        className="grid select-none bg-zinc-100 dark:bg-zinc-900"
        style={{
          gridTemplateRows: `repeat(${rows}, minmax(0, 1fr))`,
          gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`,
          width: 'max-content',
          maxWidth: '100%',
          gap: '1px',
        }}
      >
        {grid.map((row, rowIndex) => (
          <div key={rowIndex} role="row" className="contents">
            {row.map((node, colIndex) => (
              <Node
                key={`${rowIndex}-${colIndex}`}
                node={node}
                onMouseDown={onNodeMouseDown}
                onMouseEnter={onNodeMouseEnter}
                onMouseUp={onNodeMouseUp}
                onKeyDown={onNodeKeyDown}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};
