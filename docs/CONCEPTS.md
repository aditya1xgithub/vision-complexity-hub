# Programming Concepts — Beginner Guide

Every programming concept used in this project, explained from scratch.

---

## 🧠 JavaScript / TypeScript Basics

### 1. Variables (`const`, `let`)

```typescript
const name = "AlgoVision";  // Cannot be reassigned (constant)
let count = 0;              // Can be reassigned
count = 5;                  // ✅ OK
name = "Other";             // ❌ Error! const cannot change
```

**When to use which:**
- Use `const` by default (most variables don't need to change)
- Use `let` only when the value needs to change later
- Never use `var` (old syntax, has scoping issues)

---

### 2. Arrow Functions (`=>`)

```typescript
// Traditional function
function add(a, b) {
  return a + b;
}

// Arrow function (same thing, shorter syntax)
const add = (a, b) => a + b;

// Arrow function with body
const greet = (name) => {
  const message = `Hello, ${name}!`;
  return message;
};
```

**Used in our project:**
```tsx
const handleResult = (result: SimulationResult) => { ... };
algorithms.filter((a) => a.name.includes(filter));
```

---

### 3. Template Literals (Backtick Strings)

```typescript
const name = "React";
const version = 18;

// Old way (concatenation):
const msg1 = "Using " + name + " version " + version;

// Template literal (easier to read):
const msg2 = `Using ${name} version ${version}`;
```

- Use backticks `` ` ` `` instead of quotes
- `${expression}` embeds variables or expressions inside the string

---

### 4. Destructuring

```typescript
// Object destructuring — extract properties into variables
const algo = { name: "Bubble Sort", category: "sort" };
const { name, category } = algo;
// Now: name = "Bubble Sort", category = "sort"

// Array destructuring
const [first, second] = [10, 20];
// Now: first = 10, second = 20

// Used with useState:
const [selected, setSelected] = useState(null);
// selected = the current value
// setSelected = function to update it
```

---

### 5. Spread Operator (`...`)

```typescript
// Copy an array and add items
const old = [1, 2, 3];
const newArr = [...old, 4]; // [1, 2, 3, 4]

// Copy an object and override properties
const config = { color: "red", size: "large" };
const updated = { ...config, color: "blue" }; // { color: "blue", size: "large" }
```

**Used in our project for immutable state updates:**
```tsx
setInputSizes([...inputSizes, val].sort((a, b) => a - b));
```

---

### 6. Array Methods

#### `map` — Transform every item
```typescript
const numbers = [1, 2, 3];
const doubled = numbers.map((n) => n * 2); // [2, 4, 6]

// In React, used to render lists:
{algorithms.map((algo) => <div key={algo.id}>{algo.name}</div>)}
```

#### `filter` — Keep items that pass a test
```typescript
const numbers = [1, 2, 3, 4, 5];
const evens = numbers.filter((n) => n % 2 === 0); // [2, 4]

// In our project:
const filtered = algorithms.filter((a) => a.name.includes(searchText));
```

#### `reduce` — Combine all items into one value
```typescript
const numbers = [1, 2, 3, 4];
const sum = numbers.reduce((total, n) => total + n, 0); // 10

// In our project (calculating error for complexity detection):
const error = observed.reduce((sum, o, i) => sum + Math.pow(...), 0);
```

#### `find` — Get the first item that matches
```typescript
const algo = algorithms.find((a) => a.id === "bubble-sort");
```

#### `includes` — Check if an item exists
```typescript
const arr = [10, 20, 30];
arr.includes(20); // true
arr.includes(50); // false

"Bubble Sort".includes("Sort"); // true
```

#### `flatMap` — Map + flatten nested arrays
```typescript
const nested = [[1, 2], [3, 4]];
const flat = nested.flatMap((arr) => arr); // [1, 2, 3, 4]
```

---

### 7. Conditional (Ternary) Operator

```typescript
// if-else as an expression
const status = isActive ? "Active" : "Inactive";

// Same as:
let status;
if (isActive) {
  status = "Active";
} else {
  status = "Inactive";
}
```

**Used heavily in JSX for conditional styling:**
```tsx
<div className={isActive ? "bg-primary" : "bg-secondary"}>
```

---

### 8. Optional Chaining (`?.`) and Nullish Coalescing (`??`)

```typescript
// Without optional chaining:
if (data && data.choices && data.choices[0]) {
  const message = data.choices[0].message;
}

// With optional chaining (same thing, shorter):
const message = data?.choices?.[0]?.message;
// If any part is null/undefined, returns undefined instead of crashing

// Nullish coalescing — provide a default value:
const name = user?.name ?? "Guest";
// If user.name is null or undefined, use "Guest"
```

---

### 9. Async/Await

```typescript
// Making API calls takes time. async/await handles this cleanly:

async function fetchData() {
  try {
    const response = await fetch("https://api.example.com/data");
    const data = await response.json();
    console.log(data);
  } catch (error) {
    console.error("Failed:", error);
  }
}
```

- `async` marks a function as asynchronous (it will contain `await`)
- `await` pauses execution until the operation completes
- Without `await`, the code would continue before data arrives

---

### 10. Try-Catch (Error Handling)

```typescript
try {
  // Code that might fail
  const result = riskyOperation();
  console.log(result);
} catch (error) {
  // Code that runs if an error occurs
  console.error("Something went wrong:", error.message);
} finally {
  // Code that ALWAYS runs (success or failure)
  setLoading(false);
}
```

**Used in our CodeAnalyzer:**
```tsx
try {
  const { data, error } = await supabase.functions.invoke("analyze-code", { body: { code } });
  if (error) throw error;
  setResult(data);
} catch (e) {
  toast({ title: "Analysis failed", variant: "destructive" });
} finally {
  setLoading(false);
}
```

---

## ⚛️ React Concepts

### 11. Components

A **component** is a reusable piece of UI. Think of them as custom HTML tags.

```tsx
// Defining a component
function Greeting({ name }: { name: string }) {
  return <h1>Hello, {name}!</h1>;
}

// Using it (like a custom HTML tag)
<Greeting name="Alice" />
```

**In our project:**
- `AlgorithmSelector` — the algorithm list on the left
- `CodeViewer` — shows algorithm details
- `SimulationPanel` — simulation controls on the right
- `ComplexityGraph` — the line chart
- `CodeAnalyzer` — the AI analysis tool

---

### 12. Props (Properties)

Props are data passed from a parent component to a child component.

```tsx
// Parent passes data via attributes
<SimulationPanel algorithm={selected} onResult={handleResult} />

// Child receives them as a parameter
function SimulationPanel({ algorithm, onResult }: Props) {
  // Use algorithm and onResult here
}
```

**Props are READ-ONLY** — a child should never modify its props.

---

### 13. State (`useState`)

State is data that belongs to a component and can change over time.

```tsx
const [count, setCount] = useState(0);
//      ↑          ↑                ↑
//    current   updater        initial
//    value     function       value

// Update state:
setCount(5);           // Set to 5
setCount(prev => prev + 1); // Increment based on previous value
```

**When state changes → React re-renders the component** (redraws it with new data).

---

### 14. Conditional Rendering

Showing different UI based on conditions:

```tsx
// Method 1: Early return
if (!algorithm) {
  return <div>Select an algorithm</div>;
}

// Method 2: Ternary in JSX
{loading ? <Spinner /> : <Button>Submit</Button>}

// Method 3: Logical AND (show only if true)
{result && <ResultDisplay data={result} />}
```

---

### 15. Lists and Keys

Rendering arrays as UI elements:

```tsx
{algorithms.map((algo) => (
  <div key={algo.id}>  {/* key must be unique! */}
    {algo.name}
  </div>
))}
```

- `map` transforms each item into a JSX element
- `key` helps React track which items changed (must be unique per item)
- Without `key`, React can't efficiently update the list

---

## 🌐 Web Concepts

### 16. HTTP Methods

| Method | Purpose | Example |
|--------|---------|---------|
| GET | Retrieve data | Loading a webpage |
| POST | Send data | Submitting a form, sending code to analyze |
| PUT | Update data | Updating a profile |
| DELETE | Remove data | Deleting an account |

Our Edge Function uses **POST** because we're **sending** code to be analyzed.

---

### 17. JSON (JavaScript Object Notation)

JSON is a text format for exchanging data between frontend and backend.

```json
{
  "timeComplexity": {
    "best": "O(1)",
    "average": "O(n)",
    "worst": "O(n)"
  },
  "spaceComplexity": "O(1)",
  "explanation": "This is a linear search..."
}
```

- `JSON.stringify(object)` → Converts JavaScript object to JSON string
- `JSON.parse(string)` → Converts JSON string back to JavaScript object

---

### 18. API (Application Programming Interface)

An API is a way for two programs to communicate.

**Real-world analogy:**
- You (frontend) are a customer at a restaurant
- The waiter (API) takes your order to the kitchen (backend)
- The kitchen prepares the food (processes the request)
- The waiter brings back your food (returns the response)

In our project:
- Frontend **calls** the Edge Function API
- Edge Function **calls** the AI API
- Results flow back through the same chain

---

## 📊 Algorithm Concepts

### 19. Big-O Notation

Big-O describes how an algorithm's performance scales with input size.

| Notation | Name | Example | Growth |
|----------|------|---------|--------|
| O(1) | Constant | Array access by index | Same speed for any size |
| O(log n) | Logarithmic | Binary Search | Very slow growth |
| O(n) | Linear | Linear Search | Grows proportionally |
| O(n log n) | Linearithmic | Merge Sort | Slightly worse than linear |
| O(n²) | Quadratic | Bubble Sort | Grows very fast |

**"n" = the number of items** (input size)

### 20. Time vs Space Complexity

- **Time Complexity** — How many operations does the algorithm perform?
- **Space Complexity** — How much extra memory does it need?

Example: Merge Sort
- Time: O(n log n) — fast
- Space: O(n) — needs extra array for merging

Example: Bubble Sort
- Time: O(n²) — slow
- Space: O(1) — sorts in-place, no extra memory
