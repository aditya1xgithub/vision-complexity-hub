import { useState } from "react";
import { algorithms, Algorithm, runSimulation, SimulationResult } from "@/lib/algorithms";
import { ComplexityGraph } from "./ComplexityGraph";
import { Button } from "@/components/ui/button";
import { GitCompare, Play } from "lucide-react";

export function ComparisonMode() {
  const [algoA, setAlgoA] = useState<Algorithm | null>(null);
  const [algoB, setAlgoB] = useState<Algorithm | null>(null);
  const [results, setResults] = useState<SimulationResult[]>([]);

  const inputSizes = [10, 50, 100, 500, 1000, 5000, 10000];

  const compare = async () => {
    if (!algoA || !algoB) return;
    const resA = await runSimulation(algoA, inputSizes);
    const resB = await runSimulation(algoB, inputSizes);
    setResults([resA, resB]);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-2">
        <GitCompare className="h-4 w-4 text-accent" />
        <h3 className="text-sm font-semibold text-foreground">Algorithm Comparison</h3>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-xs text-muted-foreground mb-1 block">Algorithm A</label>
          <select
            value={algoA?.id ?? ""}
            onChange={(e) => setAlgoA(algorithms.find((a) => a.id === e.target.value) ?? null)}
            className="w-full px-3 py-2 rounded-lg bg-secondary border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
          >
            <option value="">Select...</option>
            {algorithms.map((a) => (
              <option key={a.id} value={a.id}>{a.name}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="text-xs text-muted-foreground mb-1 block">Algorithm B</label>
          <select
            value={algoB?.id ?? ""}
            onChange={(e) => setAlgoB(algorithms.find((a) => a.id === e.target.value) ?? null)}
            className="w-full px-3 py-2 rounded-lg bg-secondary border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
          >
            <option value="">Select...</option>
            {algorithms.map((a) => (
              <option key={a.id} value={a.id}>{a.name}</option>
            ))}
          </select>
        </div>
      </div>

      <Button
        onClick={compare}
        disabled={!algoA || !algoB}
        className="w-full gap-2"
        variant="outline"
      >
        <Play className="h-4 w-4" />
        Compare Growth Curves
      </Button>

      {results.length > 0 && (
        <div className="animate-slide-in">
          <div className="grid grid-cols-2 gap-3 mb-3">
            {results.map((r) => (
              <div key={r.algorithm.id} className="bg-secondary rounded-lg p-3 border border-border text-center">
                <p className="text-xs text-muted-foreground">{r.algorithm.name}</p>
                <p className="text-lg font-mono font-bold text-primary">{r.detectedComplexity}</p>
              </div>
            ))}
          </div>
          <div className="h-64 bg-card rounded-lg border border-border p-2">
            <ComplexityGraph results={results} />
          </div>
        </div>
      )}
    </div>
  );
}
