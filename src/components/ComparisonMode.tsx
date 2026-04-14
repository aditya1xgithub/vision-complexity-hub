import { useState } from "react";
import { algorithms, Algorithm, runSimulation, SimulationResult } from "@/lib/algorithms";
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
        Compare Complexity
      </Button>

      {results.length > 0 && (
        <div className="animate-slide-in space-y-3">
          <div className="grid grid-cols-2 gap-3">
            {results.map((r) => (
              <div key={r.algorithm.id} className="bg-secondary rounded-lg p-3 border border-border text-center">
                <p className="text-xs text-muted-foreground">{r.algorithm.name}</p>
                <p className="text-lg font-mono font-bold text-primary">{r.detectedComplexity}</p>
              </div>
            ))}
          </div>

          {/* Operations comparison table */}
          <div className="bg-secondary rounded-lg overflow-hidden border border-border">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left px-3 py-2 text-xs text-muted-foreground font-medium">n</th>
                  <th className="text-right px-3 py-2 text-xs text-muted-foreground font-medium">{results[0]?.algorithm.name}</th>
                  <th className="text-right px-3 py-2 text-xs text-muted-foreground font-medium">{results[1]?.algorithm.name}</th>
                  <th className="text-right px-3 py-2 text-xs text-muted-foreground font-medium">Winner</th>
                </tr>
              </thead>
              <tbody>
                {inputSizes.map((n, i) => {
                  const opsA = results[0]?.operations[i] ?? 0;
                  const opsB = results[1]?.operations[i] ?? 0;
                  const winner = opsA < opsB ? results[0]?.algorithm.name : opsB < opsA ? results[1]?.algorithm.name : "Tie";
                  return (
                    <tr key={n} className="border-b border-border/50 last:border-0">
                      <td className="px-3 py-1.5 font-mono text-foreground text-xs">{n.toLocaleString()}</td>
                      <td className={`px-3 py-1.5 text-right font-mono text-xs ${opsA <= opsB ? "text-primary font-bold" : "text-muted-foreground"}`}>{opsA.toLocaleString()}</td>
                      <td className={`px-3 py-1.5 text-right font-mono text-xs ${opsB <= opsA ? "text-primary font-bold" : "text-muted-foreground"}`}>{opsB.toLocaleString()}</td>
                      <td className="px-3 py-1.5 text-right text-xs text-accent">{winner}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
