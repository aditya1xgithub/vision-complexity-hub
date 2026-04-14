package com.algovision.backend.service;

import org.springframework.stereotype.Service;
import com.algovision.backend.dto.SimulationRequest;
import com.algovision.backend.dto.SimulationResponse;
import java.util.ArrayList;
import java.util.LinkedList;
import java.util.List;
import java.util.PriorityQueue;
import java.util.Random;

@Service
public class SimulationService {
    
    public SimulationResponse runSimulation(SimulationRequest request) {
        SimulationResponse response = new SimulationResponse();
        response.setAlgorithmId(request.getAlgorithmId());
        
        List<Integer> inputSizes = new ArrayList<>();
        for(int size : request.getInputSizes()) {
            inputSizes.add(size);
        }
        response.setInputSizes(inputSizes);
        
        List<Long> operationsList = new ArrayList<>();
        
        for (int n : inputSizes) {
            long ops = executeAlgorithmForSize(request.getAlgorithmId(), n);
            operationsList.add(ops);
        }
        
        response.setOperations(operationsList);
        response.setDetectedComplexity(detectComplexity(operationsList, inputSizes));
        
        return response;
    }
    
    private long executeAlgorithmForSize(String algoId, int n) {
        int[] arr = generateRandomArray(n);
        
        return switch (algoId) {
            case "linear-search" -> linearSearchDAA(arr, -1);
            case "binary-search" -> binarySearchDAA(generateSortedArray(n), -1);
            case "bubble-sort" -> bubbleSortDAA(arr);
            case "merge-sort" -> mergeSortDAA(arr);
            case "quick-sort" -> quickSortDAA(arr);
            case "kadanes" -> kadanesDP(arr);
            case "dijkstra" -> dijkstraGraphConcepts(n);
            default -> (long) n;
        };
    }
    
    
    private long linearSearchDAA(int[] arr, int target) {
        long ops = 0;
        for (int i = 0; i < arr.length; i++) {
            ops++; // Comparison step
            if (arr[i] == target) return ops;
        }
        return ops;
    }
    
    private long binarySearchDAA(int[] arr, int target) {
        long ops = 0;
        int low = 0, high = arr.length - 1;
        // Divide and Conquer Concept
        while (low <= high) {
            ops++;
            int mid = low + (high - low) / 2;
            if (arr[mid] == target) return ops;
            else if (arr[mid] < target) low = mid + 1;
            else high = mid - 1;
        }
        return ops;
    }
    
    private long bubbleSortDAA(int[] arr) {
        long ops = 0;
        int n = arr.length;
        for (int i = 0; i < n - 1; i++) {
            for (int j = 0; j < n - i - 1; j++) {
                ops++;
                if (arr[j] > arr[j + 1]) {
                    int temp = arr[j];
                    arr[j] = arr[j + 1];
                    arr[j + 1] = temp;
                }
            }
        }
        return ops;
    }
    
    private long mergeSortDAA(int[] arr) {
        long[] ops = {0};
        mergeSortDivideAndConquer(arr, 0, arr.length - 1, ops);
        return ops[0];
    }
    
    private void mergeSortDivideAndConquer(int[] arr, int l, int r, long[] ops) {
        if (l < r) {
            ops[0]++;
            int m = l + (r - l) / 2;
            mergeSortDivideAndConquer(arr, l, m, ops);
            mergeSortDivideAndConquer(arr, m + 1, r, ops);
            mergeStep(arr, l, m, r, ops);
        }
    }
    
    private void mergeStep(int[] arr, int l, int m, int r, long[] ops) {
        int n1 = m - l + 1;
        int n2 = r - m;
        int[] L = new int[n1];
        int[] R = new int[n2];
        System.arraycopy(arr, l, L, 0, n1);
        System.arraycopy(arr, m + 1, R, 0, n2);
        
        int i = 0, j = 0, k = l;
        while (i < n1 && j < n2) {
            ops[0]++;
            if (L[i] <= R[j]) {
                arr[k] = L[i];
                i++;
            } else {
                arr[k] = R[j];
                j++;
            }
            k++;
        }
        while (i < n1) { ops[0]++; arr[k++] = L[i++]; }
        while (j < n2) { ops[0]++; arr[k++] = R[j++]; }
    }
    
    private long quickSortDAA(int[] arr) {
        long[] ops = {0};
        quickSortDivideAndConquer(arr, 0, arr.length - 1, ops);
        return ops[0];
    }
    
    private void quickSortDivideAndConquer(int[] arr, int low, int high, long[] ops) {
        ops[0]++;
        if (low < high) {
            int pi = partitionPartitioningStrategy(arr, low, high, ops);
            quickSortDivideAndConquer(arr, low, pi - 1, ops);
            quickSortDivideAndConquer(arr, pi + 1, high, ops);
        }
    }
    
    private int partitionPartitioningStrategy(int[] arr, int low, int high, long[] ops) {
        int pivot = arr[high];
        int i = (low - 1);
        for (int j = low; j < high; j++) {
            ops[0]++;
            if (arr[j] < pivot) {
                i++;
                int temp = arr[i];
                arr[i] = arr[j];
                arr[j] = temp;
            }
        }
        int temp = arr[i + 1];
        arr[i + 1] = arr[high];
        arr[high] = temp;
        return i + 1;
    }
    
 
    
    private long kadanesDP(int[] arr) {
        long ops = 0;
        int n = arr.length;
        if (n == 0) return 0;
        
    
        int[] dp = new int[n]; 
        dp[0] = arr[0];
        int maxGlobal = dp[0];
        
        for (int i = 1; i < n; i++) {
            ops++;
            // DP state transition equation: dp[i] = max(arr[i], dp[i-1] + arr[i])
            dp[i] = Math.max(arr[i], dp[i - 1] + arr[i]);
            if (dp[i] > maxGlobal) {
                maxGlobal = dp[i];
            }
        }
        return ops;
    }
    

    
    // Formal Graph Data Structure using Adjacency List (Linked Lists)
    static class Edge {
        int targetNode;
        int weight;
        public Edge(int targetNode, int weight) {
            this.targetNode = targetNode;
            this.weight = weight;
        }
    }
    
    static class Graph {
        int vertices;
        // Array of Linked Lists for adjacency
        LinkedList<Edge>[] adjList;
        
        @SuppressWarnings("unchecked")
        public Graph(int vertices) {
            this.vertices = vertices;
            adjList = new LinkedList[vertices];
            for (int i = 0; i < vertices; i++) {
                adjList[i] = new LinkedList<>();
            }
        }
        
        public void addEdge(int source, int dest, int weight) {
            adjList[source].add(new Edge(dest, weight));
            // Undirected graph assumption
            adjList[dest].add(new Edge(source, weight));
        }
    }
    
    // Node for Priority Queue in Dijkstra
    static class PQNode implements Comparable<PQNode> {
        int vertex;
        int distance;
        public PQNode(int vertex, int distance) {
            this.vertex = vertex;
            this.distance = distance;
        }
        @Override
        public int compareTo(PQNode other) {
            return Integer.compare(this.distance, other.distance);
        }
    }

    private long dijkstraGraphConcepts(int numNodes) {
        long ops = 0;
        
        // 1. Graph Construction Phase
        Graph graph = new Graph(numNodes);
        Random rand = new Random();
        
        // Creating a dense graph
        for (int i = 0; i < numNodes - 1; i++) {
            for(int j = i + 1; j < Math.min(numNodes, i + 50); j++) {
                graph.addEdge(i, j, rand.nextInt(10) + 1);
            }
        }
        
        // 2. Greedy Algorithm Phase (Dijkstra's using Min Priority Queue)
        int[] dist = new int[numNodes];
        for (int i = 0; i < numNodes; i++) dist[i] = Integer.MAX_VALUE;
        dist[0] = 0; // source is node 0
        
        PriorityQueue<PQNode> pq = new PriorityQueue<>();
        pq.add(new PQNode(0, 0));
        
        while (!pq.isEmpty()) {
            PQNode current = pq.poll();
            ops++; // Priority queue extract min operation
            
            int u = current.vertex;
            
            // Adjacency List iteration using formal Linked List
            for (Edge edge : graph.adjList[u]) {
                ops++; // Edge evaluation operation
                int v = edge.targetNode;
                int weight = edge.weight;
                
                // Relaxation Step
                if (dist[u] + weight < dist[v]) {
                    dist[v] = dist[u] + weight;
                    pq.add(new PQNode(v, dist[v]));
                    ops++; // Priority queue update
                }
            }
        }
        return ops;
    }
    
    // Helper Data Generators
    private int[] generateRandomArray(int n) {
        int[] arr = new int[n];
        Random rand = new Random();
        for (int i = 0; i < n; i++) {
            arr[i] = rand.nextInt(20000) - 10000;
        }
        return arr;
    }
    
    private int[] generateSortedArray(int n) {
        int[] arr = new int[n];
        for(int i=0; i<n; i++) arr[i] = i;
        return arr;
    }
    
    // Complexity Detector (Mimicked from React code)
    private String detectComplexity(List<Long> observed, List<Integer> testSizes) {
        double nScale = (double) observed.get(2) / testSizes.get(2);
        double n2Scale = (double) observed.get(2) / Math.pow(testSizes.get(2), 2);
        
        double errorN = 0, errorN2 = 0, errorNlogN = 0, errorLogn = 0;
        
        for (int i = 0; i < observed.size(); i++) {
            int n = testSizes.get(i);
            long obs = observed.get(i);
            
            errorN += Math.pow((obs - nScale * n) / Math.max(1, obs), 2);
            errorN2 += Math.pow((obs - n2Scale * Math.pow(n, 2)) / Math.max(1, obs), 2);
            errorNlogN += Math.pow((obs - (nScale / Math.log(testSizes.get(2))) * n * Math.log(n)) / Math.max(1, obs), 2);
            errorLogn += Math.pow((obs - (nScale * Math.log(n))) / Math.max(1, obs), 2);
        }
        
        if (observed.get(observed.size()-1) <= observed.get(0) + 10) return "O(1)";
        
        double minError = Math.min(Math.min(errorN, errorN2), Math.min(errorNlogN, errorLogn));
        
        if (minError == errorN2) return "O(n²)";
        if (minError == errorNlogN) return "O(n log n)";
        if (minError == errorN) return "O(n)";
        return "O(log n)";
    }
}
