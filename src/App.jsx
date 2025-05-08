import React, { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/common/Header';
import Footer from './components/common/Footer';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import CalculateScore from './pages/CalculateScore';
import Dashboard from './pages/Dashboard';
import UtilityBillUpload from './pages/UtilityBillUpload';
import BankStatementUpload from './pages/BankStatementUpload';
import AvailableLoans from './pages/AvailableLoans';
import LoanCalculator from './pages/LoanCalculator';
import LoanApplication from './pages/LoanApplication';
import { ScoreContext } from './context/ScoreContext';

function App() {
    const [score, setScore] = useState(null);
    const [scoreFactors, setScoreFactors] = useState({
        income: 0,
        spending: 0,
        savings: 0,
        bills: 0,
        rent: 0,
        medical: 0,
        transport: 0,
        loans: 0,
        locationConsistency: 0,
        transactionHistory: 0
    });
    const [updateTrigger, setUpdateTrigger] = useState(false);

    const triggerUpdate = () => {
        setUpdateTrigger(prev => !prev);
    };

    // Check if user is logged in
    const isAuthenticated = () => {
        return localStorage.getItem('user') !== null;
    };

    // Protected Route component
    const ProtectedRoute = ({ children }) => {
        if (!isAuthenticated()) {
            return <Navigate to="/login" />;
        }
        return children;
    };

    return (
        <ScoreContext.Provider value={{ score, setScore, scoreFactors, setScoreFactors, triggerUpdate }}>
            <div className="d-flex flex-column min-vh-100">
                <Header />
                <main className="flex-grow-1">
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<Register />} />
                        <Route path="/calculate-score" element={
                            <ProtectedRoute>
                                <CalculateScore />
                            </ProtectedRoute>
                        } />
                        <Route path="/dashboard" element={
                            <ProtectedRoute>
                                <Dashboard />
                            </ProtectedRoute>
                        } />
                        <Route path="/upload-utility-bill" element={
                            <ProtectedRoute>
                                <UtilityBillUpload />
                            </ProtectedRoute>
                        } />
                        <Route path="/upload-bank-statement" element={
                            <ProtectedRoute>
                                <BankStatementUpload />
                            </ProtectedRoute>
                        } />
                        <Route path="/available-loans" element={
                            <ProtectedRoute>
                                <AvailableLoans />
                            </ProtectedRoute>
                        } />
                        <Route path="/loan-calculator" element={
                            <ProtectedRoute>
                                <LoanCalculator />
                            </ProtectedRoute>
                        } />
                        <Route path="/loan-application/:id" element={
                            <ProtectedRoute>
                                <LoanApplication />
                            </ProtectedRoute>
                        } />
                    </Routes>
                </main>
                <Footer />
            </div>
        </ScoreContext.Provider>
    );
}

export default App;
