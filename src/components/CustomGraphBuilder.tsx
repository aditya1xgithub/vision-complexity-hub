import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Trash2, Network } from "lucide-react";
import { GraphData, GraphEdge, layoutNodesCircle } from "@/lib/graphUtils";

interface Props {
  onApply: (data: GraphData) => void;
}

export function CustomGraphBuilder({ onApply }: Props) {
  const [nodeCount, setNodeCount] = useState(5);
  const [edges, setEdges] = useState<{ from: string; to: string; weight: string }[]>([
    { from: "0", to: "1", weight: "3" },
    { from: "0", to: "2", weight: "5" },
    { from: "1", to: "3", weight: "2" },
    { from: "2", to: "4", weight: "4" },
    { from: "3", to: "4", weight: "1" },
  ]);
  const [error, setError] = useState("");

  const addEdge = () => {
    setEdges((prev) => [...prev, { from: "", to: "", weight: "1" }]);
  };

  const removeEdge = (idx: number) => {
    setEdges((prev) => prev.filter((_, i) => i !== idx));
  };

  const updateEdge = (idx: number, field: "from" | "to" | "weight", value: string) => {
    setEdges((prev) =>
      prev.map((e, i) => (i === idx ? { ...e, [field]: value } : e))
    );
  };

  const handleApply = () => {
    if (nodeCount < 2 || nodeCount > 15) {
      setError("Vertices must be between 2 and 15");
      return;
    }
    if (edges.length === 0) {
      setError("Add at least one edge");
      return;
    }

    const parsedEdges: GraphEdge[] = [];
    for (let i = 0; i < edges.length; i++) {
      const f = parseInt(edges[i].from);
      const t = parseInt(edges[i].to);
      const w = parseInt(edges[i].weight) || 1;
      if (isNaN(f) || isNaN(t) || f < 0 || t < 0 || f >= nodeCount || t >= nodeCount) {
        setError(`Edge ${i + 1}: vertex IDs must be 0 to ${nodeCount - 1}`);
        return;
      }
      if (f === t) {
        setError(`Edge ${i + 1}: self-loops not allowed`);
        return;
      }
      parsedEdges.push({ from: f, to: t, weight: w });
    }

    setError("");
    const nodes = layoutNodesCircle(nodeCount);
    onApply({ nodes, edges: parsedEdges });
  };

  const labels = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <Network className="h-4 w-4 text-primary" />
        <span className="text-xs font-semibold text-foreground">Custom Graph Builder</span>
      </div>

      {/* Vertex count */}
      <div className="flex items-center gap-2 flex-wrap">
        <label className="text-xs text-muted-foreground whitespace-nowrap">Vertices (2-15):</label>
        <Input
          type="number"
          min={2}
          max={15}
          value={nodeCount}
          onChange={(e) => setNodeCount(Math.min(15, Math.max(2, parseInt(e.target.value) || 2)))}
          className="w-20 h-8 text-xs"
        />
      </div>

      {/* Helper banner explaining 0-indexed IDs */}
      <div className="bg-primary/10 border border-primary/30 rounded p-2 text-[11px] text-foreground leading-relaxed">
        ⚠️ Vertex IDs are <span className="font-bold text-primary">0-indexed</span>. For {nodeCount} vertices use IDs:{" "}
        <span className="font-mono text-primary">
          {Array.from({ length: nodeCount }, (_, i) => `${i}(${labels[i] || i})`).join(", ")}
        </span>
        <div className="text-muted-foreground mt-1">
          Example: to connect A→B with weight 5, enter From=<span className="font-mono text-primary">0</span>, To=<span className="font-mono text-primary">1</span>, Weight=<span className="font-mono text-primary">5</span>
        </div>
      </div>

      {/* Edges */}
      <div className="space-y-1.5 max-h-40 overflow-y-auto pr-1">
        <div className="grid grid-cols-[1fr_1fr_1fr_auto] gap-1.5 text-[10px] text-muted-foreground font-medium">
          <span>From</span>
          <span>To</span>
          <span>Weight</span>
          <span></span>
        </div>
        {edges.map((edge, i) => (
          <div key={i} className="grid grid-cols-[1fr_1fr_1fr_auto] gap-1.5 items-center">
            <Input
              type="number"
              min={0}
              max={nodeCount - 1}
              value={edge.from}
              onChange={(e) => updateEdge(i, "from", e.target.value)}
              className="h-7 text-xs"
              placeholder="0"
            />
            <Input
              type="number"
              min={0}
              max={nodeCount - 1}
              value={edge.to}
              onChange={(e) => updateEdge(i, "to", e.target.value)}
              className="h-7 text-xs"
              placeholder="1"
            />
            <Input
              type="number"
              min={1}
              value={edge.weight}
              onChange={(e) => updateEdge(i, "weight", e.target.value)}
              className="h-7 text-xs"
              placeholder="1"
            />
            <Button
              size="sm"
              variant="ghost"
              onClick={() => removeEdge(i)}
              className="h-7 w-7 p-0 text-destructive hover:text-destructive"
            >
              <Trash2 className="h-3 w-3" />
            </Button>
          </div>
        ))}
      </div>

      <div className="flex gap-2">
        <Button size="sm" variant="outline" onClick={addEdge} className="text-xs h-7">
          <Plus className="h-3 w-3 mr-1" /> Add Edge
        </Button>
        <Button size="sm" onClick={handleApply} className="text-xs h-7">
          Build Graph
        </Button>
      </div>

      {error && (
        <p className="text-xs text-destructive">{error}</p>
      )}
    </div>
  );
}
