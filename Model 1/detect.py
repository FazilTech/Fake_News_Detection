import pandas as pd
import chardet

# ===== Step 1: Detect file encoding =====
file_path = "IFND.csv"

with open(file_path, "rb") as f:
    result = chardet.detect(f.read(20000))  # detect using first 20KB
encoding = result["encoding"]
print(f"📂 Detected encoding: {encoding}")

# Try loading safely
try:
    df = pd.read_csv(file_path, encoding=encoding, on_bad_lines="skip")
except Exception as e:
    print(f"⚠️ Error loading with {encoding}, trying 'latin1' → {e}")
    df = pd.read_csv(file_path, encoding="latin1", on_bad_lines="skip")

print("\n✅ Dataset loaded successfully!")
print(f"🧾 Shape: {df.shape[0]} rows × {df.shape[1]} columns")

# ===== Step 2: Show column names =====
print("\n📋 Columns found:")
for i, col in enumerate(df.columns):
    print(f"{i+1}. {col}")

# ===== Step 3: Show first few rows =====
print("\n🔍 Sample data:")
print(df.head(5))

# ===== Step 4: Check for missing values =====
print("\n🚫 Missing values per column:")
print(df.isnull().sum())

# ===== Step 5: Detect likely text & label columns =====
possible_text_cols = ["text", "content", "statement", "news", "headline", "article", "body"]
possible_label_cols = ["label", "class", "target", "verdict", "output", "category"]

text_col, label_col = None, None
for c in df.columns:
    if any(key in c.lower() for key in possible_text_cols):
        text_col = c
    if any(key in c.lower() for key in possible_label_cols):
        label_col = c

print("\n🧩 Auto-detected columns:")
print(f"TEXT_COL  → {text_col}")
print(f"LABEL_COL → {label_col}")

# ===== Step 6: Show label distribution =====
if label_col:
    print("\n📊 Label distribution:")
    print(df[label_col].value_counts())

# ===== Step 7: Show average text length (if text column detected) =====
if text_col:
    df["text_length"] = df[text_col].astype(str).apply(len)
    print(f"\n✍️ Average text length: {df['text_length'].mean():.2f} characters")

# ===== Step 8: Save analysis report (optional) =====
df.info()
