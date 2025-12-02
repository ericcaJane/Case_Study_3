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

# ======================================================
# MODEL DIRECTORY
# ======================================================
MODEL_DIR = "public/models"

# ======================================================
# LOAD BEST MODEL NAME (new structure uses "best_model")
# ======================================================
best_model_path = os.path.join(MODEL_DIR, "best_model.json")
with open(best_model_path, "r") as f:
    best_model_name = json.load(f)["best"]

# Load model.pkl
model_path = os.path.join(MODEL_DIR, f"{best_model_name}.pkl")
with open(model_path, "rb") as f:
    data = pickle.load(f)

male_model = data["male_model"]
female_model = data["female_model"]
scaler_male = data["scaler_male"]
scaler_female = data["scaler_female"]
WINDOW = data["window"]

print(f"✅ Loaded best model:", best_model_name)

# ======================================================
# EXPLANATION TEMPLATE (static text)
# ======================================================
model_explanation = {
    "title": "Why this model was selected",
    "points": [
        "It achieved the highest validation accuracy among all trained MLP architectures.",
        "It produced the lowest MAE, RMSE, and MAPE values during testing.",
        "It demonstrated the most stable 10-year forecasting behavior.",
        "It avoided overfitting and generalized best across male/female patterns.",
        "It performed consistently on both male and female historical data.",
    ]
}

# ======================================================
# FORECAST FUNCTION
# ======================================================
def forecast_future(model, scaler, last_values, steps=10):
    preds = []
    current = last_values.copy()

    for _ in range(steps):
        inp = current[-WINDOW:].reshape(1, -1)
        pred_scaled = model.predict(inp)[0]
        pred = scaler.inverse_transform(pred_scaled.reshape(1, -1))[0][0]
        preds.append(float(pred))

        current = np.vstack([current, pred_scaled.reshape(1, -1)])

    return preds

# ======================================================
# /predict ENDPOINT
# ======================================================
@app.route("/predict")
def predict():
    gender = request.args.get("gender")

    if gender not in ["male", "female"]:
        return jsonify({"error": "gender must be male or female"}), 400

    model = male_model if gender == "male" else female_model
    scaler = scaler_male if gender == "male" else scaler_female

    df = pd.read_csv("gender_yearly.csv")
    values = df[gender].values.reshape(-1, 1)

    scaled = scaler.transform(values)
    last_values = scaled[-WINDOW:]

    preds = forecast_future(model, scaler, last_values, steps=10)

    last_year = int(df["year"].iloc[-1])
    future_years = list(range(last_year + 1, last_year + 11))

    return jsonify({
        "gender": gender,
        "future_years": future_years,
        "forecast": preds,
        "model_used": best_model_name,
        "explanation": model_explanation
    })

# ======================================================
# /best-model ENDPOINT (FIXED)
# ======================================================
@app.route("/best-model")
def best_model():
    results_path = os.path.join(MODEL_DIR, "results.json")

    with open(results_path, "r") as f:
        results = json.load(f)

    best = results["best_model"]

    return jsonify({
        "best": best,
        "metrics": results[best],    # now correct key
        "all_results": results,      # send everything
        "explanation": model_explanation
    })

# ======================================================
# FULL RESULTS ENDPOINT
# ======================================================
@app.route("/results")
def get_results():
    path = os.path.join(MODEL_DIR, "results.json")
    with open(path, "r") as f:
        return jsonify(json.load(f))

# ======================================================
# RUN SERVER
# ======================================================
if __name__ == "__main__":
    app.run(port=5000)
