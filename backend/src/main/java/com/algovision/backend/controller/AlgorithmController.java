package com.algovision.backend.controller;

import org.springframework.web.bind.annotation.*;
import org.springframework.beans.factory.annotation.Autowired;
import com.algovision.backend.dto.SimulationRequest;
import com.algovision.backend.dto.SimulationResponse;
import com.algovision.backend.service.SimulationService;

@RestController
@RequestMapping("/api/algorithms")
public class AlgorithmController {

    private final SimulationService simulationService;

    @Autowired
    public AlgorithmController(SimulationService simulationService) {
        this.simulationService = simulationService;
    }

    @PostMapping("/simulate")
    public SimulationResponse simulateAlgorithm(@RequestBody SimulationRequest request) {
        return simulationService.runSimulation(request);
    }
    
    @GetMapping("/health")
    public String health() {
        return "Backend is running!";
    }
}
