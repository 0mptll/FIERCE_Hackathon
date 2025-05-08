package com.hackathon.main.services;

import com.hackathon.main.entities.UtilityBill;
import com.hackathon.main.entities.User;
import com.hackathon.main.repositories.UtilityBillRepository;
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
public class UtilityBillService {

    @Autowired
    private UtilityBillRepository utilityBillRepository;

    @Autowired
    private UserRepository userRepository;

    //  Adjust the fileStorageLocation to point to a folder within htdocs
    private final Path fileStorageLocation = Paths.get("C:/xampp/htdocs/uploads/utilitybills"); // Adjust the path as needed

    @Autowired
    public UtilityBillService() {
        try {
            Files.createDirectories(fileStorageLocation);
        } catch (IOException e) {
            throw new RuntimeException("Could not create the directory where the uploaded files will be stored.", e);
        }
    }

    public UtilityBill storeUtilityBill(Long userId, String billType, String provider, Double billAmount, Date billDate, String consumerNumber, String address, MultipartFile file) {
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

        UtilityBill utilityBill = new UtilityBill();
        utilityBill.setUser(user);
        utilityBill.setBillType(billType);
        utilityBill.setProvider(provider);
        utilityBill.setBillAmount(billAmount);
        utilityBill.setBillDate(billDate);
        utilityBill.setConsumerNumber(consumerNumber);
        utilityBill.setAddress(address);
        utilityBill.setFilename(filename);
        utilityBill.setFilepath(filepath);

        return utilityBillRepository.save(utilityBill);
    }

    private String sanitizeFilename(String filename) {
        return filename.replaceAll("[^a-zA-Z0-9._-]", "_");
    }
}
