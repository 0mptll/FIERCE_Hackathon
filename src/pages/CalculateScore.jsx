import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { ScoreContext } from '../context/ScoreContext';

const CalculateScore = () => {
  const navigate = useNavigate();
  const { setScore, setScoreFactors } = useContext(ScoreContext);
  
  const [formData, setFormData] = useState({
    monthlyIncome: 20000,
    grocerySpending: 4000,
    utilityBills: 1500,
    totalSavings: 500,
    rentEmi: 6000,
    medicalExpenses: 100,
    transportationCost: 1000,
    loanRepayment: 2000
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: Number(value)
    }));
  };

  const calculateScore = () => {
    // Initial base score
    let baseScore = 500;
    
    // Income to expense ratio (higher is better)
    const totalExpenses = formData.grocerySpending + formData.utilityBills + 
                          formData.rentEmi + formData.medicalExpenses + 
                          formData.transportationCost + formData.loanRepayment;
    
    const incomeToExpenseRatio = formData.monthlyIncome / totalExpenses;
    
    // Savings as percentage of income (higher is better)
    const savingsRatio = formData.totalSavings / formData.monthlyIncome;
    
    // Debt burden ratio (lower is better)
    const debtBurdenRatio = formData.loanRepayment / formData.monthlyIncome;
    
    // Calculate score adjustments
    let incomeScore = 0;
    if (formData.monthlyIncome >= 30000) incomeScore = 100;
    else if (formData.monthlyIncome >= 20000) incomeScore = 75;
    else if (formData.monthlyIncome >= 10000) incomeScore = 50;
    else incomeScore = 25;
    
    let expenseRatioScore = 0;
    if (incomeToExpenseRatio >= 2) expenseRatioScore = 100;
    else if (incomeToExpenseRatio >= 1.5) expenseRatioScore = 75;
    else if (incomeToExpenseRatio >= 1.2) expenseRatioScore = 50;
    else expenseRatioScore = 25;
    
    let savingsScore = 0;
    if (savingsRatio >= 0.2) savingsScore = 100;
    else if (savingsRatio >= 0.1) savingsScore = 75;
    else if (savingsRatio >= 0.05) savingsScore = 50;
    else savingsScore = 25;
    
    let debtScore = 0;
    if (debtBurdenRatio <= 0.1) debtScore = 100;
    else if (debtBurdenRatio <= 0.2) debtScore = 75;
    else if (debtBurdenRatio <= 0.3) debtScore = 50;
    else debtScore = 25;
    
    // Adjust base score
    const finalScore = Math.min(900, Math.max(300, Math.round(
      baseScore + 
      (incomeScore * 1) + 
      (expenseRatioScore * 0.75) + 
      (savingsScore * 0.75) + 
      (debtScore * 0.5)
    )));
    
    const factors = {
      income: Math.round(incomeScore),
      spending: Math.round(expenseRatioScore),
      savings: Math.round(savingsScore),
      bills: Math.round(formData.utilityBills > 0 ? 50 : 0),
      rent: Math.round(formData.rentEmi > 0 ? 50 : 0),
      medical: Math.round(formData.medicalExpenses > 0 ? 50 : 0),
      transport: Math.round(formData.transportationCost > 0 ? 50 : 0),
      loans: Math.round(debtScore),
      locationConsistency: 0,  // Will be updated later with bill uploads
      transactionHistory: 0    // Will be updated later with bank statement uploads
    };
    
    // Update context
    setScore(finalScore);
    setScoreFactors(factors);
    
    // Navigate to dashboard
    navigate('/dashboard');
  };

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-8">
          <div className="card shadow-sm border-0">
            <div className="card-body p-4">
              <h2 className="mb-4 text-center">Calculate Your Financial Score</h2>
              <p className="text-muted text-center mb-4">
                Answer these questions honestly to get an accurate assessment of your financial health.
              </p>
              
              <form>
                <div className="mb-3">
                  <label htmlFor="monthlyIncome" className="form-label">What is your monthly income (INR)?</label>
                  <input 
                    type="number" 
                    className="form-control" 
                    id="monthlyIncome" 
                    name="monthlyIncome" 
                    value={formData.monthlyIncome} 
                    onChange={handleChange}
                    min="0"
                  />
                </div>
                
                <div className="mb-3">
                  <label htmlFor="grocerySpending" className="form-label">What is your average monthly spending on groceries (INR)?</label>
                  <input 
                    type="number" 
                    className="form-control" 
                    id="grocerySpending" 
                    name="grocerySpending" 
                    value={formData.grocerySpending} 
                    onChange={handleChange}
                    min="0"
                  />
                </div>
                
                <div className="mb-3">
                  <label htmlFor="utilityBills" className="form-label">What is your average monthly spending on utility bills (electricity, water, etc.) (INR)?</label>
                  <input 
                    type="number" 
                    className="form-control" 
                    id="utilityBills" 
                    name="utilityBills" 
                    value={formData.utilityBills} 
                    onChange={handleChange}
                    min="0"
                  />
                </div>
                
                <div className="mb-3">
                  <label htmlFor="totalSavings" className="form-label">What are your total monthly savings (INR)?</label>
                  <input 
                    type="number" 
                    className="form-control" 
                    id="totalSavings" 
                    name="totalSavings" 
                    value={formData.totalSavings} 
                    onChange={handleChange}
                    min="0"
                  />
                </div>
                
                <div className="mb-3">
                  <label htmlFor="rentEmi" className="form-label">What is your monthly rent or EMI payment (INR)?</label>
                  <input 
                    type="number" 
                    className="form-control" 
                    id="rentEmi" 
                    name="rentEmi" 
                    value={formData.rentEmi} 
                    onChange={handleChange}
                    min="0"
                  />
                </div>
                
                <div className="mb-3">
                  <label htmlFor="medicalExpenses" className="form-label">What is your average monthly spending on medical expenses (INR)?</label>
                  <input 
                    type="number" 
                    className="form-control" 
                    id="medicalExpenses" 
                    name="medicalExpenses" 
                    value={formData.medicalExpenses} 
                    onChange={handleChange}
                    min="0"
                  />
                </div>
                
                <div className="mb-3">
                  <label htmlFor="transportationCost" className="form-label">What is your average monthly spending on transportation (INR)?</label>
                  <input 
                    type="number" 
                    className="form-control" 
                    id="transportationCost" 
                    name="transportationCost" 
                    value={formData.transportationCost} 
                    onChange={handleChange}
                    min="0"
                  />
                </div>
                
                <div className="mb-3">
                  <label htmlFor="loanRepayment" className="form-label">What is your total monthly loan repayment amount (INR)?</label>
                  <input 
                    type="number" 
                    className="form-control" 
                    id="loanRepayment" 
                    name="loanRepayment" 
                    value={formData.loanRepayment} 
                    onChange={handleChange}
                    min="0"
                  />
                </div>
                
                <div className="d-grid mt-4">
                  <button 
                    type="button" 
                    className="btn btn-primary btn-lg"
                    onClick={calculateScore}
                  >
                    Calculate My Score
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CalculateScore;