import { useState, useEffect, useCallback, useRef, useMemo } from "react";
import { algorithms, Algorithm } from "@/lib/algorithms";
import { Button } from "@/components/ui/button";
import { Play, Pause, RotateCcw, SkipForward } from "lucide-react";
import {
  GraphNode, GraphEdge, GraphData, NodeState,
  DEFAULT_NODES, DEFAULT_EDGES,
  buildAdj, getTraversalSteps, NODE_COLORS,
} from "@/lib/graphUtils";
import { CustomGraphBuilder } from "@/components/CustomGraphBuilder";

const graphAlgorithms = algorithms.filter((a) => a.category === "graph");

export function GraphTraversal() {
  const [selectedAlgo, setSelectedAlgo] = useState<Algorithm>(graphAlgorithms[0]);
  const [graphMode, setGraphMode] = useState<"default" | "custom">("default");
  const [customGraph, setCustomGraph] = useState<GraphData | null>(null);
  const [steps, setSteps] = useState<number[][]>([]);
  const [currentStep, setCurrentStep] = useState(-1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(800);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Active graph data (memoized so effect deps are stable)
  const activeNodes: GraphNode[] = useMemo(
    () => (graphMode === "custom" && customGraph ? customGraph.nodes : DEFAULT_NODES),
    [graphMode, customGraph]
  );
  const activeEdges: GraphEdge[] = useMemo(
    () => (graphMode === "custom" && customGraph ? customGraph.edges : DEFAULT_EDGES),
    [graphMode, customGraph]
  );
  const adj = useMemo(() => buildAdj(activeNodes.length, activeEdges), [activeNodes, activeEdges]);

  const reset = useCallback(() => {
    setIsPlaying(false);
    setCurrentStep(-1);
    if (intervalRef.current) clearInterval(intervalRef.current);
  }, []);

  useEffect(() => {
    reset();
    setSteps(getTraversalSteps(selectedAlgo.id, activeNodes.length, activeEdges, adj));
  }, [selectedAlgo, activeNodes, activeEdges, adj, reset]);

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
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
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
    const curr = steps[currentStep] || [];
    const prev = currentStep > 0 ? steps[currentStep - 1] || [] : [];
    if (curr.includes(nodeId) && !prev.includes(nodeId)) return "current";
    if (curr.includes(nodeId)) return "visited";
    return "unvisited";
  };

  const isEdgeActive = (from: number, to: number): boolean => {
    if (currentStep < 0) return false;
    const visited = steps[currentStep] || [];
    return visited.includes(from) && visited.includes(to);
  };

  // Compute SVG viewBox to fit all nodes
  const padding = 40;
  const minX = Math.min(...activeNodes.map((n) => n.x)) - padding;
  const minY = Math.min(...activeNodes.map((n) => n.y)) - padding;
  const maxX = Math.max(...activeNodes.map((n) => n.x)) + padding;
  const maxY = Math.max(...activeNodes.map((n) => n.y)) + padding;
  const viewBox = `${minX} ${minY} ${maxX - minX} ${maxY - minY}`;

  return (
    <div className="space-y-4">
      {/* Graph mode toggle */}
      <div className="flex gap-2">
        <Button
          size="sm"
          variant={graphMode === "default" ? "default" : "outline"}
          onClick={() => { setGraphMode("default"); reset(); }}
          className="text-xs h-7"
        >
          Default Graph
        </Button>
        <Button
          size="sm"
          variant={graphMode === "custom" ? "default" : "outline"}
          onClick={() => setGraphMode("custom")}
          className="text-xs h-7"
        >
          Custom Graph
        </Button>
      </div>

      {/* Custom graph builder */}
      {graphMode === "custom" && (
        <div className="bg-secondary/50 rounded-lg p-3 border border-border">
          <CustomGraphBuilder
            onApply={(data) => {
              setCustomGraph(data);
              reset();
            }}
          />
        </div>
      )}

      {/* Controls */}
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

      {/* Graph SVG */}
      <div className="bg-card rounded-lg border border-border overflow-hidden">
        <svg viewBox={viewBox} className="w-full h-auto" style={{ minHeight: 280 }}>
          {activeEdges.map((e, i) => {
            const from = activeNodes[e.from];
            const to = activeNodes[e.to];
            if (!from || !to) return null;
            const active = isEdgeActive(e.from, e.to);
            return (
              <g key={i}>
                <line
                  x1={from.x} y1={from.y} x2={to.x} y2={to.y}
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

          {activeNodes.map((node) => {
            const state = getNodeState(node.id);
            return (
              <g key={node.id}>
                <circle
                  cx={node.x} cy={node.y} r={20}
                  fill={NODE_COLORS[state]}
                  stroke={
                    state === "current" ? "hsl(217, 91%, 70%)" :
                    state === "visited" ? "hsl(142, 70%, 60%)" :
                    "hsl(220, 13%, 30%)"
                  }
                  strokeWidth={state === "current" ? 3 : 2}
                  className="transition-all duration-500"
                />
                {state === "current" && (
                  <circle
                    cx={node.x} cy={node.y} r={24}
                    fill="none" stroke="hsl(217, 91%, 60%)"
                    strokeWidth={1.5} opacity={0.5}
                    className="animate-ping"
                    style={{ transformOrigin: `${node.x}px ${node.y}px` }}
                  />
                )}
                <text
                  x={node.x} y={node.y + 4}
                  textAnchor="middle"
                  fill={state === "unvisited" ? "hsl(215, 14%, 55%)" : "hsl(220, 13%, 10%)"}
                  fontSize="12" fontWeight="bold" fontFamily="monospace"
                >
                  {node.label}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      {/* Step info & legend */}
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span>Step: {currentStep < 0 ? 0 : currentStep + 1} / {steps.length}</span>
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
