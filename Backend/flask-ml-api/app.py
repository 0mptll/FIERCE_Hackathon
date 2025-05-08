from flask import Flask, request, jsonify
from flask_cors import CORS  # Import Flask-CORS
import joblib
import pandas as pd

app = Flask(__name__)
CORS(app, resources={r"/predict": {"origins": "http://localhost:5173"}})  # Allow only React frontend

# Load the trained model
model = joblib.load("credit_score_model.joblib")

@app.route('/predict', methods=['OPTIONS', 'POST'])  # Handle preflight OPTIONS request
def predict():
    if request.method == 'OPTIONS':
        return _build_cors_preflight_response()  # Return CORS headers for OPTIONS request

    try:
        data = request.json  # JSON from frontend
        df = pd.DataFrame([data])

        # Ensure correct column order
        columns = ['monthly_income', 'grocery_spending', 'utility_bills', 'savings',
                   'rent_or_emi', 'medical_expense', 'transport', 'loan_repayment']
        df = df[columns]

        prediction = model.predict(df)[0]

        def map_score_to_rating(score):
            if score >= 750:
                return "Excellent"
            elif score >= 650:
                return "Good"
            elif score >= 550:
                return "Fair"
            else:
                return "Poor"

        rating = map_score_to_rating(prediction)

        response = jsonify({
            'credit_score': round(prediction, 2),
            'credit_rating': rating
        })

        return _corsify_response(response)  # Apply CORS headers

    except Exception as e:
        return _corsify_response(jsonify({'error': str(e)}))

# Function to handle CORS preflight response
def _build_cors_preflight_response():
    response = jsonify({'message': 'CORS preflight accepted'})
    response.headers.add("Access-Control-Allow-Origin", "http://localhost:5173")
    response.headers.add("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
    response.headers.add("Access-Control-Allow-Headers", "Content-Type")
    return response

# Function to apply CORS headers to responses
def _corsify_response(response):
    response.headers.add("Access-Control-Allow-Origin", "http://localhost:5173")
    response.headers.add("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
    response.headers.add("Access-Control-Allow-Headers", "Content-Type")
    return response

if __name__ == '__main__':
    app.run(port=5001, debug=True)  # Run Flask on port 5001