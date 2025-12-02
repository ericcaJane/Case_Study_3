// forecastService.js

export const getGenderForecast = async (gender) => {
  try {
    const res = await fetch(
      `http://localhost:5001/predict?gender=${gender}`
    );

    if (!res.ok) {
      throw new Error(`Server returned ${res.status}`);
    }

    const data = await res.json();
    return data;

  } catch (err) {
    console.error("Forecast error:", err);
    return null;
  }
};
