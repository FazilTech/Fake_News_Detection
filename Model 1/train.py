import pandas as pd
import chardet
from sklearn.model_selection import train_test_split
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import PassiveAggressiveClassifier
from sklearn.metrics import accuracy_score
import pickle

# Step 1 — Detect file encoding
print("🔍 Detecting file encoding...")
with open("IFND.csv", "rb") as f:
    result = chardet.detect(f.read())
    print("Detected Encoding:", result)

encoding = result['encoding']

# Step 2 — Read the dataset safely
try:
    df = pd.read_csv("IFND.csv", encoding=encoding, on_bad_lines='skip')
    print("✅ File loaded successfully with encoding:", encoding)
except Exception as e:
    print("❌ Error reading CSV:", e)
    exit()

# Step 3 — Show basic info
print("📄 Dataset Info:")
print(df.head())
print("\nColumns:", list(df.columns))

# Step 4 — Define correct column names
text_column = 'Statement'
label_column = 'Label'

# Step 5 — Prepare features and labels
X = df[text_column]
y = df[label_column]

# Step 6 — Split data
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# Step 7 — Vectorize text
tfidf_vectorizer = TfidfVectorizer(stop_words='english', max_df=0.7)
tfidf_train = tfidf_vectorizer.fit_transform(X_train)
tfidf_test = tfidf_vectorizer.transform(X_test)

# Step 8 — Train model
pac = PassiveAggressiveClassifier(max_iter=50)
pac.fit(tfidf_train, y_train)

# Step 9 — Evaluate model
y_pred = pac.predict(tfidf_test)
score = accuracy_score(y_test, y_pred)
print(f"\n🎯 Model Accuracy: {round(score * 100, 2)}%")

# Step 10 — Save model and vectorizer
pickle.dump(pac, open("model.pkl", "wb"))
pickle.dump(tfidf_vectorizer, open("vectorizer.pkl", "wb"))
print("\n✅ Model and vectorizer saved successfully as 'model.pkl' and 'vectorizer.pkl'.")
