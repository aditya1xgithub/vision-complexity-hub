import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { GraduationCap, CheckCircle2, XCircle, RotateCcw, Trophy } from "lucide-react";

interface Question {
  q: string;
  options: string[];
  answer: number;
  explain: string;
  topic: string;
}

const QUESTIONS: Question[] = [
  {
    q: "What is the worst-case time complexity of Binary Search?",
    options: ["O(n)", "O(log n)", "O(n log n)", "O(1)"],
    answer: 1,
    explain: "Binary search halves the search space each step, giving log₂(n) iterations.",
    topic: "Searching",
  },
  {
    q: "Which algorithm uses the Divide and Conquer paradigm?",
    options: ["Bubble Sort", "Linear Search", "Merge Sort", "Kadane's Algorithm"],
    answer: 2,
    explain: "Merge Sort divides the array into halves, sorts each half recursively, and merges them.",
    topic: "Paradigms",
  },
  {
    q: "What is the average time complexity of Quick Sort?",
    options: ["O(n²)", "O(n log n)", "O(log n)", "O(n)"],
    answer: 1,
    explain: "Quick Sort partitions around a pivot. Balanced pivots give O(n log n) on average.",
    topic: "Sorting",
  },
  {
    q: "Dijkstra's algorithm follows which paradigm?",
    options: ["Dynamic Programming", "Greedy", "Backtracking", "Divide and Conquer"],
    answer: 1,
    explain: "Dijkstra greedily picks the unvisited node with the smallest tentative distance.",
    topic: "Graph Algorithms",
  },
  {
    q: "Space complexity of recursive Merge Sort is:",
    options: ["O(1)", "O(log n)", "O(n)", "O(n²)"],
    answer: 2,
    explain: "Merge Sort needs O(n) auxiliary space for the temporary merge arrays.",
    topic: "Space Complexity",
  },
  {
    q: "Kadane's algorithm solves which problem?",
    options: ["Shortest Path", "Maximum Subarray Sum", "LCS", "MST"],
    answer: 1,
    explain: "Kadane's finds the contiguous subarray with the largest sum in O(n) using DP.",
    topic: "Dynamic Programming",
  },
  {
    q: "BFS on a graph with V vertices and E edges runs in:",
    options: ["O(V)", "O(V·E)", "O(V+E)", "O(V²)"],
    answer: 2,
    explain: "BFS visits every vertex and every edge once when using an adjacency list.",
    topic: "Graph Algorithms",
  },
  {
    q: "Big-O notation describes:",
    options: ["Exact running time", "Best-case bound", "Upper bound on growth", "Memory used"],
    answer: 2,
    explain: "Big-O gives an asymptotic upper bound on how an algorithm scales with input size.",
    topic: "Theory",
  },
  {
    q: "Which sorting algorithm is stable and in-place?",
    options: ["Quick Sort", "Merge Sort", "Insertion Sort", "Heap Sort"],
    answer: 2,
    explain: "Insertion Sort preserves the relative order of equal keys and uses O(1) extra memory.",
    topic: "Sorting",
  },
  {
    q: "If T(n) = 2T(n/2) + O(n), by Master Theorem T(n) is:",
    options: ["O(n)", "O(n log n)", "O(n²)", "O(log n)"],
    answer: 1,
    explain: "Case 2 of Master Theorem: f(n) = Θ(n^(log_b a)) ⇒ T(n) = Θ(n log n). This is Merge Sort's recurrence.",
    topic: "Recurrences",
  },
];

export function QuizMode() {
  const [idx, setIdx] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);
  const [answered, setAnswered] = useState<boolean[]>([]);

  const q = QUESTIONS[idx];

  const submit = (i: number) => {
    if (selected !== null) return;
    setSelected(i);
    const correct = i === q.answer;
    if (correct) setScore((s) => s + 1);
    setAnswered((a) => [...a, correct]);
  };

  const next = () => {
    if (idx + 1 >= QUESTIONS.length) setDone(true);
    else {
      setIdx(idx + 1);
      setSelected(null);
    }
  };

  const reset = () => {
    setIdx(0); setSelected(null); setScore(0); setDone(false); setAnswered([]);
  };

  if (done) {
    const pct = Math.round((score / QUESTIONS.length) * 100);
    const grade = pct >= 90 ? "Excellent" : pct >= 70 ? "Good" : pct >= 50 ? "Average" : "Needs Practice";
    return (
      <div className="max-w-xl mx-auto text-center space-y-5 py-10">
        <Trophy className="h-16 w-16 text-accent mx-auto" />
        <h2 className="text-2xl font-bold">Quiz Complete</h2>
        <div className="text-5xl font-mono font-bold text-primary">{score}/{QUESTIONS.length}</div>
        <Badge variant="outline" className="text-sm">{grade} — {pct}%</Badge>
        <div className="flex justify-center gap-1 flex-wrap max-w-md mx-auto">
          {answered.map((c, i) => (
            <div key={i} className={`w-6 h-6 rounded text-[10px] flex items-center justify-center font-mono ${c ? "bg-chart-green/20 text-chart-green" : "bg-chart-red/20 text-chart-red"}`}>
              {i + 1}
            </div>
          ))}
        </div>
        <Button onClick={reset} className="gap-2"><RotateCcw className="h-4 w-4" /> Retake Quiz</Button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-5">
      <div className="flex items-center gap-2">
        <GraduationCap className="h-4 w-4 text-primary" />
        <h3 className="text-sm font-semibold">DAA Viva Quiz</h3>
        <Badge variant="outline" className="ml-auto font-mono text-[10px]">
          {idx + 1} / {QUESTIONS.length}
        </Badge>
        <Badge className="font-mono text-[10px] bg-primary/15 text-primary border-primary/30">
          Score: {score}
        </Badge>
      </div>

      <div className="h-1 bg-secondary rounded-full overflow-hidden">
        <div className="h-full bg-primary transition-all" style={{ width: `${((idx) / QUESTIONS.length) * 100}%` }} />
      </div>

      <div className="bg-card border border-border rounded-lg p-5 space-y-4">
        <Badge variant="secondary" className="text-[10px]">{q.topic}</Badge>
        <h4 className="text-base font-semibold leading-snug">{q.q}</h4>

        <div className="space-y-2">
          {q.options.map((opt, i) => {
            const isAnswer = i === q.answer;
            const isPicked = selected === i;
            let cls = "border-border bg-secondary/40 hover:bg-secondary";
            if (selected !== null) {
              if (isAnswer) cls = "border-chart-green bg-chart-green/10 text-chart-green";
              else if (isPicked) cls = "border-chart-red bg-chart-red/10 text-chart-red";
              else cls = "border-border bg-secondary/20 opacity-60";
            }
            return (
              <button
                key={i}
                onClick={() => submit(i)}
                disabled={selected !== null}
                className={`w-full text-left px-4 py-2.5 rounded-lg border text-sm font-mono flex items-center gap-3 transition-colors ${cls}`}
              >
                <span className="text-xs opacity-60">{String.fromCharCode(65 + i)}.</span>
                <span className="flex-1">{opt}</span>
                {selected !== null && isAnswer && <CheckCircle2 className="h-4 w-4" />}
                {selected !== null && isPicked && !isAnswer && <XCircle className="h-4 w-4" />}
              </button>
            );
          })}
        </div>

        {selected !== null && (
          <div className="bg-secondary/60 border border-border rounded p-3 text-xs text-muted-foreground animate-slide-in">
            <span className="font-semibold text-foreground">Explanation: </span>{q.explain}
          </div>
        )}
      </div>

      <div className="flex justify-end">
        <Button onClick={next} disabled={selected === null}>
          {idx + 1 >= QUESTIONS.length ? "Finish" : "Next Question"}
        </Button>
      </div>
    </div>
  );
}
