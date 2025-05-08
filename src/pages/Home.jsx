import React, { useContext, useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ScoreContext } from '../context/ScoreContext';

import { TrendingUp, BarChart4, FileText, CreditCard, LineChart, Clock, BarChart2, Award } from 'lucide-react';
import axios from 'axios'; 

const BASE_URL = 'http://localhost:8080/api/score';

const Home = () => {
    const { score, setScore, scoreFactors, setScoreFactors, updateTrigger } = useContext(ScoreContext);
    const navigate = useNavigate();
 
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
        //   generateLoanOffers(response.data.score);
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
    //   generateLoanOffers(score);
    }
 
  }, [score, updateTrigger, navigate, setScore, setScoreFactors]);
  
  return (
    <>
      <section className="hero-section">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-6">
              <h1 className="display-5 fw-bold mb-3">Financial Inclusion for Rural & Casual Earners</h1>
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

      {/* New Section: The Power of Compounding */}
      <section className="py-5 bg-gradient-primary text-white" style={{background: 'linear-gradient(135deg, #4a88eb 0%, #1e4db7 100%)'}}>
        <div className="container">
          <div className="text-center mb-5">
            <h2 className="fw-bold">The Power of Compounding Your Financial Trust</h2>
            <p className="lead">Small consistent steps lead to exponential growth in your financial opportunities</p>
          </div>
          
          <div className="row g-4">
            <div className="col-lg-6">
              <div className="card bg-white text-dark h-100 border-0 shadow">
                <div className="card-body p-4">
                  <h3 className="card-title text-primary mb-4">Watch Your Score Grow Over Time</h3>
                  
                  <div className="chart-container position-relative" style={{height: '250px'}}>
                    {/* This would be better with an actual chart library like Chart.js, but for now using styled divs */}
                    <div className="position-relative h-100">
                      <div className="d-flex justify-content-between text-muted mb-2">
                        <span>Month 1</span>
                        <span>Month 6</span>
                        <span>Month 12</span>
                      </div>
                      <div className="progress-stacked" style={{height: '40px', backgroundColor: '#f0f0f0', borderRadius: '8px', overflow: 'hidden'}}>
                        <div className="progress-bar bg-danger" role="progressbar" style={{width: '100%', height: '40px', clipPath: 'polygon(0 0, 100% 0, 85% 100%, 0% 100%)'}} aria-valuenow="25" aria-valuemin="0" aria-valuemax="100"></div>
                        <div className="progress-bar bg-warning" role="progressbar" style={{width: '85%', height: '40px', clipPath: 'polygon(0 0, 100% 0, 75% 100%, 0% 100%)'}} aria-valuenow="50" aria-valuemin="0" aria-valuemax="100"></div>
                        <div className="progress-bar bg-success" role="progressbar" style={{width: '60%', height: '40px', clipPath: 'polygon(0 0, 100% 0, 65% 100%, 0% 100%)'}} aria-valuenow="75" aria-valuemin="0" aria-valuemax="100"></div>
                        <div className="progress-bar bg-primary" role="progressbar" style={{width: '40%', height: '40px'}} aria-valuenow="100" aria-valuemin="0" aria-valuemax="100"></div>
                      </div>
                      
                      <div className="d-flex justify-content-between mt-3">
                        <div className="text-center">
                          <div className="badge bg-danger p-2 mb-1">500</div>
                          <div className="small">Starting Score</div>
                        </div>
                        <div className="text-center">
                          <div className="badge bg-warning p-2 mb-1">620</div>
                          <div className="small">After 3 Months</div>
                        </div>
                        <div className="text-center">
                          <div className="badge bg-success p-2 mb-1">710</div>
                          <div className="small">After 6 Months</div>
                        </div>
                        <div className="text-center">
                          <div className="badge bg-primary p-2 mb-1">800+</div>
                          <div className="small">After 12 Months</div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="alert alert-info mt-4">
                    <strong>Trust the process!</strong> Regular monthly updates compound your score growth over time.
                  </div>
                </div>
              </div>
            </div>
            
            <div className="col-lg-6">
              <div className="card bg-white text-dark h-100 border-0 shadow">
                <div className="card-body p-4">
                  <h3 className="card-title text-primary mb-4">Benefits That Compound Over Time</h3>
                  
                  <div className="timeline">
                    <div className="d-flex mb-4">
                      <div className="me-3">
                        <div className="rounded-circle bg-danger text-white d-flex align-items-center justify-content-center" style={{width: '45px', height: '45px'}}>
                          <Clock size={24} />
                        </div>
                      </div>
                      <div>
                        <h5 className="mb-1">Month 1-3: Building Foundation</h5>
                        <p className="text-muted mb-0">Start with basic loans, establish payment history, and upload monthly statements to build your initial score.</p>
                      </div>
                    </div>
                    
                    <div className="d-flex mb-4">
                      <div className="me-3">
                        <div className="rounded-circle bg-warning text-white d-flex align-items-center justify-content-center" style={{width: '45px', height: '45px'}}>
                          <LineChart size={24} />
                        </div>
                      </div>
                      <div>
                        <h5 className="mb-1">Month 4-6: Growing Access</h5>
                        <p className="text-muted mb-0">Access higher credit limits, reduced interest rates, and specialized financial products as your score improves.</p>
                      </div>
                    </div>
                    
                    <div className="d-flex mb-4">
                      <div className="me-3">
                        <div className="rounded-circle bg-success text-white d-flex align-items-center justify-content-center" style={{width: '45px', height: '45px'}}>
                          <TrendingUp size={24} />
                        </div>
                      </div>
                      <div>
                        <h5 className="mb-1">Month 7-9: Accelerated Growth</h5>
                        <p className="text-muted mb-0">Enjoy premium banking services, priority processing, and exclusive financial opportunities reserved for reliable borrowers.</p>
                      </div>
                    </div>
                    
                    <div className="d-flex">
                      <div className="me-3">
                        <div className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center" style={{width: '45px', height: '45px'}}>
                          <Award size={24} />
                        </div>
                      </div>
                      <div>
                        <h5 className="mb-1">Month 10+: Financial Freedom</h5>
                        <p className="text-muted mb-0">Unlock premium investment opportunities, lowest possible interest rates, and become eligible for high-value business loans.</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="d-grid mt-4">
                    <Link to="/update-profile" className="btn btn-primary btn-lg">Start Your Compounding Journey Today</Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="text-center mt-5">
            <h4 className="mb-3">Why Monthly Updates Matter</h4>
            <p className="lead mb-4">Just like compound interest grows your money, consistent information updates compound your credit worthiness.</p>
            
            <div className="row g-4 justify-content-center">
              <div className="col-md-4">
                <div className="card bg-white bg-opacity-10 border-0 h-100 text-center p-4">
                  <div className="card-body">
                    <div className="display-4 text-warning mb-3">+10%</div>
                    <h5 className="card-title">Monthly Consistency</h5>
                    <p className="card-text">Regular monthly updates can boost your score by up to 10% faster than sporadic updates.</p>
                  </div>
                </div>
              </div>
              
              <div className="col-md-4">
                <div className="card bg-white bg-opacity-10 border-0 h-100 text-center p-4">
                  <div className="card-body">
                    <div className="display-4 text-warning mb-3">3x</div>
                    <h5 className="card-title">Opportunity Growth</h5>
                    <p className="card-text">Users who update monthly see 3x more loan offers than those who update quarterly.</p>
                  </div>
                </div>
              </div>
              
              <div className="col-md-4">
                <div className="card bg-white bg-opacity-10 border-0 h-100 text-center p-4">
                  <div className="card-body">
                    <div className="display-4 text-warning mb-3">-5%</div>
                    <h5 className="card-title">Interest Reduction</h5>
                    <p className="card-text">Every 50 point increase in your score can reduce interest rates by up to 5% on new loans.</p>
                  </div>
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
      
      {/* New Testimonial Section showing compounding success */}
      <section className="py-5">
        <div className="container">
          <div className="text-center mb-5">
            <h2 className="fw-bold">Success Stories: The Compounding Effect</h2>
            <p className="text-muted">See how our users transformed their financial access through consistent participation</p>
          </div>
          
          <div className="row g-4">
            <div className="col-md-4">
              <div className="card h-100 border-0 shadow-sm">
                <div className="card-body p-4">
                  <div className="mb-3">
                    <span className="badge bg-success mb-2">Rural Entrepreneur</span>
                    <h5 className="card-title">Rajesh K.</h5>
                    <div className="small text-muted mb-3">Started with score: 490 → Current score: 780</div>
                  </div>
                  <p className="card-text">
                    "I couldn't qualify for a business loan through traditional banks. After 8 months of consistent updates with FIERCE Finance, I secured funding for my dairy farm expansion at rates I never thought possible!"
                  </p>
                  <div className="d-flex align-items-center mt-4">
                    <div className="me-3">
                      <small className="text-muted">Timeline:</small>
                    </div>
                    <div className="progress flex-grow-1" style={{ height: '5px' }}>
                      <div className="progress-bar bg-danger" style={{ width: '20%' }}></div>
                      <div className="progress-bar bg-warning" style={{ width: '30%' }}></div>
                      <div className="progress-bar bg-success" style={{ width: '50%' }}></div>
                    </div>
                  </div>
                  <div className="d-flex justify-content-between mt-1">
                    <small>Month 1</small>
                    <small>Month 4</small>
                    <small>Month 8</small>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="col-md-4">
              <div className="card h-100 border-0 shadow-sm">
                <div className="card-body p-4">
                  <div className="mb-3">
                    <span className="badge bg-primary mb-2">Seasonal Worker</span>
                    <h5 className="card-title">Meena S.</h5>
                    <div className="small text-muted mb-3">Started with score: 520 → Current score: 750</div>
                  </div>
                  <p className="card-text">
                    "As a seasonal agricultural worker, banks wouldn't even talk to me. By updating my financial information monthly, I built a score that got me a home loan after just 6 months of consistent reporting!"
                  </p>
                  <div className="d-flex align-items-center mt-4">
                    <div className="me-3">
                      <small className="text-muted">Timeline:</small>
                    </div>
                    <div className="progress flex-grow-1" style={{ height: '5px' }}>
                      <div className="progress-bar bg-warning" style={{ width: '30%' }}></div>
                      <div className="progress-bar bg-success" style={{ width: '30%' }}></div>
                      <div className="progress-bar bg-primary" style={{ width: '40%' }}></div>
                    </div>
                  </div>
                  <div className="d-flex justify-content-between mt-1">
                    <small>Month 1</small>
                    <small>Month 3</small>
                    <small>Month 6</small>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="col-md-4">
              <div className="card h-100 border-0 shadow-sm">
                <div className="card-body p-4">
                  <div className="mb-3">
                    <span className="badge bg-warning mb-2">Small Business Owner</span>
                    <h5 className="card-title">Priya T.</h5>
                    <div className="small text-muted mb-3">Started with score: 580 → Current score: 820</div>
                  </div>
                  <p className="card-text">
                    "Each monthly update compounded my credibility. After a year, my score went from 'risky' to 'excellent'. Now I have multiple banks competing to offer me business expansion loans!"
                  </p>
                  <div className="d-flex align-items-center mt-4">
                    <div className="me-3">
                      <small className="text-muted">Timeline:</small>
                    </div>
                    <div className="progress flex-grow-1" style={{ height: '5px' }}>
                      <div className="progress-bar bg-warning" style={{ width: '20%' }}></div>
                      <div className="progress-bar bg-success" style={{ width: '40%' }}></div>
                      <div className="progress-bar bg-primary" style={{ width: '40%' }}></div>
                    </div>
                  </div>
                  <div className="d-flex justify-content-between mt-1">
                    <small>Month 1</small>
                    <small>Month 6</small>
                    <small>Month 12</small>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="text-center mt-5">
            <Link to="/calculate-score" className="btn btn-lg btn-outline-primary">Join Their Success Journey Today</Link>
          </div>
        </div>
      </section>
    </>
  );
};

export default Home;