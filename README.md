# DriveFlow Analytics - Academic Project

DriveFlow Analytics is a web application dashboard built with React (Vite) and a Python Flask backend, integrated with Firebase Firestore. It calculates Net Income and a 15% self-employment tax estimate for ride-share drivers and stores the data securely.

## Prerequisites

- Node.js (v20+)
- Python (3.12+)
- A Firebase Project with Firestore Database enabled

## Setup Instructions for Professor/Evaluator

To run this application, you must provide a valid Firebase Service Account Key. The actual key has been omitted from this repository for security reasons.

### 1. Firebase Configuration

1. Locate the `server/serviceAccountKey.example.json` file.
2. Obtain your own Firebase credentials JSON file (from Firebase Console > Project Settings > Service Accounts > Generate New Private Key).
3. **Save your credentials file inside the `server/` directory and rename it exactly to:** `serviceAccountKey.json`.
4. The `.gitignore` file will ensure this key is never accidentally pushed to a repository.

### 2. Backend Setup (Flask API)

Open a terminal and navigate to the `/server` directory:

```bash
cd server
python -m venv venv

# Activate virtual environment
# On Windows:
venv\Scripts\activate
# On macOS/Linux:
# source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Run the Flask server
python main.py
```
*Note: The API server will run on `http://localhost:5005` by default.*

### 3. Frontend Setup (React Client)

Open a **new** terminal window and navigate to the `/client` directory:

```bash
cd client

# Install dependencies
npm install

# Start the Vite development server
npm run dev
```
*Note: The frontend will typically run on `http://localhost:5173` or `5174`.*

## Usage

1. Open the frontend address in your browser.
2. Enter values in the `Gross Income`, `Fuel Expenses`, and `Mileage` fields.
3. The Net Income will calculate in real-time.
4. Click **Save Record**. The data, along with a 15% `TaxEstimate`, will be sent via POST to `/api/save` and stored in Firestore.
5. The right pane will fetch a summary via GET `/api/summary` to display the 10 most recent entries.
