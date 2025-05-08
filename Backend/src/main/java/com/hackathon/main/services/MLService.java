package com.hackathon.main.services;

import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.http.*;
import java.util.*;

@Service
public class MLService {
    private final String FLASK_API_URL = "http://localhost:5001/predict"; // Flask ML Service

    public String getMLCategory(Map<String, Object> financialData) {
        RestTemplate restTemplate = new RestTemplate();

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        HttpEntity<Map<String, Object>> request = new HttpEntity<>(financialData, headers);
        ResponseEntity<Map> response = restTemplate.postForEntity(FLASK_API_URL, request, Map.class);

        if (response.getBody() != null && response.getBody().containsKey("credit_rating")) {
            return response.getBody().get("credit_rating").toString(); // Return only the category
        } else {
            throw new RuntimeException("Error fetching ML category");
        }
    }
}