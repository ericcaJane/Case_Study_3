# -*- coding: utf-8 -*-
"""
train_gender_mlp_sklearn.py

Trains MULTIPLE MLP models for Filipino Emigrant gender forecasting.
Performs MODEL SELECTION based on validation accuracy.

Outputs:
  public/models/
      mlp1.pkl
      mlp2.pkl
      mlp3.pkl
      results.json        ← includes best_model
      best_model.json
"""

import numpy as np
import pandas as pd
from sklearn.neural_network import MLPRegressor
from sklearn.preprocessing import MinMaxScaler
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score
from sklearn.model_selection import train_test_split
import pickle
import json
import os

# ============================================================
# 1. LOAD DATASET
# ============================================================
df = pd.read_csv("gender_yearly.csv")

male = df["male"].values.reshape(-1, 1)
female = df["female"].values.reshape(-1, 1)

# ============================================================
# 2. NORMALIZE DATA
# ============================================================
scaler_male = MinMaxScaler()
scaler_female = MinMaxScaler()

male_scaled = scaler_male.fit_transform(male)
female_scaled = scaler_female.fit_transform(female)

# ============================================================
# 3. CREATE SUPERVISED DATASET USING SLIDING WINDOW
# ============================================================
def create_dataset(series, window=3):
    X, y = [], []
    for i in range(len(series) - window):
        X.append(series[i:i + window].flatten())
        y.append(series[i + window])
    return np.array(X), np.array(y)

WINDOW = 3
X_male, y_male = create_dataset(male_scaled, WINDOW)
X_female, y_female = create_dataset(female_scaled, WINDOW)

# ============================================================
# 4. TRAIN/VALIDATION SPLIT (important for accuracy ranking)
# ============================================================
X_male_train, X_male_val, y_male_train, y_male_val = train_test_split(
    X_male, y_male, test_size=0.2, random_state=42)

X_female_train, X_female_val, y_female_train, y_female_val = train_test_split(
    X_female, y_female, test_size=0.2, random_state=42)

# ============================================================
# 5. MODEL ARCHITECTURES
# ============================================================
mlp_configs = {
    "mlp1": (32, 32),
    "mlp2": (64, 64),
    "mlp3": (128, 128)
}

# ============================================================
# 6. METRICS FUNCTION
# ============================================================
def compute_metrics(true_vals, pred_vals):
    mae = mean_absolute_error(true_vals, pred_vals)
    rmse = np.sqrt(mean_squared_error(true_vals, pred_vals))
    r2 = r2_score(true_vals, pred_vals)

    # Safe MAPE (avoid division by zero)
    mape = np.mean(np.abs((true_vals - pred_vals) / (true_vals + 1e-8))) * 100

    accuracy = max(0, 100 - mape)  # "Accuracy-like" measure for MLP regression

    return mae, rmse, mape, r2, accuracy

# ============================================================
# 7. TRAIN MODELS & SAVE RESULTS
# ============================================================
OUTPUT_DIR = "public/models"
os.makedirs(OUTPUT_DIR, exist_ok=True)

results = {}

for model_name, layers in mlp_configs.items():

    # --------------------------
    # TRAIN MALE MODEL
    # --------------------------
    male_model = MLPRegressor(
        hidden_layer_sizes=layers,
        max_iter=5000,
        random_state=42
    )
    male_model.fit(X_male_train, y_male_train.ravel())

    # VALIDATION PREDICTIONS
    pred_male = male_model.predict(X_male_val)
    pred_male_unscaled = scaler_male.inverse_transform(pred_male.reshape(-1, 1)).flatten()
    true_male_unscaled = scaler_male.inverse_transform(y_male_val).flatten()

    male_metrics = compute_metrics(true_male_unscaled, pred_male_unscaled)

    # --------------------------
    # TRAIN FEMALE MODEL
    # --------------------------
    female_model = MLPRegressor(
        hidden_layer_sizes=layers,
        max_iter=5000,
        random_state=42
    )
    female_model.fit(X_female_train, y_female_train.ravel())

    pred_female = female_model.predict(X_female_val)
    pred_female_unscaled = scaler_female.inverse_transform(pred_female.reshape(-1, 1)).flatten()
    true_female_unscaled = scaler_female.inverse_transform(y_female_val).flatten()

    female_metrics = compute_metrics(true_female_unscaled, pred_female_unscaled)

    # --------------------------
    # SAVE MODEL FILE
    # --------------------------
    pkl_path = f"{OUTPUT_DIR}/{model_name}.pkl"
    with open(pkl_path, "wb") as f:
        pickle.dump({
            "male_model": male_model,
            "female_model": female_model,
            "scaler_male": scaler_male,
            "scaler_female": scaler_female,
            "window": WINDOW
        }, f)

    print(f"Saved {model_name} → {pkl_path}")

    # --------------------------
    # SAVE METRICS
    # --------------------------
    avg_accuracy = (male_metrics[4] + female_metrics[4]) / 2

    results[model_name] = {
        "layers": layers,
        "male": {
            "mae": male_metrics[0],
            "rmse": male_metrics[1],
            "mape": male_metrics[2],
            "r2": male_metrics[3],
            "accuracy": male_metrics[4]
        },
        "female": {
            "mae": female_metrics[0],
            "rmse": female_metrics[1],
            "mape": female_metrics[2],
            "r2": female_metrics[3],
            "accuracy": female_metrics[4]
        },
        "avg_accuracy": avg_accuracy
    }

# ============================================================
# 8. SELECT BEST MODEL
# ============================================================
best_model_name = max(results, key=lambda x: results[x]["avg_accuracy"])

# ============================================================
# 9. SAVE RESULTS JSON (frontend-compatible)
# ============================================================
results_json = {
    "best_model": best_model_name,
    **results
}

with open(f"{OUTPUT_DIR}/results.json", "w") as f:
    json.dump(results_json, f, indent=4)

with open(f"{OUTPUT_DIR}/best_model.json", "w") as f:
    json.dump({"best": best_model_name}, f, indent=4)

print("\n====================================================")
print(f"🏆 BEST MODEL SELECTED: {best_model_name}")
print("====================================================")
