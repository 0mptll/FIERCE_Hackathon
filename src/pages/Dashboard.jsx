// import { useState, useEffect, useContext } from 'react';
// import { useNavigate, Link } from 'react-router-dom';
// import axios from 'axios';

// import { ScoreContext } from '../context/ScoreContext';

// import { Doughnut } from 'react-chartjs-2';

// import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
// ChartJS.register(ArcElement, Tooltip, Legend);
// const BASE_URL = 'http://localhost:8080/api/score';

// const Dashboard = () => {
//     const { score, setScore, scoreFactors, setScoreFactors } = useContext(ScoreContext);
//     const [loading, setLoading] = useState(true);
//     const navigate = useNavigate();

//     useEffect(() => {
//         console.log('Checking localStorage for user:', localStorage.getItem('user')); // ADD THIS LINE
//         const fetchScoreData = async () => {
//             try {
//                 // Retrieve user data from localStorage
//                 const storedUser = localStorage.getItem('user');
//                 let userId;

//                 if (storedUser) {
//                     const user = JSON.parse(storedUser);
//                     userId = user.id; // Assuming your backend returns the user ID as 'id'
//                     if (!userId) {
//                         console.warn("User ID not found in local storage. Redirecting to login.");
//                         navigate('/login'); // Redirect to login if no user ID
//                         return;
//                     }
//                 } else {
//                     console.warn("No user logged in. Redirecting to login.");
//                     navigate('/login'); // Redirect to login if no user data
//                     return;
//                 }

//                 if (userId && !score) {
//                     const response = await axios.get(`${BASE_URL}/${userId}`);
//                     console.log("Fetched Score Data:", response.data);

//                     if (response.data && response.data.score) {
//                         setScore(response.data.score);
//                         setScoreFactors({
//                             income: response.data.monthlyIncome ?? 0,
//                             spending: response.data.grocerySpending ?? 0,
//                             savings: response.data.totalSavings ?? 0,
//                             loans: response.data.loanRepayment ?? 0,
//                             locationConsistency: response.data.rentOrEmi ?? 0,
//                             transactionHistory: response.data.utilityBills ?? 0
//                         });
//                     } else {
//                         console.warn("No score data found for user. Redirecting to calculate score.");
//                         navigate("/calculate-score");
//                     }
//                 }
//             } catch (error) {
//                 console.error("Error fetching score data:", error);
//                 // Optionally handle specific error scenarios (e.g., network issues)
//             } finally {
//                 setLoading(false);
//             }
//         };

//         fetchScoreData();
//     }, [navigate, score, setScore, setScoreFactors]);
//     if (loading) {
//         return <div className="container py-5">Loading score data...</div>;
//     }

//     if (!score) {
//         return (
//             <div className="container py-5">
//                 No score data found. <Link to="/calculate-score">Calculate Your Score</Link>
//             </div>
//         );
//     }

//     const getScoreCategory = (score) => {
//         if (score >= 750) return { text: 'Excellent', color: 'primary' };
//         if (score >= 650) return { text: 'Good', color: 'success' };
//         if (score >= 500) return { text: 'Fair', color: 'warning' };
//         return { text: 'Poor', color: 'danger' };
//     };

//     const scoreCategory = getScoreCategory(score);

//     const safeScoreFactors = {
//         income: scoreFactors?.income ?? 0,
//         spending: scoreFactors?.spending ?? 0,
//         savings: scoreFactors?.savings ?? 0,
//         loans: scoreFactors?.loans ?? 0,
//         locationConsistency: scoreFactors?.locationConsistency ?? 0,
//         transactionHistory: scoreFactors?.transactionHistory ?? 0
//     };

//     const chartData = {
//         labels: ['Income Stability', 'Expense Management', 'Savings Ratio', 'Debt Management', 'Location Consistency', 'Transaction History'],
//         datasets: [
//             {
//                 label: 'Score Breakdown',
//                 data: [
//                     safeScoreFactors.income,
//                     safeScoreFactors.spending,
//                     safeScoreFactors.savings,
//                     safeScoreFactors.loans,
//                     safeScoreFactors.locationConsistency,
//                     safeScoreFactors.transactionHistory
//                 ],
//                 backgroundColor: ['#3b82f6', '#16a34a', '#ca8a04', '#dc2626', '#0f766e', '#9333ea'],
//                 borderWidth: 1,
//             },
//         ],
//     };

//     return (
//         <div className="container py-5">
//             <h2 className="mb-4">Your Financial Dashboard</h2>

//             <div className="row g-4">
//                 {/* Score Overview */}
//                 <div className="col-lg-6">
//                     <div className="card shadow-sm border-0 score-card h-100">
//                         <div className="card-body p-4">
//                             <h3 className="card-title mb-4">Your Credit Score</h3>
//                             <div className="text-center mb-4">
//                                 <div className="d-inline-block position-relative">
//                                     <div style={{ width: '200px', height: '200px' }}>
//                                         <Doughnut
//                                             data={{
//                                                 datasets: [
//                                                     {
//                                                         data: [score, 900 - score],
//                                                         backgroundColor: [`var(--${scoreCategory.color}-color)`, '#e2e8f0'],
//                                                         borderWidth: 0,
//                                                         cutout: '80%'
//                                                     },
//                                                 ],
//                                             }}
//                                             options={{
//                                                 responsive: true,
//                                                 maintainAspectRatio: true,
//                                                 plugins: {
//                                                     legend: { display: false },
//                                                     tooltip: { enabled: false }
//                                                 }
//                                             }}
//                                         />
//                                     </div>
//                                     <div className="position-absolute top-50 start-50 translate-middle text-center">
//                                         <h2 className={`mb-0 fw-bold text-${scoreCategory.color}`}>{score}</h2>
//                                         <p className="mb-0">{scoreCategory.text}</p>
//                                     </div>
//                                 </div>
//                             </div>

//                             <div className="row text-center g-3">
//                                 <div className="col-6">
//                                     <div className="p-3 bg-light rounded">
//                                         <h6>Score Range</h6>
//                                         <p className="mb-0">300 - 900</p>
//                                     </div>
//                                 </div>
//                                 <div className="col-6">
//                                     <div className="p-3 bg-light rounded">
//                                         <h6>Category</h6>
//                                         <p className={`mb-0 text-${scoreCategory.color}`}>{scoreCategory.text}</p>
//                                     </div>
//                                 </div>
//                             </div>
//                         </div>
//                     </div>
//                 </div>

//                 {/* Score Breakdown */}
//                 <div className="col-lg-6">
//                     <div className="card shadow-sm border-0 score-card h-100">
//                         <div className="card-body p-4">
//                             <h3 className="card-title mb-4">Score Breakdown</h3>
//                             <div style={{ height: '250px' }}>
//                                 <Doughnut
//                                     data={chartData}
//                                     options={{
//                                         responsive: true,
//                                         maintainAspectRatio: false,
//                                         plugins: {
//                                             legend: { position: 'right', labels: { boxWidth: 15, padding: 15 } }
//                                         }
//                                     }}
//                                 />
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default Dashboard;

import { useState, useEffect, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { ScoreContext } from '../context/ScoreContext';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);
const BASE_URL = 'http://localhost:8080/api/score';

const Dashboard = () => {
    const { score, setScore, scoreFactors, setScoreFactors, updateTrigger } = useContext(ScoreContext); // Get updateTrigger
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        console.log('Dashboard: Checking localStorage for user:', localStorage.getItem('user'));
        console.log('Dashboard: Current Score in Context:', score); // Check current context score

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
                        setScoreFactors({
                            income: response.data.monthlyIncome ?? 0,
                            spending: response.data.grocerySpending ?? 0,
                            savings: response.data.totalSavings ?? 0,
                            loans: response.data.loanRepayment ?? 0,
                            locationConsistency: response.data.rentOrEmi ?? 0,
                            transactionHistory: response.data.utilityBills ?? 0
                        });
                    } else {
                        console.warn("Dashboard: No score data found for user. Redirecting to calculate score.");
                        navigate("/calculate-score");
                    }
                }
            } catch (error) {
                console.error("Dashboard: Error fetching score data:", error);
                // Optionally handle specific error scenarios
            } finally {
                setLoading(false);
            }
        };

        // Fetch data if score is not already available in the context on mount
        if (!score) {
            console.log('Dashboard: Score not in context on mount, fetching...');
            fetchScoreData();
        } else {
            console.log('Dashboard: Score already in context:', score);
            setLoading(false); // If score is already present, no need to load
        }
    }, [navigate, score,updateTrigger, setScore, setScoreFactors]);

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
                    </div>
                </div>

                {/* Score Breakdown */}
                <div className="col-lg-6">
                    <div className="card shadow-sm border-0 score-card h-100">
                        <div className="card-body p-4">
                            <h3 className="card-title mb-4">Score Breakdown</h3>
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
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;