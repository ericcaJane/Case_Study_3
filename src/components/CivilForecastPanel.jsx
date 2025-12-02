import React, { useState } from "react";

// 📌 ADD CHART IMPORTS
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend
);

export default function CivilForecastPanel({
  handleForecast,
  forecastData,
  forecastYears,
  setForecastYears
}) {
  const [loading, setLoading] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState(null);

  const CIVIL_STATUS = [
    { label: "Single", value: "single", icon: "❤️", color: "#EAB308" },
    { label: "Married", value: "married", icon: "💍", color: "#F59E0B" },
    { label: "Widower", value: "widower", icon: "🕊", color: "#D97706" },
    { label: "Separated", value: "separated", icon: "💔", color: "#B45309" },
    { label: "Divorced", value: "divorced", icon: "⚖️", color: "#F59E0B" },
    { label: "Not Reported", value: "notReported", icon: "❓", color: "#FCD34D" }
  ];

  const handlePrediction = async (status) => {
    setLoading(true);
    setSelectedStatus(status);
    await handleForecast(status);
    setLoading(false);
  };

  const getColor = (value) =>
    CIVIL_STATUS.find((g) => g.value === value)?.color || "#EAB308";

  return (
    <div style={{ maxWidth: "1400px", margin: "0 auto", background: "#FFFFFF", padding: "40px 20px" }}>
      {/* HEADER */}
      <div
        style={{
          background: "linear-gradient(135deg, #FFFBEB 0%, #FEF3C7 100%)",
          padding: "32px",
          borderRadius: "16px",
          marginBottom: "32px",
          border: "3px solid #FDE047",
          boxShadow: "0 4px 20px rgba(234, 179, 8, 0.15)"
        }}
      >
        <h2
          style={{
            margin: 0,
            color: "#78350F",
            fontSize: "32px",
            fontWeight: "900",
            display: "flex",
            alignItems: "center",
            gap: "16px",
            marginBottom: "8px"
          }}
        >
          <span style={{ fontSize: "3rem" }}>📊</span>
          Civil Status Forecasting
        </h2>
        <p
          style={{
            margin: 0,
            color: "#92400E",
            fontSize: "1.15rem",
            fontWeight: 600
          }}
        >
          Predict emigrant trends per marital category
        </p>
      </div>

      {/* CONTROLS */}
      <div
        style={{
          background: "white",
          padding: "36px",
          borderRadius: "24px",
          boxShadow: "0 8px 32px rgba(234, 179, 8, 0.2)",
          marginBottom: "36px",
          border: "3px solid #FEF3C7"
        }}
      >
        {/* Top controls */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "28px",
            flexWrap: "wrap",
            gap: "20px"
          }}
        >
          <h3
            style={{
              margin: 0,
              fontSize: "1.4rem",
              fontWeight: 900,
              color: "#78350F"
            }}
          >
            Choose Civil Status
          </h3>

          {/* YEARS SELECTOR */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 14,
              background: "linear-gradient(135deg, #FFFBEB 0%, #FEF3C7 100%)",
              padding: "14px 24px",
              borderRadius: "16px",
              border: "2px solid #FDE047"
            }}
          >
            <label
              style={{
                fontWeight: 800,
                color: "#78350F",
                display: "flex",
                alignItems: "center",
                gap: 10,
                fontSize: "1rem"
              }}
            >
              <span style={{ fontSize: "1.4rem" }}>🔮</span>
              Forecast:
            </label>

            <select
              value={forecastYears}
              onChange={(e) => setForecastYears(parseInt(e.target.value))}
              style={{
                padding: "12px 18px",
                borderRadius: "12px",
                border: "2px solid #EAB308",
                fontWeight: 700,
                background: "white",
                cursor: "pointer",
                fontSize: "1rem",
                color: "#78350F"
              }}
            >
              {[...Array(10)].map((_, i) => (
                <option key={i} value={i + 1}>
                  {i + 1} {i + 1 === 1 ? "Year" : "Years"}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* CATEGORY BUTTONS */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(190px, 1fr))",
            gap: 18
          }}
        >
          {CIVIL_STATUS.map((g) => {
            const isSelected = selectedStatus === g.value;
            return (
              <button
                key={g.value}
                onClick={() => handlePrediction(g.value)}
                disabled={loading}
                style={{
                  padding: "24px",
                  background: isSelected
                    ? `linear-gradient(135deg, ${g.color} 0%, ${g.color}dd 100%)`
                    : loading
                    ? "#FFFBEB"
                    : "white",
                  color: isSelected ? "white" : "#78350F",
                  borderRadius: "18px",
                  border: isSelected
                    ? `3px solid ${g.color}`
                    : "3px solid #FEF3C7",
                  cursor: loading ? "not-allowed" : "pointer",
                  fontWeight: 800,
                  fontSize: "1.05rem",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 14,
                  transition: "all 0.3s ease",
                  boxShadow: isSelected
                    ? `0 10px 30px ${g.color}50`
                    : "0 4px 12px rgba(234, 179, 8, 0.15)",
                  transform: isSelected ? "translateY(-6px)" : "translateY(0)",
                  opacity: loading ? 0.6 : 1
                }}
                onMouseEnter={(e) => {
                  if (!isSelected && !loading) {
                    e.currentTarget.style.transform = "translateY(-3px)";
                    e.currentTarget.style.boxShadow = "0 8px 20px rgba(234, 179, 8, 0.25)";
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isSelected) {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow = "0 4px 12px rgba(234, 179, 8, 0.15)";
                  }
                }}
              >
                <span style={{ fontSize: "2.6rem" }}>{g.icon}</span>
                <span>{g.label}</span>
                {isSelected && <span style={{ fontSize: "0.8rem" }}>✓ Selected</span>}
              </button>
            );
          })}
        </div>
      </div>

      {/* LOADING UI */}
      {loading && (
        <div
          style={{
            padding: "52px",
            textAlign: "center",
            background: "linear-gradient(135deg, #FFFBEB 0%, #FEF3C7 100%)",
            borderRadius: "24px",
            border: "3px solid #FDE047",
            boxShadow: "0 8px 32px rgba(234, 179, 8, 0.3)"
          }}
        >
          <div style={{ fontSize: "4.5rem", marginBottom: "20px", animation: "pulse 2s ease-in-out infinite" }}>🔮</div>
          <h3
            style={{
              margin: 0,
              fontSize: "1.7rem",
              fontWeight: 900,
              color: "#78350F"
            }}
          >
            Analyzing Trends...
          </h3>
          <p style={{ margin: 0, color: "#92400E", fontWeight: 600, marginTop: "8px" }}>
            Generating {forecastYears}-year forecast
          </p>
        </div>
      )}

      {/* SINGLE FORECAST RESULT */}
      {forecastData && !loading && (
        <>
          <div
            style={{
              background: "white",
              borderRadius: "24px",
              boxShadow: "0 8px 32px rgba(234, 179, 8, 0.25)",
              border: "3px solid #FEF3C7",
              overflow: "hidden"
            }}
          >
            <div
              style={{
                background: `linear-gradient(135deg, ${getColor(
                  selectedStatus
                )} 0%, ${getColor(selectedStatus)}cc 100%)`,
                padding: "32px",
                color: "white",
                fontWeight: 900,
                fontSize: "1.7rem",
                borderBottom: "3px solid #FDE047"
              }}
            >
              📈 Civil Status Forecast Results
            </div>

            {/* VALUES */}
            <div style={{ padding: "28px" }}>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))",
                  gap: 18
                }}
              >
                {forecastData.years.slice(0, forecastYears).map((year, i) => {
                  const value = Math.round(forecastData.values[i]);
                  return (
                    <div
                      key={i}
                      style={{
                        padding: "20px",
                        background: "linear-gradient(135deg, #FFFBEB 0%, #FEF9C3 100%)",
                        borderRadius: "18px",
                        border: "3px solid #FEF3C7",
                        textAlign: "center",
                        transition: "transform 0.2s ease",
                        cursor: "default"
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = "scale(1.05)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = "scale(1)";
                      }}
                    >
                      <div style={{ color: "#92400E", fontWeight: 700 }}>📅 {year}</div>
                      <div
                        style={{
                          fontSize: "1.6rem",
                          marginTop: 10,
                          fontWeight: 900,
                          color: "#78350F"
                        }}
                      >
                        {value.toLocaleString()}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* 🌈 VISUALIZATION BLOCK */}
          <div
            style={{
              marginTop: "32px",
              padding: "32px",
              background: "white",
              borderRadius: "24px",
              border: "3px solid #FEF3C7",
              boxShadow: "0 8px 32px rgba(234, 179, 8, 0.25)"
            }}
          >
            <h3
              style={{
                marginBottom: "20px",
                fontSize: "1.5rem",
                fontWeight: 900,
                color: "#78350F",
                display: "flex",
                alignItems: "center",
                gap: "10px"
              }}
            >
              📉 Forecast Trend Visualization
            </h3>

            <Line
              data={{
                labels: forecastData.years.slice(0, forecastYears),
                datasets: [
                  {
                    label: `${selectedStatus} Forecast`,
                    data: forecastData.values.slice(0, forecastYears),
                    borderColor: getColor(selectedStatus),
                    backgroundColor: getColor(selectedStatus) + "55",
                    borderWidth: 3,
                    tension: 0.3,
                    pointRadius: 6,
                    pointBackgroundColor: getColor(selectedStatus),
                    pointBorderColor: "#FFFFFF",
                    pointBorderWidth: 2
                  }
                ]
              }}
              options={{
                responsive: true,
                plugins: {
                  legend: { 
                    position: "top",
                    labels: {
                      color: "#78350F",
                      font: { weight: 700, size: 13 }
                    }
                  },
                  tooltip: {
                    backgroundColor: "#FFFBEB",
                    titleColor: "#78350F",
                    bodyColor: "#92400E",
                    borderColor: "#FDE047",
                    borderWidth: 2,
                    padding: 12,
                    displayColors: true
                  }
                },
                scales: {
                  y: {
                    ticks: { color: "#78350F", font: { weight: 700 } },
                    grid: { color: "#FEF3C7" }
                  },
                  x: {
                    ticks: { color: "#78350F", font: { weight: 700 } },
                    grid: { color: "#FEF3C7" }
                  }
                }
              }}
            />
          </div>
        </>
      )}
    </div>
  );
}