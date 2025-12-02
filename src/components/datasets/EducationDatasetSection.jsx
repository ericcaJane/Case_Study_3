import React from "react";
import EducationForecastPanel from "../EducationForecastPanel";
import ChartLine from "../ChartLine";


export default function EducationDatasetSection({
  setShowEducationMLPModal,
  handleEducationForecast,
  educationForecastData,
  educationForecastYears,
  setEducationForecastYears
}) {
  return (
    <div
      style={{
        marginTop: "24px",
        padding: "32px",
        border: "3px solid #f3f2f1ff",
        borderRadius: "16px",
        background: "white",
        boxShadow: "0 4px 16px rgba(251, 191, 36, 0.2)"
      }}
    >
      {/* Header */}
      <div style={{
        background: "#FFFBEB",
        padding: "20px",
        borderRadius: "12px",
        marginBottom: "24px",
        border: "2px solid #FCD34D",
        boxShadow: "0 2px 8px rgba(0,0,0,0.08)"
      }}>
        <h3 style={{
          margin: 0,
          color: "#92400E",
          fontSize: "24px",
          fontWeight: "800",
          display: "flex",
          alignItems: "center",
          gap: "12px"
        }}>
          <span style={{
            background: "linear-gradient(135deg, #FCD34D 0%, #FBBF24 100%)",
            padding: "8px 12px",
            borderRadius: "8px",
            fontSize: "28px"
          }}>
            🎓
          </span>
          Forecast Education-Level Emigrants
        </h3>

        <p style={{
          margin: 0,
          color: "#78350F",
          fontSize: "15px",
          lineHeight: "1.6"
        }}>
          Analyze and predict emigration patterns based on education levels using advanced forecasting models.
        </p>
      </div>

      {/* MLP MODAL BUTTON */}
      <button
        onClick={() => setShowEducationMLPModal(true)}
        style={{
          width: "100%",
          padding: "16px 24px",
          background: "linear-gradient(135deg, #FBBF24 0%, #F59E0B 100%)",
          color: "white",
          border: "none",
          borderRadius: "12px",
          cursor: "pointer",
          fontWeight: "700",
          fontSize: "16px",
          boxShadow: "0 4px 12px rgba(245, 158, 11, 0.3)",
          transition: "all 0.3s ease",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "12px"
        }}
      >
        <span style={{ fontSize: "24px" }}>📘</span>
        <span>Open Education MLP Forecast Modal</span>
        <span style={{ fontSize: "20px" }}>→</span>
      </button>

      {/* FORECAST PANEL */}
      <EducationForecastPanel
        handleEducationForecast={handleEducationForecast}
        educationForecastData={educationForecastData}
        educationForecastYears={educationForecastYears}
        setEducationForecastYears={setEducationForecastYears}
      />

      {/* CHART */}
      {educationForecastData && (
        <div style={{
          marginTop: "24px",
          padding: "24px",
          background: "#FFFBEB",
          borderRadius: "12px",
          border: "2px solid #FCD34D",
          boxShadow: "0 2px 8px rgba(0,0,0,0.08)"
        }}>
          <ChartLine
            data={{
              labels: educationForecastData.years.slice(0, educationForecastYears),
              datasets: [
                {
                  label: "Forecasted Values",
                  data: educationForecastData.values.slice(0, educationForecastYears),
                  borderColor: "#F59E0B",
                  borderWidth: 3,
                  tension: 0.3,
                },
              ],
            }}
          />
        </div>
      )}
    </div>
  );
}
