import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Play, Pause, Shuffle, RotateCcw, BarChart3 } from "lucide-react";
import { Badge } from "@/components/ui/badge";

type SortAlgo = "bubble" | "selection" | "insertion" | "quick" | "merge";

interface Frame {
  arr: number[];
  compare?: [number, number];
  swap?: [number, number];
  sorted?: number[];
  pivot?: number;
}

const ALGOS: { id: SortAlgo; name: string; complexity: string }[] = [
  { id: "bubble", name: "Bubble Sort", complexity: "O(n²)" },
  { id: "selection", name: "Selection Sort", complexity: "O(n²)" },
  { id: "insertion", name: "Insertion Sort", complexity: "O(n²)" },
  { id: "quick", name: "Quick Sort", complexity: "O(n log n)" },
  { id: "merge", name: "Merge Sort", complexity: "O(n log n)" },
];

// ---------- frame generators ----------
function bubbleFrames(a: number[]): Frame[] {
  const frames: Frame[] = [{ arr: [...a] }];
  const arr = [...a];
  const sorted: number[] = [];
  for (let i = 0; i < arr.length - 1; i++) {
    for (let j = 0; j < arr.length - i - 1; j++) {
      frames.push({ arr: [...arr], compare: [j, j + 1], sorted: [...sorted] });
      if (arr[j] > arr[j + 1]) {
        [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
        frames.push({ arr: [...arr], swap: [j, j + 1], sorted: [...sorted] });
      }
    }
    sorted.unshift(arr.length - i - 1);
  }
  frames.push({ arr: [...arr], sorted: arr.map((_, i) => i) });
  return frames;
}

function selectionFrames(a: number[]): Frame[] {
  const frames: Frame[] = [{ arr: [...a] }];
  const arr = [...a];
  const sorted: number[] = [];
  for (let i = 0; i < arr.length; i++) {
    let min = i;
    for (let j = i + 1; j < arr.length; j++) {
      frames.push({ arr: [...arr], compare: [min, j], sorted: [...sorted] });
      if (arr[j] < arr[min]) min = j;
    }
    if (min !== i) {
      [arr[i], arr[min]] = [arr[min], arr[i]];
      frames.push({ arr: [...arr], swap: [i, min], sorted: [...sorted] });
    }
    sorted.push(i);
  }
  frames.push({ arr: [...arr], sorted: arr.map((_, i) => i) });
  return frames;
}

function insertionFrames(a: number[]): Frame[] {
  const frames: Frame[] = [{ arr: [...a] }];
  const arr = [...a];
  for (let i = 1; i < arr.length; i++) {
    let j = i;
    while (j > 0) {
      frames.push({ arr: [...arr], compare: [j - 1, j] });
      if (arr[j - 1] > arr[j]) {
        [arr[j - 1], arr[j]] = [arr[j], arr[j - 1]];
        frames.push({ arr: [...arr], swap: [j - 1, j] });
        j--;
      } else break;
    }
  }
  frames.push({ arr: [...arr], sorted: arr.map((_, i) => i) });
  return frames;
}

function quickFrames(a: number[]): Frame[] {
  const frames: Frame[] = [{ arr: [...a] }];
  const arr = [...a];
  const sorted: number[] = [];
  const qs = (lo: number, hi: number) => {
    if (lo >= hi) {
      if (lo === hi) sorted.push(lo);
      return;
    }
    const pivot = arr[hi];
    let i = lo - 1;
    for (let j = lo; j < hi; j++) {
      frames.push({ arr: [...arr], compare: [j, hi], pivot: hi, sorted: [...sorted] });
      if (arr[j] < pivot) {
        i++;
        [arr[i], arr[j]] = [arr[j], arr[i]];
        frames.push({ arr: [...arr], swap: [i, j], pivot: hi, sorted: [...sorted] });
      }
    }
    [arr[i + 1], arr[hi]] = [arr[hi], arr[i + 1]];
    frames.push({ arr: [...arr], swap: [i + 1, hi], sorted: [...sorted] });
    sorted.push(i + 1);
    qs(lo, i);
    qs(i + 2, hi);
  };
  qs(0, arr.length - 1);
  frames.push({ arr: [...arr], sorted: arr.map((_, i) => i) });
  return frames;
}

function mergeFrames(a: number[]): Frame[] {
  const frames: Frame[] = [{ arr: [...a] }];
  const arr = [...a];
  const ms = (lo: number, hi: number) => {
    if (lo >= hi) return;
    const mid = Math.floor((lo + hi) / 2);
    ms(lo, mid);
    ms(mid + 1, hi);
    const left = arr.slice(lo, mid + 1);
    const right = arr.slice(mid + 1, hi + 1);
    let i = 0, j = 0, k = lo;
    while (i < left.length && j < right.length) {
      frames.push({ arr: [...arr], compare: [lo + i, mid + 1 + j] });
      if (left[i] <= right[j]) arr[k++] = left[i++];
      else arr[k++] = right[j++];
      frames.push({ arr: [...arr], swap: [k - 1, k - 1] });
    }
    while (i < left.length) { arr[k++] = left[i++]; frames.push({ arr: [...arr], swap: [k - 1, k - 1] }); }
    while (j < right.length) { arr[k++] = right[j++]; frames.push({ arr: [...arr], swap: [k - 1, k - 1] }); }
  };
  ms(0, arr.length - 1);
  frames.push({ arr: [...arr], sorted: arr.map((_, i) => i) });
  return frames;
}

const GEN: Record<SortAlgo, (a: number[]) => Frame[]> = {
  bubble: bubbleFrames,
  selection: selectionFrames,
  insertion: insertionFrames,
  quick: quickFrames,
  merge: mergeFrames,
};

function randomArr(n: number): number[] {
  return Array.from({ length: n }, () => Math.floor(Math.random() * 95) + 5);
}

export function SortingVisualizer() {
  const [algo, setAlgo] = useState<SortAlgo>("bubble");
  const [size, setSize] = useState(25);
  const [arr, setArr] = useState<number[]>(() => randomArr(25));
  const [frames, setFrames] = useState<Frame[]>([{ arr }]);
  const [idx, setIdx] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(50);
  const [comparisons, setComparisons] = useState(0);
  const [swaps, setSwaps] = useState(0);
  const timer = useRef<number | null>(null);

  const reset = (newArr?: number[]) => {
    const base = newArr ?? arr;
    setArr(base);
    setFrames(GEN[algo](base));
    setIdx(0);
    setPlaying(false);
    setComparisons(0);
    setSwaps(0);
  };

  useEffect(() => { reset(); /* eslint-disable-next-line */ }, [algo]);

  useEffect(() => {
    if (!playing) return;
    timer.current = window.setTimeout(() => {
      setIdx((i) => {
        if (i >= frames.length - 1) { setPlaying(false); return i; }
        const next = frames[i + 1];
        if (next.compare) setComparisons((c) => c + 1);
        if (next.swap && next.swap[0] !== next.swap[1]) setSwaps((s) => s + 1);
        return i + 1;
      });
    }, 210 - speed * 2);
    return () => { if (timer.current) clearTimeout(timer.current); };
  }, [playing, idx, frames, speed]);

  const shuffle = () => {
    const a = randomArr(size);
    reset(a);
  };

  const onSize = (n: number) => {
    setSize(n);
    const a = randomArr(n);
    reset(a);
  };

  const current = frames[idx] ?? { arr };
  const maxVal = Math.max(...current.arr, 1);
  const progress = frames.length > 1 ? (idx / (frames.length - 1)) * 100 : 0;
  const meta = ALGOS.find((x) => x.id === algo)!;

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-1">
        <BarChart3 className="h-4 w-4 text-primary" />
        <h3 className="text-sm font-semibold">Live Sorting Visualizer</h3>
        <Badge variant="outline" className="ml-auto font-mono text-[10px]">{meta.complexity}</Badge>
      </div>

      <div className="flex flex-wrap gap-2">
        {ALGOS.map((a) => (
          <button
            key={a.id}
            onClick={() => setAlgo(a.id)}
            className={`text-xs px-2.5 py-1 rounded border font-mono transition-colors ${
              algo === a.id
                ? "bg-primary/15 border-primary text-primary"
                : "bg-secondary border-border text-muted-foreground hover:text-foreground"
            }`}
          >
            {a.name}
          </button>
        ))}
      </div>

      {/* Bars */}
      <div className="bg-secondary/40 border border-border rounded-lg p-3 h-72 flex items-end gap-[2px]">
        {current.arr.map((v, i) => {
          let bg = "hsl(var(--chart-blue))";
          if (current.sorted?.includes(i)) bg = "hsl(var(--chart-green))";
          if (current.compare?.includes(i)) bg = "hsl(var(--chart-orange))";
          if (current.swap?.includes(i)) bg = "hsl(var(--chart-red))";
          if (current.pivot === i) bg = "hsl(var(--accent))";
          return (
            <div
              key={i}
              className="flex-1 rounded-t transition-all duration-100"
              style={{ height: `${(v / maxVal) * 100}%`, background: bg }}
              title={`${v}`}
            />
          );
        })}
      </div>

      {/* Progress */}
      <div className="h-1 bg-secondary rounded-full overflow-hidden">
        <div className="h-full bg-primary transition-all" style={{ width: `${progress}%` }} />
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-2 text-xs">
        <div className="bg-secondary rounded p-2">
          <div className="text-muted-foreground uppercase text-[10px]">Step</div>
          <div className="font-mono text-primary font-semibold">{idx}/{frames.length - 1}</div>
        </div>
        <div className="bg-secondary rounded p-2">
          <div className="text-muted-foreground uppercase text-[10px]">Compares</div>
          <div className="font-mono text-chart-orange font-semibold">{comparisons}</div>
        </div>
        <div className="bg-secondary rounded p-2">
          <div className="text-muted-foreground uppercase text-[10px]">Swaps</div>
          <div className="font-mono text-chart-red font-semibold">{swaps}</div>
        </div>
        <div className="bg-secondary rounded p-2">
          <div className="text-muted-foreground uppercase text-[10px]">Size</div>
          <div className="font-mono text-foreground font-semibold">{size}</div>
        </div>
      </div>

      {/* Controls */}
      <div className="flex flex-wrap items-center gap-2">
        <Button size="sm" onClick={() => setPlaying((p) => !p)} className="gap-1.5">
          {playing ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}
          {playing ? "Pause" : "Play"}
        </Button>
        <Button size="sm" variant="outline" onClick={shuffle} className="gap-1.5">
          <Shuffle className="h-3.5 w-3.5" /> Shuffle
        </Button>
        <Button size="sm" variant="outline" onClick={() => reset()} className="gap-1.5">
          <RotateCcw className="h-3.5 w-3.5" /> Reset
        </Button>
        <div className="flex items-center gap-2 ml-auto text-xs">
          <span className="text-muted-foreground">Size</span>
          <input
            type="range" min={8} max={60} value={size}
            onChange={(e) => onSize(parseInt(e.target.value))}
            className="w-24 accent-primary"
          />
          <span className="text-muted-foreground">Speed</span>
          <input
            type="range" min={1} max={100} value={speed}
            onChange={(e) => setSpeed(parseInt(e.target.value))}
            className="w-24 accent-primary"
          />
        </div>
      </div>

      <div className="flex flex-wrap gap-3 text-[11px] text-muted-foreground">
        <Legend color="hsl(var(--chart-blue))" label="Unsorted" />
        <Legend color="hsl(var(--chart-orange))" label="Comparing" />
        <Legend color="hsl(var(--chart-red))" label="Swapping" />
        <Legend color="hsl(var(--accent))" label="Pivot" />
        <Legend color="hsl(var(--chart-green))" label="Sorted" />
      </div>
    </div>
  );
}

function Legend({ color, label }: { color: string; label: string }) {
  return (
    <div className="flex items-center gap-1.5">
      <div className="w-3 h-3 rounded-sm" style={{ background: color }} />
      <span>{label}</span>
    </div>
  );
}
