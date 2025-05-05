import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { ScoreContext } from '../context/ScoreContext';
import { Upload, Check, AlertCircle, FileText } from 'lucide-react';

const BankStatementUpload = () => {
  const navigate = useNavigate();
  const { score, scoreFactors, setScore, setScoreFactors } = useContext(ScoreContext);
  const [file, setFile] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
    bankName: '',
    accountNumber: '',
    accountType: 'savings',
    statementPeriod: '3'
  });

  // Redirect if no score is available
  React.useEffect(() => {
    if (!score) {
      navigate('/calculate-score');
    }
  }, [score, navigate]);

  const handleFileChange = (e) => {
    if (e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setProcessing(true);
    
    // Simulate processing delay
    setTimeout(() => {
      // Update transaction history score
      const updatedFactors = {
        ...scoreFactors,
        transactionHistory: 80
      };
      
      // Recalculate score with new factors
      const updatedScore = Math.min(900, Math.round(score + 25));
      
      setScore(updatedScore);
      setScoreFactors(updatedFactors);
      setProcessing(false);
      setSuccess(true);
      
      // Redirect after a short delay
      setTimeout(() => {
        navigate('/dashboard');
      }, 2000);
    }, 2000);
  };

  if (!score) {
    return <div className="text-center py-5">Loading...</div>;
  }

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-8">
          <div className="card shadow-sm border-0">
            <div className="card-body p-4">
              <h2 className="mb-2">Upload Bank Statement</h2>
              <p className="text-muted mb-4">
                Upload your bank statement to verify your transaction history and improve your credit score.
              </p>
              
              {success ? (
                <div className="text-center py-4">
                  <div className="mb-3">
                    <div className="rounded-circle bg-success d-inline-flex p-3">
                      <Check size={48} className="text-white" />
                    </div>
                  </div>
                  <h3 className="mb-2">Upload Successful!</h3>
                  <p className="text-muted mb-4">
                    Your bank statement has been analyzed and your score has been updated.
                  </p>
                  <div className="d-flex justify-content-center align-items-center gap-3">
                    <div className="text-center">
                      <h5>Previous Score</h5>
                      <span className="fs-4">{score - 25}</span>
                    </div>
                    <div className="text-center">
                      <h5>New Score</h5>
                      <span className="fs-4 fw-bold text-success">{score}</span>
                    </div>
                  </div>
                  
                  <div className="mt-4">
                    <h5 className="mb-3">Transaction Analysis</h5>
                    <div className="row g-2">
                      <div className="col-6">
                        <div className="border rounded p-3">
                          <h6 className="text-primary">Digital Transactions</h6>
                          <p className="fs-5 mb-0">78%</p>
                        </div>
                      </div>
                      <div className="col-6">
                        <div className="border rounded p-3">
                          <h6 className="text-success">Consistent Income</h6>
                          <p className="fs-5 mb-0">Yes</p>
                        </div>
                      </div>
                      <div className="col-6">
                        <div className="border rounded p-3">
                          <h6 className="text-warning">Savings Pattern</h6>
                          <p className="fs-5 mb-0">Moderate</p>
                        </div>
                      </div>
                      <div className="col-6">
                        <div className="border rounded p-3">
                          <h6 className="text-danger">Overdrafts</h6>
                          <p className="fs-5 mb-0">None</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit}>
                  <div className="mb-4">
                    <label className="form-label">Bank Name</label>
                    <input 
                      type="text" 
                      className="form-control" 
                      name="bankName"
                      value={formData.bankName}
                      onChange={handleInputChange}
                      placeholder="e.g., State Bank of India, HDFC, ICICI"
                      required
                    />
                  </div>
                  
                  <div className="mb-4">
                    <label className="form-label">Account Number (last 4 digits only)</label>
                    <input 
                      type="text" 
                      className="form-control" 
                      name="accountNumber"
                      value={formData.accountNumber}
                      onChange={handleInputChange}
                      placeholder="e.g., XXXX"
                      maxLength="4"
                      pattern="[0-9]{4}"
                      required
                    />
                    <small className="text-muted">
                      For security, provide only the last 4 digits
                    </small>
                  </div>
                  
                  <div className="row mb-4">
                    <div className="col-md-6">
                      <label className="form-label">Account Type</label>
                      <select 
                        className="form-select" 
                        name="accountType" 
                        value={formData.accountType}
                        onChange={handleInputChange}
                        required
                      >
                        <option value="savings">Savings Account</option>
                        <option value="current">Current Account</option>
                        <option value="salary">Salary Account</option>
                      </select>
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Statement Period</label>
                      <select 
                        className="form-select" 
                        name="statementPeriod" 
                        value={formData.statementPeriod}
                        onChange={handleInputChange}
                        required
                      >
                        <option value="3">Last 3 Months</option>
                        <option value="6">Last 6 Months</option>
                        <option value="12">Last 12 Months</option>
                      </select>
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <label className="form-label">Upload Bank Statement</label>
                    <div 
                      className={`upload-zone ${file ? 'border-primary bg-light' : ''}`}
                      onClick={() => document.getElementById('statementFileUpload').click()}
                    >
                      {file ? (
                        <div className="text-center">
                          <Check size={32} className="text-success mb-2" />
                          <p className="mb-1">{file.name}</p>
                          <p className="text-muted small mb-0">
                            {(file.size / 1024).toFixed(2)} KB
                          </p>
                        </div>
                      ) : (
                        <div>
                          <FileText size={32} className="text-primary mb-2" />
                          <p className="mb-1">Click to upload or drag and drop</p>
                          <p className="text-muted small mb-0">
                            Supported formats: PDF, CSV, XLS (Max: 10MB)
                          </p>
                        </div>
                      )}
                      <input 
                        type="file" 
                        id="statementFileUpload" 
                        className="d-none" 
                        accept=".pdf,.csv,.xls,.xlsx"
                        onChange={handleFileChange}
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="border rounded p-3 bg-light mb-4">
                    <div className="d-flex">
                      <div className="me-2">
                        <AlertCircle size={24} className="text-primary" />
                      </div>
                      <div>
                        <h6 className="mb-1">Information Security</h6>
                        <p className="text-muted small mb-0">
                          Your bank statement is securely processed and analyzed to verify your transaction patterns. 
                          We do not store sensitive information like your full account number or transaction details.
                          Only transaction patterns and financial behaviors are extracted to calculate your score.
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="d-grid">
                    <button 
                      type="submit" 
                      className="btn btn-primary btn-lg"
                      disabled={processing || !file}
                    >
                      {processing ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                          Analyzing Statement...
                        </>
                      ) : 'Upload and Analyze Statement'}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BankStatementUpload;