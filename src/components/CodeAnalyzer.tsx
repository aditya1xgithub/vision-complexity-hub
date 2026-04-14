import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Clock, HardDrive, Lightbulb, Loader2, Sparkles, AlertTriangle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface AnalysisResult {
  timeComplexity: { best: string; average: string; worst: string };
  spaceComplexity: string;
  explanation: string;
  suggestions: string;
}

export function CodeAnalyzer() {
  const [code, setCode] = useState("");
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const analyze = async () => {
    if (!code.trim()) {
      toast({ title: "Please paste some code first", variant: "destructive" });
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      const { data, error } = await supabase.functions.invoke("analyze-code", {
        body: { code },
      });

      if (error) throw error;
      if (data.error) throw new Error(data.error);

      setResult(data);
    } catch (e: any) {
      toast({
        title: "Analysis failed",
        description: e.message || "Something went wrong",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4 animate-slide-in">
      <div>
        <h3 className="text-lg font-semibold text-foreground mb-1 flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-accent" />
          AI Code Complexity Analyzer
        </h3>
        <p className="text-sm text-muted-foreground">
          Paste any code snippet and get its time & space complexity analyzed instantly.
        </p>
      </div>

      <Textarea
        placeholder={`Paste your code here...\n\nExample:\nfor (int i = 0; i < n; i++) {\n  for (int j = 0; j < n; j++) {\n    sum += arr[i][j];\n  }\n}`}
        value={code}
        onChange={(e) => setCode(e.target.value)}
        className="font-mono text-sm min-h-[200px] bg-muted/50 border-border"
      />

      <Button onClick={analyze} disabled={loading} className="w-full">
        {loading ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin mr-2" />
            Analyzing...
          </>
        ) : (
          <>
            <Sparkles className="h-4 w-4 mr-2" />
            Analyze Complexity
          </>
        )}
      </Button>

      {result && (
        <div className="space-y-3 animate-slide-in">
          {/* Time Complexity */}
          <div className="bg-secondary rounded-lg p-4 border border-border">
            <div className="flex items-center gap-1.5 mb-2">
              <Clock className="h-4 w-4 text-accent" />
              <span className="text-xs uppercase tracking-wider text-muted-foreground font-medium">
                Time Complexity
              </span>
            </div>
            <div className="space-y-1.5 text-sm font-mono">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Best</span>
                <span className="text-chart-green font-bold">{result.timeComplexity.best}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Average</span>
                <span className="text-chart-orange font-bold">{result.timeComplexity.average}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Worst</span>
                <span className="text-chart-red font-bold">{result.timeComplexity.worst}</span>
              </div>
            </div>
          </div>

          {/* Space Complexity */}
          <div className="bg-secondary rounded-lg p-4 border border-border">
            <div className="flex items-center gap-1.5 mb-2">
              <HardDrive className="h-4 w-4 text-chart-blue" />
              <span className="text-xs uppercase tracking-wider text-muted-foreground font-medium">
                Space Complexity
              </span>
            </div>
            <p className="text-xl font-mono font-bold text-chart-blue">{result.spaceComplexity}</p>
          </div>

          {/* Explanation */}
          <div className="bg-secondary rounded-lg p-4 border border-border">
            <div className="flex items-center gap-1.5 mb-2">
              <Lightbulb className="h-4 w-4 text-accent" />
              <span className="text-xs uppercase tracking-wider text-muted-foreground font-medium">
                Explanation
              </span>
            </div>
            <p className="text-sm text-foreground leading-relaxed">{result.explanation}</p>
          </div>

          {/* Suggestions */}
          <div className="bg-secondary rounded-lg p-4 border border-border">
            <div className="flex items-center gap-1.5 mb-2">
              <AlertTriangle className="h-4 w-4 text-chart-orange" />
              <span className="text-xs uppercase tracking-wider text-muted-foreground font-medium">
                Optimization
              </span>
            </div>
            <p className="text-sm text-foreground leading-relaxed">{result.suggestions}</p>
          </div>
        </div>
      )}
    </div>
  );
}
