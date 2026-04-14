import { useState, useEffect, useCallback, useRef } from "react";
import { algorithms, Algorithm } from "@/lib/algorithms";
import { Button } from "@/components/ui/button";
import { Play, Pause, RotateCcw, SkipForward } from "lucide-react";

interface GraphNode {
  id: number;
  x: number;
  y: number;
  label: string;
}

interface GraphEdge {
  from: number;
  to: number;
  weight?: number;
}

type NodeState = "unvisited" | "visiting" | "visited" | "current";

const GRAPH_NODES: GraphNode[] = [
  { id: 0, x: 200, y: 40, label: "A" },
  { id: 1, x: 80, y: 130, label: "B" },
  { id: 2, x: 320, y: 130, label: "C" },
  { id: 3, x: 40, y: 240, label: "D" },
  { id: 4, x: 160, y: 260, label: "E" },
  { id: 5, x: 280, y: 260, label: "F" },
  { id: 6, x: 370, y: 240, label: "G" },
];

const GRAPH_EDGES: GraphEdge[] = [
  { from: 0, to: 1, weight: 4 },
  { from: 0, to: 2, weight: 3 },
  { from: 1, to: 3, weight: 2 },
  { from: 1, to: 4, weight: 5 },
  { from: 2, to: 5, weight: 6 },
  { from: 2, to: 6, weight: 1 },
  { from: 1, to: 2, weight: 1 },
  { from: 4, to: 5, weight: 3 },
  { from: 3, to: 4, weight: 7 },
];

const ADJ: number[][] = Array.from({ length: 7 }, () => []);
GRAPH_EDGES.forEach((e) => {
  ADJ[e.from].push(e.to);
  ADJ[e.to].push(e.from);
});

function bfsOrder(): number[][] {
  const visited = new Set<number>();
  const steps: number[][] = [];
  const queue = [0];
  visited.add(0);
  steps.push([0]);
  while (queue.length > 0) {
    const node = queue.shift()!;
    for (const nb of ADJ[node]) {
      if (!visited.has(nb)) {
        visited.add(nb);
        queue.push(nb);
        steps.push([...visited]);
      }
    }
  }
  return steps;
}

function dfsOrder(): number[][] {
  const visited = new Set<number>();
  const steps: number[][] = [];
  function dfs(node: number) {
    visited.add(node);
    steps.push([...visited]);
    for (const nb of ADJ[node]) {
      if (!visited.has(nb)) dfs(nb);
    }
  }
  dfs(0);
  return steps;
}

function dijkstraOrder(): number[][] {
  const dist = Array(7).fill(Infinity);
  dist[0] = 0;
  const visited = new Set<number>();
  const steps: number[][] = [];
  steps.push([0]);
  for (let i = 0; i < 7; i++) {
    let u = -1;
    for (let v = 0; v < 7; v++) {
      if (!visited.has(v) && (u === -1 || dist[v] < dist[u])) u = v;
    }
    if (u === -1 || dist[u] === Infinity) break;
    visited.add(u);
    steps.push([...visited]);
    for (const e of GRAPH_EDGES) {
      let nb = -1, w = e.weight ?? 1;
      if (e.from === u) nb = e.to;
      else if (e.to === u) nb = e.from;
      if (nb !== -1 && dist[u] + w < dist[nb]) dist[nb] = dist[u] + w;
    }
  }
  return steps;
}

function bellmanFordOrder(): number[][] {
  const dist = Array(7).fill(Infinity);
  dist[0] = 0;
  const steps: number[][] = [[0]];
  const relaxed = new Set<number>([0]);
  for (let i = 0; i < 6; i++) {
    for (const e of GRAPH_EDGES) {
      const w = e.weight ?? 1;
      if (dist[e.from] + w < dist[e.to]) {
        dist[e.to] = dist[e.from] + w;
        relaxed.add(e.to);
        steps.push([...relaxed]);
      }
      if (dist[e.to] + w < dist[e.from]) {
        dist[e.from] = dist[e.to] + w;
        relaxed.add(e.from);
        steps.push([...relaxed]);
      }
    }
  }
  return steps;
}

function getTraversalSteps(algoId: string): number[][] {
  switch (algoId) {
    case "bfs": return bfsOrder();
    case "dfs": return dfsOrder();
    case "dijkstra": return dijkstraOrder();
    case "bellman-ford": return bellmanFordOrder();
    case "kahns": return bfsOrder(); // similar BFS-like traversal
    case "topological-sort": return dfsOrder(); // DFS-based
    case "kruskal": return dijkstraOrder(); // edge-based, approximate with Dijkstra visual
    case "prims": return dijkstraOrder(); // greedy MST, similar to Dijkstra visual
    case "floyd-warshall": return bellmanFordOrder(); // all-pairs, approximate
    default: return bfsOrder();
  }
}

const graphAlgorithms = algorithms.filter(
  (a) => a.category === "graph"
);

const NODE_COLORS: Record<NodeState, string> = {
  unvisited: "hsl(220, 13%, 20%)",
  visiting: "hsl(38, 92%, 50%)",
  visited: "hsl(142, 70%, 49%)",
  current: "hsl(217, 91%, 60%)",
};

export function GraphTraversal() {
  const [selectedAlgo, setSelectedAlgo] = useState<Algorithm>(graphAlgorithms[0]);
  const [steps, setSteps] = useState<number[][]>([]);
  const [currentStep, setCurrentStep] = useState(-1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(800);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const reset = useCallback(() => {
    setIsPlaying(false);
    setCurrentStep(-1);
    if (intervalRef.current) clearInterval(intervalRef.current);
  }, []);

  useEffect(() => {
    reset();
    setSteps(getTraversalSteps(selectedAlgo.id));
  }, [selectedAlgo, reset]);

  useEffect(() => {
    if (isPlaying && steps.length > 0) {
      intervalRef.current = setInterval(() => {
        setCurrentStep((prev) => {
          if (prev >= steps.length - 1) {
            setIsPlaying(false);
            if (intervalRef.current) clearInterval(intervalRef.current);
            return prev;
          }
          return prev + 1;
        });
      }, speed);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isPlaying, steps, speed]);

  const play = () => {
    if (currentStep >= steps.length - 1) setCurrentStep(-1);
    setIsPlaying(true);
  };

  const stepForward = () => {
    if (currentStep < steps.length - 1) setCurrentStep((p) => p + 1);
  };

  const getNodeState = (nodeId: number): NodeState => {
    if (currentStep < 0) return "unvisited";
    const currentVisited = steps[currentStep] || [];
    const prevVisited = currentStep > 0 ? steps[currentStep - 1] || [] : [];
    if (currentVisited.includes(nodeId) && !prevVisited.includes(nodeId)) return "current";
    if (currentVisited.includes(nodeId)) return "visited";
    return "unvisited";
  };

  const isEdgeActive = (from: number, to: number): boolean => {
    if (currentStep < 0) return false;
    const visited = steps[currentStep] || [];
    return visited.includes(from) && visited.includes(to);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 flex-wrap">
        <select
          value={selectedAlgo.id}
          onChange={(e) => {
            const algo = graphAlgorithms.find((a) => a.id === e.target.value);
            if (algo) setSelectedAlgo(algo);
          }}
          className="px-3 py-2 rounded-lg bg-secondary border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
        >
          {graphAlgorithms.map((a) => (
            <option key={a.id} value={a.id}>{a.name}</option>
          ))}
        </select>

        <div className="flex gap-1.5">
          <Button size="sm" variant="outline" onClick={isPlaying ? () => setIsPlaying(false) : play}>
            {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
          </Button>
          <Button size="sm" variant="outline" onClick={stepForward} disabled={isPlaying}>
            <SkipForward className="h-4 w-4" />
          </Button>
          <Button size="sm" variant="outline" onClick={reset}>
            <RotateCcw className="h-4 w-4" />
          </Button>
        </div>

        <select
          value={speed}
          onChange={(e) => setSpeed(Number(e.target.value))}
          className="px-2 py-1.5 rounded bg-secondary border border-border text-foreground text-xs"
        >
          <option value={1200}>Slow</option>
          <option value={800}>Normal</option>
          <option value={400}>Fast</option>
        </select>
      </div>

      {/* Graph Visualization */}
      <div className="bg-card rounded-lg border border-border overflow-hidden">
        <svg viewBox="0 0 420 310" className="w-full h-auto" style={{ minHeight: 280 }}>
          {/* Edges */}
          {GRAPH_EDGES.map((e, i) => {
            const from = GRAPH_NODES[e.from];
            const to = GRAPH_NODES[e.to];
            const active = isEdgeActive(e.from, e.to);
            return (
              <g key={i}>
                <line
                  x1={from.x}
                  y1={from.y}
                  x2={to.x}
                  y2={to.y}
                  stroke={active ? "hsl(142, 70%, 49%)" : "hsl(220, 13%, 25%)"}
                  strokeWidth={active ? 3 : 1.5}
                  className="transition-all duration-500"
                />
                {e.weight !== undefined && (
                  <text
                    x={(from.x + to.x) / 2 + 5}
                    y={(from.y + to.y) / 2 - 5}
                    fill="hsl(215, 14%, 55%)"
                    fontSize="10"
                    fontFamily="monospace"
                  >
                    {e.weight}
                  </text>
                )}
              </g>
            );
          })}

          {/* Nodes */}
          {GRAPH_NODES.map((node) => {
            const state = getNodeState(node.id);
            return (
              <g key={node.id}>
                <circle
                  cx={node.x}
                  cy={node.y}
                  r={20}
                  fill={NODE_COLORS[state]}
                  stroke={state === "current" ? "hsl(217, 91%, 70%)" : state === "visited" ? "hsl(142, 70%, 60%)" : "hsl(220, 13%, 30%)"}
                  strokeWidth={state === "current" ? 3 : 2}
                  className="transition-all duration-500"
                />
                {state === "current" && (
                  <circle
                    cx={node.x}
                    cy={node.y}
                    r={24}
                    fill="none"
                    stroke="hsl(217, 91%, 60%)"
                    strokeWidth={1.5}
                    opacity={0.5}
                    className="animate-ping"
                    style={{ transformOrigin: `${node.x}px ${node.y}px` }}
                  />
                )}
                <text
                  x={node.x}
                  y={node.y + 4}
                  textAnchor="middle"
                  fill={state === "unvisited" ? "hsl(215, 14%, 55%)" : "hsl(220, 13%, 10%)"}
                  fontSize="12"
                  fontWeight="bold"
                  fontFamily="monospace"
                >
                  {node.label}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      {/* Step info */}
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span>
          Step: {currentStep < 0 ? 0 : currentStep + 1} / {steps.length}
        </span>
        <div className="flex gap-4">
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full" style={{ background: NODE_COLORS.unvisited, border: "1px solid hsl(220,13%,30%)" }} />
            Unvisited
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full" style={{ background: NODE_COLORS.current }} />
            Current
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full" style={{ background: NODE_COLORS.visited }} />
            Visited
          </span>
        </div>
      </div>

      {/* Algorithm description */}
      <div className="bg-secondary rounded-lg p-3 border border-border">
        <p className="text-xs font-semibold text-foreground mb-1">{selectedAlgo.name}</p>
        <p className="text-xs text-muted-foreground leading-relaxed">{selectedAlgo.description}</p>
        <div className="flex gap-3 mt-2">
          <span className="text-[10px] text-muted-foreground">
            Time: <span className="text-primary font-mono">{selectedAlgo.timeComplexity.average}</span>
          </span>
          <span className="text-[10px] text-muted-foreground">
            Space: <span className="text-primary font-mono">{selectedAlgo.spaceComplexity}</span>
          </span>
        </div>
      </div>
    </div>
  );
}
