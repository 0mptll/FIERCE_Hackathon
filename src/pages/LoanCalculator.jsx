import React, { useState, useEffect, useContext } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { ScoreContext } from '../context/ScoreContext';
import { Calendar, DollarSign, Percent, ArrowRight } from 'lucide-react';

const LoanCalculator = () => {
  const location = useLocation();
  const { score } = useContext(ScoreContext);
  
  // Default values or values passed from another component
  const [loanAmount, setLoanAmount] = useState(100000);
  const [interestRate, setInterestRate] = useState(10.5);
  const [loanTenure, setLoanTenure] = useState(24);
  const [emi, setEmi] = useState(0);
  const [totalInterest, setTotalInterest] = useState(0);
  const [totalAmount, setTotalAmount] = useState(0);
  
  // Set initial values from location state if available
  useEffect(() => {
    if (location.state) {
      if (location.state.amount) setLoanAmount(location.state.amount);
      if (location.state.interest) setInterestRate(location.state.interest);
      if (location.state.tenure) setLoanTenure(location.state.tenure);
    }
  }, [location]);
  
  // Calculate EMI whenever input values change
  useEffect(() => {
    calculateEmi();
  }, [loanAmount, interestRate, loanTenure]);
  
  // EMI calculation function
  const calculateEmi = () => {
    // Convert interest rate from annual to monthly
    const monthlyInterestRate = interestRate / 12 / 100;
    
    // Calculate EMI using formula: EMI = P * r * (1+r)^n / ((1+r)^n - 1)
    const emiValue = loanAmount * monthlyInterestRate * 
                      Math.pow(1 + monthlyInterestRate, loanTenure) / 
                      (Math.pow(1 + monthlyInterestRate, loanTenure) - 1);
    
    // Calculate total amount and interest
    const totalAmountValue = emiValue * loanTenure;
    const totalInterestValue = totalAmountValue - loanAmount;
    
    // Update state with calculated values
    setEmi(isNaN(emiValue) ? 0 : emiValue);
    setTotalAmount(isNaN(totalAmountValue) ? 0 : totalAmountValue);
    setTotalInterest(isNaN(totalInterestValue) ? 0 : totalInterestValue);
  };

  // Suggested loan amounts based on score
  const getSuggestedMaxLoan = () => {
    if (!score) return 100000;
    if (score >= 750) return 500000;
    if (score >= 700) return 300000;
    if (score >= 650) return 200000;
    if (score >= 550) return 100000;
    return 50000;
  };
  
  // Suggested interest rates based on score
  const getSuggestedInterestRate = () => {
    if (!score) return 10.5;
    if (score >= 750) return 8.5;
    if (score >= 700) return 9.25;
    if (score >= 650) return 10.5;
    if (score >= 550) return 11.75;
    return 13.5;
  };

  return (
    <div className="container py-5">
      <h2 className="mb-4">Loan Calculator</h2>
      
      <div className="row g-4">
        <div className="col-lg-6">
          <div className="card border-0 shadow-sm">
            <div className="card-body p-4">
              <h3 className="card-title mb-4">Calculate Your EMI</h3>
              
              <div className="mb-4">
                <label htmlFor="loanAmount" className="form-label">
                  <DollarSign size={18} className="me-1" /> Loan Amount (₹)
                </label>
                <input
                  type="range"
                  className="form-range mb-2"
                  id="loanAmount"
                  min="10000"
                  max={getSuggestedMaxLoan()}
                  step="10000"
                  value={loanAmount}
                  onChange={(e) => setLoanAmount(Number(e.target.value))}
                />
                <div className="d-flex justify-content-between">
                  <small>₹10,000</small>
                  <input
                    type="number"
                    className="form-control form-control-sm w-25 mx-2"
                    value={loanAmount}
                    onChange={(e) => setLoanAmount(Number(e.target.value))}
                    min="10000"
                    max={getSuggestedMaxLoan()}
                  />
                  <small>₹{getSuggestedMaxLoan().toLocaleString()}</small>
                </div>
              </div>
              
              <div className="mb-4">
                <label htmlFor="interestRate" className="form-label">
                  <Percent size={18} className="me-1" /> Interest Rate (% p.a.)
                </label>
                <input
                  type="range"
                  className="form-range mb-2"
                  id="interestRate"
                  min="7"
                  max="15"
                  step="0.25"
                  value={interestRate}
                  onChange={(e) => setInterestRate(Number(e.target.value))}
                />
                <div className="d-flex justify-content-between">
                  <small>7%</small>
                  <input
                    type="number"
                    className="form-control form-control-sm w-25 mx-2"
                    value={interestRate}
                    onChange={(e) => setInterestRate(Number(e.target.value))}
                    min="7"
                    max="15"
                    step="0.25"
                  />
                  <small>15%</small>
                </div>
                <div className="text-end">
                  <small className="text-muted">
                    {score ? `Suggested rate based on your score: ${getSuggestedInterestRate()}%` : ''}
                  </small>
                </div>
              </div>
              
              <div className="mb-4">
                <label htmlFor="loanTenure" className="form-label">
                  <Calendar size={18} className="me-1" /> Loan Tenure (months)
                </label>
                <input
                  type="range"
                  className="form-range mb-2"
                  id="loanTenure"
                  min="6"
                  max="60"
                  step="6"
                  value={loanTenure}
                  onChange={(e) => setLoanTenure(Number(e.target.value))}
                />
                <div className="d-flex justify-content-between">
                  <small>6 months</small>
                  <input
                    type="number"
                    className="form-control form-control-sm w-25 mx-2"
                    value={loanTenure}
                    onChange={(e) => setLoanTenure(Number(e.target.value))}
                    min="6"
                    max="60"
                    step="1"
                  />
                  <small>60 months</small>
                </div>
              </div>
              
              <div className="d-grid mt-4">
                <Link 
                  to="/available-loans" 
                  className="btn btn-primary"
                >
                  View Available Loans <ArrowRight size={18} className="ms-1" />
                </Link>
              </div>
            </div>
          </div>
        </div>
        
        <div className="col-lg-6">
          <div className="card border-0 shadow-sm mb-4">
            <div className="card-body p-4">
              <h3 className="card-title mb-4">Loan Summary</h3>
              
              <div className="row g-3 text-center mb-4">
                <div className="col-md-4">
                  <div className="p-3 bg-light rounded">
                    <h6 className="text-muted mb-1">Monthly EMI</h6>
                    <p className="fs-4 fw-bold mb-0 text-primary">₹{Math.round(emi).toLocaleString()}</p>
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="p-3 bg-light rounded">
                    <h6 className="text-muted mb-1">Total Interest</h6>
                    <p className="fs-4 fw-bold mb-0 text-danger">₹{Math.round(totalInterest).toLocaleString()}</p>
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="p-3 bg-light rounded">
                    <h6 className="text-muted mb-1">Total Amount</h6>
                    <p className="fs-4 fw-bold mb-0">₹{Math.round(totalAmount).toLocaleString()}</p>
                  </div>
                </div>
              </div>
              
              <div className="mb-4">
                <h5 className="mb-3">Payment Breakdown</h5>
                <div className="progress" style={{ height: '20px' }}>
                  <div 
                    className="progress-bar bg-primary" 
                    style={{ width: `${(loanAmount / totalAmount) * 100}%` }}
                  >
                    Principal
                  </div>
                  <div 
                    className="progress-bar bg-danger" 
                    style={{ width: `${(totalInterest / totalAmount) * 100}%` }}
                  >
                    Interest
                  </div>
                </div>
                <div className="d-flex justify-content-between mt-2">
                  <small>Principal: {((loanAmount / totalAmount) * 100).toFixed(1)}%</small>
                  <small>Interest: {((totalInterest / totalAmount) * 100).toFixed(1)}%</small>
                </div>
              </div>
              
              <div className="mb-4">
                <h5 className="mb-3">Loan Details</h5>
                <table className="table">
                  <tbody>
                    <tr>
                      <td>Loan Amount</td>
                      <td className="fw-semibold text-end">₹{loanAmount.toLocaleString()}</td>
                    </tr>
                    <tr>
                      <td>Interest Rate</td>
                      <td className="fw-semibold text-end">{interestRate}% p.a.</td>
                    </tr>
                    <tr>
                      <td>Loan Tenure</td>
                      <td className="fw-semibold text-end">
                        {loanTenure} months ({(loanTenure / 12).toFixed(1)} years)
                      </td>
                    </tr>
                    <tr>
                      <td>Monthly EMI</td>
                      <td className="fw-semibold text-end text-primary">₹{Math.round(emi).toLocaleString()}</td>
                    </tr>
                    <tr>
                      <td>Total Interest Payable</td>
                      <td className="fw-semibold text-end text-danger">₹{Math.round(totalInterest).toLocaleString()}</td>
                    </tr>
                    <tr>
                      <td>Total Payment (Principal + Interest)</td>
                      <td className="fw-semibold text-end">₹{Math.round(totalAmount).toLocaleString()}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              
              <div className="alert alert-info d-flex mb-0">
                <div className="me-3">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <p className="mb-0 small">
                    This is an estimate based on the information provided. Actual loan offers may vary 
                    based on your credit score and other eligibility criteria.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoanCalculator;