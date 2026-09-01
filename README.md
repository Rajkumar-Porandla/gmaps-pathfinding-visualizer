# G-Maps Route Visualizer 🗺️

A high-performance, portfolio-grade Path Finding Visualizer styled like Google Maps, built using **React**, **TypeScript**, **TailwindCSS v4**, and **Framer Motion**.

## 🚀 Key Features

1. **Step-by-Step Playback Controller**: Run, pause, resume, stop, and restart animation flow. Resuming picks up precisely where it was suspended without recalculating nodes.
2. **Min-Heap Guided Pathfinders**: Evaluates weighted traffic using custom binary Min-Heaps for optimal $O((V+E)\log V)$ performance.
3. **Advanced Statistics**: Reports CPU compute time, animation duration, visited/expanded nodes, path length, traffic route cost, estimated memory footprint, FPS, and rendering time.
4. **Comparison Benchmarks**: Compares BFS, DFS, Dijkstra, and A* Search on the active layout, highlighting the fastest and most efficient routes. Export metrics as CSV or JSON.
5. **Viva Mode Inspector**: Educational debugger visualizing the active FIFO Queue (BFS), LIFO Stack (DFS), or Min-Heap Priority Queue (Dijkstra/A*) in real-time.
6. **Save & Load Custom Map configurations**: Save and restore obstacles (roadblocks, traffic jams), pin configurations, and sizes via JSON files.
7. **Grid Size Customizer**: Change grid dimension scale dynamically: 20x20, 25x25, 30x30, 40x25, 50x30, 60x40.
8. **Keyboard Accessibility & Focus rings**: Supports keyboard grid navigation (Arrow keys to navigate, Space/Enter to place walls/traffic) and full screen reader integration.
9. **Onboarding Tutorial Slide Show**: Guides users through features, keys, and modes.
10. **Direct-DOM Painting**: Maintains 60 FPS by bypassing React render diffing cycles during playback.

---

## 🛠️ Installation & Execution

1. Navigate to the project root directory.
2. Install packages:
   ```bash
   npm install
   ```
3. Run the development server:
   ```bash
   npm run dev
   ```
4. Build the production package:
   ```bash
   npm run build
   ```
5. Preview production bundle:
   ```bash
   npm run preview
   ```
6. Run unit test suite:
   ```bash
   npx tsx src/visualizer.test.ts
   ```

---

## ⌨️ Keyboard Shortcuts Reference

Press these keys during simulation to trigger visualizer behaviors:

| Key | Operation |
|:---:|:---|
| `Space` | Play / Resume navigation |
| `P` | Pause animation playback |
| `R` | Reset map elements and pins to default |
| `C` | Clear calculated route paths |
| `W` | Clear all custom walls and traffic obstacles |
| `M` | Generate a new terrain maze |
| `B` | Select BFS pathfinder |
| `F` | Select DFS pathfinder |
| `D` | Select Dijkstra's algorithm |
| `A` | Select A* Search |
| `T` | Toggle Light/Dark map skins |
| `H` | Open Onboarding Tutorial Guide |

---

## 📊 Complexity Reference

| Algorithm | Data Structure | Shortest Path? | Weighted Support? | Time Complexity | Space Complexity |
|:---|:---|:---:|:---:|:---|:---|
| **A\* Search** | Min-Heap / Priority Queue | Yes | Yes | $O(E \log V)$ average | $O(b^d)$ |
| **Dijkstra** | Min-Heap / Priority Queue | Yes | Yes | $O((V+E)\log V)$ | $O(V)$ |
| **BFS** | Queue (FIFO) | Yes (Unweighted) | No | $O(V+E)$ | $O(V)$ |
| **DFS** | Stack (LIFO) | No | No | $O(V+E)$ | $O(V)$ |

---

## ⚙️ Project Structure

```
├── public/
├── src/
│   ├── algorithms/
│   │   ├── astar.ts             # Heuristics-guided A* search
│   │   ├── bfs.ts               # Breadth-First unweighted search
│   │   ├── dfs.ts               # Depth-First unweighted search
│   │   ├── dijkstra.ts          # Weighted Dijkstra algorithm
│   │   ├── heap.ts              # Custom binary Min-Heap structure
│   │   └── types.ts             # Type interfaces and complexities
│   ├── components/
│   │   ├── ComparisonDashboard.tsx  # Concurrent benchmark simulator
│   │   ├── ControlPanel.tsx         # Visualizer playback controls
│   │   ├── Grid.tsx                 # Canvas layout wrapper
│   │   ├── Header.tsx               # Nav bar and skin toggle
│   │   ├── InfoPanel.tsx            # Complexity details card
│   │   ├── Node.tsx                 # Grid cell element
│   │   ├── StatsPanel.tsx           # Live telemetry dashboard
│   │   ├── Toast.tsx                # Status toasts notifications
│   │   ├── Tutorial.tsx             # Slideshow overlay guide
│   │   └── VivaPanel.tsx            # Real-time data structures inspector
│   ├── hooks/
│   │   └── useTheme.ts          # Theme state controller
│   ├── App.tsx                  # Main visualizer manager
│   ├── index.css                # Custom animation classes
│   ├── main.tsx                 # Application entry
│   └── visualizer.test.ts       # Performance test suite
├── package.json
└── vite.config.ts
```

---

## 🚀 Performance & Memory Tuning

- **CSS Containment**: Cells use CSS `contain: layout style paint;` boundaries, limiting reflow calculations to modified coordinates.
- **Bypassing React Reconciliation**: Visited and path routing cells paint classes directly to DOM elements during animation, keeping React render updates at $0$ until playback finishes. This maintains a steady 60 FPS even on large 60x40 grids.
- **Verbatim TS module syntax**: Compiles cleanly with zero errors under strict TypeScript type safety requirements.


## 🧭 Supported Algorithms
- A* Search (Manhattan & Euclidean Heuristics)
- Dijkstra's Algorithm
- Breadth-First Search (BFS)
- Depth-First Search (DFS)
