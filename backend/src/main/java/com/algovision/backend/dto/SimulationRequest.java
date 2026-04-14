package com.algovision.backend.dto;

public class SimulationRequest {
    private String algorithmId;
    private int[] inputSizes;

    // Getters and setters
    public String getAlgorithmId() { return algorithmId; }
    public void setAlgorithmId(String algorithmId) { this.algorithmId = algorithmId; }

    public int[] getInputSizes() { return inputSizes; }
    public void setInputSizes(int[] inputSizes) { this.inputSizes = inputSizes; }
}
