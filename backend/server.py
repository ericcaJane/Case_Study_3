# -*- coding: utf-8 -*-
"""
UNIFIED FLASK BACKEND
(All predictors merged into 1 server)
PORT = 5001
"""

from flask import Flask, request, jsonify
from flask_cors import CORS
import pickle
import numpy as np
import pandas as pd
import json
import os

app = Flask(__name__)
CORS(app)

# =====================================================================
# DIRECTORY MAPPINGS
# =====================================================================
DIR_GENDER = "public/models"
DIR_AGE = "public/models_age"
DIR_EDU = "public/models_education"
DIR_EMI = "public/models_emigrants"

# =====================================================================
# LOAD MODELS
# =====================================================================

def load_pack(directory):
    with open(f"{directory}/best_model.json", "r") as f:
        best = json.load(f)["best"]
    with open(f"{directory}/{best}.pkl", "rb") as f:
        pack = pickle.load(f)
    return best, pack

# GENDER
best_gender, pack_gender = load_pack(DIR_GENDER)
male_model = pack_gender["male_model"]
female_model = pack_gender["female_model"]
scaler_male = pack_gender["scaler_male"]
scaler_female = pack_gender["scaler_female"]
WINDOW_G = pack_gender["window"]

# AGE
best_age, pack_age = load_pack(DIR_AGE)
models_age = pack_age["models"]
scalers_age = pack_age["scalers"]
WINDOW_A = pack_age["window"]
CATEGORIES_AGE = pack_age["categories"]

# EDUCATION
best_edu, pack_edu = load_pack(DIR_EDU)
models_edu = pack_edu["models"]
scalers_edu = pack_edu["scalers"]
WINDOW_E = pack_edu["window"]
CATEGORIES_EDU = pack_edu["categories"]

# EMIGRANTS (CIVIL STATUS)
best_emi, pack_emi = load_pack(DIR_EMI)
models_emi = pack_emi["models"]
scalers_emi = pack_emi["scalers"]
WINDOW_C = pack_emi["window"]
CATEGORIES_CIVIL = pack_emi["categories"]
tiny_categories = pack_emi.get("tiny_categories", ["notReported"])

# =====================================================================
# LOAD RESULTS + EXPLANATION
# =====================================================================

with open(f"{DIR_AGE}/results.json", "r") as f:
    results_age = json.load(f)

with open(f"{DIR_EMI}/results.json", "r") as f:
    results_emi = json.load(f)

# ⭐ Ensure civil results has `best_model` in case only `best` is stored
if "best_model" not in results_emi and "best" in results_emi:
    results_emi["best_model"] = results_emi["best"]

EXPLANATION = {
    "title": "Why this model was selected",
    "points": [
        "It achieved the highest accuracy among tested models.",
        "It produced stable and smooth multi-year forecasts.",
        "It generalized well without overfitting.",
        "It captured long-term migration/emigration trends."
    ]
}

# =====================================================================
# FORECAST HELPERS
# =====================================================================

def mlp_forecast(model, scaler, last_vals, steps, window):
    preds = []
    cur = last_vals.copy()

    for _ in range(steps):
        X = cur[-window:].reshape(1, -1)
        pred_scaled = model.predict(X)[0]
        pred = scaler.inverse_transform([[pred_scaled]])[0][0]
        preds.append(float(pred))
        cur = np.vstack([cur, [pred_scaled]])
    return preds

def civil_forecast(model, scaler, last_vals, steps, window, status):
    preds = []
    cur = last_vals.copy()

    for _ in range(steps):
        X = cur[-window:].reshape(1, -1)
        pred_scaled = model.predict(X)[0]
        pred = max(scaler.inverse_transform([[pred_scaled]])[0][0], 0)

        # extra boosting for tiny categories
        if status in tiny_categories:
            pred = max(pred**2, 0)

        preds.append(float(pred))
        cur = np.vstack([cur, [pred_scaled]])
    return preds

# =====================================================================
# ROUTER: /predict (gender, age, civil)
# =====================================================================

@app.route("/predict", methods=["GET"])
def unified_predict():

    # ------------------ GENDER -------------------
    if "gender" in request.args:
        gender = request.args.get("gender")
        if gender not in ["male", "female"]:
            return jsonify({"error": "gender must be male or female"}), 400

        model = male_model if gender == "male" else female_model
        scaler = scaler_male if gender == "male" else scaler_female

        df = pd.read_csv("gender_yearly.csv")
        vals = df[gender].values.reshape(-1, 1)

        scaled = scaler.transform(vals)
        preds = mlp_forecast(model, scaler, scaled[-WINDOW_G:], 10, WINDOW_G)

        years = list(range(int(df["year"].iloc[-1]) + 1,
                           int(df["year"].iloc[-1]) + 11))

        return jsonify({
            "gender": gender,
            "future_years": years,
            "forecast": preds,
            "model_used": best_gender
        })

    # ------------------ AGE -------------------
    if "group" in request.args:
        group = request.args.get("group")
        if group not in CATEGORIES_AGE:
            return jsonify({"error": "invalid age group"}), 400

        model = models_age[group]
        scaler = scalers_age[group]

        df = pd.read_csv("age_yearly.csv")
        df["ageGroup_clean"] = (
            df["ageGroup"]
            .str.replace(" - ", "_")
            .str.replace("-", "_")
            .str.replace(" ", "_")
            .str.lower()
        )

        vals = df[df["ageGroup_clean"] == group]["count"].values.reshape(-1, 1)
        scaled = scaler.transform(vals)

        preds = mlp_forecast(model, scaler, scaled[-WINDOW_A:], 10, WINDOW_A)

        years = list(range(int(df["year"].max()) + 1,
                           int(df["year"].max()) + 11))

        return jsonify({
            "group": group,
            "future_years": years,
            "forecast": preds,
            "model_used": best_age,

            # ⭐ AGE modal payload
            "explanation": EXPLANATION,
            "allModelResults": results_age,
            "best_model": results_age["best_model"]
        })

    # ------------------ CIVIL STATUS -------------------
    if "status" in request.args:
        status = request.args.get("status")
        if status not in CATEGORIES_CIVIL:
            return jsonify({"error": f"invalid status"}), 400

        model = models_emi[status]
        scaler = scalers_emi[status]

        df = pd.read_csv("emigrants_marital_status.csv")
        vals = df[status].values.reshape(-1, 1)

        if status in tiny_categories:
            vals = np.sqrt(vals)

        scaled = scaler.transform(vals)

        preds = civil_forecast(model, scaler, scaled[-WINDOW_C:], 10, WINDOW_C, status)

        years = list(range(int(df["year"].max()) + 1,
                           int(df["year"].max()) + 11))

        return jsonify({
            "status": status,
            "years": years,
            "forecast": preds,
            "model_used": best_emi,

            # ⭐ CIVIL modal payload (for single-status charts)
            "explanation": EXPLANATION,
            "allModelResults": results_emi,
            "best_model": results_emi["best_model"]
        })

    return jsonify({"error": "missing gender/group/status"}), 400


# =====================================================================
# AGE: /predict-all
# =====================================================================

@app.route("/predict-all", methods=["GET"])
def age_predict_all():
    df = pd.read_csv("age_yearly.csv")
    df["ageGroup_clean"] = (
        df["ageGroup"]
        .str.replace(" - ", "_")
        .str.replace("-", "_")
        .str.replace(" ", "_")
        .str.lower()
    )

    future_years = list(range(int(df["year"].max()) + 1,
                              int(df["year"].max()) + 11))

    output = {}
    for group in CATEGORIES_AGE:
        model = models_age[group]
        scaler = scalers_age[group]

        vals = df[df["ageGroup_clean"] == group]["count"].values.reshape(-1, 1)
        scaled = scaler.transform(vals)

        preds = mlp_forecast(model, scaler, scaled[-WINDOW_A:], 10, WINDOW_A)

        output[group] = {"years": future_years, "forecast": preds}

    return jsonify({
        "groups": CATEGORIES_AGE,
        "data": output,
        "best_model": best_age
    })


# =====================================================================
# EDUCATION ENDPOINTS
# =====================================================================

@app.route("/predict-education")
def predict_education():
    category = request.args.get("category")

    if category not in CATEGORIES_EDU:
        return jsonify({"error": f"Invalid category"}), 400

    model = models_edu[category]
    scaler = scalers_edu[category]

    df = pd.read_csv("education_yearly.csv")
    vals = df[category].values.reshape(-1, 1)
    scaled = scaler.transform(vals)

    preds = mlp_forecast(model, scaler, scaled[-WINDOW_E:], 10, WINDOW_E)

    years = list(range(int(df["year"].max()) + 1,
                       int(df["year"].max()) + 11))

    return jsonify({
        "category": category,
        "future_years": years,
        "forecast": preds,
        "model_used": best_edu
    })


@app.route("/predict-education-all")
def predict_education_all():
    df = pd.read_csv("education_yearly.csv")
    years = list(range(int(df["year"].max()) + 1,
                       int(df["year"].max()) + 11))

    out = {}
    for c in CATEGORIES_EDU:
        model = models_edu[c]
        scaler = scalers_edu[c]

        vals = df[c].values.reshape(-1, 1)
        scaled = scaler.transform(vals)

        preds = mlp_forecast(model, scaler, scaled[-WINDOW_E:], 10, WINDOW_E)

        out[c] = [{"year": y, "predicted": float(p)} for y, p in zip(years, preds)]

    return jsonify({
        "results": out,
        "model_used": best_edu
    })


# =====================================================================
# CIVIL STATUS: /civil-predict-all
# =====================================================================

@app.route("/civil-predict-all")
def civil_predict_all():
    df = pd.read_csv("emigrants_marital_status.csv")
    years = list(range(int(df["year"].max()) + 1,
                       int(df["year"].max()) + 11))

    out = {}
    for c in CATEGORIES_CIVIL:
        model = models_emi[c]
        scaler = scalers_emi[c]

        vals = df[c].values.reshape(-1, 1)
        if c in tiny_categories:
            vals = np.sqrt(vals)

        scaled = scaler.transform(vals)

        preds = civil_forecast(model, scaler, scaled[-WINDOW_C:], 10, WINDOW_C, c)

        out[c] = {"years": years, "forecast": preds}

    return jsonify({
        "statuses": CATEGORIES_CIVIL,
        "data": out,
        "model_used": best_emi,

        # ⭐ CIVIL: for the big MLP comparison modal
        "explanation": EXPLANATION,
        "allModelResults": results_emi,
        "best_model": results_emi["best_model"]
    })


# =====================================================================
# RAW METRICS (for model comparison modals)
# =====================================================================

@app.route("/results", methods=["GET"])
def unified_results():
    # ensure civil results return `best_model`
    if "civil" in request.args:
        with open(f"{DIR_EMI}/results.json", "r") as f:
            raw = json.load(f)
        if "best_model" not in raw and "best" in raw:
            raw["best_model"] = raw["best"]
        return jsonify(raw)

    if "age" in request.args:
        with open(f"{DIR_AGE}/results.json", "r") as f:
            return jsonify(json.load(f))

    if "education" in request.args:
        with open(f"{DIR_EDU}/results.json", "r") as f:
            return jsonify(json.load(f))

    # default: gender results
    with open(f"{DIR_GENDER}/results.json", "r") as f:
        return jsonify(json.load(f))


# =====================================================================
# RUN SERVER
# =====================================================================
if __name__ == "__main__":
    print("🚀 Unified Prediction Server running on port 5001...")
    app.run(port=5001, debug=True)
