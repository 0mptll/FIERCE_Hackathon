package com.hackathon.main.controllers;

import com.hackathon.main.entities.User;
import com.hackathon.main.services.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private UserService userService;

    // Register a new user
    @PostMapping("/register")
    public ResponseEntity<String> registerUser(@RequestBody Map<String, String> request) {
        String password = request.get("password");
        String confirmPassword = request.get("confirmPassword");

        if (!password.equals(confirmPassword)) {
            return ResponseEntity.badRequest().body("Passwords do not match.");
        }

        User user = new User();
        user.setFullName(request.get("fullName"));
        user.setPhone(request.get("phone"));
        user.setVillage(request.get("village"));
        user.setDistrict(request.get("district"));
        user.setState(request.get("state"));
        user.setOccupation(request.get("occupation"));
        user.setMonthlyIncome(Integer.parseInt(request.get("monthlyIncome")));
        user.setEmail(request.get("email"));
        user.setPassword(password);
        user.setAadhaarConsent(Boolean.parseBoolean(request.get("aadhaarConsent")));
        user.setTermsConsent(Boolean.parseBoolean(request.get("termsConsent")));

        userService.createUser(user);
        return ResponseEntity.ok("User registered successfully!");
    }

    // Login user
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> loginData) {
        String phone = loginData.get("phone");
        String password = loginData.get("password");

        // Authenticate the user (e.g., using a UserService)
        Optional<User> loggedInUserOptional = userService.authenticateUser(phone, password);

        if (loggedInUserOptional.isPresent()) {
            User loggedInUser = loggedInUserOptional.get();
            // Create a response containing the success message and user ID
            Map<String, Object> response = new HashMap<>();
            response.put("message", "Login successful!");
            response.put("id", loggedInUser.getId()); // Assuming your User entity has a getId() method

            return ResponseEntity.ok(response);
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid phone number or password");
        }
    }

}