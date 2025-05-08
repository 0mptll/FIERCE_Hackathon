package com.hackathon.main.entities;
import jakarta.persistence.*;
@Entity
public class LoanApplication {
   @Id
   @GeneratedValue(strategy = GenerationType.IDENTITY)
   private Long id;
   private String aadhaarNumber;
   private String address;
   private String bank;
   private String city;
   private String dob;
   private String email;
   private String employerName;
   private String fullName;
   private String gender;
   private Double interest;
   private Double loanAmount;
   private Integer loanTenure;
   private String mobile;
   private Double monthly;
   private int user;
   // Getters and Setters
   public int getUser() {
		return user;
	}
	public void setUser(int user) {
		this.user = user;
	}
	public Long getId() {
       return id;
   }
   public void setId(Long id) {
       this.id = id;
   }
   public String getAadhaarNumber() {
       return aadhaarNumber;
   }
   public void setAadhaarNumber(String aadhaarNumber) {
       this.aadhaarNumber = aadhaarNumber;
   }
   public String getAddress() {
       return address;
   }
   public void setAddress(String address) {
       this.address = address;
   }
   public String getBank() {
       return bank;
   }
   public void setBank(String bank) {
       this.bank = bank;
   }
   public String getCity() {
       return city;
   }
   public void setCity(String city) {
       this.city = city;
   }
   public String getDob() {
       return dob;
   }
   public void setDob(String dob) {
       this.dob = dob;
   }
   public String getEmail() {
       return email;
   }
   public void setEmail(String email) {
       this.email = email;
   }
   public String getEmployerName() {
       return employerName;
   }
   public void setEmployerName(String employerName) {
       this.employerName = employerName;
   }
   public String getFullName() {
       return fullName;
   }
   public void setFullName(String fullName) {
       this.fullName = fullName;
   }
   public String getGender() {
       return gender;
   }
   public void setGender(String gender) {
       this.gender = gender;
   }
   public Double getInterest() {
       return interest;
   }
   public void setInterest(Double interest) {
       this.interest = interest;
   }
   public Double getLoanAmount() {
       return loanAmount;
   }
   public void setLoanAmount(Double loanAmount) {
       this.loanAmount = loanAmount;
   }
   public Integer getLoanTenure() {
       return loanTenure;
   }
   public void setLoanTenure(Integer loanTenure) {
       this.loanTenure = loanTenure;
   }
   public String getMobile() {
       return mobile;
   }
   public void setMobile(String mobile) {
       this.mobile = mobile;
   }
   public Double getMonthly() {
       return monthly;
   }
   public void setMonthly(Double monthly) {
       this.monthly = monthly;
   }
}

