import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Phone, Lock } from 'lucide-react';
import axios from 'axios';

const BASE_URL = 'http://localhost:8080/api/auth'; // Backend API URL

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    phone: '',
    password: ''
  });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.phone || !formData.password) {
      setError('Please fill in all fields');
      return;
    }

    if (formData.phone.length !== 10) {
      setError('Phone number must be 10 digits');
      return;
    }

    try {
      const response = await axios.post(`${BASE_URL}/login`, {
        phone: formData.phone,
        password: formData.password
      });

      if (response.data) {
        localStorage.setItem('user', JSON.stringify(response.data)); // Store user session
        navigate('/dashboard'); // Redirect after login
      }
    } catch (err) {
      setError(err.response?.data || 'Login failed. Please try again.');
    }
  };

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-6 col-lg-5">
          <div className="card border-0 shadow-sm">
            <div className="card-body p-4">
              <div className="text-center mb-4">
                <h2 className="fw-bold mb-1">Welcome Back</h2>
                <p className="text-muted">Login to access your account</p>
              </div>

              {error && (
                <div className="alert alert-danger" role="alert">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit}>
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

                <div className="mb-4">
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
                      placeholder="Enter your password"
                      required
                    />
                  </div>
                </div>

                <div className="d-grid">
                  <button type="submit" className="btn btn-primary btn-lg">
                    Login
                  </button>
                </div>

                <p className="text-center mt-4 mb-0">
                  Don't have an account? <Link to="/register">Register here</Link>
                </p>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;