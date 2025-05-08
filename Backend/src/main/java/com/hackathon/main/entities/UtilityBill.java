package com.hackathon.main.entities;

import jakarta.persistence.*;
import org.springframework.web.multipart.MultipartFile; // Import for handling file uploads
import java.util.Date;

@Entity
public class UtilityBill {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    //  Foreign key relationship with User
    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false) //  'user_id' is the column in UtilityBill table
    private User user;

    @Column(nullable = false)
    private String billType;

    @Column(nullable = false)
    private String provider;

    @Column(nullable = false)
    private Double billAmount;

    @Column(nullable = false)
    private Date billDate;

    @Column(nullable = false)
    private String consumerNumber;

    @Column(nullable = false)
    private String address;

    // Store the file name, not the actual file data.  Store the path.
    @Column(nullable = false)
    private String filename;

     @Column(nullable = false)
    private String filepath;

    // Constructors
    public UtilityBill() {}

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }

    public String getBillType() { return billType; }
    public void setBillType(String billType) { this.billType = billType; }

    public String getProvider() { return provider; }
    public void setProvider(String provider) { this.provider = provider; }

    public Double getBillAmount() { return billAmount; }
    public void setBillAmount(Double billAmount) { this.billAmount = billAmount; }

    public Date getBillDate() { return billDate; }
    public void setBillDate(Date billDate) { this.billDate = billDate; }

    public String getConsumerNumber() { return consumerNumber; }
    public void setConsumerNumber(String consumerNumber) { this.consumerNumber = consumerNumber; }

    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }

    public String getFilename() {
        return filename;
    }

    public void setFilename(String filename) {
        this.filename = filename;
    }

    public String getFilepath() {
        return filepath;
    }

    public void setFilepath(String filepath) {
        this.filepath = filepath;
    }
}

