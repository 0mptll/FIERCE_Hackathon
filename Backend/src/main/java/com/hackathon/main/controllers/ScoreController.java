package com.hackathon.main.controllers;

import com.hackathon.main.entities.Score;
import com.hackathon.main.services.ScoreService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.Optional;
		
@CrossOrigin(origins = "http://localhost:3000") 
@RestController
@RequestMapping("/api/score")
public class ScoreController {

    @Autowired
    private ScoreService scoreService;

    @PostMapping("/calculate/{userId}")
    public ResponseEntity<?> calculateMLScore(@PathVariable Long userId, @RequestBody Map<String, Object> financialData) {
        try {
            Score score = scoreService.calculateMLScore(userId, financialData);
            return ResponseEntity.ok(score);
        } catch (Exception e) {
            System.err.println("Error calculating ML score: " + e.getMessage()); // Debugging logs
            return ResponseEntity.status(400).body(Map.of(
                "error", "Failed to calculate score",
                "message", e.getMessage()
            ));
        }
    }

    @GetMapping("/{userId}")
    public ResponseEntity<?> getScore(@PathVariable Long userId) {
        Optional<Score> scoreOpt = scoreService.getScoreByUserId(userId);

        if (scoreOpt.isPresent()) {
            return ResponseEntity.ok(scoreOpt.get());
        } else {
            return ResponseEntity.status(404).body(Map.of(
                "error", "Score not found",
                "message", "No score available for the given user ID"
            ));
        }
    }
}