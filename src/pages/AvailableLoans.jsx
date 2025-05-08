import React, { useContext, useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ScoreContext } from '../context/ScoreContext';
import { Ban as Bank, ArrowRight, ShieldCheck, Clock, BadgePercent, AlertCircle } from 'lucide-react';
import axios from 'axios'; // ✅ Add this

const BASE_URL = 'http://localhost:8080/api/score';
const AvailableLoans = () => {
  const { score, setScore, scoreFactors, setScoreFactors, updateTrigger } = useContext(ScoreContext);
  const [loans, setLoans] = useState([]);
  const navigate = useNavigate();


  // Redirect if no score is available
 
 
  useEffect(() => {
    const fetchScoreData = async () => {
      try {
        const storedUser = localStorage.getItem('user');
        let userId;
 
        if (storedUser) {
          const user = JSON.parse(storedUser);
          userId = user.id;
          if (!userId) {
            console.warn("Dashboard: User ID not found in local storage. Redirecting to login.");
            navigate('/login');
            return;
          }
        } else {
          console.warn("Dashboard: No user logged in. Redirecting to login.");
          navigate('/login');
          return;
        }
 
        console.log('Dashboard: Fetching score for userId:', userId);
        const response = await axios.get(`${BASE_URL}/${userId}`);
        console.log("Dashboard: Fetched Score Data:", response.data);
 
        if (response.data && response.data.score) {
          setScore(response.data.score);
          localStorage.setItem('score', response.data.score);
          setScoreFactors({
            income: response.data.monthlyIncome ?? 0,
            spending: response.data.grocerySpending ?? 0,
            savings: response.data.totalSavings ?? 0,
            loans: response.data.loanRepayment ?? 0,
            locationConsistency: response.data.rentOrEmi ?? 0,
            transactionHistory: response.data.utilityBills ?? 0
          });
          generateLoanOffers(response.data.score);
        } else {
          navigate("/calculate-score");
        }
      } catch (error) {
        console.error("Dashboard: Error fetching score data:", error);
      }
    };
 
    if (score === null || updateTrigger > 0) {
      fetchScoreData();
    } else {
      generateLoanOffers(score);
    }
 
  }, [score, updateTrigger, navigate, setScore, setScoreFactors]);


  // useEffect(() => {
  //   if (!score) {
  //     window.location.href = '/calculate-score';
  //   } else {
  //     // Generate loan offers based on score
  //     generateLoanOffers(score);
  //   }
  // }, [score]);
  const generateLoanOffers = (score) => {
    // Base loan offers with additional banks
    let loanOffers = [
      {
        id: 1,
        bank: "People's Rural Bank",
        maxAmount: 50000,
        interest: 13.5,
        tenure: [6, 12, 18],
        minScore: 300,
        type: "basic",
        features: ["No collateral required", "Quick approval", "Minimal documentation"]
      },
      {
        id: 2,
        bank: "Bharat Finance",
        maxAmount: 100000,
        interest: 11.75,
        tenure: [6, 12, 18, 24],
        minScore: 550,
        type: "standard",
        features: ["No collateral required", "Quick approval", "Flexible repayment", "Pre-closure option"]
      },
      {
        id: 3,
        bank: "National Rural Credit",
        maxAmount: 200000,
        interest: 10.5,
        tenure: [12, 24, 36],
        minScore: 650,
        type: "standard",
        features: ["No collateral required", "Same-day approval", "Flexible repayment", "Pre-closure option"]
      },
      {
        id: 4,
        bank: "Prime Rural Bank",
        maxAmount: 300000,
        interest: 9.25,
        tenure: [12, 24, 36, 48],
        minScore: 700,
        type: "premium",
        features: ["No collateral required", "Instant approval", "Flexible repayment", "Zero pre-closure fees", "Top-up loan option"]
      },
      {
        id: 5,
        bank: "HDFC Rural Finance",
        maxAmount: 500000,
        interest: 8.5,
        tenure: [12, 24, 36, 48, 60],
        minScore: 750,
        type: "premium",
        features: ["No collateral required", "Instant approval", "Flexible repayment", "Zero pre-closure fees", "Top-up loan option", "Preferential rates for existing customers"]
      },
      // Adding new banks
      {
        id: 6,
        bank: "Union Rural Bank",
        maxAmount: 150000,
        interest: 10.0,
        tenure: [12, 24, 36],
        minScore: 600,
        type: "standard",
        features: ["Quick processing", "Flexible EMI options", "Minimal documentation"]
      },
      {
        id: 7,
        bank: "Rural Credit Co-Op",
        maxAmount: 250000,
        interest: 12.0,
        tenure: [6, 12, 18, 24],
        minScore: 650,
        type: "standard",
        features: ["Easy documentation", "Low processing fee", "Pre-closure flexibility"]
      },
      {
        id: 8,
        bank: "SBI Rural Loans",
        maxAmount: 400000,
        interest: 9.75,
        tenure: [12, 24, 36, 48],
        minScore: 700,
        type: "premium",
        features: ["No collateral", "Quick approval", "Zero processing fee", "Top-up loan option"]
      },
      {
        id: 9,
        bank: "Bank of India - Rural Division",
        maxAmount: 600000,
        interest: 8.25,
        tenure: [12, 24, 36, 48, 60],
        minScore: 750,
        type: "premium",
        features: ["Low-interest rates", "Flexible repayment options", "No hidden charges"]
      },
      {
        id: 10,
        bank: "Punjab Rural Bank",
        maxAmount: 350000,
        interest: 11.0,
        tenure: [12, 24, 36],
        minScore: 650,
        type: "standard",
        features: ["Flexible repayment", "Quick approval", "Minimal documentation", "Pre-closure option"]
      }
    ];
 
    // Filter loans based on score
    const availableLoans = loanOffers.filter(loan => score >= loan.minScore);
    setLoans(availableLoans);
  };
 


  if (!score) {
    return <div className="text-center py-5">Loading...</div>;
  }


  // Score classification
  const getScoreCategory = (score) => {
    if (score >= 750) return { text: 'Excellent', color: 'primary' };
    if (score >= 650) return { text: 'Good', color: 'success' };
    if (score >= 500) return { text: 'Fair', color: 'warning' };
    return { text: 'Poor', color: 'danger' };
  };


  const scoreCategory = getScoreCategory(score);


  return (
    <div className="container py-5">
      <h2 className="mb-4">Available Loan Options</h2>
     
      <div className="row mb-4">
        <div className="col-lg-8">
          <div className="card border-0 shadow-sm mb-4">
            <div className="card-body p-4">
              <div className="d-flex align-items-center mb-3">
                <div className={`rounded-circle bg-${scoreCategory.color} bg-opacity-10 p-2 me-3`}>
                  <ShieldCheck size={24} className={`text-${scoreCategory.color}`} />
                </div>
                <div>
                  <h5 className="mb-0">Your Credit Profile</h5>
                  <p className="text-muted mb-0">Based on your financial behavior</p>
                </div>
              </div>
             
              <div className="row g-3">
                <div className="col-sm-4">
                  <div className="border rounded p-3 text-center">
                    <h6 className="text-muted mb-1">Credit Score</h6>
                    <p className={`fs-4 fw-bold mb-0 text-${scoreCategory.color}`}>{score}</p>
                  </div>
                </div>
                <div className="col-sm-4">
                  <div className="border rounded p-3 text-center">
                    <h6 className="text-muted mb-1">Category</h6>
                    <p className={`fs-5 fw-semibold mb-0 text-${scoreCategory.color}`}>{scoreCategory.text}</p>
                  </div>
                </div>
                <div className="col-sm-4">
                  <div className="border rounded p-3 text-center">
                    <h6 className="text-muted mb-1">Eligible Loans</h6>
                    <p className="fs-5 fw-semibold mb-0">{loans.length}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-lg-4">
          <div className="card border-0 shadow-sm mb-4">
            <div className="card-body p-4">
              <h5 className="mb-3">Need a different loan amount?</h5>
              <p className="text-muted">
                Use our loan calculator to estimate EMIs and find the right loan amount for your needs.
              </p>
              <Link to="/loan-calculator" className="btn btn-primary d-block">
                Go to Loan Calculator
              </Link>
            </div>
          </div>
        </div>
      </div>
     
      {loans.length > 0 ? (
        <div className="row g-4">
          {loans.map(loan => (
            <div className="col-lg-6" key={loan.id}>
              <div className={`card loan-card loan-card-${loan.type}`}>
                <div className="card-header bg-white border-bottom-0 pt-4">
                  <div className="d-flex justify-content-between align-items-center">
                    <div className="d-flex align-items-center">
                      <div className="me-3">
                        <Bank size={28} className="text-primary" />
                      </div>
                      <h4 className="mb-0">{loan.bank}</h4>
                    </div>
                    <span className={`badge bg-${loan.type === 'premium' ? 'primary' : loan.type === 'standard' ? 'success' : 'warning'}`}>
                      {loan.type === 'premium' ? 'Premium' : loan.type === 'standard' ? 'Standard' : 'Basic'}
                    </span>
                  </div>
                </div>
                <div className="card-body p-4">
                  <div className="row mb-4">
                    <div className="col-sm-4">
                      <h6 className="text-muted mb-1">Loan Amount</h6>
                      <p className="fs-5 fw-semibold mb-0">Up to ₹{loan.maxAmount.toLocaleString()}</p>
                    </div>
                    <div className="col-sm-4">
                      <h6 className="text-muted mb-1">Interest Rate</h6>
                      <p className="fs-5 fw-semibold mb-0">{loan.interest}% p.a.</p>
                    </div>
                    <div className="col-sm-4">
                      <h6 className="text-muted mb-1">Tenure</h6>
                      <p className="fs-5 fw-semibold mb-0">{loan.tenure[0]}-{loan.tenure[loan.tenure.length-1]} months</p>
                    </div>
                  </div>
                 
                  <h6 className="mb-3">Features</h6>
                  <ul className="list-unstyled mb-4">
                    {loan.features.map((feature, index) => (
                      <li key={index} className="mb-2 d-flex align-items-start">
                        <span className="me-2 text-success">✓</span>
                        {feature}
                      </li>
                    ))}
                  </ul>
                 
                  <div className="d-flex flex-column flex-sm-row gap-2">
                    <Link
                      to={`/loan-application/${loan.id}`}
                      className="btn btn-primary"
                      state={loan}
                    >
                      Apply Now <ArrowRight size={16} className="ms-1" />
                    </Link>
                    <Link
                      to="/loan-calculator"
                      className="btn btn-outline-secondary"
                      state={{
                        amount: loan.maxAmount / 2,
                        interest: loan.interest,
                        tenure: loan.tenure[Math.floor(loan.tenure.length / 2)]
                      }}
                    >
                      Calculate EMI
                    </Link>
                  </div>
                </div>
                <div className="card-footer bg-light p-3">
                  <div className="d-flex justify-content-between align-items-center small">
                    <div className="d-flex align-items-center">
                      <Clock size={16} className="me-1" />
                      <span>Approval: 24-48 hours</span>
                    </div>
                    <div className="d-flex align-items-center">
                      <BadgePercent size={16} className="me-1" />
                      <span>Processing fee: 1%</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-5">
          <div className="mb-4">
            <AlertCircle size={48} className="text-danger" />
          </div>
          <h3 className="mb-2">No Loans Available</h3>
          <p className="text-muted mb-4">
            Sorry, your current score doesn't qualify for any loan offers.
            Improve your score by uploading your utility bills and bank statements.
          </p>
          <div className="d-flex flex-column flex-md-row justify-content-center gap-3">
            <Link to="/upload-utility-bill" className="btn btn-outline-primary">
              Upload Utility Bill
            </Link>
            <Link to="/upload-bank-statement" className="btn btn-outline-primary">
              Upload Bank Statement
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};


export default AvailableLoans;


