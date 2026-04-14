# 🎓 DAA Project Viva Prep: Code Implementation Breakdown

This document is specifically tailored for your mentor's **Design and Analysis of Algorithms (DAA)** viva. It skips project background and focuses **exclusively on the code**: *what* data structures were implemented, *where* they are located, and *how* the logic is written.

---

## 🏗️ 1. Backend: The Core DAA Logic (Java)
**Location:** `backend/src/main/java/com/algovision/backend/service/SimulationService.java`

This single file contains the textbook academic implementations of the B.Tech 2nd-year DAA algorithms.

### A. Graph Data Structure & Greedy Algorithm (Dijkstra's)
**Method:** `dijkstraGraphConcepts()`  
**DAA Concept:** Greedy methodology, Single-Source Shortest Path.  
**Data Structures Used:**
1. **Adjacency List (`LinkedList`):** Instead of an adjacency matrix, we defined a formal `Graph` class which holds an array of `LinkedList<Edge>`. This demonstrates understanding of $O(V + E)$ space complexity memory efficiency.
   ```java
   static class Graph {
       int vertices;
       LinkedList<Edge>[] adjList; // Formal Linked List implementation
   }
   ```
2. **Min-Priority Queue (`PriorityQueue`):** To achieve optimal $O((V+E) \log V)$ time complexity, we used Java's `PriorityQueue` with a custom `Comparable` node `PQNode` to extract the lowest-cost edge efficiently using Greedy relaxation.

---

### B. Dynamic Programming (Kadane's Algorithm)
**Method:** `kadanesDP()`  
**DAA Concept:** Dynamic Programming (Bottom-Up tabulation).  
**Implementation Details:**
- While Kadane's can be done with simple variables, to prove DP knowledge, the code creates an explicit **State Array**: `int[] dp = new int[n]`.
- **State Equation:** `dp[i] = Math.max(arr[i], dp[i-1] + arr[i])`
- This formally demonstrates that the optimal substructure property of DP is applied by keeping track of the local maximum at each array index.

---

### C. Divide and Conquer (Merge Sort & Quick Sort)
**Methods:** `mergeSortDAA()`, `quickSortDAA()`  
**DAA Concept:** Divide, Conquer, and Combine.  
**Implementation Details:**
1. **Merge Sort:** 
   - Demonstrates strict recursive splitting into two halves `m = l + (r - l) / 2`.
   - The `mergeStep` explicitly demonstrates the **Combine** phase by generating temporary left `L[]` and right `R[]` arrays and comparing indices ($O(n)$ time per level, leading to general $O(n \log n)$).
2. **Quick Sort:**
   - Demonstrates **Partitioning**. `partitionPartitioningStrategy()` uses the last element as the pivot and maintains a pointer `i` for elements smaller than the pivot. Displays $O(\log n)$ recursion tree depth in average cases.

---

### D. Searching (Linear vs Binary)
**Methods:** `linearSearchDAA()`, `binarySearchDAA()`  
**Implementation Details:**
- **Linear Search:** Simple linear iteration demonstrating $O(n)$ bounds.
- **Binary Search:** Demonstrates reducing the search space by half at each step (`mid = low + (high - low) / 2`).

---

## 🌐 2. API Communication Layer (Java & TypeScript)
Your mentor might ask: *"How does the frontend get the complexity of these algorithms?"*

**Location 1 (Backend Controller):** `backend/src/main/java/com/algovision/backend/controller/AlgorithmController.java`
- Contains an endpoint `@PostMapping("/simulate")`.
- Receives a `SimulationRequest` JSON (like `{"algorithmId": "kadanes", "inputSizes": [10, 100, 1000]}`).
- Triggers the `SimulationService` to run our exact DAA implementations above, incrementing an `ops++` counter at every critical operation step (comparisons, loops).

**Location 2 (Frontend Connector):** `src/lib/algorithms.ts` (Lines ~155-164)
- Contains the `export async function runSimulation()`. 
- Sends an asynchronous `fetch()` API call over strictly to the Java backend running on port `8081`. 

---

## 🖥️ 3. Frontend UI Components (React)
While DAA vivas focus on the backend logic, identifying how inputs map to the UI is helpful.

1. **Algorithm Visualizations (`src/lib/algorithms.ts`)**
   - We maintain a list of `algorithms` defining the `pseudocode` strings, `timeComplexity` mathematical notations, and fallback simulations.
   
2. **Simulation Runner (`src/components/SimulationPanel.tsx`)**
   - The user selects inputs (e.g., $N=10, 1000$). 
   - `simulate = async ()` is fired, requesting the Java backend to run the DAA code.
   - It captures the exact `operations` count returned by the Java backend and dynamically maps it onto the UI table.

3. **Time Complexity Graph (`src/components/ComparisonMode.tsx` & `ComplexityGraph.tsx`)**
   - Submits arrays of different sizes to different algorithms (e.g., Kadane vs Dijkstra). 
   - Plots the coordinates `(input_size, operation_count)`. Because Dijkstra's uses `PriorityQueue` relaxation, the graph will visually show $O(N \log N)$ or $N^2$ density curves, compared to Kadane's perfect $O(N)$ straight line.

---

## 💡 How to Answer Key Viva Questions:

**Q: "Did you use any library for graph processing?"**
*A: "No, in `SimulationService.java` I built a formal `Graph` class from scratch using an array of Java `LinkedList` utilities for the Adjacency List. I then manually combined it with a `PriorityQueue` to relax edges in my `dijkstraGraphConcepts` function."*

**Q: "How did you prove Kadane's is Dynamic Programming?"**
*A: "I used memoization/tabulation by declaring an explicit state array `int[] dp` where each index stores the maximum contiguous sum ending at that exact index, applying the state transition equation `dp[i] = Math.max(arr[i], dp[i-1] + arr[i])`."*

**Q: "How do you calculate complexity if we test an array of 10,000?"**
*A: "The frontend sends the size $10,000$ to the Java Spring Boot backend. The backend constructs a random array of 10,000 integers and executes the actual recursive or graph code, manually tracking a counter `ops++` inside pivotal loop decisions. The final operation count is returned as the exact time complexity measure."*
