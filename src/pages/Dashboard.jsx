import React, { useState, useEffect, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { ScoreContext } from '../context/ScoreContext';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Upload, FileText, ArrowUpRight } from 'lucide-react'; // Added import for icons

ChartJS.register(ArcElement, Tooltip, Legend);
const BASE_URL = 'http://localhost:8080/api/score';

const Dashboard = () => {
    const { score, setScore, scoreFactors, setScoreFactors, updateTrigger } = useContext(ScoreContext);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    // Added handler functions for demo uploads
    const handleUtilityBillDemo = () => {
        navigate('/upload-utility-bill');
    };

    const handleBankStatementDemo = () => {
        navigate('/upload-bank-statement');
    };

    // The key fix is properly using updateTrigger in the dependency array
    useEffect(() => {
        console.log('Dashboard: useEffect triggered. updateTrigger:', updateTrigger);
        console.log('Dashboard: Checking localStorage for user:', localStorage.getItem('user'));
        console.log('Dashboard: Current Score in Context:', score);

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

                if (userId) {
                    console.log('Dashboard: Fetching score for userId:', userId);
                    const response = await axios.get(`${BASE_URL}/${userId}`);
                    console.log("Dashboard: Fetched Score Data:", response.data);

                    if (response.data && response.data.score) {
                        console.log('Dashboard: Setting Score in Context:', response.data.score);
                        setScore(response.data.score);
                        //  Normalize the score factors to be within 0-100
                        const rawFactors = {
                            income: response.data.monthlyIncome ?? 0,
                            spending: response.data.grocerySpending ?? 0,
                            savings: response.data.totalSavings ?? 0,
                            loans: response.data.loanRepayment ?? 0,
                            locationConsistency: response.data.rentOrEmi ?? 0,
                            transactionHistory: response.data.utilityBills ?? 0
                        };

                        // Find a maximum value among all factors.  If all are zero, avoid dividing by zero.
                        const maxFactor = Math.max(
                            rawFactors.income,
                            rawFactors.spending,
                            rawFactors.savings,
                            rawFactors.loans,
                            rawFactors.locationConsistency,
                            rawFactors.transactionHistory
                        ) || 1;  // Ensure maxFactor is at least 1

                        const normalizedFactors = {
                            income: (rawFactors.income / maxFactor) * 100,
                            spending: (rawFactors.spending / maxFactor) * 100,
                            savings: (rawFactors.savings / maxFactor) * 100,
                            loans: (rawFactors.loans / maxFactor) * 100,
                            locationConsistency: (rawFactors.locationConsistency / maxFactor) * 100,
                            transactionHistory: (rawFactors.transactionHistory / maxFactor) * 100
                        };
                        setScoreFactors(normalizedFactors);
                    } else {
                        console.warn("Dashboard: No score data found for user. Redirecting to calculate score.");
                        navigate("/calculate-score");
                    }
                }
            } catch (error) {
                console.error("Dashboard: Error fetching score data:", error);
            } finally {
                setLoading(false);
            }
        };

        // Only fetch data if score is null (first load) or when updateTrigger changes from non-zero value
        if (score === null || updateTrigger > 0) {
            fetchScoreData();
        } else {
            setLoading(false);    // Still need to set loading to false if we skip fetching
        }

    }, [navigate, setScore, setScoreFactors, updateTrigger, score]); // Added score back, needed for conditional

    if (loading) {
        return <div className="container py-5">Loading score data...</div>;
    }

    if (!score) {
        return (
            <div className="container py-5">
                No score data found. <Link to="/calculate-score">Calculate Your Score</Link>
            </div>
        );
    }

    const getScoreCategory = (currentScore) => {
        if (currentScore >= 750) return { text: 'Excellent', color: 'primary' };
        if (currentScore >= 650) return { text: 'Good', color: 'success' };
        if (currentScore >= 500) return { text: 'Fair', color: 'warning' };
        return { text: 'Poor', color: 'danger' };
    };

    const scoreCategory = getScoreCategory(score);

    const safeScoreFactors = {
        income: scoreFactors?.income ?? 0,
        spending: scoreFactors?.spending ?? 0,
        savings: scoreFactors?.savings ?? 0,
        loans: scoreFactors?.loans ?? 0,
        locationConsistency: scoreFactors?.locationConsistency ?? 0,
        transactionHistory: scoreFactors?.transactionHistory ?? 0
    };

    const chartData = {
        labels: ['Income Stability', 'Expense Management', 'Savings Ratio', 'Debt Management', 'Location Consistency', 'Transaction History'],
        datasets: [
            {
                label: 'Score Breakdown',
                data: [
                    safeScoreFactors.income,
                    safeScoreFactors.spending,
                    safeScoreFactors.savings,
                    safeScoreFactors.loans,
                    safeScoreFactors.locationConsistency,
                    safeScoreFactors.transactionHistory
                ],
                backgroundColor: ['#3b82f6', '#16a34a', '#ca8a04', '#dc2626', '#0f766e', '#9333ea'],
                borderWidth: 1,
            },
        ],
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
                                                    legend: { display: false },
                                                    tooltip: { enabled: false }
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

                            {/* Added View Available Loans button */}
                            <div className="d-grid gap-2 mt-4">
                                <Link to="/available-loans" className="btn btn-primary">
                                    View Available Loans
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Score Factors - renamed from Score Breakdown */}
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
                                            legend: { position: 'right', labels: { boxWidth: 15, padding: 15 } }
                                        }
                                    }}
                                />
                            </div>

                            {/* Added Improve Your Score section */}
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

                {/* Added detailed Score Breakdown section */}
                <div className="col-12">
                    <div className="card shadow-sm border-0">
                        <div className="card-body p-4">
                            <h3 className="card-title mb-4">Score Breakdown</h3>
                            <div className="row">
                                <div className="col-md-6">
                                    <div className="factor-item">
                                        <div className="d-flex justify-content-between align-items-center">
                                            <h5 className="mb-0">Income Stability</h5>
                                            <span className="badge bg-primary">{safeScoreFactors.income.toFixed(0)}%</span>
                                        </div>
                                        <p className="text-muted small mb-0">Based on your reported monthly income</p>
                                    </div>

                                    <div className="factor-item">
                                        <div className="d-flex justify-content-between align-items-center">
                                            <h5 className="mb-0">Expense Management</h5>
                                            <span className="badge bg-success">{safeScoreFactors.spending.toFixed(0)}%</span>
                                        </div>
                                        <p className="text-muted small mb-0">Based on your income to expense ratio</p>
                                    </div>

                                    <div className="factor-item">
                                        <div className="d-flex justify-content-between align-items-center">
                                            <h5 className="mb-0">Savings Ratio</h5>
                                            <span className="badge bg-warning">{safeScoreFactors.savings.toFixed(0)}%</span>
                                        </div>
                                        <p className="text-muted small mb-0">Based on your savings as percentage of income</p>
                                    </div>
                                </div>

                                <div className="col-md-6">
                                    <div className="factor-item">
                                        <div className="d-flex justify-content-between align-items-center">
                                            <h5 className="mb-0">Debt Management</h5>
                                            <span className="badge bg-danger">{safeScoreFactors.loans.toFixed(0)}%</span>
                                        </div>
                                        <p className="text-muted small mb-0">Based on your debt burden ratio</p>
                                    </div>

                                    <div className="factor-item">
                                        <div className="d-flex justify-content-between align-items-center">
                                            <h5 className="mb-0">Location Consistency</h5>
                                            <span className="badge bg-secondary">{safeScoreFactors.locationConsistency.toFixed(0)}%</span>
                                        </div>
                                        <p className="text-muted small mb-0">
                                            Based on utility bill verification
                                            {safeScoreFactors.locationConsistency === 0 && (
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
                                            <span className="badge bg-secondary">{safeScoreFactors.transactionHistory.toFixed(0)}%</span>
                                        </div>
                                        <p className="text-muted small mb-0">
                                            Based on bank statement analysis
                                            {safeScoreFactors.transactionHistory === 0 && (
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
