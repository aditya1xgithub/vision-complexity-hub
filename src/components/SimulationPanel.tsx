import { useState } from "react";
import { Algorithm, runSimulation, SimulationResult } from "@/lib/algorithms";
import { Play, Plus, X, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface Props {
  algorithm: Algorithm | null;
  onResult: (result: SimulationResult) => void;
}

const presets = [10, 100, 1000, 5000, 10000];

export function SimulationPanel({ algorithm, onResult }: Props) {
  const [inputSizes, setInputSizes] = useState<number[]>([10, 100, 1000, 10000]);
  const [customValue, setCustomValue] = useState("");
  const [result, setResult] = useState<SimulationResult | null>(null);

  const addSize = () => {
    const val = parseInt(customValue);
    if (val > 0 && !inputSizes.includes(val)) {
      setInputSizes([...inputSizes, val].sort((a, b) => a - b));
      setCustomValue("");
    }
  };

  const removeSize = (n: number) => {
    setInputSizes(inputSizes.filter((s) => s !== n));
  };

  const simulate = async () => {
    if (!algorithm || inputSizes.length === 0) return;
    const res = await runSimulation(algorithm, inputSizes);
    setResult(res);
    onResult(res);
  };

  const complexityColor: Record<string, string> = {
    "O(1)": "text-chart-green",
    "O(log n)": "text-chart-blue",
    "O(n)": "text-chart-green",
    "O(n log n)": "text-chart-orange",
    "O(n²)": "text-chart-red",
    "O(n³)": "text-chart-red",
    "O(V+E)": "text-chart-blue",
  };

  return (
    <div className="space-y-5">
      {/* Input sizes */}
      <div>
        <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2 block">
          Input Sizes
        </label>
        <div className="flex flex-wrap gap-2 mb-3">
          {inputSizes.map((n) => (
            <Badge
              key={n}
              variant="secondary"
              className="pl-2.5 pr-1.5 py-1 text-sm font-mono cursor-default group"
            >
              n={n.toLocaleString()}
              <button
                onClick={() => removeSize(n)}
                className="ml-1.5 rounded-full p-0.5 hover:bg-destructive/20 transition-colors"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
        </div>
        <div className="flex gap-2">
          <input
            type="number"
            placeholder="Custom size..."
            value={customValue}
            onChange={(e) => setCustomValue(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addSize()}
            className="flex-1 px-3 py-2 rounded-lg bg-secondary border border-border text-foreground placeholder:text-muted-foreground text-sm font-mono focus:outline-none focus:ring-2 focus:ring-primary/50"
          />
          <Button size="sm" variant="outline" onClick={addSize}>
            <Plus className="h-4 w-4" />
          </Button>
        </div>
        <div className="flex gap-1.5 mt-2">
          {presets.map((p) => (
            <button
              key={p}
              onClick={() => {
                if (!inputSizes.includes(p))
                  setInputSizes([...inputSizes, p].sort((a, b) => a - b));
              }}
              className="text-xs px-2 py-1 rounded bg-muted hover:bg-muted/80 text-muted-foreground hover:text-foreground transition-colors font-mono"
            >
              {p.toLocaleString()}
            </button>
          ))}
        </div>
      </div>

      {/* Run button */}
      <Button
        onClick={simulate}
        disabled={!algorithm || inputSizes.length === 0}
        className="w-full gap-2 bg-primary text-primary-foreground hover:bg-primary/90 glow-green-sm font-semibold"
      >
        <Play className="h-4 w-4" />
        Run Simulation
      </Button>

      {/* Results */}
      {result && (
        <div className="animate-slide-in space-y-4">
          <div className="flex items-center gap-2">
            <Zap className="h-4 w-4 text-accent" />
            <span className="text-sm font-medium">Detected Complexity:</span>
            <span className={`font-mono font-bold text-lg ${complexityColor[result.detectedComplexity] ?? "text-foreground"}`}>
              {result.detectedComplexity}
            </span>
          </div>

          <div className="bg-secondary rounded-lg overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left px-3 py-2 text-xs text-muted-foreground font-medium uppercase tracking-wider">
                    Input (n)
                  </th>
                  <th className="text-right px-3 py-2 text-xs text-muted-foreground font-medium uppercase tracking-wider">
                    Operations
                  </th>
                </tr>
              </thead>
              <tbody>
                {result.inputSizes.map((n, i) => (
                  <tr key={n} className="border-b border-border/50 last:border-0">
                    <td className="px-3 py-2 font-mono text-foreground">
                      {n.toLocaleString()}
                    </td>
                    <td className="px-3 py-2 text-right font-mono text-primary font-medium">
                      {result.operations[i].toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
