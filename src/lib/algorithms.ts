export type ComplexityClass = "O(1)" | "O(log n)" | "O(n)" | "O(n log n)" | "O(n²)";

export interface Algorithm {
  id: string;
  name: string;
  category: "search" | "sort";
  description: string;
  timeComplexity: { best: string; average: string; worst: string };
  spaceComplexity: string;
  expectedClass: ComplexityClass;
  pseudocode: string;
  simulate: (n: number) => number;
  color: string;
}

export const algorithms: Algorithm[] = [
  {
    id: "linear-search",
    name: "Linear Search",
    category: "search",
    description:
      "Sequentially checks each element of the list until a match is found or the whole list has been searched. Simple but inefficient for large datasets.",
    timeComplexity: { best: "O(1)", average: "O(n)", worst: "O(n)" },
    spaceComplexity: "O(1)",
    expectedClass: "O(n)",
    pseudocode: `function linearSearch(arr, target):
    for i = 0 to arr.length - 1:   // ← n iterations
        if arr[i] == target:        // ← 1 comparison
            return i                // found
    return -1                       // not found`,
    simulate: (n) => n, // average case: n operations
    color: "hsl(var(--chart-green))",
  },
  {
    id: "binary-search",
    name: "Binary Search",
    category: "search",
    description:
      "Efficiently finds an element in a sorted array by repeatedly dividing the search interval in half. Much faster than linear search for sorted data.",
    timeComplexity: { best: "O(1)", average: "O(log n)", worst: "O(log n)" },
    spaceComplexity: "O(1)",
    expectedClass: "O(log n)",
    pseudocode: `function binarySearch(arr, target):
    low = 0, high = arr.length - 1
    while low <= high:              // ← log₂(n) iterations
        mid = (low + high) / 2     // ← 1 operation
        if arr[mid] == target:
            return mid
        else if arr[mid] < target:
            low = mid + 1           // ← halve search space
        else:
            high = mid - 1          // ← halve search space
    return -1`,
    simulate: (n) => Math.ceil(Math.log2(n + 1)),
    color: "hsl(var(--chart-blue))",
  },
  {
    id: "bubble-sort",
    name: "Bubble Sort",
    category: "sort",
    description:
      "Repeatedly steps through the list, compares adjacent elements and swaps them if they are in the wrong order. Simple but very slow for large lists.",
    timeComplexity: { best: "O(n)", average: "O(n²)", worst: "O(n²)" },
    spaceComplexity: "O(1)",
    expectedClass: "O(n²)",
    pseudocode: `function bubbleSort(arr):
    for i = 0 to n - 1:            // ← n passes
        for j = 0 to n - i - 1:    // ← n - i comparisons
            if arr[j] > arr[j+1]:  // ← 1 comparison
                swap(arr[j], arr[j+1])
    return arr`,
    simulate: (n) => Math.floor((n * (n - 1)) / 2),
    color: "hsl(var(--chart-red))",
  },
  {
    id: "merge-sort",
    name: "Merge Sort",
    category: "sort",
    description:
      "Divide-and-conquer algorithm that splits the array in half, recursively sorts each half, then merges them. Guarantees O(n log n) performance.",
    timeComplexity: { best: "O(n log n)", average: "O(n log n)", worst: "O(n log n)" },
    spaceComplexity: "O(n)",
    expectedClass: "O(n log n)",
    pseudocode: `function mergeSort(arr):
    if arr.length <= 1: return arr
    mid = arr.length / 2            // ← split
    left = mergeSort(arr[0..mid])   // ← recurse left
    right = mergeSort(arr[mid..n])  // ← recurse right
    return merge(left, right)       // ← n comparisons per level
                                    // ← log₂(n) levels total`,
    simulate: (n) => (n <= 1 ? 0 : Math.ceil(n * Math.log2(n))),
    color: "hsl(var(--chart-orange))",
  },
  {
    id: "quick-sort",
    name: "Quick Sort",
    category: "sort",
    description:
      "Picks a pivot element, partitions the array around it, and recursively sorts subarrays. Very fast in practice with average O(n log n) performance.",
    timeComplexity: { best: "O(n log n)", average: "O(n log n)", worst: "O(n²)" },
    spaceComplexity: "O(log n)",
    expectedClass: "O(n log n)",
    pseudocode: `function quickSort(arr, low, high):
    if low < high:
        pivot = partition(arr, low, high)  // ← n comparisons
        quickSort(arr, low, pivot - 1)     // ← recurse left
        quickSort(arr, pivot + 1, high)    // ← recurse right

function partition(arr, low, high):
    pivot = arr[high]
    i = low - 1
    for j = low to high - 1:       // ← scan & swap
        if arr[j] <= pivot:
            i++; swap(arr[i], arr[j])
    swap(arr[i+1], arr[high])
    return i + 1`,
    simulate: (n) => (n <= 1 ? 0 : Math.ceil(1.39 * n * Math.log2(n))),
    color: "hsl(var(--chart-purple))",
  },
  {
    id: "kadanes",
    name: "Kadane's Algorithm",
    category: "search",
    description: "An elegant dynamic programming algorithm to find the maximum sum of a contiguous subarray in an array of numbers.",
    timeComplexity: { best: "O(n)", average: "O(n)", worst: "O(n)" },
    spaceComplexity: "O(1)",
    expectedClass: "O(n)",
    pseudocode: `function kadanes(arr):
    max_so_far = -INFINITY
    max_ending_here = 0
    for i = 0 to n - 1:            // ← n iterations
        max_ending_here = max_ending_here + arr[i]
        if max_so_far < max_ending_here:
            max_so_far = max_ending_here
        if max_ending_here < 0:
            max_ending_here = 0
    return max_so_far`,
    simulate: (n) => n,
    color: "hsl(var(--chart-green))",
  },
  {
    id: "dijkstra",
    name: "Dijkstra's Algorithm",
    category: "search",
    description: "Finds the shortest paths between nodes in a graph. Uses a greedy approach and priority queue.",
    timeComplexity: { best: "O(E + V log V)", average: "O(E + V log V)", worst: "O(V²)" },
    spaceComplexity: "O(V)",
    expectedClass: "O(n²)",
    pseudocode: `function dijkstra(graph, start):
    distances = array of INFINITY
    distances[start] = 0
    queue = all nodes
    while queue is not empty:
        current = node in queue with min distance
        remove current from queue
        for each neighbor of current:
            alt = distances[current] + weight(current, neighbor)
            if alt < distances[neighbor]:
                distances[neighbor] = alt
    return distances`,
    simulate: (n) => n * n, // Dense graph approximation V^2
    color: "hsl(var(--chart-orange))",
  },
];

export const complexityPatterns: { name: ComplexityClass; fn: (n: number) => number }[] = [
  { name: "O(1)", fn: () => 1 },
  { name: "O(log n)", fn: (n) => Math.log2(n) },
  { name: "O(n)", fn: (n) => n },
  { name: "O(n log n)", fn: (n) => n * Math.log2(n) },
  { name: "O(n²)", fn: (n) => n * n },
];

export function detectComplexity(simulate: (n: number) => number): ComplexityClass {
  const testSizes = [100, 500, 1000, 5000, 10000];
  const observed = testSizes.map((n) => simulate(n));

  let bestMatch: ComplexityClass = "O(n)";
  let bestError = Infinity;

  for (const pattern of complexityPatterns) {
    const expected = testSizes.map((n) => pattern.fn(n));
    const scale = observed[2] / (expected[2] || 1);
    const scaled = expected.map((e) => e * scale);
    const error = observed.reduce((sum, o, i) => sum + Math.pow((o - scaled[i]) / (o || 1), 2), 0);

    if (error < bestError) {
      bestError = error;
      bestMatch = pattern.name;
    }
  }

  return bestMatch;
}

export interface SimulationResult {
  algorithm: Algorithm;
  inputSizes: number[];
  operations: number[];
  detectedComplexity: ComplexityClass;
}

export async function runSimulation(algorithm: Algorithm, inputSizes: number[]): Promise<SimulationResult> {
  try {
    const res = await fetch("http://localhost:8081/api/algorithms/simulate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ algorithmId: algorithm.id, inputSizes }),
    });
    
    if (!res.ok) throw new Error("Backend response not ok");
    
    const data = await res.json();
    return {
      algorithm,
      inputSizes: data.inputSizes,
      operations: data.operations,
      detectedComplexity: data.detectedComplexity as ComplexityClass,
    };
  } catch (error) {
    console.error("Calling fallback, unable to reach Spring Boot Backend", error);
    const operations = inputSizes.map((n) => algorithm.simulate(n));
    const detectedComplexity = detectComplexity(algorithm.simulate);
    return { algorithm, inputSizes, operations, detectedComplexity };
  }
}
