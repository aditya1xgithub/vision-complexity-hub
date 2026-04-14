# Frontend Architecture — Detailed Explanation

This document explains every frontend file and component in detail.

---

## 📁 Entry Point: How the App Starts

### `src/main.tsx` — The Very First File

```tsx
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
```

**What happens here:**
- This is the **entry point** — the first file that runs when you open the website
- `ReactDOM.createRoot()` finds the `<div id="root">` in `index.html` and renders our React app inside it
- Think of it as: "Hey browser, put my app inside this empty div"

**What is `ReactDOM`?**
- React creates a virtual version of the page in memory (called Virtual DOM)
- `ReactDOM` takes that virtual page and puts it on the actual browser screen
- This is more efficient than updating the real page directly

---

### `src/App.tsx` — The Main App Component

```tsx
const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);
```

**Line-by-line explanation:**

1. **`QueryClientProvider`** — Wraps the app to enable data fetching features (from `@tanstack/react-query`). It's like a "manager" that handles all API calls.

2. **`TooltipProvider`** — Enables tooltip popups when you hover over elements.

3. **`Toaster` and `Sonner`** — These are notification systems. When something succeeds or fails, these show popup messages (called "toasts").

4. **`BrowserRouter`** — Enables navigation between pages. Without this, clicking links would reload the whole page.

5. **`Routes` and `Route`** — This is **routing**:
   - `path="/"` → When URL is `/`, show the `Index` page (main dashboard)
   - `path="*"` → Any other URL shows `NotFound` page (404 error)

**What is a "Provider" pattern?**
- A Provider is a React pattern where a parent component shares data/features with ALL its children
- Instead of passing data through every component manually, the Provider makes it available everywhere
- It's like a WiFi router — any device in range can connect without wires

---

## 📄 Pages

### `src/pages/Index.tsx` — The Main Dashboard Page

This is the **main page** users see. It has 3 sections:

```
┌──────────────┬────────────────────────┬──────────────┐
│  Left Panel  │     Center Panel       │ Right Panel  │
│  Algorithm   │  Details / Graph /     │  Simulation  │
│  Library     │  Compare / Analyze     │  Controls    │
└──────────────┴────────────────────────┴──────────────┘
```

**Key concepts used:**

#### 1. `useState` — Managing Component State

```tsx
const [selected, setSelected] = useState<Algorithm | null>(null);
const [results, setResults] = useState<SimulationResult[]>([]);
```

**What is `useState`?**
- `useState` is a React **Hook** (a special function that adds features to components)
- It creates a variable that, when changed, **re-renders** (re-draws) the component
- `selected` holds the currently selected algorithm (or `null` if none selected)
- `setSelected` is the function to update it
- `useState<Algorithm | null>(null)` means: "Create a state variable that can be an Algorithm object OR null, starting as null"

**Why not use a regular variable?**
- Regular variables (`let x = 5`) don't trigger re-renders
- If you change a regular variable, the screen won't update
- `useState` tells React: "Hey, this value changed, please redraw the component!"

#### 2. `<Tabs>` — Tab Navigation

```tsx
<Tabs defaultValue="details">
  <TabsList>
    <TabsTrigger value="details">Details</TabsTrigger>
    <TabsTrigger value="graph">Growth Graph</TabsTrigger>
    <TabsTrigger value="compare">Compare</TabsTrigger>
    <TabsTrigger value="analyze">Analyze Code</TabsTrigger>
  </TabsList>
  <TabsContent value="details">...</TabsContent>
  <TabsContent value="graph">...</TabsContent>
</Tabs>
```

- `TabsList` → The row of tab buttons
- `TabsTrigger` → Each clickable tab button
- `TabsContent` → The content that shows when a tab is active
- `defaultValue="details"` → The "Details" tab is shown first

#### 3. Callback Functions

```tsx
const handleResult = (result: SimulationResult) => {
  setResults((prev) => {
    const filtered = prev.filter((r) => r.algorithm.id !== result.algorithm.id);
    return [...filtered, result];
  });
};
```

**What is this doing?**
- When a simulation finishes, this function receives the result
- It removes any old result for the same algorithm (using `filter`)
- Then adds the new result to the list (using spread operator `...`)
- `prev` is the previous state — React gives us this to safely update arrays

**What is `filter`?**
- `filter` creates a new array with only the items that pass a test
- `prev.filter((r) => r.algorithm.id !== result.algorithm.id)` means: "Keep all results EXCEPT the one with the same algorithm ID"

**What is the spread operator `...`?**
- `[...filtered, result]` means: "Create a new array with all items from `filtered`, plus `result` at the end"
- It's like combining two lists into one

---

## 🧩 Components — Detailed Explanation

### `AlgorithmSelector.tsx` — The Left Panel (Algorithm Library)

**Purpose:** Shows a searchable list of algorithms. When you click one, it becomes "selected."

**Key concepts:**

#### Filtering with `filter` and `includes`

```tsx
const filtered = algorithms.filter((a) =>
  a.name.toLowerCase().includes(filter.toLowerCase())
);
```

- `algorithms` is our full list of algorithms (imported from `lib/algorithms.ts`)
- `filter()` goes through each algorithm and keeps only the ones where the name contains the search text
- `toLowerCase()` makes the search case-insensitive (so "bubble" matches "Bubble Sort")
- `includes()` checks if a string contains another string

#### Conditional CSS Classes (Ternary Operator)

```tsx
className={`... ${isActive ? "bg-primary/10 border border-primary/30" : "hover:bg-secondary border border-transparent"}`}
```

**What is a ternary operator?**
- It's a shorthand `if-else`: `condition ? valueIfTrue : valueIfFalse`
- If `isActive` is true → apply green highlighted styles
- If `isActive` is false → apply default hover styles

---

### `CodeViewer.tsx` — Algorithm Details View

**Purpose:** Shows the selected algorithm's description, complexity info, and pseudocode.

**Key concept: Conditional Rendering**

```tsx
if (!algorithm) {
  return <div>Select an algorithm to view its details</div>;
}
```

- `if (!algorithm)` checks if `algorithm` is `null` (nothing selected)
- `!` is the "NOT" operator — `!null` is `true`
- This is called an **early return** — if nothing is selected, show a message and stop
- This prevents errors from trying to display `.name` or `.description` of `null`

**String splitting for pseudocode display:**

```tsx
algorithm.pseudocode.split("\n").map((line, i) => { ... })
```

- `split("\n")` breaks the pseudocode string into an array of lines (splitting at every newline character)
- `map()` loops through each line and creates a `<div>` for it
- `i` is the index (line number), used for numbering

---

### `SimulationPanel.tsx` — The Right Panel (Simulation Controls)

**Purpose:** Lets users set input sizes and run algorithm simulations.

**Key concepts:**

#### Array State Management

```tsx
const [inputSizes, setInputSizes] = useState<number[]>([10, 100, 1000, 10000]);
```

- This creates a state variable that holds an array of numbers
- `<number[]>` is TypeScript saying "this is an array of numbers"

#### Adding to an Array (Immutably)

```tsx
const addSize = () => {
  const val = parseInt(customValue);
  if (val > 0 && !inputSizes.includes(val)) {
    setInputSizes([...inputSizes, val].sort((a, b) => a - b));
  }
};
```

- `parseInt()` converts a string like "500" to the number 500
- `val > 0` ensures the number is positive
- `!inputSizes.includes(val)` ensures we don't add duplicates
- `[...inputSizes, val]` creates a new array with old values + new value
- `.sort((a, b) => a - b)` sorts the numbers in ascending order

**Why create a new array instead of modifying the old one?**
- In React, you must **never modify state directly** (called "mutation")
- `inputSizes.push(val)` would modify the original array — React won't detect the change
- `[...inputSizes, val]` creates a **new** array — React sees it's different and re-renders

#### Removing from an Array

```tsx
const removeSize = (n: number) => {
  setInputSizes(inputSizes.filter((s) => s !== n));
};
```

- `filter((s) => s !== n)` keeps everything EXCEPT the value we want to remove

---

### `ComplexityGraph.tsx` — Interactive Line Chart

**Purpose:** Displays a line chart showing how operations grow with input size.

**Key concept: Data Transformation**

```tsx
const allSizes = [...new Set(results.flatMap((r) => r.inputSizes))].sort((a, b) => a - b);
```

**Breaking this down step by step:**
1. `results.flatMap((r) => r.inputSizes)` — Gets ALL input sizes from ALL results and flattens them into one array
2. `new Set(...)` — Removes duplicates (a Set only keeps unique values)
3. `[...new Set(...)]` — Converts the Set back to an array
4. `.sort((a, b) => a - b)` — Sorts in ascending order

**What is `flatMap`?**
- `map` transforms each item: `[a, b] → [f(a), f(b)]`
- `flatMap` does the same but also flattens nested arrays: `[[1,2], [3,4]] → [1, 2, 3, 4]`

**The Chart Library (Recharts):**
```tsx
<ResponsiveContainer width="100%" height="100%">
  <LineChart data={data}>
    <XAxis dataKey="n" />
    <YAxis />
    <Line dataKey="Bubble Sort" stroke="red" />
  </LineChart>
</ResponsiveContainer>
```

- `ResponsiveContainer` makes the chart resize with its parent
- `LineChart` is the main chart component
- `XAxis` / `YAxis` are the axes
- Each `<Line>` draws one algorithm's growth curve

---

### `ComparisonMode.tsx` — Algorithm Comparison

**Purpose:** Select two algorithms and compare their growth curves side-by-side.

**Key concept: Multiple State Variables**

```tsx
const [algoA, setAlgoA] = useState<Algorithm | null>(null);
const [algoB, setAlgoB] = useState<Algorithm | null>(null);
const [results, setResults] = useState<SimulationResult[]>([]);
```

- Each piece of data that can change independently gets its own `useState`
- When `algoA` changes, only the parts of the UI that use `algoA` re-render

**HTML `<select>` Element:**

```tsx
<select value={algoA?.id ?? ""} onChange={(e) => setAlgoA(...)}>
  <option value="">Select...</option>
  {algorithms.map((a) => (
    <option key={a.id} value={a.id}>{a.name}</option>
  ))}
</select>
```

- `<select>` creates a dropdown menu
- `<option>` creates each item in the dropdown
- `onChange` fires when the user picks a different option
- `algoA?.id` uses **optional chaining** (`?.`) — if `algoA` is null, it returns `undefined` instead of crashing
- `?? ""` is the **nullish coalescing operator** — if the left side is null/undefined, use the right side (`""`)

---

### `CodeAnalyzer.tsx` — AI Code Analysis

**Purpose:** Users paste code, click "Analyze," and get time/space complexity from AI.

This component is explained in detail in [BACKEND.md](./BACKEND.md) since it involves frontend-backend communication.

---

## 📁 `src/lib/algorithms.ts` — Algorithm Data & Logic

This file contains all the algorithm definitions and simulation logic.

### TypeScript Interfaces

```tsx
export interface Algorithm {
  id: string;
  name: string;
  category: "search" | "sort";
  simulate: (n: number) => number;
  // ... more fields
}
```

**What is an Interface?**
- An interface defines the **shape** of an object — what properties it must have and their types
- `id: string` means the `id` property must be a string
- `category: "search" | "sort"` means category can ONLY be "search" or "sort" (this is called a **union type**)
- `simulate: (n: number) => number` means `simulate` is a function that takes a number and returns a number

### Simulation Functions

```tsx
simulate: (n) => Math.floor((n * (n - 1)) / 2),  // Bubble Sort
simulate: (n) => Math.ceil(Math.log2(n + 1)),     // Binary Search
```

- These functions calculate how many operations an algorithm would perform for input size `n`
- Bubble Sort: `n * (n-1) / 2` → this is the formula for O(n²)
- Binary Search: `log₂(n)` → this is the formula for O(log n)

### Complexity Detection

```tsx
export function detectComplexity(simulate: (n: number) => number): ComplexityClass {
  const testSizes = [100, 500, 1000, 5000, 10000];
  const observed = testSizes.map((n) => simulate(n));
  // ... curve fitting logic
}
```

**How does it detect complexity?**
1. Run the simulation at several input sizes (100, 500, 1000, etc.)
2. Compare the results against known patterns (O(1), O(log n), O(n), O(n²), etc.)
3. The pattern with the **smallest error** (best match) is the detected complexity
4. This is basically **curve fitting** — finding which mathematical function best matches the observed data

---

## 🎨 Styling

### Tailwind CSS Classes

This project uses **Tailwind CSS** — a utility-first CSS framework where you style elements using class names:

```tsx
<div className="bg-secondary rounded-lg p-4 border border-border">
```

| Class | What it does |
|-------|-------------|
| `bg-secondary` | Sets background color to the secondary color from our theme |
| `rounded-lg` | Rounds the corners |
| `p-4` | Adds padding (spacing inside) of 1rem (16px) |
| `border` | Adds a border |
| `border-border` | Sets border color to our theme's border color |
| `text-sm` | Sets small font size |
| `font-mono` | Uses monospace font (like code) |
| `flex` | Makes the element a flexbox container (for layouts) |
| `gap-2` | Adds spacing between flex children |
| `animate-slide-in` | Plays a slide-in animation |

### Design Tokens (CSS Variables)

Colors are defined as **CSS variables** in `src/index.css`:

```css
:root {
  --primary: 142 70% 49%;      /* Green — main brand color */
  --background: 220 13% 10%;   /* Dark background */
  --foreground: 210 20% 92%;   /* Light text */
}
```

These are in **HSL format** (Hue, Saturation, Lightness) and Tailwind uses them through semantic class names like `bg-primary`, `text-foreground`, etc.
