//package com.hackathon.main.services;
//
//import com.hackathon.main.entities.Score;
//import com.hackathon.main.entities.User;
//import com.hackathon.main.repositories.ScoreRepository;
//import com.hackathon.main.repositories.UserRepository;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.stereotype.Service;
//import org.springframework.web.client.RestTemplate;
//
//import java.util.Optional;
//import java.util.Map;
//
//@Service
//public class ScoreService {
//
//    @Autowired
//    private ScoreRepository scoreRepository;
//
//    @Autowired
//    private UserRepository userRepository;
//
//    private final String FLASK_API_URL = "http://localhost:5001/predict"; // Flask ML service
//
//    public Score calculateMLScore(Long userId, Map<String, Object> financialData) {
//        Optional<User> userOpt = userRepository.findById(userId);
//        if (userOpt.isEmpty()) {
//            throw new RuntimeException("User not found");
//        }
//
//        // Call Flask ML API
//        RestTemplate restTemplate = new RestTemplate();
//        Map<String, Object> response = restTemplate.postForObject(FLASK_API_URL, financialData, Map.class);
//
//        if (response == null || !response.containsKey("credit_rating")) {
//            throw new RuntimeException("Error fetching ML category");
//        }
//
//        String category = response.get("credit_rating").toString();
//
//        // Check if a score record already exists for this user
//        Optional<Score> existingScoreOpt = scoreRepository.findByUserId(userId);
//        
//        Score score;
//        if (existingScoreOpt.isPresent()) {
//            // Update existing record
//            score = existingScoreOpt.get();
//            score.setCategory(category);
//            score.setMonthlyIncome(Integer.parseInt(financialData.get("monthly_income").toString()));
//            score.setGrocerySpending(Integer.parseInt(financialData.get("grocery_spending").toString()));
//            score.setUtilityBills(Integer.parseInt(financialData.get("utility_bills").toString()));
//            score.setTotalSavings(Integer.parseInt(financialData.get("savings").toString()));
//            score.setRentOrEmi(Integer.parseInt(financialData.get("rent_or_emi").toString()));
//            score.setMedicalExpenses(Integer.parseInt(financialData.get("medical_expense").toString()));
//            score.setTransportationCost(Integer.parseInt(financialData.get("transport").toString()));
//            score.setLoanRepayment(Integer.parseInt(financialData.get("loan_repayment").toString()));
//            score.setScore(applyScoreAdjustments(score.getScore(), category)); // Update score
//        } else {
//            // Create new record
//            score = new Score(
//                userOpt.get(),
//                category,
//                Integer.parseInt(financialData.get("monthly_income").toString()),
//                Integer.parseInt(financialData.get("grocery_spending").toString()),
//                Integer.parseInt(financialData.get("utility_bills").toString()),
//                Integer.parseInt(financialData.get("savings").toString()),
//                Integer.parseInt(financialData.get("rent_or_emi").toString()),
//                Integer.parseInt(financialData.get("medical_expense").toString()),
//                Integer.parseInt(financialData.get("transport").toString()),
//                Integer.parseInt(financialData.get("loan_repayment").toString())
//            );
//        }
//
//        Score savedScore = scoreRepository.save(score);
//        System.out.println("Stored in Database: " + savedScore); // Debugging logs
//
//        return savedScore;
//    }
//
//    private int applyScoreAdjustments(int baseScore, String category) {
//        switch (category.toLowerCase()) {
//            case "excellent":
//                baseScore += 10;
//                break;
//            case "good":
//                baseScore += 5;
//                break;
//            case "bad":
//                baseScore -= 5;
//                break;
//            case "very poor":
//                baseScore -= 10;
//                break;
//        }
//        return Math.max(baseScore, 300); // Ensures score does not go below 300
//    }
//
//    public Optional<Score> getScoreByUserId(Long userId) {
//        return scoreRepository.findByUserId(userId);
//    }
//}
package com.hackathon.main.services;

import com.hackathon.main.entities.Score;
import com.hackathon.main.entities.User;
import com.hackathon.main.repositories.ScoreRepository;
import com.hackathon.main.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.Optional;
import java.util.Map;

@Service
public class ScoreService {

    @Autowired
    private ScoreRepository scoreRepository;

    @Autowired
    private UserRepository userRepository;

    private final String FLASK_API_URL = "http://localhost:5001/predict"; // Flask ML service

    public Score calculateMLScore(Long userId, Map<String, Object> financialData) {
        Optional<User> userOpt = userRepository.findById(userId);
        if (userOpt.isEmpty()) {
            throw new RuntimeException("User not found");
        }

        // Call Flask ML API
        RestTemplate restTemplate = new RestTemplate();
        Map<String, Object> response = restTemplate.postForObject(FLASK_API_URL, financialData, Map.class);

        if (response == null || !response.containsKey("credit_rating")) {
            throw new RuntimeException("Error fetching ML category");
        }

        String category = response.get("credit_rating").toString();

        // Check if a score record already exists for this user
        Optional<Score> existingScoreOpt = scoreRepository.findByUserId(userId);
       
        Score score;
        if (existingScoreOpt.isPresent()) {
            // Update existing record
            score = existingScoreOpt.get();
            score.setCategory(category);
            score.setMonthlyIncome(Integer.parseInt(financialData.get("monthly_income").toString()));
            score.setGrocerySpending(Integer.parseInt(financialData.get("grocery_spending").toString()));
            score.setUtilityBills(Integer.parseInt(financialData.get("utility_bills").toString()));
            score.setTotalSavings(Integer.parseInt(financialData.get("savings").toString()));
            score.setRentOrEmi(Integer.parseInt(financialData.get("rent_or_emi").toString()));
            score.setMedicalExpenses(Integer.parseInt(financialData.get("medical_expense").toString()));
            score.setTransportationCost(Integer.parseInt(financialData.get("transport").toString()));
            score.setLoanRepayment(Integer.parseInt(financialData.get("loan_repayment").toString()));
            score.setScore(applyScoreAdjustments(score.getScore(), category)); // Update score
        } else {
            // Create new record
            score = new Score(
                    userOpt.get(),
                    category,
                    Integer.parseInt(financialData.get("monthly_income").toString()),
                    Integer.parseInt(financialData.get("grocery_spending").toString()),
                    Integer.parseInt(financialData.get("utility_bills").toString()),
                    Integer.parseInt(financialData.get("savings").toString()),
                    Integer.parseInt(financialData.get("rent_or_emi").toString()),
                    Integer.parseInt(financialData.get("medical_expense").toString()),
                    Integer.parseInt(financialData.get("transport").toString()),
                    Integer.parseInt(financialData.get("loan_repayment").toString())
            );
            score.setScore(applyScoreAdjustments(300, category)); // set initial score
        }

        Score savedScore = scoreRepository.save(score);
        System.out.println("Stored in Database: " + savedScore); // Debugging logs

        return savedScore;
    }

    private int applyScoreAdjustments(int baseScore, String category) {
        switch (category.toLowerCase()) {
            case "excellent":
                baseScore += 10;
                break;
            case "good":
                baseScore += 5;
                break;
            case "bad":
                baseScore -= 5;
                break;
            case "very poor":
                baseScore -= 10;
                break;
        }
        return Math.max(baseScore, 300); // Ensures score does not go below 300
    }

    public Optional<Score> getScoreByUserId(Long userId) {
        return scoreRepository.findByUserId(userId);
    }
}
