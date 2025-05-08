import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Phone, MapPin, Briefcase, Mail, Lock } from 'lucide-react';
import axios from 'axios';

const BASE_URL = 'http://localhost:8080/api/auth'; // Backend API URL

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    village: '',
    district: '',
    state: 'Gujarat',
    occupation: '',
    monthlyIncome: '',
    email: '',
    password: '',
    confirmPassword: '',
    aadhaarConsent: false,
    termsConsent: false
  });
  const [error, setError] = useState('');

  const occupations = [
    'Farmer', 'Daily Wage Laborer', 'Shop Owner', 'Street Vendor',
    'Artisan', 'Driver', 'Domestic Worker', 'Other'
  ];

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    if (!formData.aadhaarConsent || !formData.termsConsent) {
      setError('Please accept all terms and conditions');
      return;
    }

    try {
      // Send registration data to backend
      const response = await axios.post(`${BASE_URL}/register`, formData, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      // Redirect user upon successful registration
      if (response.data) {
        navigate('/login');
      }
    } catch (err) {
      setError(err.response?.data || 'Registration failed. Please try again.');
    }
    navigate('/calculate-score');
  };

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-8 col-lg-7">
          <div className="card border-0 shadow-sm">
            <div className="card-body p-4">
              <div className="text-center mb-4">
                <h2 className="fw-bold mb-1">Create Account</h2>
                <p className="text-muted">Join FIERCE Finance to access financial services</p>
              </div>

              {error && (
                <div className="alert alert-danger" role="alert">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label">Full Name</label>
                  <div className="input-group">
                    <span className="input-group-text">
                      <User size={18} />
                    </span>
                    <input
                      type="text"
                      className="form-control"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleChange}
                      placeholder="Enter your full name"
                      required
                    />
                  </div>
                </div>

                <div className="mb-3">
                  <label className="form-label">Phone Number</label>
                  <div className="input-group">
                    <span className="input-group-text">
                      <Phone size={18} />
                    </span>
                    <input
                      type="tel"
                      className="form-control"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="Enter your 10-digit phone number"
                      pattern="[0-9]{10}"
                      required
                    />
                  </div>
                </div>

                <div className="row mb-3">
                  <div className="col-md-6">
                    <label className="form-label">Village/Town</label>
                    <div className="input-group">
                      <span className="input-group-text">
                        <MapPin size={18} />
                      </span>
                      <input
                        type="text"
                        className="form-control"
                        name="village"
                        value={formData.village}
                        onChange={handleChange}
                        placeholder="Enter village/town"
                        required
                      />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">District</label>
                    <div className="input-group">
                      <span className="input-group-text">
                        <MapPin size={18} />
                      </span>
                      <input
                        type="text"
                        className="form-control"
                        name="district"
                        value={formData.district}
                        onChange={handleChange}
                        placeholder="Enter district"
                        required
                      />
                    </div>
                  </div>
                </div>

                <div className="row mb-3">
                  <div className="col-md-6">
                    <label className="form-label">State</label>
                    <select 
                      className="form-select"
                      name="state"
                      value={formData.state}
                      onChange={handleChange}
                      required
                    >
                      <option value="Gujarat">Gujarat</option>
                    </select>
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Occupation</label>
                    <select 
                      className="form-select"
                      name="occupation"
                      value={formData.occupation}
                      onChange={handleChange}
                      required
                    >
                      <option value="">Select occupation</option>
                      {occupations.map(occupation => (
                        <option key={occupation} value={occupation}>
                          {occupation}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="mb-3">
                  <label className="form-label">Monthly Income (₹)</label>
                  <div className="input-group">
                    <span className="input-group-text">
                      <Briefcase size={18} />
                    </span>
                    <input
                      type="number"
                      className="form-control"
                      name="monthlyIncome"
                      value={formData.monthlyIncome}
                      onChange={handleChange}
                      placeholder="Enter your monthly income"
                      min="1000"
                      required
                    />
                  </div>
                </div>

                <div className="mb-3">
                  <label className="form-label">Email Address</label>
                  <div className="input-group">
                    <span className="input-group-text">
                      <Mail size={18} />
                    </span>
                    <input
                      type="email"
                      className="form-control"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="Enter your email address"
                      required
                    />
                  </div>
                </div>

                <div className="row mb-3">
                  <div className="col-md-6">
                    <label className="form-label">Password</label>
                    <div className="input-group">
                      <span className="input-group-text">
                        <Lock size={18} />
                      </span>
                      <input
                        type="password"
                        className="form-control"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        placeholder="Create a password"
                        minLength="6"
                        required
                      />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Confirm Password</label>
                    <div className="input-group">
                      <span className="input-group-text">
                        <Lock size={18} />
                      </span>
                      <input
                        type="password"
                        className="form-control"
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        placeholder="Confirm your password"
                        minLength="6"
                        required
                      />
                    </div>
                  </div>
                </div>

                <div className="mb-3">
                  <div className="form-check">
                    <input
                      type="checkbox"
                      className="form-check-input"
                      id="aadhaarConsent"
                      name="aadhaarConsent"
                      checked={formData.aadhaarConsent}
                      onChange={handleChange}
                      required
                    />
                    <label className="form-check-label" htmlFor="aadhaarConsent">
                      I consent to link my Aadhaar for verification
                    </label>
                  </div>
                </div>

                <div className="mb-4">
                  <div className="form-check">
                    <input
                      type="checkbox"
                      className="form-check-input"
                      id="termsConsent"
                      name="termsConsent"
                      checked={formData.termsConsent}
                      onChange={handleChange}
                      required
                    />
                    <label className="form-check-label" htmlFor="termsConsent">
                      I agree to the <Link to="/terms">Terms & Conditions</Link>
                    </label>
                  </div>
                </div>

                <div className="d-grid">
                  <button type="submit" className="btn btn-primary btn-lg">
                    Create Account
                  </button>
                </div>

                <p className="text-center mt-4 mb-0">
                  Already have an account? <Link to="/login">Login here</Link>
                </p>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;