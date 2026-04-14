# Backend — Edge Functions Explained

This document explains the backend part of AlgoVision — the AI-powered code analyzer.

---

## 🤔 What is a "Backend"?

When you open a website:
- **Frontend** = What runs in YOUR browser (the HTML, CSS, JavaScript you see)
- **Backend** = Code that runs on a SERVER (a computer on the internet)

**Why do we need a backend?**
- Some things can't happen in the browser (like calling AI APIs with secret keys)
- API keys must be kept secret — if they were in frontend code, anyone could steal them
- The backend is like a "middleman" between your browser and external services

---

## ☁️ What are Edge Functions?

Edge Functions are **serverless functions** — small pieces of code that run on a server only when called.

**"Serverless" doesn't mean "no server"** — it means:
- You don't manage the server yourself
- The cloud provider runs your code when needed
- You only pay for actual usage, not idle time
- The function starts up, does its job, and shuts down

Think of it like a vending machine:
- It doesn't need a person standing there all the time
- You press a button (make a request) → it gives you the product (returns data) → it goes idle

---

## 📁 The Analyze-Code Edge Function

**File:** `supabase/functions/analyze-code/index.ts`

This function receives code from the user, sends it to an AI model, and returns the complexity analysis.

### Step-by-Step Walkthrough

#### 1. Imports and Setup

```typescript
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
```

- `serve` is a function that creates an HTTP server (listens for web requests)
- This runs on **Deno** (a JavaScript runtime, similar to Node.js but different)
- The URL import is how Deno loads packages (unlike Node.js which uses `npm`)

#### 2. CORS Headers

```typescript
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, ...",
};
```

**What is CORS?**
- CORS stands for **Cross-Origin Resource Sharing**
- Browsers block requests from one website to another by default (security feature)
- Our frontend (at `localhost:8080`) needs to talk to the backend (at a different URL)
- CORS headers tell the browser: "It's OK, allow this request"
- `"*"` means "allow requests from any website"

#### 3. Handling OPTIONS Requests (Preflight)

```typescript
if (req.method === "OPTIONS") {
  return new Response(null, { headers: corsHeaders });
}
```

**What is a preflight request?**
- Before sending a real request, the browser sends a "test" request (OPTIONS method)
- It's asking the server: "Are you going to accept my request?"
- If the server responds with CORS headers → browser proceeds with the real request
- If not → browser blocks the request

#### 4. Reading the Request Body

```typescript
const { code } = await req.json();
```

- `req.json()` reads the incoming data and parses it as JSON
- `{ code }` is **destructuring** — it extracts the `code` property from the JSON object
- `await` means "wait for this to finish before continuing" (because reading data takes time)

**What is `await`?**
- Some operations take time (network requests, reading files, etc.)
- `await` pauses the function until the operation completes
- The function must be marked as `async` to use `await`
- Without `await`, the code would continue before the data is ready

#### 5. Input Validation

```typescript
if (!code || typeof code !== "string" || code.trim().length === 0) {
  return new Response(
    JSON.stringify({ error: "Please provide code to analyze." }),
    { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
  );
}
```

**What is validation?**
- Checking that the input data is correct before processing it
- `!code` → Is code missing or empty?
- `typeof code !== "string"` → Is it not a string? (could be a number, object, etc.)
- `code.trim().length === 0` → Is it only whitespace?
- Status `400` means "Bad Request" — the client sent invalid data

**What is `typeof`?**
- `typeof` returns the type of a value as a string
- `typeof "hello"` → `"string"`
- `typeof 42` → `"number"`
- `typeof true` → `"boolean"`

#### 6. Getting the API Key

```typescript
const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
if (!LOVABLE_API_KEY) {
  throw new Error("LOVABLE_API_KEY is not configured");
}
```

- `Deno.env.get()` reads an **environment variable** (a secret value stored on the server)
- API keys are stored as environment variables so they never appear in code
- If the key is missing, we `throw` an error (crash intentionally with a helpful message)

**What are environment variables?**
- Secret values stored in the server's environment, not in code
- Like a locked safe — the code knows the safe exists but the contents aren't visible in the source code
- Examples: API keys, database passwords, secret tokens

#### 7. Calling the AI API

```typescript
const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
  method: "POST",
  headers: {
    Authorization: `Bearer ${LOVABLE_API_KEY}`,
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    model: "google/gemini-3-flash-preview",
    messages: [
      { role: "system", content: "You are an expert algorithm analyst..." },
      { role: "user", content: `Analyze this code:\n\n${code}` },
    ],
    tools: [{ type: "function", function: { name: "analyze_complexity", ... } }],
  }),
});
```

**What is `fetch`?**
- `fetch` makes HTTP requests (like a browser visiting a URL, but programmatically)
- `method: "POST"` means we're sending data TO the server (unlike GET which retrieves data)
- `headers` contains metadata about the request (authentication, content type)
- `body` contains the actual data we're sending

**What is `Bearer ${LOVABLE_API_KEY}`?**
- This is the **Authorization header** — proving we have permission to use the API
- `Bearer` is a type of authentication token
- Template literals (backticks `` ` ` ``) allow embedding variables with `${variable}`

**What is the `messages` array?**
- AI models work with a conversation format
- `system` message → Instructions for the AI (how to behave)
- `user` message → The actual question/request
- This tells the AI: "You're an algorithm expert. Analyze this code."

**What are `tools` in the API?**
- Tools tell the AI to return data in a **specific structured format** (JSON schema)
- Instead of free-form text, the AI returns exact fields: `timeComplexity`, `spaceComplexity`, etc.
- This makes parsing the response reliable

#### 8. Error Handling

```typescript
if (!response.ok) {
  if (response.status === 429) {
    return new Response(JSON.stringify({ error: "Rate limit exceeded..." }), { status: 429 });
  }
  if (response.status === 402) {
    return new Response(JSON.stringify({ error: "AI credits exhausted..." }), { status: 402 });
  }
}
```

**HTTP Status Codes:**
| Code | Meaning |
|------|---------|
| 200 | OK — Success |
| 400 | Bad Request — Client sent invalid data |
| 402 | Payment Required — Out of credits |
| 429 | Too Many Requests — Slow down |
| 500 | Internal Server Error — Something broke on the server |

#### 9. Parsing the AI Response

```typescript
const data = await response.json();
const toolCall = data.choices?.[0]?.message?.tool_calls?.[0];
const analysis = JSON.parse(toolCall.function.arguments);
```

- The AI returns its response inside `choices[0].message.tool_calls[0]`
- `?.` is **optional chaining** — if any part is null/undefined, it returns undefined instead of crashing
- `JSON.parse()` converts a JSON string back into a JavaScript object

#### 10. Try-Catch Error Handling

```typescript
try {
  // ... risky code that might fail
} catch (e) {
  console.error("analyze-code error:", e);
  return new Response(
    JSON.stringify({ error: e.message }),
    { status: 500 }
  );
}
```

**What is try-catch?**
- `try` block contains code that MIGHT throw an error
- If an error occurs, execution jumps to the `catch` block
- `e` contains the error object with details about what went wrong
- Without try-catch, an error would crash the entire function
- This ensures we always return a proper response, even when things go wrong

---

## 🔄 How Frontend Calls the Backend

In `CodeAnalyzer.tsx`:

```typescript
const { data, error } = await supabase.functions.invoke("analyze-code", {
  body: { code },
});
```

1. User types code and clicks "Analyze"
2. Frontend calls `supabase.functions.invoke("analyze-code", ...)` 
3. This sends an HTTP POST request to the Edge Function
4. The Edge Function processes the request and calls the AI API
5. AI returns the complexity analysis
6. Edge Function sends the result back to the frontend
7. Frontend displays the results

```
┌─────────┐    HTTP POST     ┌────────────────┐    HTTP POST    ┌──────────┐
│ Browser  │ ──────────────→ │ Edge Function  │ ─────────────→ │  AI API  │
│(Frontend)│ ←────────────── │   (Backend)    │ ←───────────── │(Gemini)  │
└─────────┘    JSON Response  └────────────────┘   JSON Response └──────────┘
```
