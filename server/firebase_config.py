import firebase_admin
from firebase_admin import credentials, firestore

def initialize_firebase():
    """
    Initializes the Firebase Admin SDK and returns the Firestore client.
    Note: In production, use environment variables for service account credentials.
    """
    try:
        # Check if already initialized
        firebase_admin.get_app()
    except ValueError:
        cred = credentials.Certificate("serviceAccountKey.json")
        firebase_admin.initialize_app(cred)
        print("Firebase initialized successfully with serviceAccountKey.json.")

    return firestore.client()

db = initialize_firebase()
