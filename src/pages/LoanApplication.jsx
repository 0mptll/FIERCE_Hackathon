import React, { useState, useContext, useEffect } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { ScoreContext } from '../context/ScoreContext';
import { CheckCircle, AlertCircle, FileText, Calendar } from 'lucide-react';

const LoanApplication = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { score } = useContext(ScoreContext);
  
  const [loan, setLoan] = useState(null);
  const [activeStep, setActiveStep] = useState(1);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [loanAmount, setLoanAmount] = useState('');
  const [loanTenure, setLoanTenure] = useState('');
  const [formData, setFormData] = useState({
    fullName: '',
    gender: '',
    dob: '',
    mobile: '',
    email: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    occupation: '',
    employerName: '',
    monthlyIncome: '',
    panNumber: '',
    aadhaarNumber: '',
    purpose: '',
    agreeTerms: false
  });
  
  // Form validation states
  const [formErrors, setFormErrors] = useState({
    step1: false,
    step2: false
  });
  
  // Load loan details from location state or fetch based on ID
  useEffect(() => {
    if (location.state) {
      setLoan(location.state);
      setLoanAmount(location.state.maxAmount / 2);
      setLoanTenure(location.state.tenure[Math.floor(location.state.tenure.length / 2)]);
    } else {
      // In a real app, we would fetch loan details from an API
      navigate('/available-loans');
    }
  }, [location, id, navigate]);
  
  // Redirect if no score is available
  useEffect(() => {
    if (!score) {
      navigate('/calculate-score');
    }
  }, [score, navigate]);

  if (!loan || !score) {
    return <div className="text-center py-5">Loading...</div>;
  }

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  // Validate form fields for each step
  const validateStep1 = () => {
    if (!loanAmount || !loanTenure || !formData.purpose) {
      setFormErrors(prev => ({ ...prev, step1: true }));
      return false;
    }
    setFormErrors(prev => ({ ...prev, step1: false }));
    return true;
  };

  const validateStep2 = () => {
    const requiredFields = [
      'fullName', 'gender', 'dob', 'mobile', 'email', 
      'address', 'city', 'state', 'pincode', 
      'occupation', 'employerName', 'monthlyIncome', 
      'panNumber', 'aadhaarNumber'
    ];
    
    const isValid = requiredFields.every(field => formData[field].trim() !== '');
    
    setFormErrors(prev => ({ ...prev, step2: !isValid }));
    return isValid;
  };

  const handleNext = () => {
    if (activeStep === 1) {
      if (!validateStep1()) return;
    } else if (activeStep === 2) {
      if (!validateStep2()) return;
    }
    
    setActiveStep(prev => prev + 1);
    window.scrollTo(0, 0);
  };

  const handlePrev = () => {
    setActiveStep(prev => prev - 1);
    window.scrollTo(0, 0);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Final validation before submission
    if (!formData.agreeTerms) return;
    
    setFormSubmitted(true);
    
    // In a real app, this would submit the application to the backend
    setTimeout(() => {
      navigate('/dashboard');
    }, 5000);
  };

  // Calculate EMI based on loan amount and tenure
  const calculateEmi = () => {
    // Convert interest rate from annual to monthly
    const monthlyInterestRate = loan.interest / 12 / 100;
    
    // Calculate EMI
    const emi = loanAmount * monthlyInterestRate * 
                Math.pow(1 + monthlyInterestRate, loanTenure) / 
                (Math.pow(1 + monthlyInterestRate, loanTenure) - 1);
    
    return isNaN(emi) ? 0 : Math.round(emi);
  };

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-lg-10">
          {formSubmitted ? (
            <div className="card border-0 shadow-sm">
              <div className="card-body p-5 text-center">
                <div className="mb-4">
                  <CheckCircle size={64} className="text-success" />
                </div>
                <h2 className="mb-2">Application Submitted Successfully!</h2>
                <p className="text-muted mb-4">
                  Your loan application for ₹{Number(loanAmount).toLocaleString()} has been submitted to {loan.bank}.
                  You will receive a confirmation on your registered mobile number and email.
                </p>
                <div className="alert alert-primary d-inline-flex align-items-center">
                  <Calendar size={24} className="me-3" />
                  <div className="text-start">
                    <strong>Application Number:</strong> FIRC{Math.floor(Math.random() * 1000000) + 1000000}<br />
                    <strong>Expected Processing Time:</strong> 24-48 hours
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="card border-0 shadow-sm">
              <div className="card-body p-4">
                <h2 className="mb-4">{loan.bank} Loan Application</h2>
                
                {/* Progress steps */}
                <div className="mb-5">
                  <div className="d-flex justify-content-between position-relative mb-4">
                    <div className="flex-grow-1 position-absolute" style={{ height: '2px', backgroundColor: '#e2e8f0', top: '50%', zIndex: 1 }}></div>
                    {[1, 2, 3].map((step) => (
                      <div key={step} className="d-flex flex-column align-items-center position-relative" style={{ zIndex: 2 }}>
                        <div 
                          className={`rounded-circle d-flex align-items-center justify-content-center mb-2 ${
                            activeStep >= step ? 'bg-primary text-white' : 'bg-light text-muted'
                          }`}
                          style={{ width: '40px', height: '40px' }}
                        >
                          {step}
                        </div>
                        <span className={activeStep >= step ? 'text-primary' : 'text-muted'}>
                          {step === 1 ? 'Loan Details' : step === 2 ? 'Personal Details' : 'Review & Submit'}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
                
                <form onSubmit={handleSubmit} noValidate>
                  {/* Step 1: Loan Details */}
                  {activeStep === 1 && (
                    <div>
                      <h4 className="mb-4">Loan Details</h4>
                      
                      {formErrors.step1 && (
                        <div className="alert alert-danger mb-4">
                          <strong>Please complete all required fields before proceeding.</strong>
                        </div>
                      )}
                      
                      <div className="alert alert-light d-flex mb-4">
                        <div className="me-3">
                          <CheckCircle size={24} className="text-success" />
                        </div>
                        <div>
                          <h5 className="mb-1">Pre-Approved Loan Offer</h5>
                          <p className="mb-0">
                            Based on your credit score of <strong>{score}</strong>, you are eligible for a loan of up to 
                            <strong> ₹{loan.maxAmount.toLocaleString()}</strong> at <strong>{loan.interest}% interest rate</strong>.
                          </p>
                        </div>
                      </div>
                      
                      <div className="row mb-4">
                        <div className="col-md-6">
                          <label htmlFor="loanAmount" className="form-label">Loan Amount (₹) <span className="text-danger">*</span></label>
                          <input 
                            type="range"
                            className="form-range mb-2"
                            id="loanAmount"
                            min="10000"
                            max={loan.maxAmount}
                            step="5000"
                            value={loanAmount}
                            onChange={(e) => setLoanAmount(e.target.value)}
                            required
                          />
                          <div className="d-flex justify-content-between">
                            <small>₹10,000</small>
                            <input
                              type="number"
                              className="form-control form-control-sm w-25 mx-2"
                              value={loanAmount}
                              onChange={(e) => setLoanAmount(e.target.value)}
                              min="10000"
                              max={loan.maxAmount}
                              required
                            />
                            <small>₹{loan.maxAmount.toLocaleString()}</small>
                          </div>
                        </div>
                        <div className="col-md-6">
                          <label htmlFor="loanTenure" className="form-label">Loan Tenure (months) <span className="text-danger">*</span></label>
                          <select 
                            className={`form-select ${!loanTenure && 'is-invalid'}`}
                            id="loanTenure"
                            value={loanTenure}
                            onChange={(e) => setLoanTenure(e.target.value)}
                            required
                          >
                            <option value="">Select loan tenure</option>
                            {loan.tenure.map(tenure => (
                              <option key={tenure} value={tenure}>{tenure} months</option>
                            ))}
                          </select>
                          {!loanTenure && <div className="invalid-feedback">Please select a loan tenure</div>}
                        </div>
                      </div>
                      
                      <div className="row mb-4">
                        <div className="col-md-4">
                          <div className="card">
                            <div className="card-body">
                              <h6 className="card-title">Monthly EMI</h6>
                              <p className="fs-4 fw-bold mb-0 text-primary">₹{calculateEmi().toLocaleString()}</p>
                            </div>
                          </div>
                        </div>
                        <div className="col-md-4">
                          <div className="card">
                            <div className="card-body">
                              <h6 className="card-title">Interest Rate</h6>
                              <p className="fs-4 fw-bold mb-0">{loan.interest}% p.a.</p>
                            </div>
                          </div>
                        </div>
                        <div className="col-md-4">
                          <div className="card">
                            <div className="card-body">
                              <h6 className="card-title">Processing Fee</h6>
                              <p className="fs-4 fw-bold mb-0">₹{Math.round(loanAmount * 0.01).toLocaleString()}</p>
                              <p className="text-muted small mb-0">(1% of loan amount)</p>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="mb-4">
                        <label htmlFor="purpose" className="form-label">Purpose of Loan <span className="text-danger">*</span></label>
                        <select 
                          className={`form-select ${!formData.purpose && 'is-invalid'}`}
                          id="purpose"
                          name="purpose"
                          value={formData.purpose}
                          onChange={handleInputChange}
                          required
                        >
                          <option value="">Select purpose</option>
                          <option value="agriculture">Agriculture / Farming</option>
                          <option value="business">Small Business</option>
                          <option value="education">Education</option>
                          <option value="medical">Medical Expenses</option>
                          <option value="home">Home Renovation</option>
                          <option value="wedding">Wedding</option>
                          <option value="other">Other</option>
                        </select>
                        {!formData.purpose && <div className="invalid-feedback">Please select a purpose for the loan</div>}
                      </div>
                      
                      <div className="d-flex justify-content-end mt-4">
                        <button 
                          type="button" 
                          className="btn btn-primary px-4"
                          onClick={handleNext}
                        >
                          Next
                        </button>
                      </div>
                    </div>
                  )}
                  
                  {/* Step 2: Personal Details */}
                  {activeStep === 2 && (
                    <div>
                      <h4 className="mb-4">Personal Details</h4>
                      
                      {formErrors.step2 && (
                        <div className="alert alert-danger mb-4">
                          <strong>Please complete all required fields before proceeding.</strong>
                        </div>
                      )}
                      
                      <div className="row mb-3">
                        <div className="col-md-6">
                          <div className="mb-3">
                            <label htmlFor="fullName" className="form-label">Full Name <span className="text-danger">*</span></label>
                            <input 
                              type="text" 
                              className={`form-control ${!formData.fullName && 'is-invalid'}`}
                              id="fullName"
                              name="fullName"
                              value={formData.fullName}
                              onChange={handleInputChange}
                              required
                            />
                            {!formData.fullName && <div className="invalid-feedback">Please enter your full name</div>}
                          </div>
                        </div>
                        <div className="col-md-6">
                          <div className="mb-3">
                            <label htmlFor="gender" className="form-label">Gender <span className="text-danger">*</span></label>
                            <select 
                              className={`form-select ${!formData.gender && 'is-invalid'}`}
                              id="gender"
                              name="gender"
                              value={formData.gender}
                              onChange={handleInputChange}
                              required
                            >
                              <option value="">Select gender</option>
                              <option value="male">Male</option>
                              <option value="female">Female</option>
                              <option value="other">Other</option>
                            </select>
                            {!formData.gender && <div className="invalid-feedback">Please select your gender</div>}
                          </div>
                        </div>
                      </div>
                      
                      <div className="row mb-3">
                        <div className="col-md-6">
                          <div className="mb-3">
                            <label htmlFor="dob" className="form-label">Date of Birth <span className="text-danger">*</span></label>
                            <input 
                              type="date" 
                              className={`form-control ${!formData.dob && 'is-invalid'}`}
                              id="dob"
                              name="dob"
                              value={formData.dob}
                              onChange={handleInputChange}
                              required
                            />
                            {!formData.dob && <div className="invalid-feedback">Please enter your date of birth</div>}
                          </div>
                        </div>
                        <div className="col-md-6">
                          <div className="mb-3">
                            <label htmlFor="mobile" className="form-label">Mobile Number <span className="text-danger">*</span></label>
                            <input 
                              type="tel" 
                              className={`form-control ${formData.mobile && !/^[0-9]{10}$/.test(formData.mobile) ? 'is-invalid' : ''}`}
                              id="mobile"
                              name="mobile"
                              value={formData.mobile}
                              onChange={handleInputChange}
                              pattern="[0-9]{10}"
                              placeholder="10-digit mobile number"
                              required
                            />
                            {formData.mobile && !/^[0-9]{10}$/.test(formData.mobile) && 
                              <div className="invalid-feedback">Please enter a valid 10-digit mobile number</div>
                            }
                          </div>
                        </div>
                      </div>
                      
                      <div className="mb-3">
                        <label htmlFor="email" className="form-label">Email Address <span className="text-danger">*</span></label>
                        <input 
                          type="email" 
                          className={`form-control ${formData.email && !/\S+@\S+\.\S+/.test(formData.email) ? 'is-invalid' : ''}`}
                          id="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          required
                        />
                        {formData.email && !/\S+@\S+\.\S+/.test(formData.email) && 
                          <div className="invalid-feedback">Please enter a valid email address</div>
                        }
                      </div>
                      
                      <div className="mb-3">
                        <label htmlFor="address" className="form-label">Full Address <span className="text-danger">*</span></label>
                        <textarea 
                          className={`form-control ${!formData.address && 'is-invalid'}`}
                          id="address"
                          name="address"
                          value={formData.address}
                          onChange={handleInputChange}
                          rows="2"
                          required
                        ></textarea>
                        {!formData.address && <div className="invalid-feedback">Please enter your full address</div>}
                      </div>
                      
                      <div className="row mb-3">
                        <div className="col-md-4">
                          <div className="mb-3">
                            <label htmlFor="city" className="form-label">City <span className="text-danger">*</span></label>
                            <input 
                              type="text" 
                              className={`form-control ${!formData.city && 'is-invalid'}`}
                              id="city"
                              name="city"
                              value={formData.city}
                              onChange={handleInputChange}
                              required
                            />
                            {!formData.city && <div className="invalid-feedback">Please enter your city</div>}
                          </div>
                        </div>
                        <div className="col-md-4">
                          <div className="mb-3">
                            <label htmlFor="state" className="form-label">State <span className="text-danger">*</span></label>
                            <input 
                              type="text" 
                              className={`form-control ${!formData.state && 'is-invalid'}`}
                              id="state"
                              name="state"
                              value={formData.state}
                              onChange={handleInputChange}
                              required
                            />
                            {!formData.state && <div className="invalid-feedback">Please enter your state</div>}
                          </div>
                        </div>
                        <div className="col-md-4">
                          <div className="mb-3">
                            <label htmlFor="pincode" className="form-label">PIN Code <span className="text-danger">*</span></label>
                            <input 
                              type="text" 
                              className={`form-control ${formData.pincode && !/^[0-9]{6}$/.test(formData.pincode) ? 'is-invalid' : ''}`}
                              id="pincode"
                              name="pincode"
                              value={formData.pincode}
                              onChange={handleInputChange}
                              pattern="[0-9]{6}"
                              placeholder="6-digit PIN code"
                              required
                            />
                            {formData.pincode && !/^[0-9]{6}$/.test(formData.pincode) && 
                              <div className="invalid-feedback">Please enter a valid 6-digit PIN code</div>
                            }
                          </div>
                        </div>
                      </div>
                      
                      <div className="row mb-3">
                        <div className="col-md-6">
                          <div className="mb-3">
                            <label htmlFor="occupation" className="form-label">Occupation <span className="text-danger">*</span></label>
                            <select 
                              className={`form-select ${!formData.occupation && 'is-invalid'}`}
                              id="occupation"
                              name="occupation"
                              value={formData.occupation}
                              onChange={handleInputChange}
                              required
                            >
                              <option value="">Select occupation</option>
                              <option value="farmer">Farmer</option>
                              <option value="labour">Daily Wage Labourer</option>
                              <option value="shopkeeper">Small Shop Owner</option>
                              <option value="artisan">Artisan / Craftsperson</option>
                              <option value="service">Service Worker</option>
                              <option value="other">Other</option>
                            </select>
                            {!formData.occupation && <div className="invalid-feedback">Please select your occupation</div>}
                          </div>
                        </div>
                        <div className="col-md-6">
                          <div className="mb-3">
                            <label htmlFor="employerName" className="form-label">Employer/Business Name <span className="text-danger">*</span></label>
                            <input 
                              type="text" 
                              className={`form-control ${!formData.employerName && 'is-invalid'}`}
                              id="employerName"
                              name="employerName"
                              value={formData.employerName}
                              onChange={handleInputChange}
                              required
                            />
                            {!formData.employerName && <div className="invalid-feedback">Please enter your employer/business name</div>}
                          </div>
                        </div>
                      </div>
                      
                      <div className="mb-3">
                        <label htmlFor="monthlyIncome" className="form-label">Monthly Income (₹) <span className="text-danger">*</span></label>
                        <input 
                          type="number" 
                          className={`form-control ${formData.monthlyIncome && Number(formData.monthlyIncome) < 5000 ? 'is-invalid' : ''}`}
                          id="monthlyIncome"
                          name="monthlyIncome"
                          value={formData.monthlyIncome}
                          onChange={handleInputChange}
                          min="5000"
                          required
                        />
                        {formData.monthlyIncome && Number(formData.monthlyIncome) < 5000 && 
                          <div className="invalid-feedback">Monthly income must be at least ₹5,000</div>
                        }
                      </div>
                      
                      <div className="row mb-3">
                        <div className="col-md-6">
                          <div className="mb-3">
                            <label htmlFor="panNumber" className="form-label">PAN Card Number <span className="text-danger">*</span></label>
                            <input 
                              type="text" 
                              className={`form-control ${formData.panNumber && !/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(formData.panNumber) ? 'is-invalid' : ''}`}
                              id="panNumber"
                              name="panNumber"
                              value={formData.panNumber}
                              onChange={handleInputChange}
                              pattern="[A-Z]{5}[0-9]{4}[A-Z]{1}"
                              placeholder="e.g., ABCDE1234F"
                              required
                            />
                            {formData.panNumber && !/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(formData.panNumber) && 
                              <div className="invalid-feedback">Please enter a valid PAN number (e.g., ABCDE1234F)</div>
                            }
                          </div>
                        </div>
                        <div className="col-md-6">
                          <div className="mb-3">
                            <label htmlFor="aadhaarNumber" className="form-label">Aadhaar Number (last 4 digits) <span className="text-danger">*</span></label>
                            <input 
                              type="text" 
                              className={`form-control ${formData.aadhaarNumber && !/^[0-9]{4}$/.test(formData.aadhaarNumber) ? 'is-invalid' : ''}`}
                              id="aadhaarNumber"
                              name="aadhaarNumber"
                              value={formData.aadhaarNumber}
                              onChange={handleInputChange}
                              pattern="[0-9]{4}"
                              placeholder="e.g., XXXX XXXX 1234"
                              maxLength="4"
                              required
                            />
                            {formData.aadhaarNumber && !/^[0-9]{4}$/.test(formData.aadhaarNumber) && 
                              <div className="invalid-feedback">Please enter the last 4 digits of your Aadhaar number</div>
                            }
                          </div>
                        </div>
                      </div>
                      
                      <div className="alert alert-info d-flex">
                        <div className="me-3">
                          <FileText size={24} className="text-primary" />
                        </div>
                        <div>
                          <h6 className="mb-1">Required Documents</h6>
                          <p className="small mb-0">
                            You will need to upload the following documents after submission:
                            <br />
                            1. ID proof (Aadhaar/PAN/Voter ID)
                            <br />
                            2. Recent passport-size photograph
                            <br />
                            3. Income proof (if available)
                          </p>
                        </div>
                      </div>
                      
                      <div className="d-flex justify-content-between mt-4">
                        <button 
                          type="button" 
                          className="btn btn-outline-primary px-4"
                          onClick={handlePrev}
                        >
                          Back
                        </button>
                        <button 
                          type="button" 
                          className="btn btn-primary px-4"
                          onClick={handleNext}
                        >
                          Next
                        </button>
                      </div>
                    </div>
                  )}
                  
                  {/* Step 3: Review & Submit */}
                  {activeStep === 3 && (
                    <div>
                      <h4 className="mb-4">Review & Submit Application</h4>
                      
                      <div className="card mb-4">
                        <div className="card-header bg-light">
                          <h5 className="mb-0">Loan Details</h5>
                        </div>
                        <div className="card-body">
                          <div className="row">
                            <div className="col-md-6">
                              <table className="table table-borderless">
                                <tbody>
                                  <tr>
                                    <td className="text-muted">Lender</td>
                                    <td className="fw-semibold">{loan.bank}</td>
                                  </tr>
                                  <tr>
                                    <td className="text-muted">Loan Amount</td>
                                    <td className="fw-semibold">₹{Number(loanAmount).toLocaleString()}</td>
                                  </tr>
                                  <tr>
                                    <td className="text-muted">Interest Rate</td>
                                    <td className="fw-semibold">{loan.interest}% p.a.</td>
                                  </tr>
                                </tbody>
                              </table>
                            </div>
                            <div className="col-md-6">
                              <table className="table table-borderless">
                                <tbody>
                                  <tr>
                                    <td className="text-muted">Tenure</td>
                                    <td className="fw-semibold">{loanTenure} months</td>
                                  </tr>
                                  <tr>
                                    <td className="text-muted">Monthly EMI</td>
                                    <td className="fw-semibold">₹{calculateEmi().toLocaleString()}</td>
                                  </tr>
                                  <tr>
                                    <td className="text-muted">Purpose</td>
                                    <td className="fw-semibold">{formData.purpose.charAt(0).toUpperCase() + formData.purpose.slice(1)}</td>
                                  </tr>
                                </tbody>
                              </table>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="card mb-4">
                        <div className="card-header bg-light">
                          <h5 className="mb-0">Personal Details</h5>
                        </div>
                        <div className="card-body">
                          <div className="row">
                            <div className="col-md-6">
                              <table className="table table-borderless">
                                <tbody>
                                  <tr>
                                    <td className="text-muted">Full Name</td>
                                    <td className="fw-semibold">{formData.fullName}</td>
                                  </tr>
                                  <tr>
                                    <td className="text-muted">Gender</td>
                                    <td className="fw-semibold">{formData.gender.charAt(0).toUpperCase() + formData.gender.slice(1)}</td>
                                  </tr>
                                  <tr>
                                    <td className="text-muted">Date of Birth</td>
                                    <td className="fw-semibold">{formData.dob}</td>
                                  </tr>
                                  <tr>
                                    <td className="text-muted">Mobile</td>
                                    <td className="fw-semibold">{formData.mobile}</td>
                                  </tr>
                                  <tr>
                                    <td className="text-muted">Email</td>
                                    <td className="fw-semibold">{formData.email}</td>
                                  </tr>
                                </tbody>
                              </table>
                            </div>
                            <div className="col-md-6">
                              <table className="table table-borderless">
                                <tbody>
                                  <tr>
                                    <td className="text-muted">Address</td>
                                    <td className="fw-semibold">{formData.address}</td>
                                  </tr>
                                  <tr>
                                    <td className="text-muted">City, State</td>
                                    <td className="fw-semibold">{formData.city}, {formData.state}</td>
                                  </tr>
                                  <tr>
                                    <td className="text-muted">PIN Code</td>
                                    <td className="fw-semibold">{formData.pincode}</td>
                                  </tr>
                                  <tr>
                                    <td className="text-muted">Occupation</td>
                                    <td className="fw-semibold">{formData.occupation.charAt(0).toUpperCase() + formData.occupation.slice(1)}</td>
                                  </tr>
                                  <tr>
                                    <td className="text-muted">Monthly Income</td>
                                    <td className="fw-semibold">₹{Number(formData.monthlyIncome).toLocaleString()}</td>
                                  </tr>
                                </tbody>
                              </table>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="alert alert-warning d-flex mb-4">
                        <div className="me-3">
                          <AlertCircle size={24} className="text-warning" />
                        </div>
                        <div>
                          <h6 className="mb-1">Important Notice</h6>
                          <p className="small mb-0">
                            By submitting this application, you confirm that all the information provided is accurate and complete.
                            Providing false information may result in rejection of your application and may impact your credit score.
                          </p>
                        </div>
                      </div>
                      
                      <div className="form-check mb-4">
                        <input 
                          className="form-check-input" 
                          type="checkbox" 
                          id="agreeTerms"
                          name="agreeTerms"
                          checked={formData.agreeTerms}
                          onChange={handleInputChange}
                          required
                        />
                        <label className="form-check-label" htmlFor="agreeTerms">
                          I agree to the terms and conditions, and authorize {loan.bank} to verify my information with 
                          credit bureaus and other sources. I understand that the final loan approval and disbursement 
                          are subject to verification of documents and credit assessment.
                        </label>
                      </div>
                      
                      <div className="d-flex justify-content-between mt-4">
                        <button 
                          type="button" 
                          className="btn btn-outline-primary px-4"
                          onClick={handlePrev}
                        >
                          Back
                        </button>
                        <button 
                          type="submit" 
                          className="btn btn-primary px-4"
                          disabled={!formData.agreeTerms}
                        >
                          Submit Application
                        </button>
                      </div>
                    </div>
                  )}
                </form>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LoanApplication;