import React, { useState, useEffect, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ScoreContext } from '../context/ScoreContext';
import { Upload, Check, AlertCircle } from 'lucide-react';
import axios from 'axios'; // ✅ Add this




const BASE_URL = 'http://localhost:8080/api/score';
const UtilityBillUpload = () => {
  const navigate = useNavigate();
  const { score, setScore, scoreFactors, setScoreFactors, updateTrigger } = useContext(ScoreContext);
  const [file, setFile] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
    billType: 'electricity',
    billAmount: '',
    billDate: '',
    provider: '',
    consumerNumber: '',
    address: ''
  });


  // Redirect if no score is available
  // React.useEffect(() => {
  //   if (!score) {
  //     navigate('/calculate-score');
  //   }
  // }, [score, navigate]);


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
            // generateLoan/Offers(response.data.score);
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
        // generateLoanOffers(score);
      }
   
    }, [score, updateTrigger, navigate, setScore, setScoreFactors]);
   
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
      // Update location consistency score
      const updatedFactors = {
        ...scoreFactors,
        locationConsistency: 75
      };
     
      // Recalculate score with new factors
      const updatedScore = Math.min(900, Math.round(score + 20));
     
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
              <h2 className="mb-2">Upload Utility Bill</h2>
              <p className="text-muted mb-4">
                Upload your utility bills to verify your address and improve your location consistency score.
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
                    Your utility bill has been verified and your score has been updated.
                  </p>
                  <div className="d-flex justify-content-center align-items-center gap-3">
                    <div className="text-center">
                      <h5>Previous Score</h5>
                      <span className="fs-4">{score - 20}</span>
                    </div>
                    <div className="text-center">
                      <h5>New Score</h5>
                      <span className="fs-4 fw-bold text-success">{score}</span>
                    </div>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit}>
                  <div className="mb-4">
                    <label className="form-label">Bill Type</label>
                    <select
                      className="form-select"
                      name="billType"
                      value={formData.billType}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="electricity">Electricity Bill</option>
                      <option value="water">Water Bill</option>
                      <option value="gas">Gas Bill</option>
                      <option value="internet">Internet Bill</option>
                      <option value="phone">Phone Bill</option>
                    </select>
                  </div>
                 
                  <div className="mb-4">
                    <label className="form-label">Service Provider</label>
                    <input
                      type="text"
                      className="form-control"
                      name="provider"
                      value={formData.provider}
                      onChange={handleInputChange}
                      placeholder="e.g., BSES, Jio, Airtel"
                      required
                    />
                  </div>
                 
                  <div className="row mb-4">
                    <div className="col-md-6">
                      <label className="form-label">Bill Amount (INR)</label>
                      <input
                        type="number"
                        className="form-control"
                        name="billAmount"
                        value={formData.billAmount}
                        onChange={handleInputChange}
                        placeholder="e.g., 1500"
                        required
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Bill Date</label>
                      <input
                        type="date"
                        className="form-control"
                        name="billDate"
                        value={formData.billDate}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                  </div>
                 
                  <div className="mb-4">
                    <label className="form-label">Consumer Number / Account ID</label>
                    <input
                      type="text"
                      className="form-control"
                      name="consumerNumber"
                      value={formData.consumerNumber}
                      onChange={handleInputChange}
                      placeholder="e.g., CUST12345678"
                      required
                    />
                  </div>
                 
                  <div className="mb-4">
                    <label className="form-label">Address (as shown on bill)</label>
                    <textarea
                      className="form-control"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      rows="3"
                      placeholder="Full address as it appears on your bill"
                      required
                    ></textarea>
                  </div>
                 
                  <div className="mb-4">
                    <label className="form-label">Upload Bill Document</label>
                    <div
                      className={`upload-zone ${file ? 'border-primary bg-light' : ''}`}
                      onClick={() => document.getElementById('billFileUpload').click()}
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
                          <Upload size={32} className="text-primary mb-2" />
                          <p className="mb-1">Click to upload or drag and drop</p>
                          <p className="text-muted small mb-0">
                            Supported formats: PDF, JPG, PNG (Max: 5MB)
                          </p>
                        </div>
                      )}
                      <input
                        type="file"
                        id="billFileUpload"
                        className="d-none"
                        accept=".pdf,.jpg,.jpeg,.png"
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
                        <h6 className="mb-1">Document Guidelines</h6>
                        <ul className="text-muted small mb-0">
                          <li>Bill should be less than 3 months old</li>
                          <li>Address and consumer number should be clearly visible</li>
                          <li>Bill should be in your name or immediate family member's name</li>
                          <li>File should be clear and all text must be readable</li>
                        </ul>
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
                          Processing...
                        </>
                      ) : 'Upload and Verify Bill'}
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


export default UtilityBillUpload;
