// AgeMLPModal.jsx
import React from "react";
import { Line } from "react-chartjs-2";

export default function AgeMLPModal({
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

  const AGE_LABELS = {
    "0_14": "0–14",
    "15_19": "15–19",
    "20_24": "20–24",
    "25_29": "25–29",
    "30_34": "30–34",
    "35_39": "35–39",
    "40_44": "40–44",
    "45_49": "45–49",
    "50_54": "50–54",
    "55_59": "55–59",
    "60_64": "60–64",
    "65_plus": "65+"
  };

  const safeLoad = () => {
    onLoad();     // load ALL ages
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
          background: linear-gradient(135deg, #FFFBEB 0%, #FEF3C7 50%, #FDE68A 100%);
          z-index: 99999;
          overflow-y: auto;
          animation: fadeIn .3s ease;
        }

        @keyframes fadeIn { from {opacity:0;} to {opacity:1;} }

        .modal-header {
          background: linear-gradient(135deg, #FBBF24 0%, #F59E0B 100%);
          padding: 32px 48px;
          border-bottom: 3px solid #D97706;
          display: flex;
          justify-content: space-between;
          align-items: center;
          position: sticky;
          top: 0;
          z-index: 100;
          box-shadow: 0 8px 32px rgba(217, 119, 6, 0.3);
        }

        .modal-content {
          padding: 40px 48px 120px;
          max-width: 1400px;
          margin: 0 auto;
        }

        .btn-close {
          background: white;
          color: #DC2626;
          border: 2px solid #DC2626;
          padding: 14px 32px;
          border-radius: 16px;
          cursor: pointer;
          font-weight: 800;
          font-size: 1rem;
          transition: all 0.3s ease;
          box-shadow: 0 4px 12px rgba(220, 38, 38, 0.2);
        }
        .btn-close:hover {
          background: #FEE2E2;
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(220, 38, 38, 0.3);
        }

        .btn-generate {
          padding: 22px 52px;
          background: linear-gradient(135deg, #FBBF24 0%, #F59E0B 100%);
          border-radius: 16px;
          color: white;
          font-weight: 800;
          font-size: 1.2rem;
          cursor: pointer;
          margin-bottom: 40px;
          border: none;
          transition: all 0.3s ease;
          box-shadow: 0 8px 24px rgba(245, 158, 11, 0.4);
          text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }
        .btn-generate:hover:not(:disabled) {
          transform: translateY(-3px);
          box-shadow: 0 12px 32px rgba(245, 158, 11, 0.5);
          background: linear-gradient(135deg, #FCD34D 0%, #FBBF24 100%);
        }
        .btn-generate:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .table-section {
          margin-top: 48px;
        }

        .table-wrapper {
          background: white;
          border: 3px solid #FBBF24;
          border-radius: 20px;
          overflow: hidden;
          margin-bottom: 40px;
          box-shadow: 0 8px 32px rgba(251, 191, 36, 0.2);
          transition: all 0.3s ease;
        }
        .table-wrapper:hover {
          box-shadow: 0 12px 40px rgba(251, 191, 36, 0.3);
          transform: translateY(-2px);
        }

        .modern-table {
          width: 100%;
          border-collapse: collapse;
        }
        .modern-table th {
          background: linear-gradient(135deg, #FBBF24 0%, #F59E0B 100%);
          color: white;
          padding: 18px;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 0.8px;
          font-size: 0.9rem;
          text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }
        .modern-table td {
          padding: 16px 18px;
          background: #FFFBEB;
          border-bottom: 2px solid #FEF3C7;
          font-weight: 600;
          color: #78350F;
          transition: all 0.2s ease;
        }
        .modern-table tr:hover td {
          background: #FEF3C7;
          transform: scale(1.01);
        }

        .chart-container {
          background: white;
          border: 3px solid #FBBF24;
          border-radius: 20px;
          padding: 36px;
          margin-bottom: 40px;
          box-shadow: 0 8px 32px rgba(251, 191, 36, 0.2);
          transition: all 0.3s ease;
        }
        .chart-container:hover {
          box-shadow: 0 12px 40px rgba(251, 191, 36, 0.3);
          transform: translateY(-2px);
        }

        .info-box {
          background: white;
          border: 3px solid #FBBF24;
          border-radius: 20px;
          padding: 36px;
          margin-bottom: 40px;
          box-shadow: 0 8px 32px rgba(251, 191, 36, 0.2);
          transition: all 0.3s ease;
        }
        .info-box:hover {
          box-shadow: 0 12px 40px rgba(251, 191, 36, 0.3);
          transform: translateY(-2px);
        }

        .info-box h3 {
          margin-top: 0;
          color: #D97706;
          font-size: 1.6rem;
          font-weight: 800;
        }

        .info-box ul {
          line-height: 1.9;
          color: #78350F;
        }

        .info-box li {
          margin-bottom: 12px;
          font-weight: 600;
        }

        .model-comparison-box {
          background: white;
          border: 3px solid #10B981;
          border-radius: 20px;
          padding: 36px;
          margin-bottom: 40px;
          box-shadow: 0 8px 32px rgba(16, 185, 129, 0.2);
          transition: all 0.3s ease;
        }
        .model-comparison-box:hover {
          box-shadow: 0 12px 40px rgba(16, 185, 129, 0.3);
          transform: translateY(-2px);
        }

        .model-comparison-box h3 {
          margin-top: 0;
          color: #059669;
          font-size: 1.6rem;
          font-weight: 800;
        }

        .best-model-badge {
          margin-top: 24px;
          background: linear-gradient(135deg, #D1FAE5 0%, #A7F3D0 100%);
          padding: 18px 28px;
          border-radius: 16px;
          font-weight: 800;
          border: 3px solid #10B981;
          color: #065F46;
          font-size: 1.15rem;
          box-shadow: 0 4px 16px rgba(16, 185, 129, 0.2);
        }

        .age-group-title {
          color: #D97706;
          font-size: 1.5rem;
          margin-bottom: 24px;
          font-weight: 800;
          text-shadow: 0 2px 4px rgba(217, 119, 6, 0.1);
        }

        .message-box {
          border-radius: 20px;
          margin-bottom: 36px;
          font-weight: 700;
          padding: 24px 32px;
          font-size: 1.05rem;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
          transition: all 0.3s ease;
        }
        .message-box:hover {
          transform: translateY(-2px);
          box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15);
        }

        .loading-box {
          background: linear-gradient(135deg, #DBEAFE 0%, #BFDBFE 100%);
          border: 3px solid #3B82F6;
          color: #1E40AF;
        }

        .success-box {
          background: linear-gradient(135deg, #FEF3C7 0%, #FDE68A 100%);
          border: 3px solid #FBBF24;
          color: #78350F;
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
          <h2 style={{ color: "white", margin: 0, fontSize: "1.9rem", fontWeight: 900, textShadow: "0 2px 4px rgba(0, 0, 0, 0.2)" }}>
            📊 MLP Age-Group Forecasting
          </h2>

          <button className="btn-close" onClick={onClose}>
            ✕ Close
          </button>
        </div>

        {/* CONTENT */}
        <div className="modal-content">

          {/* MESSAGE */}
          {message && (
            <div className={`message-box ${loading ? 'loading-box' : 'success-box'}`}>
              {loading ? "⏳" : "💡"} {message}
            </div>
          )}

          {/* LOAD ALL */}
          <button
            className="btn-generate"
            disabled={loading}
            onClick={safeLoad}
          >
            🎯 Generate Forecasts for ALL Age Groups
          </button>

          {/* EXPLANATION */}
          {explanation && (
            <div className="info-box">
              <h3>🏆 {explanation.title}</h3>
              <ul>
                {explanation.points.map((p, i) => (
                  <li key={i}>{p}</li>
                ))}
              </ul>
            </div>
          )}

          {/* MODEL COMPARISON */}
          {allModelResults && allModelResults.best_model && (
            <div className="model-comparison-box">
              <h3>📈 Model Comparison</h3>

              <div className="table-wrapper" style={{ border: "3px solid #10B981" }}>
                <table className="modern-table">
                  <thead>
                    <tr>
                      <th style={{ background: "linear-gradient(135deg, #10B981 0%, #059669 100%)" }}>Model</th>
                      <th style={{ background: "linear-gradient(135deg, #10B981 0%, #059669 100%)" }}>Avg MAE</th>
                      <th style={{ background: "linear-gradient(135deg, #10B981 0%, #059669 100%)" }}>Avg RMSE</th>
                      <th style={{ background: "linear-gradient(135deg, #10B981 0%, #059669 100%)" }}>Avg SMAPE (%)</th>
                      <th style={{ background: "linear-gradient(135deg, #10B981 0%, #059669 100%)" }}>Accuracy (%)</th>
                    </tr>
                  </thead>

                  <tbody>
                    {["mlp1", "mlp2", "mlp3"].map((m) => {
                      const model = allModelResults[m];
                      if (!model?.metrics) return null;

                      const arr = Object.values(model.metrics);

                      const avg = (k) =>
                        (arr.reduce((a, b) => a + b[k], 0) / arr.length).toFixed(3);

                      return (
                        <tr key={m}>
                          <td>{m.toUpperCase()}</td>
                          <td>{avg("mae")}</td>
                          <td>{avg("rmse")}</td>
                          <td>{avg("smape")}</td>
                          <td>{avg("accuracy")}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              <div className="best-model-badge">
                🏆 Best Model: {allModelResults.best_model.toUpperCase()}
              </div>
            </div>
          )}

          {/* TABLES (ALL GROUPS) */}
          {tableData && Object.keys(tableData).length > 0 && (
            <>
              <h2 style={{ color: "#D97706", fontSize: "2rem", fontWeight: 900, marginTop: "48px", marginBottom: "32px" }}>
                📋 All Age Group Predictions
              </h2>
              
              {Object.keys(tableData).map((group) => {
                // Find best performing year (highest predicted value)
                const predictions = tableData[group];
                const maxPrediction = Math.max(...predictions.map(p => p.predicted));
                
                return (
                  <div key={group} className="table-section">
                    <h3 className="age-group-title">📘 Age Group: {AGE_LABELS[group] || group}</h3>

                    <div className="table-wrapper">
                      <table className="modern-table">
                        <thead>
                          <tr>
                            <th>Year</th>
                            <th>Predicted</th>
                          </tr>
                        </thead>

                        <tbody>
                          {predictions.map((row, i) => {
                            const isBest = row.predicted === maxPrediction;
                            return (
                              <tr key={i} style={isBest ? { background: "#D1FAE5" } : {}}>
                                <td style={isBest ? { fontWeight: 900, color: "#065F46" } : {}}>
                                  {isBest && "🏆 "}{row.year}
                                </td>
                                <td style={isBest ? { fontWeight: 900, color: "#065F46" } : {}}>
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

              {/* VISUALIZATIONS SECTION */}
              <h2 style={{ color: "#D97706", fontSize: "2rem", fontWeight: 900, marginTop: "64px", marginBottom: "32px" }}>
                📊 All Visualizations
              </h2>

              <div className="chart-grid">
                {Object.keys(chartData).map((group) => (
                  chartData[group] && (
                    <div key={group} className="chart-container" style={{ margin: 0 }}>
                      <h4 style={{ 
                        color: "#D97706", 
                        fontSize: "1.3rem", 
                        fontWeight: 800, 
                        marginTop: 0,
                        marginBottom: "24px",
                        textAlign: "center"
                      }}>
                        {AGE_LABELS[group] || group}
                      </h4>
                      <Line data={chartData[group]} />
                    </div>
                  )
                ))}
              </div>
            </>
          )}

        </div>
      </div>
    </>
  );
}