# AlgoVision — Algorithm Complexity Simulator

## 📋 What is this project?

AlgoVision is a **web application** that helps you understand **algorithm time and space complexity** visually. It lets you:

1. **Browse algorithms** — View details, pseudocode, and complexity of popular sorting and searching algorithms
2. **Run simulations** — Test algorithms with different input sizes and see how many operations they perform
3. **Visualize growth curves** — See interactive line charts showing how algorithms scale
4. **Compare algorithms** — Put two algorithms side-by-side to see which one is faster
5. **Analyze any code** — Paste any code snippet and get its Big-O complexity analyzed by AI

---

## 🏗️ Project Structure

```
AlgoVision/
├── README.md                          ← You are here (Project Overview)
├── docs/
│   ├── FRONTEND.md                    ← Frontend architecture & code explanation
│   ├── BACKEND.md                     ← Backend (Edge Functions) explanation
│   ├── TECHNOLOGIES.md                ← All technologies used & why
│   ├── CONCEPTS.md                    ← Programming concepts used (for beginners)
│   └── HOW_IT_ALL_CONNECTS.md         ← How frontend and backend talk to each other
├── src/                               ← All frontend source code
│   ├── components/                    ← Reusable UI pieces
│   ├── pages/                         ← Full pages (like Index.tsx)
│   ├── lib/                           ← Helper functions and algorithm data
│   └── integrations/supabase/         ← Backend connection setup
├── supabase/
│   └── functions/analyze-code/        ← Backend serverless function
├── public/                            ← Static files (favicon, robots.txt)
└── package.json                       ← Project dependencies list
```

---

## 🚀 How to Run Locally

**Prerequisites:** You need [Node.js](https://nodejs.org/) installed (v18 or higher).

```bash
# 1. Clone the repository
git clone <YOUR_GIT_URL>

# 2. Go into the project folder
cd <YOUR_PROJECT_NAME>

# 3. Install all required packages
npm install

# 4. Start the development server
npm run dev
```npm run dev

Then open **http://localhost:8080** in your browser.

---

## 📚 Documentation Files

| File | What it covers |
|------|---------------|
| [docs/FRONTEND.md](docs/FRONTEND.md) | How the frontend works — every component explained |
| [docs/BACKEND.md](docs/BACKEND.md) | How the backend Edge Function works |
| [docs/TECHNOLOGIES.md](docs/TECHNOLOGIES.md) | Every technology/library used and why |
| [docs/CONCEPTS.md](docs/CONCEPTS.md) | Programming concepts explained for beginners |
| [docs/HOW_IT_ALL_CONNECTS.md](docs/HOW_IT_ALL_CONNECTS.md) | How frontend calls backend and data flows |

---

## 🎯 Key Features

| Feature | Description |
|---------|-------------|
| Algorithm Library | Browse 5 algorithms (Linear Search, Binary Search, Bubble Sort, Merge Sort, Quick Sort) |
| Simulation Panel | Run algorithms with custom input sizes and see operation counts |
| Growth Graph | Interactive chart showing how operations grow with input size |
| Compare Mode | Compare two algorithms side-by-side on the same graph |
| AI Code Analyzer | Paste any code → get Big-O analysis powered by AI |
