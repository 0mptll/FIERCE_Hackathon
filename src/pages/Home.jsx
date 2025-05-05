import React from 'react';
import { Link } from 'react-router-dom';
import { TrendingUp, BarChart4, FileText, CreditCard } from 'lucide-react';

const Home = () => {
  return (
    <>
      <section className="hero-section">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-6">
              <h1 className="display-5 fw-bold mb-3">Financial Inclusion for Rural Workers</h1>
              <p className="fs-5 mb-4">
                Get access to formal credit based on your financial behavior, even if you don't have a traditional credit history.
              </p>
              <div className="d-grid gap-2 d-md-flex">
                <Link to="/calculate-score" className="btn btn-light btn-lg px-4 me-md-2">
                  Calculate Your Score
                </Link>
                <a href="#how-it-works" className="btn btn-outline-light btn-lg px-4">
                  Learn More
                </a>
              </div>
            </div>
            <div className="col-lg-6 d-none d-lg-block">
              <img 
                src="https://images.pexels.com/photos/6694543/pexels-photo-6694543.jpeg" 
                alt="Rural workers using mobile banking" 
                className="img-fluid rounded-3 shadow-lg" 
              />
            </div>
          </div>
        </div>
      </section>

      <section className="py-5" id="how-it-works">
        <div className="container">
          <div className="text-center mb-5">
            <h2 className="fw-bold">How It Works</h2>
            <p className="text-muted">Our AI-powered system evaluates your financial behavior to create a credit score</p>
          </div>
          
          <div className="row g-4">
            <div className="col-md-4">
              <div className="card h-100 border-0 shadow-sm">
                <div className="card-body text-center p-4">
                  <div className="rounded-circle bg-primary bg-opacity-10 p-3 d-inline-flex mb-3">
                    <TrendingUp size={32} className="text-primary" />
                  </div>
                  <h4 className="card-title">Calculate Your Score</h4>
                  <p className="card-text text-muted">
                    Answer a few questions about your income, expenses, and savings to generate your initial score.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="col-md-4">
              <div className="card h-100 border-0 shadow-sm">
                <div className="card-body text-center p-4">
                  <div className="rounded-circle bg-success bg-opacity-10 p-3 d-inline-flex mb-3">
                    <FileText size={32} className="text-success" />
                  </div>
                  <h4 className="card-title">Improve Your Score</h4>
                  <p className="card-text text-muted">
                    Upload utility bills and bank statements to enhance your financial profile and increase your score.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="col-md-4">
              <div className="card h-100 border-0 shadow-sm">
                <div className="card-body text-center p-4">
                  <div className="rounded-circle bg-warning bg-opacity-10 p-3 d-inline-flex mb-3">
                    <CreditCard size={32} className="text-warning" />
                  </div>
                  <h4 className="card-title">Access Loans</h4>
                  <p className="card-text text-muted">
                    Get matched with lenders who offer credit based on your score, with better rates for higher scores.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      <section className="py-5 bg-light">
        <div className="container">
          <div className="row align-items-center g-5">
            <div className="col-lg-6">
              <h2 className="fw-bold mb-4">Benefits of FIERCE Finance</h2>
              <div className="d-flex mb-3">
                <div className="me-3">
                  <div className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center" style={{ width: '40px', height: '40px' }}>1</div>
                </div>
                <div>
                  <h5>Financial Inclusion</h5>
                  <p className="text-muted">Access to formal credit for those without traditional credit history</p>
                </div>
              </div>
              <div className="d-flex mb-3">
                <div className="me-3">
                  <div className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center" style={{ width: '40px', height: '40px' }}>2</div>
                </div>
                <div>
                  <h5>Fair Evaluation</h5>
                  <p className="text-muted">Score based on actual financial behavior, not just formal credit history</p>
                </div>
              </div>
              <div className="d-flex mb-3">
                <div className="me-3">
                  <div className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center" style={{ width: '40px', height: '40px' }}>3</div>
                </div>
                <div>
                  <h5>Better Loan Terms</h5>
                  <p className="text-muted">Higher scores unlock better interest rates and loan options</p>
                </div>
              </div>
            </div>
            <div className="col-lg-6">
              <div className="card border-0 shadow">
                <div className="card-body p-4">
                  <h3 className="card-title mb-4">Score Range</h3>
                  <div className="mb-4">
                    <div className="d-flex justify-content-between mb-1">
                      <span>Very Poor</span>
                      <span>300-499</span>
                    </div>
                    <div className="progress" style={{ height: '10px' }}>
                      <div className="progress-bar bg-danger" style={{ width: '25%' }}></div>
                    </div>
                  </div>
                  <div className="mb-4">
                    <div className="d-flex justify-content-between mb-1">
                      <span>Fair</span>
                      <span>500-649</span>
                    </div>
                    <div className="progress" style={{ height: '10px' }}>
                      <div className="progress-bar bg-warning" style={{ width: '25%' }}></div>
                    </div>
                  </div>
                  <div className="mb-4">
                    <div className="d-flex justify-content-between mb-1">
                      <span>Good</span>
                      <span>650-749</span>
                    </div>
                    <div className="progress" style={{ height: '10px' }}>
                      <div className="progress-bar bg-success" style={{ width: '25%' }}></div>
                    </div>
                  </div>
                  <div className="mb-4">
                    <div className="d-flex justify-content-between mb-1">
                      <span>Excellent</span>
                      <span>750-900</span>
                    </div>
                    <div className="progress" style={{ height: '10px' }}>
                      <div className="progress-bar bg-primary" style={{ width: '25%' }}></div>
                    </div>
                  </div>
                  <div className="d-grid">
                    <Link to="/calculate-score" className="btn btn-primary">
                      Calculate Your Score Now
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Home;