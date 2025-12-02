const API = "http://localhost:5000";

// TRAIN model
export const trainGenderMLP = async () => {
  const res = await fetch(`${API}/train`, { method: "POST" });
  return res.json();
};

export const predictGenderMLP = async (gender) => {
  const res = await fetch(`http://localhost:5001/predict?gender=${gender}`);

  if (!res.ok) {
    throw new Error(`Failed gender forecast: ${res.status}`);
  }

  return await res.json();
};

