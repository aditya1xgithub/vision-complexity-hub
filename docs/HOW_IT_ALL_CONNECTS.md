# How Everything Connects — Data Flow Guide

This document explains how all the pieces of AlgoVision work together.

---

## 🗺️ Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                        BROWSER (Frontend)                       │
│                                                                 │
│  index.html → main.tsx → App.tsx → Index.tsx                   │
│                                                                 │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────────────┐  │
│  │ Algorithm     │  │ CodeViewer   │  │ SimulationPanel      │  │
│  │ Selector      │→ │ ComplexGraph │  │ (runs simulate fn)   │  │
│  │ (left panel)  │  │ CompareMode  │  │ (right panel)        │  │
│  │               │  │ CodeAnalyzer │  │                      │  │
│  └──────────────┘  └──────┬───────┘  └──────────────────────┘  │
│                           │                                     │
│                    Only CodeAnalyzer                             │
│                    needs the backend ↓                           │
├─────────────────────────────────────────────────────────────────┤
│                        INTERNET                                 │
├─────────────────────────────────────────────────────────────────┤
│                    CLOUD (Backend)                               │
│                                                                 │
│  ┌─────────────────────────┐    ┌─────────────────────────┐    │
│  │ Edge Function:          │───→│ Lovable AI Gateway      │    │
│  │ analyze-code            │←───│ (Google Gemini model)   │    │
│  └─────────────────────────┘    └─────────────────────────┘    │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🔗 Flow 1: Browsing Algorithms (No Backend Needed)

This flow is **entirely frontend** — no server calls.

```
User clicks "Bubble Sort" in sidebar
        ↓
AlgorithmSelector calls onSelect(bubbleSortAlgo)
        ↓
Index.tsx receives the callback → setSelected(bubbleSortAlgo)
        ↓
React re-renders with new selected state
        ↓
CodeViewer receives algorithm prop → displays details
```

**Step by step:**

1. **User clicks** → `AlgorithmSelector` fires `onSelect(algo)`
2. **Index receives callback** → `setSelected(algo)` updates state
3. **React re-renders** → `selected` has new value
4. **CodeViewer gets new prop** → Shows algorithm details, pseudocode, complexity

**Key concept: Lifting State Up**
- Both `AlgorithmSelector` and `CodeViewer` need access to `selected`
- So we store `selected` in their common parent (`Index.tsx`)
- Parent passes it DOWN via props

```
                Index.tsx
               /    |     \
              /     |      \
  AlgorithmSelector CodeViewer SimulationPanel
     (onSelect)    (algorithm)  (algorithm)
```

---

## 🔗 Flow 2: Running a Simulation (No Backend Needed)

```
User selects "Bubble Sort" → sets input sizes [10, 100, 1000] → clicks "Run Simulation"
        ↓
SimulationPanel calls runSimulation(algorithm, inputSizes)
        ↓
lib/algorithms.ts runs algorithm.simulate(n) for each input size
        ↓
Returns: { inputSizes: [10, 100, 1000], operations: [45, 4950, 499500] }
        ↓
detectComplexity() compares against known patterns → "O(n²)"
        ↓
SimulationPanel calls onResult(result) → Index.tsx adds to results array
        ↓
ComplexityGraph receives new results → draws updated chart
```

**The simulation is purely mathematical** — it uses the `simulate` function defined for each algorithm:

```typescript
// Bubble Sort: n*(n-1)/2 operations
simulate: (n) => Math.floor((n * (n - 1)) / 2)

// For n=10:  Math.floor(10 * 9 / 2) = 45
// For n=100: Math.floor(100 * 99 / 2) = 4950
// For n=1000: Math.floor(1000 * 999 / 2) = 499500
```

---

## 🔗 Flow 3: AI Code Analysis (Uses Backend)

This is the only flow that requires the backend.

```
User pastes code → clicks "Analyze Complexity"
        ↓
CodeAnalyzer.tsx: setLoading(true)
        ↓
supabase.functions.invoke("analyze-code", { body: { code } })
        ↓
    HTTP POST request sent to Edge Function
        ↓
Edge Function receives the code
        ↓
Edge Function validates input (not empty, not too long)
        ↓
Edge Function calls AI Gateway with the code + system prompt
        ↓
AI (Google Gemini) analyzes the code
        ↓
AI returns structured JSON: { timeComplexity, spaceComplexity, explanation, suggestions }
        ↓
Edge Function sends this JSON back to frontend
        ↓
CodeAnalyzer.tsx: setResult(data), setLoading(false)
        ↓
React re-renders → shows complexity cards
```

**Why can't this happen in the frontend?**
- The AI API requires an API key (`LOVABLE_API_KEY`)
- If we put the key in frontend code, anyone could see it (browser DevTools → Sources)
- The Edge Function keeps the key secret on the server

---

## 🔗 Flow 4: Comparing Two Algorithms (No Backend)

```
User selects Algorithm A (Bubble Sort) and Algorithm B (Merge Sort)
        ↓
Clicks "Compare Growth Curves"
        ↓
ComparisonMode runs:
  runSimulation(algoA, [10, 50, 100, 500, 1000, 5000, 10000])
  runSimulation(algoB, [10, 50, 100, 500, 1000, 5000, 10000])
        ↓
Sets results = [resultA, resultB]
        ↓
ComplexityGraph receives both results → draws both curves on same chart
```

---

## 📂 File Dependency Map

```
index.html
  └── src/main.tsx
       └── src/App.tsx
            ├── src/pages/Index.tsx          ← Main page
            │    ├── src/components/AlgorithmSelector.tsx
            │    │    └── src/lib/algorithms.ts    ← Algorithm data
            │    ├── src/components/CodeViewer.tsx
            │    │    └── src/lib/algorithms.ts
            │    ├── src/components/SimulationPanel.tsx
            │    │    └── src/lib/algorithms.ts
            │    ├── src/components/ComplexityGraph.tsx
            │    │    └── recharts (library)
            │    ├── src/components/ComparisonMode.tsx
            │    │    ├── src/lib/algorithms.ts
            │    │    └── src/components/ComplexityGraph.tsx
            │    └── src/components/CodeAnalyzer.tsx
            │         └── src/integrations/supabase/client.ts
            │              └── supabase/functions/analyze-code/index.ts (backend)
            │                   └── Lovable AI Gateway (external API)
            └── src/pages/NotFound.tsx       ← 404 page
```

---

## 🔑 Key Patterns Used

### 1. Component Composition
Build complex UIs from simple, reusable pieces:
```
Index = AlgorithmSelector + CodeViewer + SimulationPanel + ComplexityGraph + ...
```

### 2. Unidirectional Data Flow
Data flows in ONE direction: Parent → Child (via props)
```
Index (state) → AlgorithmSelector (props)
Index (state) → CodeViewer (props)
Index (state) → SimulationPanel (props)
```

### 3. Callback Pattern
Child tells parent something happened (via callback functions):
```
SimulationPanel: "Hey parent, simulation finished!" → calls onResult(result)
AlgorithmSelector: "Hey parent, user picked an algorithm!" → calls onSelect(algo)
```

### 4. Separation of Concerns
Each file has ONE job:
- `algorithms.ts` → Algorithm data and logic only
- `ComplexityGraph.tsx` → Chart rendering only
- `CodeAnalyzer.tsx` → AI analysis UI only
- `analyze-code/index.ts` → Backend API call only

---

## 🔧 Environment & Configuration Flow

```
.env file (environment variables)
  ├── VITE_SUPABASE_URL         → Used by supabase/client.ts to know WHERE the backend is
  ├── VITE_SUPABASE_PUBLISHABLE_KEY → Used to authenticate requests to backend
  └── VITE_SUPABASE_PROJECT_ID  → Project identifier

src/integrations/supabase/client.ts
  └── Creates a Supabase client using the above env variables
       └── CodeAnalyzer.tsx imports this client to call Edge Functions

supabase/functions/analyze-code/index.ts
  └── Reads LOVABLE_API_KEY from server environment
       └── Uses it to call the AI Gateway (this key is NEVER sent to the browser)
```

**The key insight:** Frontend environment variables start with `VITE_` and are visible in the browser. Backend environment variables (like `LOVABLE_API_KEY`) are only on the server and stay secret.
