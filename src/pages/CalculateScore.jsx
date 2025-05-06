import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { ScoreContext } from '../context/ScoreContext';
import axios from 'axios';

const BASE_URL = 'http://localhost:8080/api/score'; // Updated backend route

const CalculateScore = () => {
    const navigate = useNavigate();
    const { setScore, setScoreFactors } = useContext(ScoreContext);
    const userId = 1;  // Replace with actual user ID

    const [formData, setFormData] = useState({
        monthlyIncome: '',
        grocerySpending: '',
        utilityBills: '',
        totalSavings: '',
        rentEmi: '',
        medicalExpenses: '',
        transportationCost: '',
        loanRepayment: ''
    });

    const [score, setLocalScore] = useState(300);  // Base score starts at 300
    const [category, setCategory] = useState('');
    const [error, setError] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: Number(value)
        }));
    };

    const calculateMLScore = async () => {
        try {
            console.log("Sending request to ML API at: http://localhost:5001/predict");
            console.log("Request Data:", formData);

            const mlResponse = await axios.post("http://localhost:5001/predict", formData, {
                headers: { 'Content-Type': 'application/json' }
            });

            if (mlResponse.data) {
                console.log("ML API Response:", mlResponse.data);

                const category = mlResponse.data.credit_rating;  // Extract category from ML response
                setCategory(category);

                let adjustedScore = 300;
                switch (category) {
                    case "Excellent":
                        adjustedScore += 10;
                        break;
                    case "Good":
                        adjustedScore += 5;
                        break;
                    case "Bad":
                        adjustedScore -= 5;
                        break;
                    case "Very Poor":
                        adjustedScore -= 10;
                        break;
                }
                adjustedScore = Math.max(adjustedScore, 300); // Ensure score doesn't drop below 300

                setLocalScore(adjustedScore);
                setScore(adjustedScore);
                setScoreFactors({ category });

                console.log("Updated Score:", adjustedScore);

                // **Send Data to Backend for Storage**
                console.log("Sending final data to backend:", { ...formData, category });

                const backendResponse = await axios.post(`${BASE_URL}/calculate/${userId}`, {
                    monthly_income: formData.monthlyIncome,
                    grocery_spending: formData.grocerySpending,
                    utility_bills: formData.utilityBills,
                    savings: formData.totalSavings,
                    rent_or_emi: formData.rentEmi,
                    medical_expense: formData.medicalExpenses,
                    transport: formData.transportationCost,
                    loan_repayment: formData.loanRepayment,
                    category: category
                });

                console.log("Stored in Backend:", backendResponse.data);

                navigate('/dashboard');  // Redirect after calculation
            }
        } catch (err) {
            console.error("Error fetching ML category or storing data:", err);
            setError(err.response?.data?.error || 'Error calculating ML score');
        }
    };

    return (
        <div className="container py-5">
            <div className="row justify-content-center">
                <div className="col-md-8">
                    <div className="card shadow-sm border-0">
                        <div className="card-body p-4">
                            <h2 className="mb-4 text-center">Calculate Your Financial Score</h2>

                            {error && <div className="alert alert-danger">{error}</div>}
                            {score && (
                                <div className="alert alert-success">
                                    Updated Score: {score} ({category})
                                </div>
                            )}

                            <form>
                                {Object.keys(formData).map((key, index) => (
                                    <div className="mb-3" key={index}>
                                        <label className="form-label">{key.replace(/([A-Z])/g, " $1").trim()} (INR)</label>
                                        <input
                                            type="number"
                                            className="form-control"
                                            name={key}
                                            value={formData[key]}
                                            onChange={handleChange}
                                            min="0"
                                        />
                                    </div>
                                ))}

                                <div className="d-grid mt-4">
                                    <button type="button" className="btn btn-primary btn-lg" onClick={calculateMLScore}>
                                        Get ML Score
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CalculateScore;