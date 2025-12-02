// CivilMLPModal.jsx
import React from "react";
import { Line } from "react-chartjs-2";

export default function CivilMLPModal({
  visible,
  onClose,
  onLoad,
  loading,
  message,
  explanation,
  allModelResults,
  tableData,
  chartData
}) {
  if (!visible) return null;

  // Civil Status Labels & Icons
  const CIVIL_LABELS = {
    "single": { label: "Single", icon: "❤️", color: "#EAB308" },
    "married": { label: "Married", icon: "💍", color: "#F59E0B" },
    "widower": { label: "Widower", icon: "🕊️", color: "#D97706" },
    "separated": { label: "Separated", icon: "💔", color: "#B45309" },
    "divorced": { label: "Divorced", icon: "⚖️", color: "#F59E0B" },
    "notReported": { label: "Not Reported", icon: "❓", color: "#FCD34D" }
  };

  const safeLoad = () => {
    onLoad(); // generate ALL civil groups
  };

  return (
    <>
      <style>{`
        .modal-fullscreen {
          position: fixed;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          background: linear-gradient(135deg, #FFFFFF 0%, #FFFBEB 50%, #FEF3C7 100%);
          z-index: 99999;
          overflow-y: auto;
          animation: fadeIn .3s ease;
        }

        @keyframes fadeIn { from {opacity:0;} to {opacity:1;} }

        .modal-header {
          background: linear-gradient(135deg, #FCD34D 0%, #EAB308 100%);
          padding: 36px 48px;
          border-bottom: 4px solid #F59E0B;
          display: flex;
          justify-content: space-between;
          align-items: center;
          position: sticky;
          top: 0;
          z-index: 100;
          box-shadow: 0 8px 32px rgba(234, 179, 8, 0.3);
        }

        .modal-content {
          padding: 48px 48px 120px;
          max-width: 1400px;
          margin: 0 auto;
        }

        .btn-close {
          background: white;
          color: #DC2626;
          border: 3px solid #DC2626;
          padding: 16px 36px;
          border-radius: 16px;
          cursor: pointer;
          font-weight: 900;
          font-size: 1.05rem;
          transition: all 0.3s ease;
          box-shadow: 0 4px 12px rgba(220, 38, 38, 0.2);
        }

        .btn-close:hover {
          background: #FEE2E2;
          transform: translateY(-3px);
          box-shadow: 0 6px 16px rgba(220, 38, 38, 0.3);
        }

        .btn-generate {
          padding: 24px 56px;
          background: linear-gradient(135deg, #FCD34D 0%, #EAB308 100%);
          border-radius: 18px;
          color: #78350F;
          font-weight: 900;
          font-size: 1.25rem;
          cursor: pointer;
          border: 3px solid #F59E0B;
          transition: all 0.3s ease;
          margin-bottom: 48px;
          box-shadow: 0 6px 20px rgba(234, 179, 8, 0.3);
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 12px;
        }

        .btn-generate:hover:not(:disabled) {
          transform: translateY(-3px);
          box-shadow: 0 8px 24px rgba(234, 179, 8, 0.4);
        }

        .btn-generate:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .info-box, .model-comparison-box, .table-wrapper, .chart-container {
          background: white;
          border-radius: 20px;
          padding: 36px;
          margin-bottom: 40px;
          box-shadow: 0 8px 32px rgba(234, 179, 8, 0.15);
          transition: all 0.3s ease;
        }

        .info-box:hover, .table-wrapper:hover, .chart-container:hover {
          transform: translateY(-3px);
          box-shadow: 0 12px 40px rgba(234, 179, 8, 0.25);
        }

        .info-box {
          border: 3px solid #FCD34D;
        }

        .model-comparison-box {
          border: 3px solid #FCD34D;
        }

        .modern-table {
          width: 100%;
          border-collapse: collapse;
          border-radius: 12px;
          overflow: hidden;
        }
        .modern-table th {
          background: linear-gradient(135deg, #F59E0B 0%, #D97706 100%);
          color: white;
          padding: 20px;
          font-weight: 900;
          font-size: 1.05rem;
          text-align: left;
        }
        .modern-table td {
          padding: 18px 20px;
          background: #FFFBEB;
          border-bottom: 2px solid #FEF3C7;
          font-weight: 700;
          color: #78350F;
        }
        .modern-table tr:hover td {
          background: #FEF3C7;
        }
        .modern-table tr:last-child td {
          border-bottom: none;
        }

        .civil-title {
          font-size: 1.9rem;
          font-weight: 900;
          color: #78350F;
          margin-bottom: 20px;
          margin-top: 48px;
          display: flex;
          align-items: center;
          gap: 14px;
          padding: 20px 28px;
          background: linear-gradient(135deg, #FFFBEB 0%, #FEF3C7 100%);
          border-radius: 16px;
          border: 3px solid #FDE047;
        }

        .loading-box {
          padding: 28px 36px;
          margin-bottom: 40px;
          border-radius: 20px;
          font-weight: 800;
          font-size: 1.1rem;
          display: flex;
          align-items: center;
          gap: 14px;
        }

        .section-header {
          font-size: 2rem;
          font-weight: 900;
          color: #78350F;
          margin-top: 64px;
          margin-bottom: 32px;
          display: flex;
          align-items: center;
          gap: 14px;
          padding: 24px 32px;
          background: linear-gradient(135deg, #FEF3C7 0%, #FDE68A 100%);
          border-radius: 18px;
          border: 3px solid #F59E0B;
          box-shadow: 0 6px 20px rgba(234, 179, 8, 0.25);
        }

        .chart-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 32px;
          margin-bottom: 40px;
        }

        @media (max-width: 1024px) {
          .chart-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>

      <div className="modal-fullscreen">

        {/* HEADER */}
        <div className="modal-header">
          <h2 style={{ 
            color: "#78350F", 
            margin: 0, 
            fontSize: "2rem", 
            fontWeight: 900,
            display: "flex",
            alignItems: "center",
            gap: "14px"
          }}>
            <span style={{ fontSize: "2.4rem" }}>💍</span>
            Civil Status MLP Forecasting
          </h2>

          <button className="btn-close" onClick={onClose}>✕ Close</button>
        </div>

        {/* MAIN CONTENT */}
        <div className="modal-content">

          {/* MESSAGE */}
          {message && (
            <div
              className="loading-box"
              style={{
                background: loading
                  ? "linear-gradient(135deg, #DBEAFE 0%, #BFDBFE 100%)"
                  : "linear-gradient(135deg, #FFFBEB 0%, #FEF3C7 100%)",
                border: loading ? "3px solid #3B82F6" : "3px solid #FCD34D",
                color: loading ? "#1E40AF" : "#78350F",
                boxShadow: loading 
                  ? "0 6px 20px rgba(59, 130, 246, 0.3)"
                  : "0 6px 20px rgba(234, 179, 8, 0.3)"
              }}
            >
              <span style={{ fontSize: "1.8rem" }}>{loading ? "⏳" : "💡"}</span>
              <span>{message}</span>
            </div>
          )}

          {/* LOAD ALL CIVIL STATUS BUTTON */}
          <button className="btn-generate" onClick={safeLoad} disabled={loading}>
            <span style={{ fontSize: "1.6rem" }}>🔮</span>
            <span>Generate Forecasts for ALL Civil Status Categories</span>
          </button>

          {/* EXPLANATION */}
          {explanation && (
            <div className="info-box">
              <h3 style={{ 
                marginTop: 0, 
                color: "#D97706", 
                fontWeight: 900,
                fontSize: "1.6rem",
                display: "flex",
                alignItems: "center",
                gap: "10px",
                marginBottom: "20px"
              }}>
                <span style={{ fontSize: "1.8rem" }}>📘</span>
                {explanation.title}
              </h3>
              <ul style={{ 
                color: "#78350F", 
                lineHeight: 1.9,
                paddingLeft: "24px"
              }}>
                {explanation.points.map((p, i) => (
                  <li key={i} style={{ marginBottom: "12px", fontWeight: 700, fontSize: "1.05rem" }}>
                    {p}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* MODEL COMPARISON */}
          {allModelResults && allModelResults.best_model && (
            <div className="model-comparison-box">

              <h3 style={{ 
                marginTop: 0, 
                color: "#78350F", 
                fontWeight: 900,
                fontSize: "1.7rem",
                display: "flex",
                alignItems: "center",
                gap: "10px",
                marginBottom: "24px"
              }}>
                <span style={{ fontSize: "1.9rem" }}>📊</span>
                Model Comparison (MLP1 vs MLP2 vs MLP3)
              </h3>

              <div className="table-wrapper" style={{ border: "3px solid #FCD34D" }}>
                <table className="modern-table">
                  <thead>
                    <tr>
                      <th>Model</th>
                      <th>MAE</th>
                      <th>RMSE</th>
                      <th>SMAPE</th>
                      <th>Accuracy</th>
                    </tr>
                  </thead>

                  <tbody>
                    {(() => {
                      // Calculate averages for all models
                      const modelData = ["mlp1", "mlp2", "mlp3"].map((m) => {
                        const model = allModelResults[m];
                        if (!model?.metrics) return null;
                        const arr = Object.values(model.metrics);
                        return {
                          name: m,
                          mae: (arr.reduce((a, b) => a + b.mae, 0) / arr.length),
                          rmse: (arr.reduce((a, b) => a + b.rmse, 0) / arr.length),
                          smape: (arr.reduce((a, b) => a + b.smape, 0) / arr.length),
                          accuracy: (arr.reduce((a, b) => a + b.accuracy, 0) / arr.length)
                        };
                      }).filter(Boolean);

                      // Find best values (lowest for mae/rmse/smape, highest for accuracy)
                      const bestMae = Math.min(...modelData.map(d => d.mae));
                      const bestRmse = Math.min(...modelData.map(d => d.rmse));
                      const bestSmape = Math.min(...modelData.map(d => d.smape));
                      const bestAccuracy = Math.max(...modelData.map(d => d.accuracy));

                      const getBestStyle = (value, best, isBestModel) => {
                        if (value === best) {
                          return {
                            background: "linear-gradient(135deg, #FDE047 0%, #FCD34D 100%)",
                            fontWeight: 900,
                            fontSize: "1.15rem",
                            color: "#78350F",
                            boxShadow: "inset 0 0 0 2px #F59E0B"
                          };
                        }
                        if (isBestModel) {
                          return {
                            background: "linear-gradient(135deg, #FEF3C7 0%, #FDE68A 100%)",
                            fontWeight: 800
                          };
                        }
                        return {};
                      };

                      return modelData.map((data) => {
                        const isBestModel = allModelResults.best_model === data.name;
                        
                        return (
                          <tr key={data.name}>
                            <td style={{ 
                              fontWeight: 900, 
                              fontSize: "1.1rem",
                              ...(isBestModel ? {
                                background: "linear-gradient(135deg, #FEF3C7 0%, #FDE68A 100%)",
                                fontWeight: 900
                              } : {})
                            }}>
                              {data.name.toUpperCase()}
                              {isBestModel && <span style={{ marginLeft: "8px" }}>🏆</span>}
                            </td>
                            <td style={getBestStyle(data.mae, bestMae, isBestModel)}>
                              {data.mae.toFixed(3)}
                            </td>
                            <td style={getBestStyle(data.rmse, bestRmse, isBestModel)}>
                              {data.rmse.toFixed(3)}
                            </td>
                            <td style={getBestStyle(data.smape, bestSmape, isBestModel)}>
                              {data.smape.toFixed(3)}
                            </td>
                            <td style={getBestStyle(data.accuracy, bestAccuracy, isBestModel)}>
                              {data.accuracy.toFixed(3)}
                            </td>
                          </tr>
                        );
                      });
                    })()}
                  </tbody>
                </table>
              </div>

              <div
                style={{
                  marginTop: 28,
                  background: "linear-gradient(135deg, #FEF3C7 0%, #FDE68A 100%)",
                  border: "3px solid #F59E0B",
                  padding: "20px 32px",
                  borderRadius: 18,
                  fontWeight: 900,
                  color: "#78350F",
                  width: "fit-content",
                  fontSize: "1.15rem",
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  boxShadow: "0 4px 16px rgba(234, 179, 8, 0.25)"
                }}
              >
                <span style={{ fontSize: "1.6rem" }}>🏆</span>
                Best Model: {allModelResults.best_model.toUpperCase()}
              </div>
            </div>
          )}

          {/* ALL PREDICTIONS SECTION */}
          {tableData && Object.keys(tableData).length > 0 && (
            <>
              <div className="section-header">
                <span style={{ fontSize: "2.4rem" }}>📋</span>
                <span>All Civil Status Predictions</span>
              </div>

              {Object.keys(tableData).map((group) => {
                const civil = CIVIL_LABELS[group];
                const predictions = tableData[group];
                const maxPrediction = Math.max(...predictions.map(p => p.predicted));

                return (
                  <div key={group}>
                    <div className="civil-title">
                      <span style={{ fontSize: "2.4rem" }}>{civil.icon}</span>
                      <span>{civil.label}</span>
                    </div>

                    {/* TABLE */}
                    <div className="table-wrapper" style={{ border: `3px solid ${civil.color}` }}>
                      <table className="modern-table">
                        <thead>
                          <tr>
                            <th>Year</th>
                            <th>Predicted Value</th>
                          </tr>
                        </thead>

                        <tbody>
                          {predictions.map((row, i) => {
                            const isBest = row.predicted === maxPrediction;
                            return (
                              <tr key={i} style={isBest ? { background: "#D1FAE5" } : {}}>
                                <td style={{ 
                                  fontWeight: 900,
                                  ...(isBest ? { color: "#065F46", fontSize: "1.1rem" } : {})
                                }}>
                                  {isBest && "🏆 "}📅 {row.year}
                                </td>
                                <td style={{ 
                                  fontSize: "1.1rem", 
                                  fontWeight: 900,
                                  ...(isBest ? { color: "#065F46", fontSize: "1.2rem" } : {})
                                }}>
                                  {Math.round(row.predicted).toLocaleString()}
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>
                );
              })}

              {/* ALL VISUALIZATIONS SECTION */}
              <div className="section-header">
                <span style={{ fontSize: "2.4rem" }}>📊</span>
                <span>All Visualizations</span>
              </div>

              <div className="chart-grid">
                {Object.keys(chartData).map((group) => {
                  const civil = CIVIL_LABELS[group];
                  
                  return chartData[group] && (
                    <div key={group} className="chart-container" style={{ 
                      border: `3px solid ${civil.color}`,
                      margin: 0
                    }}>
                      <h4 style={{
                        margin: 0,
                        marginBottom: "20px",
                        fontSize: "1.4rem",
                        fontWeight: 900,
                        color: "#78350F",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "10px"
                      }}>
                        <span style={{ fontSize: "1.8rem" }}>{civil.icon}</span>
                        <span>{civil.label}</span>
                      </h4>
                      <Line 
                        data={{
                          ...chartData[group],
                          datasets: chartData[group].datasets.map(ds => ({
                            ...ds,
                            borderColor: civil.color,
                            backgroundColor: civil.color + "55",
                            borderWidth: 3,
                            pointRadius: 6,
                            pointBackgroundColor: civil.color,
                            pointBorderColor: "#FFFFFF",
                            pointBorderWidth: 2
                          }))
                        }}
                        options={{
                          responsive: true,
                          maintainAspectRatio: true,
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
                              padding: 12
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
                  );
                })}
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}