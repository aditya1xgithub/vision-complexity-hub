import { Algorithm } from "@/lib/algorithms";
import { Code2, Clock, HardDrive } from "lucide-react";

interface Props {
  algorithm: Algorithm | null;
}

export function CodeViewer({ algorithm }: Props) {
  if (!algorithm) {
    return (
      <div className="flex items-center justify-center h-full text-muted-foreground text-sm">
        Select an algorithm to view its details
      </div>
    );
  }

  return (
    <div className="space-y-4 animate-slide-in">
      {/* Description */}
      <div>
        <h3 className="text-lg font-semibold text-foreground mb-1">{algorithm.name}</h3>
        <p className="text-sm text-muted-foreground leading-relaxed">{algorithm.description}</p>
      </div>

      {/* Complexity badges */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-secondary rounded-lg p-3 border border-border">
          <div className="flex items-center gap-1.5 mb-1.5">
            <Clock className="h-3.5 w-3.5 text-accent" />
            <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium">
              Time Complexity
            </span>
          </div>
          <div className="space-y-1 text-xs font-mono">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Best</span>
              <span className="text-chart-green">{algorithm.timeComplexity.best}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Average</span>
              <span className="text-chart-orange">{algorithm.timeComplexity.average}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Worst</span>
              <span className="text-chart-red">{algorithm.timeComplexity.worst}</span>
            </div>
          </div>
        </div>
        <div className="bg-secondary rounded-lg p-3 border border-border">
          <div className="flex items-center gap-1.5 mb-1.5">
            <HardDrive className="h-3.5 w-3.5 text-chart-blue" />
            <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium">
              Space
            </span>
          </div>
          <p className="text-xl font-mono font-bold text-chart-blue">{algorithm.spaceComplexity}</p>
        </div>
      </div>

      {/* Pseudocode */}
      <div>
        <div className="flex items-center gap-1.5 mb-2">
          <Code2 className="h-3.5 w-3.5 text-primary" />
          <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium">
            Pseudocode
          </span>
        </div>
        <pre className="bg-muted/50 border border-border rounded-lg p-4 overflow-x-auto text-sm font-mono leading-relaxed">
          {algorithm.pseudocode.split("\n").map((line, i) => {
            const isComment = line.includes("//") || line.includes("←");
            const parts = line.split(/(\/\/.*|←.*)$/);
            return (
              <div key={i} className="flex">
                <span className="select-none text-muted-foreground/40 w-6 text-right mr-4 text-xs leading-relaxed">
                  {i + 1}
                </span>
                <span>
                  <span className="text-foreground">{parts[0]}</span>
                  {parts[1] && <span className="text-primary/70">{parts[1]}</span>}
                </span>
              </div>
            );
          })}
        </pre>
      </div>
    </div>
  );
}
