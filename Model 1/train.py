import pandas as pd
import chardet
from sklearn.model_selection import train_test_split
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import PassiveAggressiveClassifier
from sklearn.metrics import accuracy_score
import pickle

print("Detecting file encoding...")
with open("IFND.csv", "rb") as f:
    result = chardet.detect(f.read())
    print("Detected Encoding:", result)

encoding = result['encoding']

try:
    df = pd.read_csv("IFND.csv", encoding=encoding, on_bad_lines='skip')
    print("File loaded successfully with encoding:", encoding)
except Exception as e:
    print("Error reading CSV:", e)
    exit()

print("Dataset Info:")
print(df.head())
print("\nColumns:", list(df.columns))

text_column = 'Statement'
label_column = 'Label'

X = df[text_column]
y = df[label_column]

X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

tfidf_vectorizer = TfidfVectorizer(stop_words='english', max_df=0.7)
tfidf_train = tfidf_vectorizer.fit_transform(X_train)
tfidf_test = tfidf_vectorizer.transform(X_test)

pac = PassiveAggressiveClassifier(max_iter=50)
pac.fit(tfidf_train, y_train)

y_pred = pac.predict(tfidf_test)
score = accuracy_score(y_test, y_pred)
print(f"\nModel Accuracy: {round(score * 100, 2)}%")

pickle.dump(pac, open("model.pkl", "wb"))
pickle.dump(tfidf_vectorizer, open("vectorizer.pkl", "wb"))
print("\nModel and vectorizer saved successfully as 'model.pkl' and 'vectorizer.pkl'.")
