package com.hackathon.main.controllers;

import com.hackathon.main.entities.BankStatement;
import com.hackathon.main.services.BankStatementService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;


@RestController
@RequestMapping("/api/bank-statement")
public class BankStatementController {

    @Autowired
    private BankStatementService bankStatementService;

    @PostMapping("/upload")
    public ResponseEntity<String> uploadBankStatement(
            @RequestParam("userId") Long userId,
            @RequestParam("bankName") String bankName,
            @RequestParam("accountNumber") String accountNumber,
            @RequestParam("accountType") String accountType,
            @RequestParam("statementPeriod") String statementPeriod,
            @RequestParam("file") MultipartFile file) {
        try {
            BankStatement statement = bankStatementService.storeBankStatement(userId, bankName, accountNumber, accountType, statementPeriod, file);
            return ResponseEntity.status(HttpStatus.CREATED).body("Bank statement uploaded successfully. Stored with ID: " + statement.getId());
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error uploading bank statement: " + e.getMessage());
        }
    }
}

