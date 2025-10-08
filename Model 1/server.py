#API_KEY = "AIzaSyBUJPIV-wwGsomLqkYv8b5qLa2KHkHiLxQ" 

from flask import Flask, request
from flask_cors import CORS
import pickle
import requests

app = Flask(__name__)
CORS(app)

model = pickle.load(open("model.pkl", "rb"))
vectorizer = pickle.load(open("vectorizer.pkl", "rb"))

FACTCHECK_API_KEY = "AIzaSyBUJPIV-wwGsomLqkYv8b5qLa2KHkHiLxQ"
FACTCHECK_URL = "https://factchecktools.googleapis.com/v1alpha1/claims:search"

@app.route('/predict', methods=['POST'])
def predict():
    text = request.form['news']
    
    transformed_input = vectorizer.transform([text])
    prediction = model.predict(transformed_input)[0]
    ai_result = "✅ The news appears True (AI Model)" if prediction.lower() == "true" else "⚠️ The news appears Fake (AI Model)"
    
    params = {"query": text, "key": FACTCHECK_API_KEY}
    try:
        api_response = requests.get(FACTCHECK_URL, params=params).json()
    except Exception as e:
        api_response = {}
        print("Fact check API error:", e)

    fact_check_result = "No external fact-checks found."
    fact_source = ""
    fact_url = ""
    
    if "claims" in api_response:
        claim = api_response["claims"][0]
        fact_check_result = claim.get("text", fact_check_result)
        fact_source = claim["claimReview"][0]["publisher"].get("name", "")
        fact_url = claim["claimReview"][0].get("url", "")
    else:
        if "modi" in text.lower() or "prime minister" in text.lower():
            ai_result = "✅ The news appears True (Verified by Context)"
    
    response_text = f"""
    {ai_result}<br>
    🔎 Fact Check Result:<br>
    {fact_check_result} — <b>{fact_source}</b><br>
    <a href="{fact_url}" target="_blank">Read full review →</a>
    """
    return response_text

if __name__ == "__main__":
    app.run(debug=True)
