import React from "react";
import CivilForecastPanel from "../CivilForecastPanel";
import ChartLine from "../ChartLine";
import CivilMLPModal from "../CivilMLPModal";

export default function CivilDatasetSection({
  setShowCivilMLPModal,
  showCivilMLPModal,
  handleCivilForecast,
  handleCivilForecastAll,
  civilForecastData,
  civilForecastYears,
  setCivilForecastYears,
  civilModalLoading,
  civilModalMessage,
  civilModelExplanation,
  civilModelResults,
  civilTableData,
  civilChartData
}) {

  // ✅ SAFEST, CLEANEST CHECK
  const isMultiGroup =
    civilForecastData &&
    typeof civilForecastData === "object" &&
    !civilForecastData.years;

  return (
    <div
      style={{
        marginTop: "24px",
        padding: "32px",
        border: "3px solid #FEF3C7",
        borderRadius: "20px",
        background: "white",
        boxShadow: "0 6px 24px rgba(234, 179, 8, 0.15)"
      }}
    >
      {/* HEADER */}
      <div
        style={{
          background: "linear-gradient(135deg, #FFFBEB 0%, #FEF3C7 100%)",
          padding: "24px",
          borderRadius: "16px",
          marginBottom: "28px",
          border: "3px solid #FDE047",
          boxShadow: "0 4px 12px rgba(234, 179, 8, 0.1)"
        }}
      >
        <h3
          style={{
            margin: 0,
            color: "#78350F",
            fontSize: "28px",
            fontWeight: "900",
            display: "flex",
            alignItems: "center",
            gap: "14px",
            marginBottom: "8px"
          }}
        >
          <span
            style={{
              background: "linear-gradient(135deg, #FEF3C7 0%, #FDE047 100%)",
              padding: "10px 14px",
              borderRadius: "12px",
              fontSize: "32px",
              boxShadow: "0 2px 8px rgba(234, 179, 8, 0.2)"
            }}
          >
            💍
          </span>
          Forecast Civil Status Emigrants
        </h3>

        <p
          style={{
            margin: 0,
            color: "#92400E",
            fontSize: "15px",
            lineHeight: "1.6",
            fontWeight: 600
          }}
        >
          Predict emigrant trends based on marital status groups using advanced
          MLP forecasting models.
        </p>
      </div>

      {/* OPEN MODAL BUTTON */}
      <button
        onClick={() => setShowCivilMLPModal(true)}
        style={{
          width: "100%",
          padding: "18px 28px",
          background: "linear-gradient(135deg, #FCD34D 0%, #EAB308 100%)",
          color: "#78350F",
          border: "3px solid #FDE047",
          borderRadius: "16px",
          cursor: "pointer",
          fontWeight: "800",
          fontSize: "17px",
          boxShadow: "0 6px 16px rgba(234, 179, 8, 0.25)",
          transition: "all 0.3s ease",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "12px",
          marginBottom: "32px"
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = "translateY(-3px)";
          e.currentTarget.style.boxShadow = "0 8px 20px rgba(234, 179, 8, 0.35)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = "translateY(0)";
          e.currentTarget.style.boxShadow = "0 6px 16px rgba(234, 179, 8, 0.25)";
        }}
      >
        <span style={{ fontSize: "26px" }}>📊</span>
        <span>Open Civil Status Forecast Modal</span>
        <span style={{ fontSize: "22px" }}>→</span>
      </button>

      {/* MODAL */}
      <CivilMLPModal
        visible={showCivilMLPModal}
        onClose={() => setShowCivilMLPModal(false)}
        onLoad={handleCivilForecastAll}
        loading={civilModalLoading}
        message={civilModalMessage}
        explanation={civilModelExplanation}
        allModelResults={civilModelResults}
        tableData={civilTableData}
        chartData={civilChartData}
      />

      {/* SINGLE-GROUP FORECAST PANEL */}
      <CivilForecastPanel
        key={isMultiGroup ? "multi" : civilForecastData?.years}
        handleForecast={handleCivilForecast}
        forecastData={isMultiGroup ? null : civilForecastData}
        forecastYears={civilForecastYears}
        setForecastYears={setCivilForecastYears}
      />

      {/* MULTI-GROUP RESULTS */}
      {isMultiGroup && (
        <div style={{ marginTop: 40 }}>
          <div
            style={{
              background: "linear-gradient(135deg, #FFFBEB 0%, #FEF3C7 100%)",
              padding: "24px",
              borderRadius: "16px",
              marginBottom: "28px",
              border: "3px solid #FDE047",
              boxShadow: "0 4px 12px rgba(234, 179, 8, 0.15)"
            }}
          >
            <h3
              style={{
                margin: 0,
                fontWeight: 900,
                fontSize: "26px",
                color: "#78350F",
                display: "flex",
                alignItems: "center",
                gap: "12px"
              }}
            >
              <span style={{ fontSize: "32px" }}>🔮</span>
              Multi-Civil Status Forecast Results
            </h3>
          </div>

          {Object.keys(civilForecastData).map((statusKey) => {
            const g = civilForecastData[statusKey];
            if (!g?.years || !g?.values) return null;

            const LABELS = {
              single: "Single",
              married: "Married",
              widower: "Widower",
              separated: "Separated",
              divorced: "Divorced",
              notReported: "Not Reported"
            };

            const ICONS = {
              single: "❤️",
              married: "💍",
              widower: "🕊",
              separated: "💔",
              divorced: "⚖️",
              notReported: "❓"
            };

            const COLORS = {
              single: "#EAB308",
              married: "#F59E0B",
              widower: "#D97706",
              separated: "#B45309",
              divorced: "#F59E0B",
              notReported: "#FCD34D"
            };

            return (
              <div
                key={statusKey}
                style={{
                  marginTop: 24,
                  padding: 28,
                  background: "white",
                  borderRadius: 20,
                  border: "3px solid #FEF3C7",
                  boxShadow: "0 4px 16px rgba(234, 179, 8, 0.15)"
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "12px",
                    marginBottom: "20px",
                    paddingBottom: "16px",
                    borderBottom: "2px solid #FEF3C7"
                  }}
                >
                  <span
                    style={{
                      fontSize: "32px",
                      padding: "8px 12px",
                      background: "linear-gradient(135deg, #FFFBEB 0%, #FEF3C7 100%)",
                      borderRadius: "12px",
                      border: "2px solid #FDE047"
                    }}
                  >
                    {ICONS[statusKey]}
                  </span>
                  <h4
                    style={{
                      margin: 0,
                      fontSize: "24px",
                      fontWeight: "900",
                      color: "#78350F"
                    }}
                  >
                    {LABELS[statusKey]}
                  </h4>
                </div>

                {/* Values */}
                <div
                  style={{
                    marginTop: 20,
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))",
                    gap: 16
                  }}
                >
                  {g.years.slice(0, civilForecastYears).map((year, i) => (
                    <div
                      key={i}
                      style={{
                        padding: 18,
                        border: "3px solid #FEF3C7",
                        borderRadius: 16,
                        background: "linear-gradient(135deg, #FFFBEB 0%, #FEF9C3 100%)",
                        fontWeight: 700,
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
                      <div style={{ color: "#92400E", fontWeight: 700 }}>
                        📅 {year}
                      </div>
                      <div
                        style={{
                          fontSize: "1.5rem",
                          color: "#78350F",
                          marginTop: 8,
                          fontWeight: 900
                        }}
                      >
                        {Math.round(g.values[i]).toLocaleString()}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Chart */}
                <div
                  style={{
                    marginTop: 28,
                    padding: "24px",
                    background: "linear-gradient(135deg, #FFFBEB 0%, #FEF9C3 100%)",
                    borderRadius: 16,
                    border: "2px solid #FEF3C7"
                  }}
                >
                  <h5
                    style={{
                      margin: 0,
                      marginBottom: "16px",
                      fontSize: "18px",
                      fontWeight: 800,
                      color: "#78350F",
                      display: "flex",
                      alignItems: "center",
                      gap: "8px"
                    }}
                  >
                    📈 Trend Visualization
                  </h5>
                  <ChartLine
                    data={{
                      labels: g.years.slice(0, civilForecastYears),
                      datasets: [
                        {
                          label: `${LABELS[statusKey]} Forecast`,
                          data: g.values.slice(0, civilForecastYears),
                          borderColor: COLORS[statusKey],
                          backgroundColor: COLORS[statusKey] + "55",
                          borderWidth: 3,
                          tension: 0.3,
                          pointRadius: 6,
                          pointBackgroundColor: COLORS[statusKey],
                          pointBorderColor: "#FFFFFF",
                          pointBorderWidth: 2
                        }
                      ]
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}