# Technologies Used — Complete Guide

Every technology, library, and tool used in AlgoVision, explained for beginners.

---

## 🏗️ Core Technologies

### 1. React (v18)
**What:** A JavaScript library for building user interfaces  
**Why we use it:** Instead of manually updating HTML, React lets us describe what the UI should look like, and it handles all the updates efficiently.

**Key concepts we use:**
- **Components** — Reusable pieces of UI (like `AlgorithmSelector`, `CodeViewer`)
- **State (`useState`)** — Variables that trigger UI updates when changed
- **Props** — Data passed from parent to child components
- **JSX** — HTML-like syntax inside JavaScript (`<div className="...">`)

**Example from our code:**
```tsx
// This is a React component — a reusable piece of UI
export function CodeViewer({ algorithm }: Props) {
  // This is JSX — looks like HTML but it's actually JavaScript
  return <div>{algorithm.name}</div>;
}
```

---

### 2. TypeScript
**What:** JavaScript with **type checking** — it catches errors before your code runs  
**Why we use it:** Prevents bugs by making sure you use the right types of data

**Example from our code:**
```typescript
// TypeScript interface — defines what an Algorithm object must look like
export interface Algorithm {
  id: string;           // must be a string
  name: string;         // must be a string
  category: "search" | "sort";  // can ONLY be "search" or "sort"
  simulate: (n: number) => number; // must be a function
}

// TypeScript catches this error BEFORE you run the code:
const algo: Algorithm = { id: 123 }; // ❌ Error: id should be string, not number
```

**Without TypeScript:** You'd only discover these errors when the app crashes at runtime.

---

### 3. Vite
**What:** A build tool and development server  
**Why we use it:** It makes development fast — changes appear instantly in the browser

**What it does:**
- Starts a local development server (`npm run dev`)
- Hot Module Replacement (HMR) — updates the page without full reload when you save a file
- Bundles all files into optimized output for production (`npm run build`)
- Handles imports, TypeScript compilation, CSS processing

**Config file:** `vite.config.ts`

---

### 4. Tailwind CSS
**What:** A utility-first CSS framework  
**Why we use it:** Style elements quickly using class names instead of writing CSS files

**Traditional CSS vs Tailwind:**
```css
/* Traditional CSS — separate file */
.card {
  background-color: #1a1a2e;
  border-radius: 8px;
  padding: 16px;
  border: 1px solid #333;
}
```

```tsx
/* Tailwind — classes right on the element */
<div className="bg-secondary rounded-lg p-4 border border-border">
```

**Common Tailwind classes in our project:**

| Class | CSS Equivalent | Meaning |
|-------|---------------|---------|
| `flex` | `display: flex` | Flexbox layout |
| `grid` | `display: grid` | Grid layout |
| `p-4` | `padding: 1rem` | Padding (spacing inside) |
| `m-2` | `margin: 0.5rem` | Margin (spacing outside) |
| `gap-3` | `gap: 0.75rem` | Space between flex/grid items |
| `text-sm` | `font-size: 0.875rem` | Small text |
| `font-bold` | `font-weight: 700` | Bold text |
| `rounded-lg` | `border-radius: 0.5rem` | Rounded corners |
| `bg-primary` | `background: var(--primary)` | Primary color background |
| `hover:bg-secondary` | On hover, change background | Interactive styles |
| `w-full` | `width: 100%` | Full width |
| `min-h-screen` | `min-height: 100vh` | At least full screen height |

---

## 📦 UI Libraries

### 5. shadcn/ui
**What:** Pre-built, customizable React components  
**Why we use it:** Provides beautiful, accessible UI components out of the box

**Components we use from shadcn:**
| Component | What it is | Where we use it |
|-----------|-----------|----------------|
| `Button` | Styled button | "Run Simulation", "Analyze" buttons |
| `Tabs` | Tab navigation | Main content area tabs |
| `Badge` | Small label | Algorithm category badges |
| `Textarea` | Multi-line input | Code input in analyzer |
| `Toaster` | Notification popups | Success/error messages |

### 6. Lucide React
**What:** Icon library with 1000+ icons  
**Why we use it:** Consistent, clean SVG icons

```tsx
import { Play, Search, Code2, Activity } from "lucide-react";

// Use like a component:
<Play className="h-4 w-4" />
```

### 7. Recharts
**What:** Chart library for React  
**Why we use it:** Draws the complexity growth graphs

**Components we use:**
- `LineChart` — The main chart
- `Line` — Each algorithm's growth curve
- `XAxis`, `YAxis` — The axes
- `Tooltip` — Popup info when hovering on data points
- `ResponsiveContainer` — Makes chart resize with its container

---

## 🔧 Backend Technologies

### 8. Supabase (via Lovable Cloud)
**What:** An open-source backend-as-a-service platform  
**Why we use it:** Provides Edge Functions (serverless backend) without managing servers

**What we use from Supabase:**
- **Edge Functions** — Serverless functions for the AI code analyzer
- **Supabase Client** — JavaScript SDK to call Edge Functions from the frontend

### 9. Deno
**What:** A JavaScript/TypeScript runtime (like Node.js but newer)  
**Why it's used:** Supabase Edge Functions run on Deno

**Key difference from Node.js:**
- Imports use URLs: `import { serve } from "https://deno.land/..."`
- Built-in TypeScript support (no compilation step needed)
- Better security defaults

### 10. Google Gemini AI (via Lovable AI Gateway)
**What:** Google's AI language model  
**Why we use it:** Analyzes code and determines Big-O complexity

---

## 🛠️ Development Tools

### 11. ESLint
**What:** A code quality tool that finds problems in your code  
**Config:** `eslint.config.js`

### 12. PostCSS + Autoprefixer
**What:** CSS processing tools  
**Why:** PostCSS processes Tailwind CSS; Autoprefixer adds browser-specific CSS prefixes

### 13. React Router DOM
**What:** Navigation library for React  
**Why we use it:** Handles page routing (URL → Component mapping)

```tsx
<Route path="/" element={<Index />} />    // URL "/" → show Index page
<Route path="*" element={<NotFound />} /> // Any other URL → show 404
```

### 14. TanStack React Query
**What:** Data fetching and caching library  
**Why we use it:** Manages server state, caching, and request lifecycle

### 15. Zod
**What:** Schema validation library  
**Why:** Validates data shapes at runtime (complements TypeScript's compile-time checks)

---

## 📁 Configuration Files Explained

| File | Purpose |
|------|---------|
| `package.json` | Lists all dependencies and scripts (`npm run dev`, `npm run build`) |
| `tsconfig.json` | TypeScript compiler settings |
| `vite.config.ts` | Vite build tool configuration |
| `tailwind.config.ts` | Tailwind CSS customization (colors, fonts, etc.) |
| `postcss.config.js` | PostCSS plugins (processes CSS) |
| `eslint.config.js` | Code quality rules |
| `index.html` | The single HTML page (React mounts into `<div id="root">`) |
| `components.json` | shadcn/ui component configuration |
