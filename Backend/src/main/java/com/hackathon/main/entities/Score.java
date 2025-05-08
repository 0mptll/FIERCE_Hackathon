package com.hackathon.main.entities;

import jakarta.persistence.*;

@Entity
public class Score {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)  // Foreign key reference to User
    private User user;

    private int score = 300;  // Default score initialized at 300
    private String category;

    // Financial details
    private int monthlyIncome;
    private int grocerySpending;
    private int utilityBills;
    private int totalSavings;
    private int rentOrEmi;
    private int medicalExpenses;
    private int transportationCost;
    private int loanRepayment;

    // Constructor
    public Score() {}

    public Score(User user, String category, int monthlyIncome, int grocerySpending,
                 int utilityBills, int totalSavings, int rentOrEmi, int medicalExpenses,
                 int transportationCost, int loanRepayment) {
        this.user = user;
        this.category = category;
        this.monthlyIncome = monthlyIncome;
        this.grocerySpending = grocerySpending;
        this.utilityBills = utilityBills;
        this.totalSavings = totalSavings;
        this.rentOrEmi = rentOrEmi;
        this.medicalExpenses = medicalExpenses;
        this.transportationCost = transportationCost;
        this.loanRepayment = loanRepayment;
        this.score = applyScoreAdjustments(category); // Apply category-based score changes
    }

    // Getters
    public Long getId() { return id; }
    public User getUser() { return user; }
    public int getScore() { return score; }
    public String getCategory() { return category; }
    public int getMonthlyIncome() { return monthlyIncome; }
    public int getGrocerySpending() { return grocerySpending; }
    public int getUtilityBills() { return utilityBills; }
    public int getTotalSavings() { return totalSavings; }
    public int getRentOrEmi() { return rentOrEmi; }
    public int getMedicalExpenses() { return medicalExpenses; }
    public int getTransportationCost() { return transportationCost; }
    public int getLoanRepayment() { return loanRepayment; }

    // Setters
    public void setId(Long id) { this.id = id; }
    public void setUser(User user) { this.user = user; }
    public void setScore(int score) { this.score = score; }
    public void setCategory(String category) { this.category = category; }
    public void setMonthlyIncome(int monthlyIncome) { this.monthlyIncome = monthlyIncome; }
    public void setGrocerySpending(int grocerySpending) { this.grocerySpending = grocerySpending; }
    public void setUtilityBills(int utilityBills) { this.utilityBills = utilityBills; }
    public void setTotalSavings(int totalSavings) { this.totalSavings = totalSavings; }
    public void setRentOrEmi(int rentOrEmi) { this.rentOrEmi = rentOrEmi; }
    public void setMedicalExpenses(int medicalExpenses) { this.medicalExpenses = medicalExpenses; }
    public void setTransportationCost(int transportationCost) { this.transportationCost = transportationCost; }
    public void setLoanRepayment(int loanRepayment) { this.loanRepayment = loanRepayment; }

    // Method to adjust score based on category
    private int applyScoreAdjustments(String category) {
        int baseScore = 300;
        switch (category.toLowerCase()) {
            case "excellent":
                baseScore += 10;
                break;
            case "good":
                baseScore += 5;
                break;
            case "bad":
                baseScore -= 5;
                break;
            case "very poor":
                baseScore -= 10;
                break;
        }
        return Math.max(baseScore, 300); // Ensure score does not go below 300
    }
}