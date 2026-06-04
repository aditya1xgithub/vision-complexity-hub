// ─── Types ────────────────────────────────────────────────────
export interface GraphNode {
  id: number;
  x: number;
  y: number;
  label: string;
}

export interface GraphEdge {
  from: number;
  to: number;
  weight?: number;
}

export type NodeState = "unvisited" | "visiting" | "visited" | "current";

export interface GraphData {
  nodes: GraphNode[];
  edges: GraphEdge[];
}

// ─── Default graph ────────────────────────────────────────────
export const DEFAULT_NODES: GraphNode[] = [
  { id: 0, x: 200, y: 40, label: "A" },
  { id: 1, x: 80, y: 130, label: "B" },
  { id: 2, x: 320, y: 130, label: "C" },
  { id: 3, x: 40, y: 240, label: "D" },
  { id: 4, x: 160, y: 260, label: "E" },
  { id: 5, x: 280, y: 260, label: "F" },
  { id: 6, x: 370, y: 240, label: "G" },
];

export const DEFAULT_EDGES: GraphEdge[] = [
  { from: 0, to: 1, weight: 4 },
  { from: 0, to: 2, weight: 3 },
  { from: 1, to: 3, weight: 2 },
  { from: 1, to: 4, weight: 5 },
  { from: 2, to: 5, weight: 6 },
  { from: 2, to: 6, weight: 1 },
  { from: 1, to: 2, weight: 1 },
  { from: 4, to: 5, weight: 3 },
  { from: 3, to: 4, weight: 7 },
];

// ─── Build adjacency list ─────────────────────────────────────
export function buildAdj(nodeCount: number, edges: GraphEdge[]): number[][] {
  const adj: number[][] = Array.from({ length: nodeCount }, () => []);
  edges.forEach((e) => {
    adj[e.from].push(e.to);
    adj[e.to].push(e.from);
  });
  return adj;
}

// ─── Traversal algorithms ─────────────────────────────────────
export function bfsOrder(nodeCount: number, adj: number[][]): number[][] {
  if (nodeCount === 0) return [];
  const visited = new Set<number>();
  const steps: number[][] = [];
  for (let start = 0; start < nodeCount; start++) {
    if (visited.has(start)) continue;
    const queue = [start];
    visited.add(start);
    steps.push([...visited]);
    while (queue.length > 0) {
      const node = queue.shift()!;
      for (const nb of adj[node] || []) {
        if (!visited.has(nb)) {
          visited.add(nb);
          queue.push(nb);
          steps.push([...visited]);
        }
      }
    }
  }
  return steps;
}

export function dfsOrder(nodeCount: number, adj: number[][]): number[][] {
  if (nodeCount === 0) return [];
  const visited = new Set<number>();
  const steps: number[][] = [];
  function dfs(node: number) {
    visited.add(node);
    steps.push([...visited]);
    for (const nb of adj[node] || []) {
      if (!visited.has(nb)) dfs(nb);
    }
  }
  for (let i = 0; i < nodeCount; i++) {
    if (!visited.has(i)) dfs(i);
  }
  return steps;
}

export function dijkstraOrder(nodeCount: number, edges: GraphEdge[]): number[][] {
  const dist = Array(nodeCount).fill(Infinity);
  dist[0] = 0;
  const visited = new Set<number>();
  const steps: number[][] = [[0]];
  for (let i = 0; i < nodeCount; i++) {
    let u = -1;
    for (let v = 0; v < nodeCount; v++) {
      if (!visited.has(v) && (u === -1 || dist[v] < dist[u])) u = v;
    }
    if (u === -1 || dist[u] === Infinity) break;
    visited.add(u);
    steps.push([...visited]);
    for (const e of edges) {
      let nb = -1;
      const w = e.weight ?? 1;
      if (e.from === u) nb = e.to;
      else if (e.to === u) nb = e.from;
      if (nb !== -1 && dist[u] + w < dist[nb]) dist[nb] = dist[u] + w;
    }
  }
  return steps;
}

export function bellmanFordOrder(nodeCount: number, edges: GraphEdge[]): number[][] {
  const dist = Array(nodeCount).fill(Infinity);
  dist[0] = 0;
  const steps: number[][] = [[0]];
  const relaxed = new Set<number>([0]);
  for (let i = 0; i < nodeCount - 1; i++) {
    for (const e of edges) {
      const w = e.weight ?? 1;
      if (dist[e.from] + w < dist[e.to]) {
        dist[e.to] = dist[e.from] + w;
        relaxed.add(e.to);
        steps.push([...relaxed]);
      }
      if (dist[e.to] + w < dist[e.from]) {
        dist[e.from] = dist[e.to] + w;
        relaxed.add(e.from);
        steps.push([...relaxed]);
      }
    }
  }
  return steps;
}

export function getTraversalSteps(
  algoId: string,
  nodeCount: number,
  edges: GraphEdge[],
  adj: number[][]
): number[][] {
  switch (algoId) {
    case "bfs":
    case "kahns":
      return bfsOrder(nodeCount, adj);
    case "dfs":
    case "topological-sort":
      return dfsOrder(nodeCount, adj);
    case "dijkstra":
    case "kruskal":
    case "prims":
      return dijkstraOrder(nodeCount, edges);
    case "bellman-ford":
    case "floyd-warshall":
      return bellmanFordOrder(nodeCount, edges);
    default:
      return bfsOrder(nodeCount, adj);
  }
}

// ─── Node colors ──────────────────────────────────────────────
export const NODE_COLORS: Record<NodeState, string> = {
  unvisited: "hsl(220, 13%, 20%)",
  visiting: "hsl(38, 92%, 50%)",
  visited: "hsl(142, 70%, 49%)",
  current: "hsl(217, 91%, 60%)",
};

// ─── Layout helper: arrange N nodes in a circle ───────────────
// When edges are provided, reorder nodes around the circle using BFS so
// connected vertices sit next to each other — this dramatically reduces
// edge crossings and produces a cleaner, less complex looking diagram.
// Simple, predictable circular layout — nodes placed in ID order around
// a circle. Keeps diagrams easy to read (e.g. 0-1-2-3-0 becomes a clean
// square along the rim with no crossings).
export function layoutNodesCircle(
  count: number,
  _edges?: GraphEdge[],
  cx = 210,
  cy = 155,
  r = 110
): GraphNode[] {
  const labels = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const result: GraphNode[] = [];
  for (let i = 0; i < count; i++) {
    const angle = (2 * Math.PI * i) / count - Math.PI / 2;
    result.push({
      id: i,
      x: Math.round(cx + r * Math.cos(angle)),
      y: Math.round(cy + r * Math.sin(angle)),
      label: labels[i] || `${i}`,
    });
  }
  return result;
}
