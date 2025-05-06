import axios from 'axios';

const BASE_URL = 'http://localhost:8080/api/auth';

// User login with phone and password
export const login = async (phone, password) => {
    try {
        const response = await axios.post(`${BASE_URL}/login`, { phone, password });
        
        if (response.data) {
            localStorage.setItem("phone", phone);
            localStorage.setItem("password", password);
            return response.data;
        } else {
            throw new Error('Invalid phone number or password');
        }
    } catch (error) {
        console.error('Login Error:', error.response?.data || error.message);
        throw error;
    }
};

// User registration
export const register = async (userData) => {
    try {
        const response = await axios.post(`${BASE_URL}/register`, userData, {
            headers: {
                'Content-Type': 'application/json',
            },
        });
        
        return response.data;
    } catch (error) {
        console.error('Registration Error:', error.response?.data || error.message);
        throw new Error(error.response?.data || 'Error during registration');
    }
};