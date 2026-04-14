import { algorithms, Algorithm } from "@/lib/algorithms";
import { Search, ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";

interface Props {
  selected: Algorithm | null;
  onSelect: (algo: Algorithm) => void;
}

export function AlgorithmSelector({ selected, onSelect }: Props) {
  const [filter, setFilter] = useState("");
  const filtered = algorithms.filter((a) =>
    a.name.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <div className="space-y-3">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <input
          type="text"
          placeholder="Search algorithms..."
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-secondary border border-border text-foreground placeholder:text-muted-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
        />
      </div>

      <div className="space-y-1.5">
        {filtered.map((algo) => {
          const isActive = selected?.id === algo.id;
          return (
            <button
              key={algo.id}
              onClick={() => onSelect(algo)}
              className={`w-full text-left px-3 py-2.5 rounded-lg transition-all group flex items-center justify-between ${
                isActive
                  ? "bg-primary/10 border border-primary/30 glow-green-sm"
                  : "hover:bg-secondary border border-transparent"
              }`}
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <div
                  className={`w-2 h-2 rounded-full flex-shrink-0 ${
                    isActive ? "bg-primary animate-pulse-glow" : "bg-muted-foreground/40"
                  }`}
                />
                <div className="min-w-0">
                  <p className={`text-sm font-medium truncate ${isActive ? "text-primary" : "text-foreground"}`}>
                    {algo.name}
                  </p>
                  <p className="text-xs text-muted-foreground truncate">{algo.timeComplexity.average}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <Badge
                  variant="secondary"
                  className="text-[10px] px-1.5 py-0 h-5"
                >
                  {algo.category}
                </Badge>
                <ArrowRight
                  className={`h-3.5 w-3.5 transition-all ${
                    isActive
                      ? "text-primary opacity-100"
                      : "text-muted-foreground opacity-0 group-hover:opacity-100"
                  }`}
                />
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
