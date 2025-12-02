# -*- coding: utf-8 -*-
from flask import Flask, request, jsonify
from flask_cors import CORS
import pickle
import numpy as np
import pandas as pd
import json
import os

app = Flask(__name__)
CORS(app)

MODEL_DIR = "public/models_age"

# ================================
# LOAD BEST MODEL + PACK
# ================================
with open(f"{MODEL_DIR}/best_model.json", "r") as f:
    best_model_name = json.load(f)["best"]

with open(f"{MODEL_DIR}/{best_model_name}.pkl", "rb") as f:
    pack = pickle.load(f)

models = pack["models"]
scalers = pack["scalers"]
CATEGORIES = pack["categories"]
WINDOW = pack["window"]

print("✅ Loaded BEST AGE MODEL:", best_model_name)

# ================================
# EXPLANATION (same format as education)
# ================================
model_explanation = {
    "title": "Why this model was selected",
    "points": [
        "It achieved the highest overall SMAPE accuracy across all age groups.",
        "It produced stable and smooth multi-year forecasts.",
        "It generalized well without overfitting.",
        "It captured long-term trends in the age-group emigration data."
    ]
}

# ================================
# FORECAST FUNCTION
# ================================
def forecast(model, scaler, last_vals, steps=10):
    preds = []
    current = last_vals.copy()

    for _ in range(steps):
        window_input = current[-WINDOW:].reshape(1, -1)

        pred_scaled = model.predict(window_input)[0]
        pred_unscaled = scaler.inverse_transform([[pred_scaled]])[0][0]

        preds.append(float(pred_unscaled))
        current = np.vstack([current, [pred_scaled]])

    return preds

# ================================
# /predict — MAIN ENDPOINT
# ================================
@app.route("/predict", methods=["GET"])
def predict():
    group = request.args.get("group")

    if group not in CATEGORIES:
        return jsonify({"error": "Invalid group"}), 400

    model = models[group]
    scaler = scalers[group]

    df = pd.read_csv("age_yearly.csv")
    df["ageGroup_clean"] = (
        df["ageGroup"]
        .str.replace(" - ", "_")
        .str.replace("-", "_")
        .str.replace(" ", "_")
        .str.lower()
    )

    values = df[df["ageGroup_clean"] == group]["count"].values.reshape(-1, 1)

    scaled_vals = scaler.transform(values)
    last_vals = scaled_vals[-WINDOW:]

    preds = forecast(model, scaler, last_vals, steps=10)

    last_year = int(df["year"].max())
    future_years = list(range(last_year + 1, last_year + 11))

    with open(f"{MODEL_DIR}/results.json", "r") as f:
        all_results = json.load(f)

    return jsonify({
        "group": group,
        "future_years": future_years,
        "forecast": preds,
        "model_used": best_model_name,
        "explanation": model_explanation,
        "allModelResults": all_results,
        "best_model": all_results["best_model"]
    })


# ============================================================
# ⭐⭐ NEW ENDPOINT — LOAD ALL AGE GROUPS FOR MODAL ⭐⭐
# ============================================================
@app.route("/predict-all", methods=["GET"])
def predict_all():
    df = pd.read_csv("age_yearly.csv")
    df["ageGroup_clean"] = (
        df["ageGroup"]
        .str.replace(" - ", "_")
        .str.replace("-", "_")
        .str.replace(" ", "_")
        .str.lower()
    )

    last_year = int(df["year"].max())
    future_years = list(range(last_year + 1, last_year + 11))

    all_forecasts = {}

    for group in CATEGORIES:
        model = models[group]
        scaler = scalers[group]

        values = df[df["ageGroup_clean"] == group]["count"].values.reshape(-1, 1)

        scaled_vals = scaler.transform(values)
        last_vals = scaled_vals[-WINDOW:]

        preds = forecast(model, scaler, last_vals, steps=10)

        all_forecasts[group] = {
            "years": future_years,
            "forecast": preds
        }

    with open(f"{MODEL_DIR}/results.json", "r") as f:
        all_results = json.load(f)

    return jsonify({
        "groups": CATEGORIES,
        "data": all_forecasts,
        "model_used": best_model_name,
        "explanation": model_explanation,
        "allModelResults": all_results,
        "best_model": all_results["best_model"]
    })


# ================================
# /best-model
# ================================
@app.route("/best-model")
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


# ================================
# /results — raw metrics
# ================================
@app.route("/results")
def results():
    with open(f"{MODEL_DIR}/results.json", "r") as f:
        return jsonify(json.load(f))


# ================================
# START SERVER
# ================================
if __name__ == "__main__":
    app.run(port=5001)
