from flask import Flask, request, jsonify
from flask_cors import CORS
from firebase_config import db
import datetime

app = Flask(__name__)
CORS(app) # Enable CORS for frontend requests

def calculate_tax_estimate(net_income):
    """
    Calculates a 15% self-employment tax estimate based on the Net Income.
    """
    return round(net_income * 0.15, 2)

@app.route('/api/save', methods=['POST'])
def save_data():
    """
    Saves the income, expenses, and mileage data to Firestore.
    """
    data = request.json
    if not data:
        return jsonify({"error": "No data provided"}), 400

    gross_income = data.get('grossIncome', 0)
    fuel_expenses = data.get('fuelExpenses', 0)
    mileage = data.get('mileage', 0)
    net_income = data.get('netIncome', 0)
    
    # Calculate the tax estimate
    tax_estimate_value = calculate_tax_estimate(float(net_income))

    record = {
        "grossIncome": float(gross_income),
        "fuelExpenses": float(fuel_expenses),
        "mileage": float(mileage),
        "netIncome": float(net_income),
        "taxEstimate": tax_estimate_value,
        "timestamp": datetime.datetime.utcnow()
    }

    try:
        if db is not None:
            # Assuming a collection called 'drive_records'
            db.collection('drive_records').add(record)
            return jsonify({"message": "Data saved successfully!", "record": record}), 201
        else:
            return jsonify({"message": "Mock saved successfully (Firebase not configured).", "record": record}), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/summary', methods=['GET'])
def get_summary():
    """
    Fetches the history of saved records from Firestore.
    """
    try:
        if db is not None:
            records_ref = db.collection('drive_records').order_by('timestamp', direction='DESCENDING').limit(10)
            docs = records_ref.stream()
            history = []
            for doc in docs:
                doc_data = doc.to_dict()
                doc_data['id'] = doc.id
                history.append(doc_data)
            return jsonify({"history": history}), 200
        else:
            return jsonify({"history": []}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, port=5005)
