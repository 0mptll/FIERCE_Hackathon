package com.hackathon.main.controllers;

import com.hackathon.main.entities.UtilityBill;
import com.hackathon.main.services.UtilityBillService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import java.util.Date;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import org.springframework.web.bind.annotation.RequestParam;


@RestController
@RequestMapping("/api/utility-bill")
public class UtilityBillController {

    @Autowired
    private UtilityBillService utilityBillService;

    @PostMapping("/upload")
    public ResponseEntity<String> uploadUtilityBill(
            @RequestParam("userId") Long userId,
            @RequestParam("billType") String billType,
            @RequestParam("provider") String provider,
            @RequestParam("billAmount") Double billAmount,
            @RequestParam("billDate") String billDateStr,
            @RequestParam("consumerNumber") String consumerNumber,
            @RequestParam("address") String address,
            @RequestParam("file") MultipartFile file) {

        try {
            //  Parse the billDate string into a Date object
            Date billDate = new SimpleDateFormat("yyyy-MM-dd").parse(billDateStr);

            //  Call the service to store the utility bill data and the file
            UtilityBill utilityBill = utilityBillService.storeUtilityBill(userId, billType, provider, billAmount, billDate, consumerNumber, address, file);

            return ResponseEntity.status(HttpStatus.CREATED).body("Utility bill uploaded successfully.  Stored with ID: " + utilityBill.getId());
        } catch (ParseException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Invalid date format. Please use yyyy-MM-dd.");
        } catch (RuntimeException e) {
            //  Catch the exceptions thrown by the service (e.g., user not found, file error)
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error uploading utility bill: " + e.getMessage());
        }
    }
}
