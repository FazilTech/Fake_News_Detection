#API_KEY = "AIzaSyBUJPIV-wwGsomLqkYv8b5qLa2KHkHiLxQ" 

from flask import Flask, request
from flask_cors import CORS
import pickle
import requests

app = Flask(__name__)
CORS(app)

# Load model
model = pickle.load(open("model.pkl", "rb"))
vectorizer = pickle.load(open("vectorizer.pkl", "rb"))

FACTCHECK_API_KEY = "AIzaSyBUJPIV-wwGsomLqkYv8b5qLa2KHkHiLxQ"
FACTCHECK_URL = "https://factchecktools.googleapis.com/v1alpha1/claims:search"


@app.route('/predict', methods=['POST'])
def predict():
    text = request.form['news']

    # -------- AI MODEL PREDICTION --------
    transformed_input = vectorizer.transform([text])
    prediction = model.predict(transformed_input)[0].lower()

    # Confidence score
    try:
        proba = model.predict_proba(transformed_input)[0]
        confidence = round(max(proba) * 100, 2)
    except:
        confidence = 70  # fallback if model doesn't support proba

    # -------- FACT CHECK API --------
    params = {"query": text, "key": FACTCHECK_API_KEY}

    try:
        api_response = requests.get(FACTCHECK_URL, params=params).json()
    except Exception as e:
        api_response = {}
        print("Fact check API error:", e)

    # -------- CHECK FACT DATA --------
    fact_check_found = "claims" in api_response and len(api_response["claims"]) > 0

    if fact_check_found:
        # ✅ VERIFIED TRUE
        claim = api_response["claims"][0]
        fact_text = claim.get("text", "")
        fact_source = claim["claimReview"][0]["publisher"].get("name", "")
        fact_url = claim["claimReview"][0].get("url", "")

        final_result = "✅ VERIFIED TRUE (High Confidence)"

    else:
        # No fact-check available
        fact_text = "No external fact-check available."
        fact_source = ""
        fact_url = ""

        # -------- IMPROVED DECISION LOGIC --------
        if prediction == "true":
            final_result = f"⚠️ MOSTLY TRUE ({confidence}% confidence)"
        else:
            final_result = f"⚠️ UNVERIFIED / POSSIBLY MISLEADING ({confidence}% confidence)"

        # -------- OPTIONAL TRUSTED SOURCE BOOST --------
        trusted_sources = ["cnn", "bbc", "reuters", "the hindu", "ndtv"]

        if any(source in text.lower() for source in trusted_sources):
            final_result = f"⚠️ LIKELY TRUE (Trusted Source Detected, {confidence}% confidence)"

    # -------- RESPONSE --------
    response_text = f"""
    <b>Result:</b> {final_result}<br><br>

    🔎 <b>Fact Check:</b><br>
    {fact_text} <br>
    <b>Source:</b> {fact_source} <br>
    <a href="{fact_url}" target="_blank">Read full review →</a>
    """

    return response_text


if __name__ == "__main__":
    app.run(debug=True)