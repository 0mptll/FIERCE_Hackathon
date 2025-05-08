package com.hackathon.main.services;

import com.hackathon.main.entities.BankStatement;
import com.hackathon.main.entities.User;
import com.hackathon.main.repositories.BankStatementRepository;
import com.hackathon.main.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.Date;
import java.util.Optional;

@Service
public class BankStatementService {

    @Autowired
    private BankStatementRepository bankStatementRepository;

    @Autowired
    private UserRepository userRepository;

    //  Adjust the fileStorageLocation to point to a folder within htdocs
    private final Path fileStorageLocation = Paths.get("C:/xampp/htdocs/uploads/bankstatements"); // Adjust the path as needed

    @Autowired
    public BankStatementService() {
        try {
            Files.createDirectories(fileStorageLocation);
        } catch (IOException e) {
            throw new RuntimeException("Could not create the directory to store bank statements.", e);
        }
    }

    public BankStatement storeBankStatement(Long userId, String bankName, String accountNumber, String accountType, String statementPeriod, MultipartFile file) {
        Optional<User> userOptional = userRepository.findById(userId);
        if (!userOptional.isPresent()) {
            throw new RuntimeException("User not found with id: " + userId);
        }
        User user = userOptional.get();

        String filename = sanitizeFilename(file.getOriginalFilename());
        String filepath = fileStorageLocation.resolve(filename).toString();

        try {
            Files.copy(file.getInputStream(), Paths.get(filepath), StandardCopyOption.REPLACE_EXISTING);
        } catch (IOException e) {
            throw new RuntimeException("Failed to store file " + filename, e);
        }

        BankStatement bankStatement = new BankStatement();
        bankStatement.setUser(user);
        bankStatement.setBankName(bankName);
        bankStatement.setAccountNumber(accountNumber);
        bankStatement.setAccountType(accountType);
        bankStatement.setStatementPeriod(statementPeriod);
        bankStatement.setFilename(filename);
        bankStatement.setFilepath(filepath);
        bankStatement.setUploadDate(new Date());
        return bankStatementRepository.save(bankStatement);
    }

    private String sanitizeFilename(String filename) {
        return filename.replaceAll("[^a-zA-Z0-9._-]", "_");
    }
}
