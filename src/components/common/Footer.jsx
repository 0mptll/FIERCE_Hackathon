import React from 'react';
import { Link } from 'react-router-dom';
import { TrendingUp, PhoneCall, Mail, MapPin } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-dark text-white py-4 mt-5">
      <div className="container">
        <div className="row g-4">
          <div className="col-lg-4">
            <div className="d-flex align-items-center mb-3">
              <TrendingUp size={24} className="me-2 text-primary" />
              <h5 className="mb-0">FIERCE Finance</h5>
            </div>
            <p className="text-muted">
              Empowering rural and informal workers with access to formal credit through innovative AI-based financial scoring.
            </p>
          </div>
          
          <div className="col-lg-2 col-md-4">
            <h6 className="mb-3">Quick Links</h6>
            <ul className="list-unstyled">
              <li className="mb-2"><Link to="/" className="text-decoration-none text-muted">Home</Link></li>
              <li className="mb-2"><Link to="/calculate-score" className="text-decoration-none text-muted">Calculate Score</Link></li>
              <li className="mb-2"><Link to="/dashboard" className="text-decoration-none text-muted">Dashboard</Link></li>
              <li className="mb-2"><Link to="/available-loans" className="text-decoration-none text-muted">Loans</Link></li>
            </ul>
          </div>
          
          <div className="col-lg-3 col-md-4">
            <h6 className="mb-3">Resources</h6>
            <ul className="list-unstyled">
              <li className="mb-2"><a href="#" className="text-decoration-none text-muted">How Scoring Works</a></li>
              <li className="mb-2"><a href="#" className="text-decoration-none text-muted">Improve Your Score</a></li>
              <li className="mb-2"><a href="#" className="text-decoration-none text-muted">Privacy Policy</a></li>
              <li className="mb-2"><a href="#" className="text-decoration-none text-muted">Terms of Service</a></li>
            </ul>
          </div>
          
          <div className="col-lg-3 col-md-4">
            <h6 className="mb-3">Contact Us</h6>
            <ul className="list-unstyled">
              <li className="mb-2 d-flex align-items-center">
                <PhoneCall size={16} className="me-2" /> 
                <span className="text-muted">+91 1234 567 890</span>
              </li>
              <li className="mb-2 d-flex align-items-center">
                <Mail size={16} className="me-2" /> 
                <span className="text-muted">contact@fiercefinance.in</span>
              </li>
              <li className="d-flex align-items-center">
                <MapPin size={16} className="me-2" /> 
                <span className="text-muted">New Delhi, India</span>
              </li>
            </ul>
          </div>
        </div>
        
        <hr className="my-4 border-secondary" />
        
        <div className="text-center text-muted">
          <small>&copy; {new Date().getFullYear()} FIERCE Finance. All rights reserved.</small>
        </div>
      </div>
    </footer>
  );
};

export default Footer;