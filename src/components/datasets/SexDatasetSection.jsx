import React from "react";
import GenderForecastPanel from "../GenderForecastPanel";

export default function SexDatasetSection({
  setShowGenderMLPModal,
  handleForecast,
  forecastData,
  forecastYears,
  setForecastYears
}) {
  return (
    <div
      style={{
        marginTop: "24px",
        padding: "32px",
        border: "3px solid #FCD34D",
        borderRadius: "16px",
        background: "white",
        boxShadow: "0 4px 16px rgba(251, 191, 36, 0.2)"
      }}
    >
      {/* Header Section */}
      <div
        style={{
          background: "white",
          padding: "20px",
          borderRadius: "12px",
          marginBottom: "24px",
          border: "2px solid #FCD34D",
          boxShadow: "0 2px 8px rgba(0,0,0,0.08)"
        }}
      >
        <h3
          style={{
            margin: "0 0 12px 0",
            color: "#92400E",
            fontSize: "24px",
            fontWeight: "800",
            display: "flex",
            alignItems: "center",
            gap: "12px"
          }}
        >
          <span
            style={{
              background: "linear-gradient(135deg, #FCD34D 0%, #FBBF24 100%)",
              padding: "8px 12px",
              borderRadius: "8px",
              fontSize: "28px"
            }}
          >
            🔮
          </span>
          Forecast Male / Female Emigrants
        </h3>
        <p
          style={{
            margin: 0,
            color: "#78350F",
            fontSize: "15px",
            lineHeight: "1.6"
          }}
        >
          Analyze and predict emigration patterns by gender using advanced
          forecasting models
        </p>
      </div>

      {/* MLP MODAL BUTTON */}
      <button
        onClick={() => setShowGenderMLPModal(true)}
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
          gap: "12px",
          marginBottom: "24px"
        }}
        onMouseOver={(e) => {
          e.target.style.transform = "translateY(-2px)";
          e.target.style.boxShadow = "0 6px 16px rgba(245, 158, 11, 0.4)";
        }}
        onMouseOut={(e) => {
          e.target.style.transform = "translateY(0)";
          e.target.style.boxShadow = "0 4px 12px rgba(245, 158, 11, 0.3)";
        }}
      >
        <span style={{ fontSize: "24px" }}>📊</span>
        <span>Open Gender MLP Forecast Modal</span>
        <span style={{ fontSize: "20px" }}>→</span>
      </button>

      {/* FORECAST PANEL - only pink chart */}
      <GenderForecastPanel
        handleForecast={handleForecast}
        forecastData={forecastData}
        forecastYears={forecastYears}
        setForecastYears={setForecastYears}
      />
    </div>
  );
}
