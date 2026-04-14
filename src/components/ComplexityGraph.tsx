import { SimulationResult } from "@/lib/algorithms";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

interface Props {
  results: SimulationResult[];
}

const COLORS = [
  "hsl(142, 70%, 49%)",
  "hsl(217, 91%, 60%)",
  "hsl(38, 92%, 50%)",
  "hsl(0, 72%, 51%)",
  "hsl(270, 70%, 60%)",
];

export function ComplexityGraph({ results }: Props) {
  if (results.length === 0) {
    return (
      <div className="flex items-center justify-center h-full text-muted-foreground text-sm">
        Run a simulation to see the growth graph
      </div>
    );
  }

  // Build unified data from all results
  const allSizes = [...new Set(results.flatMap((r) => r.inputSizes))].sort((a, b) => a - b);

  const data = allSizes.map((n) => {
    const point: Record<string, number> = { n };
    results.forEach((r) => {
      const idx = r.inputSizes.indexOf(n);
      if (idx !== -1) point[r.algorithm.name] = r.operations[idx];
    });
    return point;
  });

  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={data} margin={{ top: 10, right: 20, bottom: 10, left: 10 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 13%, 20%)" />
        <XAxis
          dataKey="n"
          stroke="hsl(215, 14%, 55%)"
          fontSize={11}
          fontFamily="JetBrains Mono"
          tickFormatter={(v: number) => v >= 1000 ? `${v / 1000}k` : String(v)}
          label={{ value: "Input Size (n)", position: "insideBottom", offset: -5, style: { fill: "hsl(215, 14%, 55%)", fontSize: 11 } }}
        />
        <YAxis
          stroke="hsl(215, 14%, 55%)"
          fontSize={11}
          fontFamily="JetBrains Mono"
          tickFormatter={(v: number) => {
            if (v >= 1_000_000) return `${(v / 1_000_000).toFixed(1)}M`;
            if (v >= 1000) return `${(v / 1000).toFixed(1)}k`;
            return String(v);
          }}
          label={{ value: "Operations", angle: -90, position: "insideLeft", style: { fill: "hsl(215, 14%, 55%)", fontSize: 11 } }}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: "hsl(220, 13%, 13%)",
            border: "1px solid hsl(220, 13%, 20%)",
            borderRadius: "8px",
            fontFamily: "JetBrains Mono",
            fontSize: "12px",
          }}
          labelFormatter={(v) => `n = ${Number(v).toLocaleString()}`}
          formatter={(value: number) => [value.toLocaleString(), "ops"]}
        />
        <Legend
          wrapperStyle={{ fontFamily: "JetBrains Mono", fontSize: "12px" }}
        />
        {results.map((r, i) => (
          <Line
            key={r.algorithm.id}
            type="monotone"
            dataKey={r.algorithm.name}
            stroke={COLORS[i % COLORS.length]}
            strokeWidth={2.5}
            dot={{ r: 4, fill: COLORS[i % COLORS.length] }}
            activeDot={{ r: 6 }}
          />
        ))}
      </LineChart>
    </ResponsiveContainer>
  );
}
