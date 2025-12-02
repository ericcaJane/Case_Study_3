# -*- coding: utf-8 -*-
"""
train_education_mlp_sklearn.py

Trains MULTIPLE MLP models for Education Level forecasting.
Performs MODEL SELECTION based on validation accuracy.

Outputs:
  public/models_education/
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
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score
from sklearn.model_selection import train_test_split
import pickle
import json
import os

# ============================================================
# 1. LOAD EDUCATION DATASET
# ============================================================
df = pd.read_csv("education_yearly.csv")

# Expected columns:
# year, elementary, highschool, vocational, college, postgrad, notReported

CATEGORIES = [
    "elementary",
    "highschool",
    "vocational",
    "college",
    "postgrad",
    "notReported"
]

# ============================================================
# 1B. APPLY SMOOTHING FOR SMALL/NOISY CATEGORIES
# ============================================================

SMOOTH_CATEGORIES = ["vocational", "notReported"]

for cat in SMOOTH_CATEGORIES:
    df[cat] = (
        df[cat]
        .rolling(window=3, center=True)
        .mean()
        .bfill()
        .ffill()
    )

# Convert each category to numpy array
series = {cat: df[cat].values.reshape(-1, 1) for cat in CATEGORIES}

# ============================================================
# 2. NORMALIZE DATA PER CATEGORY
# ============================================================
scalers = {cat: MinMaxScaler() for cat in CATEGORIES}

scaled = {
    cat: scalers[cat].fit_transform(series[cat])
    for cat in CATEGORIES
}

# ============================================================
# 3. CREATE SUPERVISED SLIDING WINDOW DATA
# ============================================================
def create_dataset(series, window=3):
    X, y = [], []
    for i in range(len(series) - window):
        X.append(series[i:i + window].flatten())
        y.append(series[i + window])
    return np.array(X), np.array(y)

WINDOW = 3

datasets = {
    cat: create_dataset(scaled[cat], WINDOW)
    for cat in CATEGORIES
}

# ============================================================
# 4. TRAIN/VALIDATION SPLIT FOR ALL CATEGORIES
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
# 6. METRICS FUNCTION (Using SMAPE)
# ============================================================
def compute_metrics(true_vals, pred_vals):
    mae = mean_absolute_error(true_vals, pred_vals)
    rmse = np.sqrt(mean_squared_error(true_vals, pred_vals))
    r2 = r2_score(true_vals, pred_vals)

    # SMAPE (safe for near-zero values)
    smape = np.mean(
        2 * np.abs(true_vals - pred_vals) /
        (np.abs(true_vals) + np.abs(pred_vals) + 1e-8)
    ) * 100

    accuracy = max(0, 100 - smape)

    return mae, rmse, smape, r2, accuracy

# ============================================================
# 7. TRAIN ALL MODELS
# ============================================================
OUTPUT_DIR = "public/models_education"
os.makedirs(OUTPUT_DIR, exist_ok=True)

results = {}

for model_name, layers in mlp_configs.items():

    category_models = {}
    category_metrics = {}

    avg_accuracy_total = 0

    print(f"\n=======================================")
    print(f"TRAINING {model_name} with layers {layers}")
    print(f"=======================================\n")

    for cat in CATEGORIES:

        Xtr, Xval, ytr, yval = splits[cat]

        model = MLPRegressor(
            hidden_layer_sizes=layers,
            max_iter=5000,
            random_state=42
        )

        model.fit(Xtr, ytr.ravel())

        pred = model.predict(Xval)

        # Undo scaling
        pred_unscaled = scalers[cat].inverse_transform(pred.reshape(-1, 1)).flatten()
        true_unscaled = scalers[cat].inverse_transform(yval).flatten()

        # Compute metrics
        metrics = compute_metrics(true_unscaled, pred_unscaled)

        category_metrics[cat] = {
            "mae": metrics[0],
            "rmse": metrics[1],
            "mape": metrics[2],  # now SMAPE
            "r2": metrics[3],
            "accuracy": metrics[4]
        }

        avg_accuracy_total += metrics[4]
        category_models[cat] = model

        print(f"{cat}: accuracy={metrics[4]:.2f}%")

    avg_accuracy = avg_accuracy_total / len(CATEGORIES)

    # Save model pkl
    pkl_path = f"{OUTPUT_DIR}/{model_name}.pkl"
    with open(pkl_path, "wb") as f:
        pickle.dump({
            "models": category_models,
            "scalers": scalers,
            "window": WINDOW,
            "categories": CATEGORIES
        }, f)

    print(f"\nSaved {model_name} → {pkl_path}")

    # Save metrics
    results[model_name] = {
        "layers": layers,
        "metrics": category_metrics,
        "avg_accuracy": avg_accuracy
    }

# ============================================================
# 8. SELECT BEST MODEL
# ============================================================
best_model_name = max(results, key=lambda x: results[x]["avg_accuracy"])

# ============================================================
# 9. SAVE RESULTS JSON
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
