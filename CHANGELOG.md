# CHANGELOG - Route Visualizer Upgrades

All major portfolio-quality upgrades made to the pathfinding visualizer project:

### Added Features
- **Step-by-Step Playback Controller**: Full Play, Pause, Resume, Stop, and Restart features that suspends/resumes animations without recalculating the algorithm.
- **Dynamic Grid Sizing**: Support for switching grid sizes dynamically (20x20, 25x25, 30x30, 40x25, 50x30, 60x40) with auto-resizing.
- **Speed Presets**: Integrated Very Slow, Slow, Normal, Fast, Very Fast, and Instant animation levels.
- **Technical Reference Sheet**: Professional information cards describing each algorithm's complex structures, heuristics, real-world applications, advantages, and disadvantages.
- **Viva Inspector Mode**: Interactive debugging console visualizing the active Queue, Stack, or Heap Priority Queue nodes and current distance metrics in real-time.
- **Comparison Benchmarks Dashboard**: Runs BFS, DFS, Dijkstra, and A* concurrently on map layouts, reporting execution time, visited node counts, path cost, and memory consumption. Highlight tags indicate the fastest and most efficient routes. Export outputs as CSV/JSON.
- **Persistence Save & Load**: Save and restore custom map roadblocks, traffic weights, start/end locations, and dimensions using JSON configurations.
- **Onboarding Tutorial System**: An interactive overlay guide stepping users through nodes, speeds, shortcuts, and modes.
- **Accessibility & Focus states**: Added `aria-label`, visible focus rings, and support for keyboard-guided grid navigation (Arrow Keys and Space/Enter).
- **Unit and Integration tests**: Custom testing suite validating pathfinders, maze generators, and boundaries in `src/visualizer.test.ts`.

### Performance Optimizations
- **Direct-DOM Injection**: Animates route visited and shortest path cells directly via DOM selection, bypassing React rendering overhead during visual playback. Yields a stable 60 FPS on all grids.
- **Min-Heap Binary Priority Queue**: Optimized Dijkstra and A* Search search algorithms using custom binary heaps, reducing runtime complexity from $O(V^2)$ to $O((V+E)\log V)$.
- **Strict VerbatimModuleSyntax Type Safety**: Ensured correct explicit types throughout the React project, compiling clean of errors or warnings.
