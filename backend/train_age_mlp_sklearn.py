# -*- coding: utf-8 -*-
"""
train_age_mlp_sklearn.py

Trains MULTIPLE MLP models for AGE-GROUP forecasting.
Handles missing age groups by interpolation.
Performs MODEL SELECTION based on SMAPE accuracy.

Output:
  public/models_age/
      mlp1.pkl
      mlp2.pkl
      mlp3.pkl
      results.json
      best_model.json
"""

import numpy as np
import pandas as pd
from sklearn.neural_network import MLPRegressor
from sklearn.preprocessing import MinMaxScaler
from sklearn.metrics import mean_absolute_error, mean_squared_error
from sklearn.model_selection import train_test_split
import pickle
import json
import os

# ============================================================
# 1. LOAD CSV (LONG FORMAT)
# ============================================================

df = pd.read_csv("age_yearly.csv")

# Clean age group names
def to_snake(s):
    return (
        s.replace(" - ", "_")
         .replace("-", "_")
         .replace(" ", "_")
         .lower()
    )

df["ageGroup_clean"] = df["ageGroup"].apply(to_snake)

# Pivot to wide format
df_wide = df.pivot(index="year", columns="ageGroup_clean", values="count").reset_index()

# ============================================================
# FIX: FILL MISSING AGE GROUP DATA USING INTERPOLATION
# ============================================================

df_wide = df_wide.interpolate().fillna(method="bfill").fillna(method="ffill")

# Identify categories after interpolation
CATEGORIES = [c for c in df_wide.columns if c != "year"]

# Extract series per category
series = {cat: df_wide[cat].values.reshape(-1, 1) for cat in CATEGORIES}

# ============================================================
# 2. NORMALIZATION (Per Age Group)
# ============================================================

scalers = {cat: MinMaxScaler() for cat in CATEGORIES}
scaled = {cat: scalers[cat].fit_transform(series[cat]) for cat in CATEGORIES}

# ============================================================
# 3. SUPERVISED TIMESERIES WINDOW
# ============================================================

def create_dataset(series, window=3):
    X, y = [], []
    for i in range(len(series) - window):
        X.append(series[i:i + window].flatten())
        y.append(series[i + window])
    return np.array(X), np.array(y)

WINDOW = 3

datasets = {cat: create_dataset(scaled[cat], WINDOW) for cat in CATEGORIES}

# ============================================================
# 4. TRAIN/VAL SPLIT
# ============================================================

splits = {}
for cat in CATEGORIES:
    X, y = datasets[cat]
    Xtr, Xval, ytr, yval = train_test_split(
        X, y, test_size=0.2, random_state=42
    )
    splits[cat] = (Xtr, Xval, ytr, yval)

# ============================================================
# 5. MODEL ARCHITECTURES
# ============================================================

mlp_configs = {
    "mlp1": (32, 32),
    "mlp2": (64, 64),
    "mlp3": (128, 128)
}

# ============================================================
# 6. METRICS (SMAPE for accuracy)
# ============================================================

def compute_metrics(true_vals, pred_vals):
    mae = mean_absolute_error(true_vals, pred_vals)
    rmse = np.sqrt(mean_squared_error(true_vals, pred_vals))

    smape = np.mean(
        2 * np.abs(true_vals - pred_vals) /
        (np.abs(true_vals) + np.abs(pred_vals) + 1e-8)
    ) * 100

    accuracy = max(0, 100 - smape)

    return mae, rmse, smape, accuracy

# ============================================================
# 7. TRAIN ALL MODELS
# ============================================================

OUTPUT_DIR = "public/models_age"
os.makedirs(OUTPUT_DIR, exist_ok=True)

results = {}

for model_name, layers in mlp_configs.items():

    print("\n=======================================")
    print(f"TRAINING {model_name} with {layers}")
    print("=======================================\n")

    category_models = {}
    category_metrics = {}
    avg_accuracy_total = 0

    for cat in CATEGORIES:
        Xtr, Xval, ytr, yval = splits[cat]

        model = MLPRegressor(
            hidden_layer_sizes=layers,
            max_iter=5000,
            random_state=42
        )

        model.fit(Xtr, ytr.ravel())
        pred = model.predict(Xval)

        # Reverse scaling
        pred_unscaled = scalers[cat].inverse_transform(pred.reshape(-1, 1)).flatten()
        true_unscaled = scalers[cat].inverse_transform(yval).flatten()

        mae, rmse, smape, accuracy = compute_metrics(true_unscaled, pred_unscaled)

        category_metrics[cat] = {
            "mae": mae,
            "rmse": rmse,
            "smape": smape,
            "accuracy": accuracy
        }

        avg_accuracy_total += accuracy
        category_models[cat] = model

        print(f"{cat}: accuracy={accuracy:.2f}%")

    avg_accuracy = avg_accuracy_total / len(CATEGORIES)

    # Save model
    with open(f"{OUTPUT_DIR}/{model_name}.pkl", "wb") as f:
        pickle.dump({
            "models": category_models,
            "scalers": scalers,
            "window": WINDOW,
            "categories": CATEGORIES
        }, f)

    results[model_name] = {
        "layers": layers,
        "metrics": category_metrics,
        "avg_accuracy": avg_accuracy
    }

# ============================================================
# 8. SELECT BEST MODEL
# ============================================================

best_model_name = max(results, key=lambda k: results[k]["avg_accuracy"])

with open(f"{OUTPUT_DIR}/best_model.json", "w") as f:
    json.dump({"best": best_model_name}, f, indent=4)

with open(f"{OUTPUT_DIR}/results.json", "w") as f:
    json.dump({"best_model": best_model_name, **results}, f, indent=4)

print("\n====================================================")
print(f"🏆 BEST MODEL SELECTED: {best_model_name}")
print("====================================================")
