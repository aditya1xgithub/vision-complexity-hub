package com.algovision.backend.dto;

import java.util.List;

public class SimulationResponse {
    private String algorithmId;
    private List<Integer> inputSizes;
    private List<Long> operations;
    private String detectedComplexity;

    // Getters and Setters
    public String getAlgorithmId() { return algorithmId; }
    public void setAlgorithmId(String algorithmId) { this.algorithmId = algorithmId; }

    public List<Integer> getInputSizes() { return inputSizes; }
    public void setInputSizes(List<Integer> inputSizes) { this.inputSizes = inputSizes; }

    public List<Long> getOperations() { return operations; }
    public void setOperations(List<Long> operations) { this.operations = operations; }

    public String getDetectedComplexity() { return detectedComplexity; }
    public void setDetectedComplexity(String detectedComplexity) { this.detectedComplexity = detectedComplexity; }
}
