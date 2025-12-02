# -*- coding: utf-8 -*-
"""
emigrants_predict_server.py

Flask API server for predicting emigrant counts
based on marital status categories:
single, married, widower, separated, divorced, notReported.

Includes:
 - safe inverse transform
 - sqrt transform handling for tiny categories
 - clamping negative values to 0
"""

from flask import Flask, request, jsonify
from flask_cors import CORS
import numpy as np
import pandas as pd
import pickle
import json
import os

app = Flask(__name__)
CORS(app)

MODEL_DIR = "public/models_emigrants"

# ============================================================
# LOAD BEST MODEL PACK
# ============================================================

with open(f"{MODEL_DIR}/best_model.json", "r") as f:
    best_model_name = json.load(f)["best"]

with open(f"{MODEL_DIR}/{best_model_name}.pkl", "rb") as f:
    pack = pickle.load(f)

models = pack["models"]
scalers = pack["scalers"]
WINDOW = pack["window"]
CATEGORIES = pack["categories"]
tiny_categories = pack.get("tiny_categories", ["notReported"])

print("✅ Loaded BEST MODEL:", best_model_name)

model_explanation = {
    "title": "Why this model was selected",
    "points": [
        "It achieved the highest average forecast accuracy across all marital categories.",
        "It has stable and smooth multi-year predictions.",
        "It generalizes well without overfitting.",
        "It captures long-term migration patterns."
    ]
}

# ============================================================
# SAFE FORECAST (this is the critical fix)
# ============================================================

def safe_forecast(model, scaler, last_vals, steps=10, status="single"):
    preds = []
    current = last_vals.copy()

    for _ in range(steps):
        X = current[-WINDOW:].reshape(1, -1)

        pred_scaled = model.predict(X)[0]

        # Inverse scaling
        pred_u = scaler.inverse_transform([[pred_scaled]])[0][0]

        # Clamp negative before sqrt reversal
        pred_u = max(pred_u, 0)

        # Reverse sqrt for tiny category
        if status in tiny_categories:
            pred_u = pred_u ** 2

        # Clamp again after square
        pred_u = max(pred_u, 0)

        preds.append(float(pred_u))

        # Append scaled prediction for rolling window
        current = np.vstack([current, [pred_scaled]])

    return preds

# ============================================================
# /predict?status=single
# ============================================================

@app.route("/predict", methods=["GET"])
def predict():
    status = request.args.get("status")

    if status not in CATEGORIES:
        return jsonify({"error": f"Invalid status. Options: {CATEGORIES}"}), 400

    model = models[status]
    scaler = scalers[status]

    df = pd.read_csv("emigrants_marital_status.csv")
    values = df[status].values.reshape(-1, 1)

    # Apply sqrt-transform on input
    if status in tiny_categories:
        values = np.sqrt(values)

    scaled_vals = scaler.transform(values)
    last_vals = scaled_vals[-WINDOW:]

    preds = safe_forecast(model, scaler, last_vals, steps=10, status=status)

    last_year = int(df["year"].max())
    future_years = list(range(last_year + 1, last_year + 11))

    with open(f"{MODEL_DIR}/results.json", "r") as f:
        all_results = json.load(f)

    return jsonify({
        "status": status,
        "years": future_years,
        "forecast": preds,
        "model_used": best_model_name,
        "explanation": model_explanation,
        "allModelResults": all_results,
        "best_model": all_results["best_model"]
    })

# ============================================================
# /predict-all
# ============================================================

@app.route("/predict-all", methods=["GET"])
def predict_all():

    df = pd.read_csv("emigrants_marital_status.csv")
    last_year = int(df["year"].max())
    future_years = list(range(last_year + 1, last_year + 11))

    output = {}

    for status in CATEGORIES:
        model = models[status]
        scaler = scalers[status]

        vals = df[status].values.reshape(-1, 1)

        # Apply sqrt-transform pre-processing
        if status in tiny_categories:
            vals = np.sqrt(vals)

        scaled_vals = scaler.transform(vals)
        last_vals = scaled_vals[-WINDOW:]

        preds = safe_forecast(model, scaler, last_vals, steps=10, status=status)

        output[status] = {
            "years": future_years,
            "forecast": preds
        }

    with open(f"{MODEL_DIR}/results.json", "r") as f:
        all_results = json.load(f)

    return jsonify({
        "statuses": CATEGORIES,
        "data": output,
        "model_used": best_model_name,
        "explanation": model_explanation,
        "allModelResults": all_results,
        "best_model": all_results["best_model"]
    })

# ============================================================
# /best-model
# ============================================================

@app.route("/best-model", methods=["GET"])
def best_model():
    with open(f"{MODEL_DIR}/results.json", "r") as f:
        results = json.load(f)

    best = results["best_model"]

    return jsonify({
        "best": best,
        "metrics": results[best],
        "all_results": results,
        "explanation": model_explanation
    })

# ============================================================
# /results
# ============================================================

@app.route("/results")
def results():
    with open(f"{MODEL_DIR}/results.json", "r") as f:
        return jsonify(json.load(f))

# ============================================================
# START SERVER
# ============================================================

if __name__ == "__main__":
    print("🚀 Starting Emigrants Prediction Server on port 5003...")
    app.run(port=5003, debug=True)
