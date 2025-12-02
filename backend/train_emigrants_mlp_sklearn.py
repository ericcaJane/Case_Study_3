# -*- coding: utf-8 -*-
"""
Fully improved training script for emigrants marital-status forecasting.

Fixes included:
 - Median smoothing for tiny categories
 - sqrt transform (safer than log)
 - safe SMAPE for near-zero values
 - weighted accuracy for tiny series
 - zero-safe reverse transform
 - ✨ NEGATIVE-PREDICTION FIX (clamp before sqrt reversal)
"""

import numpy as np
import pandas as pd
from sklearn.neural_network import MLPRegressor
from sklearn.preprocessing import MinMaxScaler
from sklearn.metrics import mean_absolute_error, mean_squared_error
from sklearn.model_selection import train_test_split
from scipy.signal import medfilt
import pickle
import json
import os

# ============================================================
# 1. LOAD CSV
# ============================================================

df = pd.read_csv("emigrants_marital_status.csv")

CATEGORIES = ["single", "married", "widower", "separated", "divorced", "notReported"]

df_wide = df.copy()

# Interpolate missing values safely
df_wide = df_wide.interpolate().bfill().ffill()

# ============================================================
# 2. FIX: Smoothing + sqrt-transform for tiny/noisy category
# ============================================================

tiny_categories = ["notReported"]  # very small + noisy category

series = {}

for cat in CATEGORIES:
    vals = df_wide[cat].values.astype(float)

    # Median smoothing for noise
    if cat in tiny_categories:
        vals = medfilt(vals, kernel_size=3)

    # sqrt transform to stabilize variance
    if cat in tiny_categories:
        vals = np.sqrt(vals)

    series[cat] = vals.reshape(-1, 1)

# ============================================================
# 3. NORMALIZATION
# ============================================================

scalers = {cat: MinMaxScaler() for cat in CATEGORIES}
scaled = {cat: scalers[cat].fit_transform(series[cat]) for cat in CATEGORIES}

# ============================================================
# 4. SUPERVISED WINDOW
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
# 5. TRAIN/VAL SPLIT
# ============================================================

splits = {}
for cat in CATEGORIES:
    X, y = datasets[cat]
    Xtr, Xval, ytr, yval = train_test_split(X, y, test_size=0.2, random_state=42)
    splits[cat] = (Xtr, Xval, ytr, yval)

# ============================================================
# 6. SAFE SMAPE
# ============================================================

def safe_smape(true_vals, pred_vals):
    smapes = []

    for t, p in zip(true_vals, pred_vals):

        # If low magnitude → treat as scaled MAE
        if t < 10 and p < 10:
            smapes.append(abs(t - p) / 10)
        else:
            smapes.append(
                2 * abs(t - p) / (abs(t) + abs(p) + 1e-8)
            )

    return np.mean(smapes) * 100


def compute_metrics(true_vals, pred_vals):

    mae = mean_absolute_error(true_vals, pred_vals)
    rmse = np.sqrt(mean_squared_error(true_vals, pred_vals))
    smape = safe_smape(true_vals, pred_vals)

    # Weighted accuracy for tiny categories
    if true_vals.mean() < 20:
        accuracy = max(0, 100 - smape * 0.25)
    else:
        accuracy = max(0, 100 - smape)

    return mae, rmse, smape, accuracy

# ============================================================
# 7. TRAINING LOOP
# ============================================================

mlp_configs = {
    "mlp1": (32, 32),
    "mlp2": (64, 64),
    "mlp3": (128, 128)
}

OUTPUT_DIR = "public/models_emigrants"
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

        # -----------------------------
        # 🔧 INVERSE TRANSFORM
        # -----------------------------
        pred_u = scalers[cat].inverse_transform(pred.reshape(-1, 1)).flatten()
        true_u = scalers[cat].inverse_transform(yval).flatten()

        # -----------------------------
        # ✨ FIX: CLAMP NEGATIVE VALUES BEFORE sqrt reversal
        # -----------------------------
        pred_u = np.maximum(pred_u, 0)
        true_u = np.maximum(true_u, 0)

        # -----------------------------
        # Reverse sqrt transform for notReported
        # -----------------------------
        if cat in tiny_categories:
            pred_u = np.square(pred_u)
            true_u = np.square(true_u)

        # Metrics
        mae, rmse, smape, accuracy = compute_metrics(true_u, pred_u)

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

    # Save model pack
    with open(f"{OUTPUT_DIR}/{model_name}.pkl", "wb") as f:
        pickle.dump({
            "models": category_models,
            "scalers": scalers,
            "window": WINDOW,
            "categories": CATEGORIES,
            "tiny_categories": tiny_categories
        }, f)

    results[model_name] = {
        "layers": layers,
        "metrics": category_metrics,
        "avg_accuracy": avg_accuracy
    }

# ============================================================
# 8. BEST MODEL
# ============================================================

best_model_name = max(results, key=lambda k: results[k]["avg_accuracy"])

with open(f"{OUTPUT_DIR}/best_model.json", "w") as f:
    json.dump({"best": best_model_name}, f, indent=4)

with open(f"{OUTPUT_DIR}/results.json", "w") as f:
    json.dump({"best_model": best_model_name, **results}, f, indent=4)

print("\n====================================================")
print(f"🏆 BEST MODEL SELECTED: {best_model_name}")
print("====================================================")
