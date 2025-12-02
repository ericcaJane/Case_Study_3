import React from "react";
import AgeForecastPanel from "../AgeForecastPanel";
import ChartLine from "../ChartLine";

export default function AgeDatasetSection({
  setShowAgeMLPModal,
  handleAgeForecast,
  ageForecastData,
  ageForecastYears,
  setAgeForecastYears
}) {
  
  // --------------------------
  // 🔍 DETECT FORECAST MODE
  // --------------------------
  const isMultiGroup =
    ageForecastData &&
    typeof ageForecastData === "object" &&
    !("years" in ageForecastData);   // multi = no .years key

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
      {/* HEADER */}
      <div
        style={{
          background: "#FFFBEB",
          padding: "20px",
          borderRadius: "12px",
          marginBottom: "24px",
          border: "2px solid #FCD34D",
          boxShadow: "0 2px 8px rgba(0,0,0,0.08)"
        }}
      >
        <h3
          style={{
            margin: 0,
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
              background: "linear-gradient(135deg, #FEF3C7 0%, #FDE68A 100%)",
              padding: "8px 12px",
              borderRadius: "8px",
              fontSize: "28px"
            }}
          >
            👥
          </span>
          Forecast Age-Group Emigrants
        </h3>

        <p
          style={{
            margin: 0,
            color: "#78350F",
            fontSize: "15px",
            lineHeight: "1.6"
          }}
        >
          Analyze and predict emigration patterns based on age brackets using
          advanced MLP forecasting models.
        </p>
      </div>

      {/* OPEN MODAL BUTTON */}
      <button
        onClick={() => setShowAgeMLPModal(true)}
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
        <span style={{ fontSize: "24px" }}>📊</span>
        <span>Open Age MLP Forecast Modal</span>
        <span style={{ fontSize: "20px" }}>→</span>
      </button>

      {/* FORECAST PANEL (single-group mode only) */}
      <AgeForecastPanel
        handleForecast={handleAgeForecast}
        forecastData={isMultiGroup ? null : ageForecastData}
        forecastYears={ageForecastYears}
        setForecastYears={setAgeForecastYears}
      />

      {/* ------------------------------- */}
      {/*          MULTI-GROUP VIEW       */}
      {/* ------------------------------- */}
      {isMultiGroup && (
        <div style={{ marginTop: 32 }}>
          <h3
            style={{
              fontWeight: 800,
              fontSize: "22px",
              color: "#92400E",
              marginBottom: 10
            }}
          >
            🔮 Multi-Age Forecast Results
          </h3>

          {Object.keys(ageForecastData).map((groupKey) => {
            const g = ageForecastData[groupKey];
            if (!g?.years || !g?.values) return null;

            return (
              <div
                key={groupKey}
                style={{
                  marginTop: 24,
                  padding: 24,
                  background: "#FFFBEB",
                  borderRadius: 12,
                  border: "2px solid #FCD34D",
                  boxShadow: "0 2px 6px rgba(0,0,0,0.06)"
                }}
              >
                <h4
                  style={{
                    margin: 0,
                    fontSize: "20px",
                    fontWeight: "800",
                    color: "#B45309"
                  }}
                >
                  {groupKey.replace("_", "–")} Years
                </h4>

                <div
                  style={{
                    marginTop: 16,
                    display: "flex",
                    flexWrap: "wrap",
                    gap: 12
                  }}
                >
                  {g.years.slice(0, ageForecastYears).map((year, i) => (
                    <div
                      key={i}
                      style={{
                        padding: 16,
                        border: "2px solid #FCD34D",
                        borderRadius: 12,
                        background: "white",
                        fontWeight: 700,
                        minWidth: 150
                      }}
                    >
                      📅 {year}
                      <div
                        style={{
                          fontSize: "1.4rem",
                          color: "#B45309",
                          marginTop: 8
                        }}
                      >
                        {Math.round(g.values[i]).toLocaleString()}
                      </div>
                    </div>
                  ))}
                </div>

                {/* CHART */}
                <div style={{ marginTop: 24 }}>
                  <ChartLine
                    data={{
                      labels: g.years.slice(0, ageForecastYears),
                      datasets: [
                        {
                          label: `${groupKey} Forecast`,
                          data: g.values.slice(0, ageForecastYears),
                          borderColor: "#F59E0B",
                          borderWidth: 3,
                          tension: 0.3
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

      {/* ------------------------------- */}
      {/*       SINGLE-GROUP CHART        */}
      {/* ------------------------------- */}
      {!isMultiGroup && ageForecastData && (
        <div
          style={{
            marginTop: "24px",
            padding: "24px",
            background: "#FFFBEB",
            borderRadius: "12px",
            border: "2px solid #FCD34D",
            boxShadow: "0 2px 8px rgba(0,0,0,0.08)"
          }}
        >
          <ChartLine
            data={{
              labels: ageForecastData.years.slice(0, ageForecastYears),
              datasets: [
                {
                  label: "Age Forecast",
                  data: ageForecastData.values.slice(0, ageForecastYears),
                  borderColor: "#F59E0B",
                  borderWidth: 3,
                  tension: 0.3
                }
              ]
            }}
          />
        </div>
      )}
    </div>
  );
}
