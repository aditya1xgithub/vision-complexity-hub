# AlgoVision — Complete Interview Preparation Notes

> A single, exhaustive document covering **everything** about this project — purpose, motivation, tech stack, architecture, every file, every library, APIs, backend, security, performance, and likely interview questions.  Written for a beginner audience but going deep enough for an industry evaluator (Infosys-style technical viva).

---

## TABLE OF CONTENTS

1. [Project Purpose & Motivation](#1-project-purpose--motivation)
2. [Where the Idea Came From](#2-where-the-idea-came-from)
3. [Future Scope](#3-future-scope)
4. [High-Level Architecture](#4-high-level-architecture)
5. [Complete Tech Stack — What, Why, How](#5-complete-tech-stack)
6. [File-by-File Walkthrough](#6-file-by-file-walkthrough)
7. [Components — Role of Each](#7-components)
8. [Library Reference](#8-library-reference)
9. [API & Backend (Edge Function + Optional Spring Boot)](#9-api--backend)
10. [Connection Management (Frontend ↔ Backend)](#10-connection-management)
11. [Algorithms, Simulation Math, Big-O Detection](#11-algorithms--simulation-math)
12. [Security Considerations](#12-security)
13. [Performance & Optimization](#13-performance)
14. [Likely Interview Questions (with Answers)](#14-likely-interview-questions)

---

## 1. Project Purpose & Motivation

**AlgoVision** is an interactive web application that helps students and developers **understand the time and space complexity (Big-O)** of algorithms — visually, mathematically, and through AI-assisted analysis of arbitrary code.

### The problem it solves
- Big-O is **abstract**. Textbooks show formulas; students rarely *see* how doubling input changes work.
- Visualizing graph algorithms (BFS, DFS) on paper is tedious.
- Beginners cannot easily check the complexity of their own code.

### What this project gives the user
| Feature | Benefit |
|---|---|
| Algorithm Library | Curated DAA-curriculum algorithms with pseudocode |
| Simulation Panel | Run with n=10, 100, 1000, 10000 — see operation counts |
| Growth Graph | Recharts line graph: operations vs n |
| Comparison Mode | Two algorithms on one chart — visually obvious which scales better |
| Graph Traversal + Custom Graph Builder | Build a graph, watch BFS/DFS step through nodes |
| AI Code Analyzer | Paste any code → Google Gemini returns Big-O + explanation |

---

## 2. Where the Idea Came From

- Originated from a **DAA (Design & Analysis of Algorithms)** university subject where complexity analysis is taught theoretically but rarely demonstrated empirically.
- Inspired by platforms like **LeetCode** (dark IDE-like UI), **VisuAlgo** (algorithm visualization), and **Big-O Cheat Sheet** (reference tables).
- The differentiator: combine **all three** — reference, visualization, and AI analysis — into one viva-prep tool.

---

## 3. Future Scope

- Add more algorithm families: dynamic programming, greedy, backtracking, divide & conquer trees.
- **Step-by-step animation** of sorting (already partially achievable via SVG transitions).
- **User accounts** (Lovable Cloud / Supabase Auth) so students can save custom graphs and snippets.
- **Classroom mode** — teacher posts a code snippet; students submit complexity guesses; AI grades.
- **Mobile app** wrapper via Capacitor.
- **Multi-language code analyzer** (currently any text; extend to language-specific parsers for higher accuracy).
- Integration with **GitHub** — analyze pull requests for hidden O(n²) regressions.

---

## 4. High-Level Architecture

```
┌──────────────────────────────────────────────────────────┐
│                       BROWSER                            │
│   React 18 + Vite + TypeScript + Tailwind + shadcn/ui    │
│                                                          │
│   ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌────────┐   │
│   │ Selector │  │Simulation│  │  Graph   │  │  Code  │   │
│   │  (lib)   │  │  Panel   │  │Traversal │  │Analyzer│   │
│   └────┬─────┘  └────┬─────┘  └────┬─────┘  └────┬───┘   │
│        │             │             │             │       │
│        ▼             ▼             ▼             ▼       │
│   algorithms.ts  Recharts   graphUtils.ts   supabase JS  │
│                                              client      │
└──────────────────────────────────────────────────────────┘
                                                  │
                                                  │ HTTPS
                                                  ▼
        ┌──────────────────────────────────────────────────┐
        │  LOVABLE CLOUD (Supabase Edge Function — Deno)   │
        │  /functions/v1/analyze-code                      │
        │                                                  │
        │   1. Validate input (length, type)               │
        │   2. Call Lovable AI Gateway                     │
        │   3. Force JSON via tool-calling                 │
        │   4. Return structured analysis                  │
        └──────────────────┬───────────────────────────────┘
                           │
                           ▼
        ┌──────────────────────────────────────────────────┐
        │  Lovable AI Gateway → Google Gemini              │
        │  Model: google/gemini-3-flash-preview            │
        └──────────────────────────────────────────────────┘
```

**Key architectural decisions:**
- **Frontend-only algorithm logic** — no DB, no server round-trip; instant simulation.
- **Edge Function only for AI** — keeps the secret `LOVABLE_API_KEY` off the browser.
- **No persistent database** — data lives in React state; reload = clean slate. Simplifies the project; matches its "lab tool" nature.

---

## 5. Complete Tech Stack

### Frontend Core
| Tech | Version | Why used |
|---|---|---|
| **React** | 18 | Component model, virtual DOM, huge ecosystem |
| **TypeScript** | 5 | Static type-safety → fewer runtime bugs; great IDE help |
| **Vite** | 5 | Faster dev server + HMR than Webpack/CRA |
| **Tailwind CSS** | 3 | Utility-first; no separate CSS files; consistent design tokens |
| **shadcn/ui** | latest | Copy-in accessible components built on Radix — not a heavy npm dep |
| **Radix UI primitives** | various | Unstyled, accessible UI building blocks under shadcn |
| **Lucide React** | 0.462 | Lightweight tree-shakable SVG icons |
| **Recharts** | 2 | Declarative React charts for the growth graph |
| **React Router DOM** | 6 | Client-side routing (`/`, `*` 404) |
| **TanStack React Query** | 5 | Caching + request lifecycle (set up; ready when DB added) |
| **react-hook-form + Zod** | latest | Form validation pattern used across shadcn forms |
| **sonner / toast** | latest | User notifications |
| **class-variance-authority + clsx + tailwind-merge** | latest | Variant-based styling utilities |

### Backend
| Tech | Why |
|---|---|
| **Lovable Cloud** (Supabase) | Hosted Postgres + Edge Functions without manual setup |
| **Supabase Edge Functions** | Serverless TypeScript on Deno — zero server admin |
| **Deno** | Modern, secure JS runtime used by Edge Functions |
| **Lovable AI Gateway** | Pre-provisioned route to Gemini/GPT — no user API key needed |
| **Google Gemini** (`gemini-3-flash-preview`) | Fast, cheap, good at code-reasoning |

### Optional auxiliary backend
There is also a **`backend/`** Spring Boot scaffold (Java/Maven) — kept as a reference implementation showing how the same simulation logic *could* run server-side in an enterprise stack. It is **not** required at runtime; frontend handles simulation directly.

### Tooling
| Tool | Purpose |
|---|---|
| ESLint + typescript-eslint | Lint rules |
| Vitest + Testing Library + jsdom | Unit testing |
| PostCSS + Autoprefixer | CSS processing |
| `lovable-tagger` | Dev-only component tagging plugin |

---

## 6. File-by-File Walkthrough

### Root configuration
| File | Role |
|---|---|
| `index.html` | Single HTML page; React mounts to `<div id="root">` |
| `package.json` | Dependencies + npm scripts (`dev`, `build`, `test`) |
| `vite.config.ts` | Vite settings — port 8080, `@` alias → `src/`, React-SWC plugin |
| `tailwind.config.ts` | Theme colors mapped to CSS variables (HSL design tokens) |
| `tsconfig*.json` | TypeScript compiler options |
| `postcss.config.js` | Loads Tailwind + Autoprefixer |
| `eslint.config.js` | Code-style rules |
| `components.json` | shadcn/ui config (alias paths, base color) |
| `vitest.config.ts` | Test runner config |
| `.env` | Public Supabase URL + anon key (safe to commit; RLS protects data) |

### `src/`
| Path | Role |
|---|---|
| `main.tsx` | React entry — renders `<App />` into the DOM |
| `App.tsx` | Sets up providers: `QueryClient`, `TooltipProvider`, `Toaster`, `BrowserRouter` + routes |
| `App.css` / `index.css` | Global styles + HSL design tokens (light/dark theme variables) |
| `vite-env.d.ts` | TS shim for Vite env variables |

### `src/pages/`
| File | Role |
|---|---|
| `Index.tsx` | The single main page. 3-column grid: **Library | Tabs (Details/Graph/Compare/Analyze) | Simulation**. Holds top-level state: selected algorithm + accumulated simulation results. |
| `NotFound.tsx` | Catch-all 404 page |

### `src/components/` (feature components)
| File | Role |
|---|---|
| `AlgorithmSelector.tsx` | Left sidebar list — reads `algorithms[]` array, lets user pick one |
| `CodeViewer.tsx` | Center "Details" tab — shows description, complexity badges, pseudocode |
| `SimulationPanel.tsx` | Right sidebar — input box for `n`, runs `algorithm.simulate(n)`, calls back with result; renders `ComplexityGraph` |
| `ComplexityGraph.tsx` | Recharts `LineChart` of `{n, operations}` results |
| `ComparisonMode.tsx` | Pick two algorithms; run both at sweeping `n`s; draw two lines on one chart |
| `GraphTraversal.tsx` | BFS/DFS visualizer with stepper controls; uses SVG to draw nodes/edges |
| `CustomGraphBuilder.tsx` | User-defined vertices/edges/weights → constructs a graph and feeds the visualizer |
| `CodeAnalyzer.tsx` | Textarea + "Analyze" button → invokes the Edge Function, displays Big-O result |
| `NavLink.tsx` | Small styled router link |

### `src/components/ui/`
shadcn-generated primitives — `button.tsx`, `tabs.tsx`, `card.tsx`, `dialog.tsx`, etc. Don't edit unless restyling. Each wraps a Radix component with Tailwind classes.

### `src/lib/`
| File | Role |
|---|---|
| `algorithms.ts` | The "database" of algorithms: id, name, pseudocode, simulate function, complexity. **This is the heart of the simulator.** |
| `graphUtils.ts` | Helpers: `layoutNodesCircle`, BFS/DFS step generators, adjacency parsing |
| `utils.ts` | `cn()` — merges Tailwind classes safely |

### `src/hooks/`
| File | Role |
|---|---|
| `use-toast.ts` | shadcn toast hook |
| `use-mobile.tsx` | Detects viewport size for responsive logic |

### `src/integrations/supabase/`
| File | Role |
|---|---|
| `client.ts` | **Auto-generated.** Creates the Supabase JS client used to invoke Edge Functions |
| `types.ts` | **Auto-generated** DB types (empty here — no tables yet) |

### `src/test/`
| File | Role |
|---|---|
| `setup.ts` | Vitest setup (jsdom + jest-dom matchers) |
| `example.test.ts` | Sample test confirming the framework runs |

### `supabase/`
| Path | Role |
|---|---|
| `config.toml` | Auto-generated project config |
| `functions/analyze-code/index.ts` | The single Edge Function — see §9 |

### `backend/` (Spring Boot reference)
| File | Role |
|---|---|
| `pom.xml` | Maven dependencies (Spring Web, etc.) |
| `AlgoVisionBackendApplication.java` | Spring entry point |
| `controller/AlgorithmController.java` | REST endpoint `/api/simulate` |
| `service/SimulationService.java` | Operation-count formulas (mirrors frontend) |
| `dto/SimulationRequest.java`, `SimulationResponse.java` | JSON DTOs |
| `config/WebConfig.java` | CORS config |

> Talking point: "We *could* have done simulation server-side; we kept it client-side for zero latency. The Spring Boot folder demonstrates we understand both approaches."

### `docs/`
| File | Role |
|---|---|
| `FRONTEND.md` | Detailed frontend explanation |
| `BACKEND.md` | Edge Function explanation |
| `TECHNOLOGIES.md` | Per-library reference |
| `CONCEPTS.md` | Programming concepts for beginners |
| `HOW_IT_ALL_CONNECTS.md` | Data-flow diagrams |
| `VIVA_CODE_EXPLANATION.md` | Code walkthrough for viva |
| `INTERVIEW_NOTES.md` | **This file** — master interview prep |

---

## 7. Components

| Component | Inputs (Props) | Outputs / Events | Why it exists |
|---|---|---|---|
| `AlgorithmSelector` | `selected`, `onSelect` | calls `onSelect(algo)` | Single responsibility — list & pick |
| `CodeViewer` | `algorithm` | none | Static info display; reusable across tabs |
| `SimulationPanel` | `algorithm`, `onResult` | `onResult(simResult)` | Encapsulates "run + show graph" |
| `ComplexityGraph` | `results[]` | none | Pure chart — easy to test |
| `ComparisonMode` | none (self-contained) | n/a | A separate UX flow; isolated state |
| `GraphTraversal` | none | n/a | Owns its own graph state |
| `CustomGraphBuilder` | `onBuild` callback | emits graph object | Separates parsing from visualization |
| `CodeAnalyzer` | none | n/a | Encapsulates the only network call in the app |

**Composition pattern:** `Index.tsx` is the **container** (state owner); components are **presentational/feature** units. This is the classic **lifting state up** pattern from React docs.

---

## 8. Library Reference

For each library: *what / why / where used*.

- **react / react-dom** — UI framework. Everywhere.
- **typescript** — Static typing. Every `.ts/.tsx`.
- **vite** + `@vitejs/plugin-react-swc` — Dev server & bundler. SWC = Rust-based fast compiler.
- **tailwindcss** + `tailwindcss-animate` + `@tailwindcss/typography` — Styling. All components.
- **@radix-ui/react-*** — Unstyled accessible primitives. Underlie `src/components/ui/*`.
- **class-variance-authority, clsx, tailwind-merge** — Conditional class composition.
- **lucide-react** — Icons (`Play`, `Code2`, `Network`, …).
- **recharts** — `ComplexityGraph.tsx`, `ComparisonMode.tsx`.
- **react-router-dom** — `App.tsx` routes.
- **@tanstack/react-query** — Configured in `App.tsx`; ready for future server data.
- **react-hook-form + @hookform/resolvers + zod** — Form/validation stack (shadcn form).
- **sonner + @radix-ui/react-toast** — Notifications (`CodeAnalyzer` errors).
- **@supabase/supabase-js** — Calls `supabase.functions.invoke("analyze-code", ...)`.
- **date-fns** — Date formatting (used by shadcn calendar).
- **cmdk, embla-carousel-react, input-otp, react-day-picker, react-resizable-panels, vaul, next-themes** — Shipped with shadcn primitives; available if needed.
- **vitest + @testing-library/* + jsdom** — Unit tests.

---

## 9. API & Backend

### Edge Function: `POST /functions/v1/analyze-code`

**Request body**
```json
{ "code": "for (int i=0;i<n;i++) ..." }
```

**Response body**
```json
{
  "timeComplexity": { "best": "O(n)", "average": "O(n)", "worst": "O(n)" },
  "spaceComplexity": "O(1)",
  "explanation": "Single loop runs n times ...",
  "suggestions": "Already optimal"
}
```

**Flow inside the function** (`supabase/functions/analyze-code/index.ts`):
1. Handle CORS preflight (`OPTIONS`).
2. Validate: code present, ≤ 10 000 chars.
3. Read `LOVABLE_API_KEY` from env (set as Supabase secret).
4. POST to `https://ai.gateway.lovable.dev/v1/chat/completions` with:
   - `model: google/gemini-3-flash-preview`
   - System message: "expert algorithm analyst…"
   - **Tool calling** with a strict JSON schema → guarantees structured output (no regex parsing of free text).
5. Handle errors: 429 (rate limit), 402 (credits exhausted), generic.
6. Return parsed JSON to client.

**Why an Edge Function (not a direct browser → Gemini call)?**
- Keeps the API key **server-side** (browser never sees it).
- Adds rate-limit/error normalization.
- Centralized prompt — easy to update.

### Why Lovable AI Gateway (not raw OpenAI/Google SDK)?
- No need to manage paid accounts/keys per environment.
- Unified billing through the Lovable workspace.
- Drop-in OpenAI-compatible HTTP API.

---

## 10. Connection Management

### Frontend ↔ Edge Function
```ts
import { supabase } from "@/integrations/supabase/client";

const { data, error } = await supabase.functions.invoke("analyze-code", {
  body: { code },
});
```

- `supabase` client is built from **publishable** env vars (`VITE_SUPABASE_URL`, `VITE_SUPABASE_PUBLISHABLE_KEY`) — safe in the browser.
- `invoke` automatically:
  - Adds CORS headers
  - Attaches the anon JWT
  - Serializes JSON body
  - Parses JSON response
- Errors come back as `{ data: null, error: FunctionsError }` — handled in a `try/catch`.

### Edge Function ↔ AI Gateway
- Plain `fetch()` with `Authorization: Bearer ${LOVABLE_API_KEY}`.
- Secret read via `Deno.env.get("LOVABLE_API_KEY")` — stored in Supabase Secrets, never in code.

### State management on the frontend
- **Local state** (`useState`) per component for inputs.
- **Lifted state** in `Index.tsx` for cross-tab data (selected algorithm, accumulated results).
- **React Query** provider is mounted but unused so far — kept for future server data.
- **No Redux / Zustand** — overkill for current scale.

---

## 11. Algorithms & Simulation Math

The brilliance of this project: **we don't actually run the algorithm on real data.** We use **closed-form operation-count formulas** that match the algorithm's runtime growth.

| Algorithm | `simulate(n)` formula | Why it matches |
|---|---|---|
| Linear Search | `n` | One comparison per element |
| Binary Search | `⌈log₂(n+1)⌉` | Search space halves each step |
| Bubble Sort | `n·(n-1)/2` | Sum of comparisons in nested loops |
| Merge Sort | `n·log₂(n)` | Recurrence T(n)=2T(n/2)+n |
| Quick Sort (avg) | `n·log₂(n)` | Balanced partition average |
| BFS / DFS | `V + E` | Visits every vertex + every edge once |

**Big-O detection** = pattern-match the *shape* of simulation outputs over multiple `n`s. Doubling `n`:
- O(1) → unchanged
- O(log n) → +constant
- O(n) → doubles
- O(n log n) → slightly more than double
- O(n²) → 4×
- O(n³) → 8×

The **AI analyzer** is a separate path — it reads source code semantically (loops, recursion) and outputs Big-O classes directly.

---

## 12. Security

- **No PII** stored; no auth required for current features.
- **API key isolation** — `LOVABLE_API_KEY` only inside Edge Function env.
- **Input validation** in Edge Function (length cap, type check) → prevents prompt-blasting & cost overruns.
- **CORS** locked to standard headers; methods limited to POST + OPTIONS.
- **Anon key in `.env`** is *publishable* — only useful when paired with RLS-protected tables (none yet).
- If user accounts are added later: enable Supabase Auth + RLS + roles in a **separate** `user_roles` table (never store role on profile → prevents privilege escalation).

---

## 13. Performance

- **Vite + SWC** build → sub-second HMR.
- **Tailwind JIT** — only generates classes you use.
- **Lucide tree-shaking** — only imported icons end up in the bundle.
- **No heavy charts on initial load** — Recharts renders only when a simulation runs.
- **Edge Function** runs in Deno isolates → cold-start ≈100 ms; warm ≈10 ms + AI latency.
- **No database queries** = no N+1, no indexes to tune.
- Memoization opportunities: `ComplexityGraph` could use `React.memo` if results grow large.

---

## 14. Likely Interview Questions

### Conceptual / theoretical
1. **What is Big-O notation?** — Asymptotic upper bound on growth of an algorithm's running time or space, as input size n → ∞.
2. **Difference between O(n), Θ(n), Ω(n)?** — Upper, tight, lower bound respectively.
3. **Best vs average vs worst case** — Show with Quick Sort (worst O(n²) when pivot is min/max).
4. **Why O(log n) for Binary Search?** — Search space halves → ⌈log₂ n⌉ steps.
5. **Space complexity of recursive Merge Sort?** — O(n) for temp arrays + O(log n) recursion stack.
6. **BFS vs DFS** — BFS uses a queue (level-order, shortest path in unweighted), DFS uses a stack/recursion (path discovery, cycle detection). Both O(V+E).
7. **What is amortized complexity?** — Average cost per operation over a sequence (e.g., dynamic array `push` is amortized O(1)).

### Project-specific
8. **Why did you build this?** → Make DAA concepts tangible; viva prep tool.
9. **Why React + Vite, not Next.js?** → Pure client-side SPA; no SSR/SEO need; Vite is faster for dev.
10. **Why TypeScript?** → Catches type bugs at compile time; better refactoring; auto-complete on `Algorithm` interface.
11. **Why Tailwind, not CSS modules?** → Faster iteration; consistent design tokens via HSL CSS vars; no naming fatigue.
12. **Why shadcn/ui over Material UI?** → shadcn copies components into your repo — you own/style them; no runtime version lock-in; smaller bundle.
13. **How does the AI analyzer work?** → Edge Function calls Lovable AI Gateway → Gemini with **tool-calling JSON schema** → guarantees parseable output.
14. **Why an Edge Function instead of calling Gemini from React?** → API key security + CORS + central prompt + future rate-limiting.
15. **What happens if Gemini is down?** → Function returns 500 with message; React shows a toast. The rest of the app (simulator, comparison, graph) keeps working — **graceful degradation**.
16. **No database — why?** → Simulator is pure-function; nothing needs persistence. Adding one would be premature.
17. **How would you scale this to 1M users?** → Edge Functions auto-scale; add CDN caching on static assets; rate-limit the AI route per IP; queue heavy analyses.
18. **How is state managed?** → `useState` locally; lift to `Index.tsx` for cross-component; React Query ready for server cache.
19. **Testing strategy?** → Vitest + Testing Library; pure functions in `algorithms.ts` are easiest to unit-test (deterministic).
20. **How is the graph laid out?** → Nodes placed on a circle (`layoutNodesCircle`) at angle `2πi/n`; edges drawn as SVG lines between centers.
21. **How does Comparison Mode work?** → Runs `simulate(n)` on both algorithms across `[10,100,1000,10000]`, plots two Recharts `<Line>`s on one chart.
22. **Why pseudocode and not real code?** → Language-agnostic; teaches the algorithm, not a syntax.
23. **What is the role of `class-variance-authority`?** → Defines component variants (e.g., button sizes/colors) in a typed way.
24. **What is Radix UI?** → Headless, accessibility-first React primitives. shadcn styles them.
25. **What is Deno?** → A secure JS/TS runtime by the creator of Node.js. Edge Functions run on it. ES modules over URLs, no `node_modules`.
26. **What is HMR?** — Hot Module Replacement; Vite swaps changed modules without full reload.
27. **Folder structure rationale?** → Feature components in `components/`, primitives in `components/ui/`, business logic in `lib/`, pages in `pages/`. Keeps concerns separated.
28. **How would you add user accounts?** → Enable Lovable Cloud auth, create `profiles` table + `user_roles` table with `has_role()` security-definer function for RLS.

### Tricky / "gotcha" questions
29. **Is `O(2n)` different from `O(n)`?** — No, constants are dropped.
30. **What's the complexity of `for (i=1; i<n; i*=2)`?** — O(log n).
31. **Nested loop where inner runs `i` times?** — Σi = O(n²).
32. **Big-O of `arr.indexOf(x)`?** — O(n) worst case.
33. **Why isn't your simulation accurate for very small n?** — Lower-order terms and constants dominate; that's why we test with n=10, 100, 1000, 10000 — large gaps reveal the growth pattern.

---

## TL;DR — One-Liner Pitch

> *"AlgoVision is a React + TypeScript + Tailwind SPA, backed by a Supabase Edge Function that proxies Google Gemini through the Lovable AI Gateway. It lets students simulate algorithm operation counts, visually compare growth curves, animate graph traversals, and AI-analyze arbitrary code — turning abstract Big-O into something you can see and click."*

Good luck with the interview. 🚀
