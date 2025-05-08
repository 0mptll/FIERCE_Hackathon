package com.hackathon.main.entities;

import jakarta.persistence.*;

@Entity
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    private String fullName;
    private String phone;
    private String village;
    private String district;
    private String state;
    private String occupation;
    private Integer monthlyIncome;

    @Column(unique = true, nullable = false)
    private String email;

    private String password;

    private boolean aadhaarConsent;
    private boolean termsConsent;

    // Constructors
    public User() {}

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getFullName() { return fullName; }
    public void setFullName(String fullName) { this.fullName = fullName; }

    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }

    public String getVillage() { return village; }
    public void setVillage(String village) { this.village = village; }

    public String getDistrict() { return district; }
    public void setDistrict(String district) { this.district = district; }

    public String getState() { return state; }
    public void setState(String state) { this.state = state; }

    public String getOccupation() { return occupation; }
    public void setOccupation(String occupation) { this.occupation = occupation; }

    public Integer getMonthlyIncome() { return monthlyIncome; }
    public void setMonthlyIncome(Integer monthlyIncome) { this.monthlyIncome = monthlyIncome; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }

    public boolean isAadhaarConsent() { return aadhaarConsent; }
    public void setAadhaarConsent(boolean aadhaarConsent) { this.aadhaarConsent = aadhaarConsent; }

    public boolean isTermsConsent() { return termsConsent; }
    public void setTermsConsent(boolean termsConsent) { this.termsConsent = termsConsent; }
}