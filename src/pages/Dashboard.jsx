import React, { useContext, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ScoreContext } from '../context/ScoreContext';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { ArrowUpRight, Upload, FileText } from 'lucide-react';

// Register required ChartJS components
ChartJS.register(ArcElement, Tooltip, Legend);

const Dashboard = () => {
  const { score, scoreFactors, setScore, setScoreFactors } = useContext(ScoreContext);
  
  // Redirect if no score is available
  useEffect(() => {
    if (!score) {
      window.location.href = '/calculate-score';
    }
  }, [score]);

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
  
  // Prepare chart data
  const chartData = {
    labels: ['Income Stability', 'Expense Management', 'Savings Ratio', 'Debt Management', 'Location Consistency', 'Transaction History'],
    datasets: [
      {
        label: 'Score Factors',
        data: [
          scoreFactors.income, 
          scoreFactors.spending, 
          scoreFactors.savings, 
          scoreFactors.loans,
          scoreFactors.locationConsistency,
          scoreFactors.transactionHistory
        ],
        backgroundColor: [
          '#3b82f6',
          '#16a34a',
          '#ca8a04',
          '#dc2626',
          '#0f766e',
          '#9333ea',
        ],
        borderWidth: 1,
      },
    ],
  };

  // Handler for utility bill upload simulation
  const handleUtilityBillDemo = () => {
    // Update location consistency score
    const updatedFactors = {
      ...scoreFactors,
      locationConsistency: 75
    };
    
    // Recalculate score with new factors
    const updatedScore = Math.min(900, Math.round(score + 20));
    
    setScore(updatedScore);
    setScoreFactors(updatedFactors);
  };

  // Handler for bank statement upload simulation
  const handleBankStatementDemo = () => {
    // Update transaction history score
    const updatedFactors = {
      ...scoreFactors,
      transactionHistory: 80
    };
    
    // Recalculate score with new factors
    const updatedScore = Math.min(900, Math.round(score + 25));
    
    setScore(updatedScore);
    setScoreFactors(updatedFactors);
  };

  return (
    <div className="container py-5">
      <h2 className="mb-4">Your Financial Dashboard</h2>
      
      <div className="row g-4">
        {/* Score Overview */}
        <div className="col-lg-6">
          <div className="card shadow-sm border-0 score-card h-100">
            <div className="card-body p-4">
              <h3 className="card-title mb-4">Your Credit Score</h3>
              <div className="text-center mb-4">
                <div className="d-inline-block position-relative">
                  <div style={{ width: '200px', height: '200px' }}>
                    <Doughnut
                      data={{
                        datasets: [
                          {
                            data: [score, 900 - score],
                            backgroundColor: [`var(--${scoreCategory.color}-color)`, '#e2e8f0'],
                            borderWidth: 0,
                            cutout: '80%'
                          },
                        ],
                      }}
                      options={{
                        responsive: true,
                        maintainAspectRatio: true,
                        plugins: {
                          legend: {
                            display: false
                          },
                          tooltip: {
                            enabled: false
                          }
                        }
                      }}
                    />
                  </div>
                  <div className="position-absolute top-50 start-50 translate-middle text-center">
                    <h2 className={`mb-0 fw-bold text-${scoreCategory.color}`}>{score}</h2>
                    <p className="mb-0">{scoreCategory.text}</p>
                  </div>
                </div>
              </div>
              
              <div className="row text-center g-3">
                <div className="col-6">
                  <div className="p-3 bg-light rounded">
                    <h6>Score Range</h6>
                    <p className="mb-0">300 - 900</p>
                  </div>
                </div>
                <div className="col-6">
                  <div className="p-3 bg-light rounded">
                    <h6>Category</h6>
                    <p className={`mb-0 text-${scoreCategory.color}`}>{scoreCategory.text}</p>
                  </div>
                </div>
              </div>
              
              <div className="d-grid gap-2 mt-4">
                <Link to="/available-loans" className="btn btn-primary">
                  View Available Loans
                </Link>
              </div>
            </div>
          </div>
        </div>
        
        {/* Score Factors */}
        <div className="col-lg-6">
          <div className="card shadow-sm border-0 score-card h-100">
            <div className="card-body p-4">
              <h3 className="card-title mb-4">Score Factors</h3>
              <div style={{ height: '250px' }}>
                <Doughnut 
                  data={chartData}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: {
                        position: 'right',
                        labels: {
                          boxWidth: 15,
                          padding: 15
                        }
                      }
                    }
                  }}
                />
              </div>
              
              <div className="mt-4">
                <h5>Improve Your Score</h5>
                <div className="row g-2 mt-2">
                  <div className="col-sm-6">
                    <Link 
                      to="/upload-utility-bill" 
                      className="btn btn-outline-primary d-flex align-items-center justify-content-center gap-2 w-100"
                    >
                      <Upload size={18} />
                      Upload Utility Bill
                    </Link>
                  </div>
                  <div className="col-sm-6">
                    <Link 
                      to="/upload-bank-statement" 
                      className="btn btn-outline-primary d-flex align-items-center justify-content-center gap-2 w-100"
                    >
                      <FileText size={18} />
                      Upload Bank Statement
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Score Breakdown */}
        <div className="col-12">
          <div className="card shadow-sm border-0">
            <div className="card-body p-4">
              <h3 className="card-title mb-4">Score Breakdown</h3>
              <div className="row">
                <div className="col-md-6">
                  <div className="factor-item">
                    <div className="d-flex justify-content-between align-items-center">
                      <h5 className="mb-0">Income Stability</h5>
                      <span className="badge bg-primary">{scoreFactors.income}%</span>
                    </div>
                    <p className="text-muted small mb-0">Based on your reported monthly income</p>
                  </div>
                  
                  <div className="factor-item">
                    <div className="d-flex justify-content-between align-items-center">
                      <h5 className="mb-0">Expense Management</h5>
                      <span className="badge bg-success">{scoreFactors.spending}%</span>
                    </div>
                    <p className="text-muted small mb-0">Based on your income to expense ratio</p>
                  </div>
                  
                  <div className="factor-item">
                    <div className="d-flex justify-content-between align-items-center">
                      <h5 className="mb-0">Savings Ratio</h5>
                      <span className="badge bg-warning">{scoreFactors.savings}%</span>
                    </div>
                    <p className="text-muted small mb-0">Based on your savings as percentage of income</p>
                  </div>
                </div>
                
                <div className="col-md-6">
                  <div className="factor-item">
                    <div className="d-flex justify-content-between align-items-center">
                      <h5 className="mb-0">Debt Management</h5>
                      <span className="badge bg-danger">{scoreFactors.loans}%</span>
                    </div>
                    <p className="text-muted small mb-0">Based on your debt burden ratio</p>
                  </div>
                  
                  <div className="factor-item">
                    <div className="d-flex justify-content-between align-items-center">
                      <h5 className="mb-0">Location Consistency</h5>
                      <span className="badge bg-secondary">{scoreFactors.locationConsistency}%</span>
                    </div>
                    <p className="text-muted small mb-0">
                      Based on utility bill verification
                      {scoreFactors.locationConsistency === 0 && (
                        <button
                          className="btn btn-link btn-sm p-0 ms-1 text-decoration-none"
                          onClick={handleUtilityBillDemo}
                        >
                          <small>Demo Upload <ArrowUpRight size={12} /></small>
                        </button>
                      )}
                    </p>
                  </div>
                  
                  <div className="factor-item">
                    <div className="d-flex justify-content-between align-items-center">
                      <h5 className="mb-0">Transaction History</h5>
                      <span className="badge bg-secondary">{scoreFactors.transactionHistory}%</span>
                    </div>
                    <p className="text-muted small mb-0">
                      Based on bank statement analysis
                      {scoreFactors.transactionHistory === 0 && (
                        <button
                          className="btn btn-link btn-sm p-0 ms-1 text-decoration-none"
                          onClick={handleBankStatementDemo}
                        >
                          <small>Demo Upload <ArrowUpRight size={12} /></small>
                        </button>
                      )}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;