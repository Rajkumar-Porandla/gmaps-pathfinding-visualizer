import React from 'react';
import { Sun, Moon, Map, Navigation } from 'lucide-react';

interface HeaderProps {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  isAnimating: boolean;
}

export const Header: React.FC<HeaderProps> = ({ theme, toggleTheme, isAnimating }) => {
  return (
    <header className="glass-panel sticky top-0 z-50 w-full px-6 py-4 shadow-sm border-b border-zinc-200/50 dark:border-zinc-800/40 flex items-center justify-between rounded-b-2xl">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-blue-500 flex items-center justify-center text-white shadow-md shadow-blue-500/20">
          <Map className="w-5 h-5" />
        </div>
        <div>
          <h1 className="text-lg font-bold text-zinc-800 dark:text-zinc-50 tracking-tight flex items-center gap-2">
            G-Maps Route Visualizer
            {isAnimating && (
              <span className="flex h-2.5 w-2.5 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-blue-500"></span>
              </span>
            )}
          </h1>
          <p className="text-[10px] text-zinc-500 dark:text-zinc-400 font-medium">
            Path Finding Algorithm Simulator
          </p>
        </div>
      </div>

      <div className="flex items-center gap-4">
        {isAnimating && (
          <div className="hidden sm:flex items-center gap-2 text-xs text-blue-500 font-medium animate-pulse">
            <Navigation className="w-3.5 h-3.5 animate-spin" />
            <span>Calculating Route...</span>
          </div>
        )}
        <button
          onClick={toggleTheme}
          className="p-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-200 transition-colors shadow-sm cursor-pointer"
          title="Toggle Light/Dark Theme"
        >
          {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </button>
      </div>
    </header>
  );
};
