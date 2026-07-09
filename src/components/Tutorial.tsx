import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Play, MapPin, Construction, Sliders, LayoutGrid, Keyboard, Cpu } from 'lucide-react';

interface TutorialProps {
  isOpen: boolean;
  onClose: () => void;
}

interface Slide {
  title: string;
  icon: React.ReactNode;
  content: string;
  badge?: string;
}

export const Tutorial: React.FC<TutorialProps> = ({ isOpen, onClose }) => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides: Slide[] = [
    {
      title: 'Welcome to G-Maps Route Visualizer!',
      icon: <LayoutGrid className="w-12 h-12 text-blue-500" />,
      content: 'This tool is a pathfinding algorithm simulator styled like Google Maps. Learn how algorithms find the best route across roadblock obstacles and heavy traffic jams!',
      badge: 'Start Navigation',
    },
    {
      title: 'Locators & Pins',
      icon: <MapPin className="w-12 h-12 text-red-500 animate-bounce" />,
      content: 'Drag the blue locator pin (Current Location) and the red marker pin (Destination Address) to position them anywhere on the map grid.',
      badge: 'Location Nodes',
    },
    {
      title: 'Roadblocks & Traffic Jams',
      icon: <Construction className="w-12 h-12 text-amber-500" />,
      content: 'Choose between drawing solid roadblocks (walls) that block traffic entirely, or traffic jams (weights with cost 5x) that slow down weighted pathfinders like Dijkstra and A*. Click and drag to paint!',
      badge: 'Obstacles',
    },
    {
      title: 'Simulation Speeds & Control',
      icon: <Sliders className="w-12 h-12 text-purple-500" />,
      content: 'Use playback controls to Play, Pause, Resume, and Stop the route visualizer. Change drawing speed settings from Slow to Instant to see how routing operates in real-time.',
      badge: 'Speed Presets',
    },
    {
      title: 'Viva Demonstration Mode',
      icon: <Cpu className="w-12 h-12 text-green-500" />,
      content: 'Enable Viva Mode to inspect the live data structures (Queue, Stack, Min-Heap Priority Queue) during playback! This displays exactly what nodes are currently being evaluated.',
      badge: 'University Viva Prep',
    },
    {
      title: 'Comparison & Keyboard Shortcuts',
      icon: <Keyboard className="w-12 h-12 text-zinc-500" />,
      content: 'Toggle the Comparison Dashboard to test all 4 algorithms at once on your current grid configuration! Press "H" at any time to open this guide, or "Space" to start navigation.',
      badge: 'Keyboard & Benchmarks',
    },
  ];

  if (!isOpen) return null;

  const nextSlide = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(prev => prev + 1);
    } else {
      onClose();
    }
  };

  const prevSlide = () => {
    if (currentSlide > 0) {
      setCurrentSlide(prev => prev - 1);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <AnimatePresence mode="wait">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="glass-panel max-w-lg w-full rounded-2xl shadow-2xl p-6 border border-zinc-200 dark:border-zinc-800 flex flex-col justify-between min-h-[400px]"
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <span className="text-[10px] uppercase tracking-wider font-extrabold text-blue-500 bg-blue-50 dark:bg-blue-900/30 px-2.5 py-1 rounded-full">
              {slides[currentSlide].badge}
            </span>
            <button
              onClick={onClose}
              className="p-1 rounded-lg text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Slide Content */}
          <div className="flex-1 flex flex-col items-center justify-center text-center px-4 my-4 space-y-4">
            <div className="p-4 bg-zinc-50 dark:bg-zinc-800/40 rounded-full mb-2">
              {slides[currentSlide].icon}
            </div>
            <h2 className="text-xl font-extrabold text-zinc-850 dark:text-zinc-150">
              {slides[currentSlide].title}
            </h2>
            <p className="text-sm text-zinc-500 dark:text-zinc-450 leading-relaxed max-w-sm">
              {slides[currentSlide].content}
            </p>
          </div>

          {/* Bottom Bar Controls */}
          <div className="pt-4 border-t border-zinc-200/50 dark:border-zinc-800/50 flex items-center justify-between">
            <span className="text-xs text-zinc-400">
              Step {currentSlide + 1} of {slides.length}
            </span>

            <div className="flex gap-2">
              {currentSlide > 0 && (
                <button
                  onClick={prevSlide}
                  className="px-4 py-2 text-xs font-bold rounded-xl border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-650 dark:text-zinc-300 transition-colors cursor-pointer"
                >
                  Back
                </button>
              )}
              <button
                onClick={nextSlide}
                className="px-5 py-2 text-xs font-bold rounded-xl bg-blue-500 hover:bg-blue-600 text-white shadow-md shadow-blue-500/10 flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <span>{currentSlide === slides.length - 1 ? 'Get Started' : 'Next'}</span>
                <Play className="w-3 h-3 fill-white" />
              </button>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};
