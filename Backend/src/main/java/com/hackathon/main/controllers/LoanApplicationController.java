package com.hackathon.main.controllers;
import com.hackathon.main.entities.LoanApplication;
import com.hackathon.main.services.LoanApplicationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
@RestController
@RequestMapping("/api/applications")
public class LoanApplicationController {
   @Autowired
   private LoanApplicationService service;
   @PostMapping
   public ResponseEntity<LoanApplication> submitApplication(@RequestBody LoanApplication application) {
       LoanApplication savedApp = service.submitApplication(application);
       return ResponseEntity.status(HttpStatus.CREATED).body(savedApp);
   }
}
