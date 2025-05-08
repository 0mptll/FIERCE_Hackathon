package com.hackathon.main.controllers;

import com.hackathon.main.services.MLService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/ml")
public class MLController {

    @Autowired
    private MLService mlService;

    @PostMapping("/score")
    public String getMLCategory(@RequestBody Map<String, Object> financialData) {
        return mlService.getMLCategory(financialData);
    }
}