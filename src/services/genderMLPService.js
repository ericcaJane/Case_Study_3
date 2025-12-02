const API_BASE = "http://localhost:5000";

// ==============================
// PREDICT
// ==============================
export const loadGenderMLP = async (gender = "male") => {
  const res = await fetch(`${API_BASE}/predict?gender=${gender}`);
  if (!res.ok) throw new Error("Prediction failed");
  return await res.json();
};

// ==============================
// GET BEST MODEL INFO
// ==============================
export const getBestModel = async () => {
  const res = await fetch(`${API_BASE}/best-model`);
  if (!res.ok) throw new Error("Failed to fetch best model");
  return await res.json();
};
