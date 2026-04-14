import { useState } from "react";
import { Algorithm, SimulationResult } from "@/lib/algorithms";
import { AlgorithmSelector } from "@/components/AlgorithmSelector";
import { SimulationPanel } from "@/components/SimulationPanel";
import { ComplexityGraph } from "@/components/ComplexityGraph";
import { CodeViewer } from "@/components/CodeViewer";
import { CodeAnalyzer } from "@/components/CodeAnalyzer";
import { ComparisonMode } from "@/components/ComparisonMode";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Activity, BarChart3, Code2, GitCompare, Cpu, Sparkles } from "lucide-react";

const Index = () => {
  const [selected, setSelected] = useState<Algorithm | null>(null);
  const [results, setResults] = useState<SimulationResult[]>([]);

  const handleResult = (result: SimulationResult) => {
    setResults((prev) => {
      const filtered = prev.filter((r) => r.algorithm.id !== result.algorithm.id);
      return [...filtered, result];
    });
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-[1600px] mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-primary/10 border border-primary/30 flex items-center justify-center glow-green-sm">
              <Cpu className="h-4 w-4 text-primary" />
            </div>
            <div>
              <h1 className="text-sm font-bold text-foreground tracking-tight leading-none">
                AlgoVision
              </h1>
              <p className="text-[10px] text-muted-foreground tracking-wider uppercase">
                Complexity Simulator
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            <span className="hidden sm:flex items-center gap-1.5">
              <Activity className="h-3 w-3 text-primary" />
              {results.length} simulation{results.length !== 1 ? "s" : ""} active
            </span>
          </div>
        </div>
      </header>

      {/* Main */}
      <div className="flex-1 max-w-[1600px] mx-auto w-full grid grid-cols-1 lg:grid-cols-[280px_1fr_340px] gap-0 lg:gap-0">
        {/* Left panel — Algorithm Library */}
        <aside className="border-b lg:border-b-0 lg:border-r border-border p-4 overflow-y-auto max-h-[calc(100vh-3.5rem)]">
          <div className="flex items-center gap-1.5 mb-3">
            <Code2 className="h-3.5 w-3.5 text-primary" />
            <h2 className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Algorithm Library
            </h2>
          </div>
          <AlgorithmSelector selected={selected} onSelect={setSelected} />
        </aside>

        {/* Center — Main content */}
        <main className="overflow-y-auto max-h-[calc(100vh-3.5rem)]">
          <Tabs defaultValue="details" className="h-full flex flex-col">
            <div className="border-b border-border px-4">
              <TabsList className="bg-transparent h-10 p-0 gap-0">
                <TabsTrigger
                  value="details"
                  className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:text-primary rounded-none px-4 text-xs font-medium"
                >
                  <Code2 className="h-3.5 w-3.5 mr-1.5" />
                  Details
                </TabsTrigger>
                <TabsTrigger
                  value="graph"
                  className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:text-primary rounded-none px-4 text-xs font-medium"
                >
                  <BarChart3 className="h-3.5 w-3.5 mr-1.5" />
                  Growth Graph
                </TabsTrigger>
                <TabsTrigger
                  value="compare"
                  className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:text-primary rounded-none px-4 text-xs font-medium"
                >
                  <GitCompare className="h-3.5 w-3.5 mr-1.5" />
                  Compare
                </TabsTrigger>
                <TabsTrigger
                  value="analyze"
                  className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:text-primary rounded-none px-4 text-xs font-medium"
                >
                  <Sparkles className="h-3.5 w-3.5 mr-1.5" />
                  Analyze Code
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="details" className="flex-1 p-4 mt-0">
              <CodeViewer algorithm={selected} />
            </TabsContent>

            <TabsContent value="graph" className="flex-1 p-4 mt-0">
              <div className="h-[400px] lg:h-[500px]">
                <ComplexityGraph results={results} />
              </div>
              {results.length > 0 && (
                <div className="mt-4 flex flex-wrap gap-3">
                  {results.map((r) => (
                    <div
                      key={r.algorithm.id}
                      className="bg-secondary rounded-lg px-3 py-2 border border-border"
                    >
                      <p className="text-xs text-muted-foreground">{r.algorithm.name}</p>
                      <p className="text-sm font-mono font-bold text-primary">
                        {r.detectedComplexity}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="compare" className="flex-1 p-4 mt-0">
              <ComparisonMode />
            </TabsContent>

            <TabsContent value="analyze" className="flex-1 p-4 mt-0">
              <CodeAnalyzer />
            </TabsContent>
          </Tabs>
        </main>

        {/* Right panel — Simulation */}
        <aside className="border-t lg:border-t-0 lg:border-l border-border p-4 overflow-y-auto max-h-[calc(100vh-3.5rem)]">
          <div className="flex items-center gap-1.5 mb-3">
            <Activity className="h-3.5 w-3.5 text-accent" />
            <h2 className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Simulation
            </h2>
          </div>
          <SimulationPanel algorithm={selected} onResult={handleResult} />
        </aside>
      </div>
    </div>
  );
};

export default Index;
