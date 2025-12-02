import React from "react";

export default function GenderMLPModal({
  visible,
  onClose,
  onLoad,
  metrics,
  tableData,
  chartData,
  loading,
  message,
  explanation,
  allModelResults,
}) {
  if (!visible) return null;

  return (
    <>
      <style>{`
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          background: rgba(0, 0, 0, 0.4);
          backdrop-filter: blur(8px);
          z-index: 99998;
          animation: fadeIn 0.3s ease;
        }
        
        .modal-fullscreen {
          position: fixed;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          background: linear-gradient(135deg, #fffbeb 0%, #fef3c7 50%, #fde68a 100%);
          z-index: 99999;
          padding: 0;
          overflow-y: auto;
          animation: slideUp 0.4s ease;
        }
        
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes slideUp {
          from { transform: translateY(100px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.7; }
        }
        
        @keyframes shimmer {
          0% { background-position: -1000px 0; }
          100% { background-position: 1000px 0; }
        }
        
        @keyframes glow {
          0%, 100% { box-shadow: 0 0 20px rgba(251, 191, 36, 0.5); }
          50% { box-shadow: 0 0 30px rgba(251, 191, 36, 0.8); }
        }
        
        .modal-header-modern {
          background: linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%);
          padding: 28px 40px;
          border-bottom: 3px solid #d97706;
          display: flex;
          justify-content: space-between;
          align-items: center;
          position: sticky;
          top: 0;
          z-index: 100;
          box-shadow: 0 4px 20px rgba(251, 191, 36, 0.3);
        }
        
        .modal-title {
          display: flex;
          align-items: center;
          gap: 18px;
          margin: 0;
        }
        
        .title-icon {
          width: 56px;
          height: 56px;
          background: white;
          border-radius: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 28px;
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
          transition: transform 0.3s ease;
        }
        
        .title-icon:hover {
          transform: rotate(5deg) scale(1.05);
        }
        
        .title-text h2 {
          margin: 0;
          font-size: 1.75rem;
          font-weight: 800;
          color: white;
          text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.1);
        }
        
        .title-text p {
          margin: 4px 0 0 0;
          font-size: 0.9rem;
          color: rgba(255, 255, 255, 0.9);
          font-weight: 600;
        }
        
        .btn-close-modern {
          background: white;
          color: #dc2626;
          border: 2px solid #dc2626;
          padding: 12px 28px;
          border-radius: 12px;
          cursor: pointer;
          font-size: 1rem;
          font-weight: 700;
          transition: all 0.2s ease;
          display: flex;
          align-items: center;
          gap: 8px;
          box-shadow: 0 4px 12px rgba(220, 38, 38, 0.2);
        }
        
        .btn-close-modern:hover {
          background: #dc2626;
          color: white;
          transform: translateY(-2px);
          box-shadow: 0 6px 16px rgba(220, 38, 38, 0.3);
        }
        
        .modal-content {
          padding: 36px 40px;
          max-width: 1400px;
          margin: 0 auto;
        }
        
        .status-card {
          padding: 20px 28px;
          background: white;
          border: 2px solid #fbbf24;
          border-radius: 16px;
          margin-bottom: 28px;
          font-weight: 600;
          color: #92400e;
          display: flex;
          align-items: center;
          gap: 12px;
          box-shadow: 0 4px 16px rgba(251, 191, 36, 0.2);
        }
        
        .status-card.loading {
          border-color: #3b82f6;
          background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%);
          color: #1e40af;
          animation: pulse 2s ease-in-out infinite;
        }
        
        .action-section {
          margin-bottom: 32px;
        }
        
        .btn-predict {
          padding: 18px 48px;
          background: linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%);
          color: white;
          border-radius: 14px;
          border: none;
          cursor: pointer;
          font-weight: 800;
          font-size: 1.1rem;
          transition: all 0.3s ease;
          box-shadow: 0 8px 24px rgba(251, 191, 36, 0.4);
          display: inline-flex;
          align-items: center;
          gap: 14px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        
        .btn-predict:hover {
          transform: translateY(-4px);
          box-shadow: 0 12px 32px rgba(251, 191, 36, 0.5);
        }
        
        .btn-predict:disabled {
          background: #d1d5db;
          cursor: not-allowed;
          transform: none;
          box-shadow: none;
        }
        
        .explanation-box {
          background: white;
          border: 3px solid #fbbf24;
          border-radius: 16px;
          padding: 28px;
          margin-bottom: 32px;
          box-shadow: 0 8px 24px rgba(251, 191, 36, 0.2);
          position: relative;
          overflow: hidden;
        }
        
        .explanation-box::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(251, 191, 36, 0.1), transparent);
          animation: shimmer 2s infinite;
        }
        
        .explanation-box h3 {
          margin: 0 0 16px 0;
          font-size: 1.4rem;
          font-weight: 800;
          color: #92400e;
          display: flex;
          align-items: center;
          gap: 10px;
        }
        
        .explanation-box ul {
          margin: 0;
          padding-left: 24px;
          color: #78350f;
          font-weight: 600;
          line-height: 1.8;
        }
        
        .explanation-box li {
          margin-bottom: 10px;
          position: relative;
        }
        
        .explanation-box li::marker {
          color: #fbbf24;
          font-size: 1.2em;
        }
        
        .comparison-box {
          background: white;
          border: 3px solid #fbbf24;
          border-radius: 16px;
          padding: 32px;
          margin-bottom: 36px;
          box-shadow: 0 8px 24px rgba(251, 191, 36, 0.2);
          position: relative;
          overflow: hidden;
        }
        
        .comparison-box::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 4px;
          background: linear-gradient(90deg, #fbbf24, #f59e0b, #fbbf24);
          animation: shimmer 3s infinite;
        }
        
        .comparison-box h3 {
          margin: 0 0 24px 0;
          font-size: 1.5rem;
          font-weight: 800;
          color: #78350f;
          display: flex;
          align-items: center;
          gap: 12px;
        }
        
        .comparison-table {
          width: 100%;
          border-collapse: collapse;
          margin-top: 16px;
        }
        
        .comparison-table th {
          background: linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%);
          color: white;
          font-weight: 800;
          text-align: center;
          padding: 16px 12px;
          font-size: 0.9rem;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          border: 2px solid #f59e0b;
        }
        
        .comparison-table td {
          padding: 14px 12px;
          text-align: center;
          color: #78350f;
          font-weight: 700;
          border-bottom: 2px solid #fef3c7;
          background: #fffbeb;
          position: relative;
        }
        
        .comparison-table tbody tr {
          transition: all 0.2s ease;
        }
        
        .comparison-table tbody tr:hover {
          background: #fef3c7;
        }
        
        .highlight-row {
          background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%) !important;
          border: 3px solid #fbbf24 !important;
        }
        
        .highlight-row td {
          background: transparent !important;
          color: #78350f !important;
          font-weight: 900 !important;
          font-size: 1.1rem !important;
        }
        
        .highlight-row td:first-child {
          color: #92400e !important;
        }
        
        .best-value {
          background: linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%);
          color: white !important;
          padding: 6px 12px;
          border-radius: 8px;
          display: inline-block;
          font-weight: 900 !important;
          box-shadow: 0 4px 12px rgba(251, 191, 36, 0.3);
          animation: glow 2s ease-in-out infinite;
        }
        
        .best-model-note {
          margin-top: 20px;
          padding: 16px 20px;
          background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
          border: 3px solid #fbbf24;
          border-radius: 12px;
          font-size: 1.05rem;
          color: #78350f;
          font-weight: 700;
          display: flex;
          align-items: center;
          gap: 10px;
          box-shadow: 0 4px 12px rgba(251, 191, 36, 0.3);
        }
        
        .best-model-note strong {
          color: #92400e;
          font-size: 1.2rem;
        }
        
        .metrics-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(420px, 1fr));
          gap: 28px;
          margin-bottom: 36px;
        }
        
        .metric-card {
          background: white;
          border: 2px solid #fbbf24;
          border-radius: 18px;
          padding: 32px;
          transition: all 0.3s ease;
          box-shadow: 0 6px 20px rgba(251, 191, 36, 0.15);
        }
        
        .metric-card:hover {
          transform: translateY(-6px);
          box-shadow: 0 12px 32px rgba(251, 191, 36, 0.3);
          border-color: #f59e0b;
        }
        
        .metric-card-header {
          display: flex;
          align-items: center;
          gap: 14px;
          margin-bottom: 24px;
          padding-bottom: 18px;
          border-bottom: 2px solid #fef3c7;
        }
        
        .metric-icon {
          width: 52px;
          height: 52px;
          border-radius: 14px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 26px;
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
        }
        
        .metric-icon.male {
          background: linear-gradient(135deg, #60a5fa 0%, #3b82f6 100%);
        }
        
        .metric-icon.female {
          background: linear-gradient(135deg, #f9a8d4 0%, #ec4899 100%);
        }
        
        .metric-card-header h3 {
          margin: 0;
          font-size: 1.3rem;
          font-weight: 800;
          color: #78350f;
        }
        
        .metric-items {
          display: grid;
          gap: 12px;
        }
        
        .metric-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 14px 18px;
          background: linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%);
          border-radius: 12px;
          border: 1px solid #fde68a;
          transition: all 0.2s ease;
        }
        
        .metric-item:hover {
          background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
          transform: translateX(4px);
        }
        
        .metric-label {
          font-weight: 700;
          color: #92400e;
          font-size: 0.95rem;
        }
        
        .metric-value {
          font-weight: 800;
          color: #78350f;
          font-size: 1.1rem;
        }
        
        .metric-value-highlight {
          background: linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%);
          color: white !important;
          padding: 6px 14px;
          border-radius: 8px;
          font-weight: 900 !important;
          box-shadow: 0 4px 12px rgba(251, 191, 36, 0.3);
        }
        
        .table-section {
          margin-bottom: 36px;
        }
        
        .table-header {
          display: flex;
          align-items: center;
          gap: 14px;
          margin-bottom: 18px;
        }
        
        .table-icon {
          width: 48px;
          height: 48px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 24px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }
        
        .table-icon.male {
          background: linear-gradient(135deg, #60a5fa 0%, #3b82f6 100%);
        }
        
        .table-icon.female {
          background: linear-gradient(135deg, #f9a8d4 0%, #ec4899 100%);
        }
        
        .table-header h3 {
          margin: 0;
          font-size: 1.25rem;
          font-weight: 800;
          color: #78350f;
        }
        
        .table-wrapper {
          background: white;
          border: 2px solid #fbbf24;
          border-radius: 16px;
          overflow: hidden;
          box-shadow: 0 6px 20px rgba(251, 191, 36, 0.15);
        }
        
        .modern-table {
          width: 100%;
          border-collapse: collapse;
        }
        
        .modern-table th {
          background: linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%);
          color: white;
          font-weight: 800;
          text-align: left;
          padding: 18px 24px;
          font-size: 0.9rem;
          text-transform: uppercase;
          letter-spacing: 0.8px;
        }
        
        .modern-table td {
          padding: 16px 24px;
          color: #78350f;
          font-weight: 600;
          border-bottom: 1px solid #fef3c7;
        }
        
        .modern-table tbody tr {
          transition: all 0.2s ease;
        }
        
        .modern-table tbody tr:hover {
          background: linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%);
        }
        
        .modern-table tbody tr:last-child td {
          border-bottom: none;
        }
        
        .chart-container {
          background: white;
          border: 2px solid #fbbf24;
          border-radius: 16px;
          padding: 32px;
          box-shadow: 0 6px 20px rgba(251, 191, 36, 0.15);
          min-height: 500px;
        }
        
        .loading-spinner {
          display: inline-block;
          animation: spin 1s linear infinite;
        }
      `}</style>

      <div className="modal-fullscreen">
        {/* HEADER */}
        <div className="modal-header-modern">
          <div className="modal-title">
            <div className="title-icon">🤖</div>
            <div className="title-text">
              <h2>MLP Gender Forecasting</h2>
              <p>Advanced Neural Network Predictions</p>
            </div>
          </div>
          <button className="btn-close-modern" onClick={onClose}>
            <span style={{ fontSize: "1.2rem" }}>✕</span>
            <span>Close</span>
          </button>
        </div>

        <div className="modal-content">
          {/* STATUS CARD */}
          {message && (
            <div className={`status-card ${loading ? 'loading' : ''}`}>
              {loading ? <span className="loading-spinner">⏳</span> : "💡"}
              <span style={{ fontSize: "1.05rem" }}>{message}</span>
            </div>
          )}

          {/* PREDICT BUTTON */}
          <div className="action-section">
            <button 
              onClick={onLoad} 
              className="btn-predict"
              disabled={loading}
            >
              <span style={{ fontSize: "1.5rem" }}>🎯</span>
              <span>Generate Predictions</span>
            </button>
          </div>

          {/* EXPLANATION BOX */}
          {explanation && (
            <div className="explanation-box">
              <h3>
                <span style={{ fontSize: "1.5rem" }}>🏆</span>
                {explanation.title}
              </h3>
              <ul>
                {explanation.points.map((p, i) => (
                  <li key={i}>{p}</li>
                ))}
              </ul>
            </div>
          )}

          {/* MODEL COMPARISON TABLE */}
          {allModelResults &&
            allModelResults.best_model &&
            allModelResults.mlp1 &&
            allModelResults.mlp2 &&
            allModelResults.mlp3 && (
              <div className="comparison-box">
                <h3>
                  <span style={{ fontSize: "1.6rem" }}>📊</span>
                  MLP Model Comparison
                </h3>

                <table className="comparison-table">
                  <thead>
                    <tr>
                      <th>Model</th>
                      <th>MAE</th>
                      <th>RMSE</th>
                      <th>MAPE (%)</th>
                      <th>R²</th>
                      <th>Accuracy (%)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {["mlp1", "mlp2", "mlp3"].map((m) => {
                      const male = allModelResults[m].male;
                      const female = allModelResults[m].female;
                      const isBest = allModelResults.best_model === m;

                      return (
                        <tr
                          key={m}
                          className={isBest ? "highlight-row" : ""}
                        >
                          <td style={{ fontWeight: 800, fontSize: "1.1rem" }}>
                            {m.toUpperCase()}
                            {isBest && " ⭐"}
                          </td>
                          <td>
                            <span className={isBest ? "best-value" : ""}>
                              {((male.mae + female.mae) / 2).toFixed(3)}
                            </span>
                          </td>
                          <td>
                            <span className={isBest ? "best-value" : ""}>
                              {((male.rmse + female.rmse) / 2).toFixed(3)}
                            </span>
                          </td>
                          <td>
                            <span className={isBest ? "best-value" : ""}>
                              {((male.mape + female.mape) / 2).toFixed(3)}
                            </span>
                          </td>
                          <td>
                            <span className={isBest ? "best-value" : ""}>
                              {((male.r2 + female.r2) / 2).toFixed(3)}
                            </span>
                          </td>
                          <td>
                            <span className={isBest ? "best-value" : ""}>
                              {((male.accuracy + female.accuracy) / 2).toFixed(2)}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>

                <div className="best-model-note">
                  <span style={{ fontSize: "1.4rem" }}>🏆</span>
                  <span>
                    Best Model: <strong>{allModelResults.best_model.toUpperCase()}</strong>
                  </span>
                </div>
              </div>
            )}

          {/* METRICS GRID */}
          {metrics && (
            <div className="metrics-grid">
              {/* MALE METRICS */}
              {metrics.male && (
                <div className="metric-card">
                  <div className="metric-card-header">
                    <div className="metric-icon male">👨</div>
                    <h3>Male Model Metrics</h3>
                  </div>
                  <div className="metric-items">
                    <div className="metric-item">
                      <span className="metric-label">Mean Absolute Error</span>
                      <span className="metric-value-highlight">{metrics.male.mae}</span>
                    </div>
                    <div className="metric-item">
                      <span className="metric-label">Root Mean Squared Error</span>
                      <span className="metric-value-highlight">{metrics.male.rmse}</span>
                    </div>
                    <div className="metric-item">
                      <span className="metric-label">Mean Absolute % Error</span>
                      <span className="metric-value-highlight">{metrics.male.mape}%</span>
                    </div>
                    <div className="metric-item">
                      <span className="metric-label">R² Score</span>
                      <span className="metric-value-highlight">{metrics.male.r2}</span>
                    </div>
                    <div className="metric-item">
                      <span className="metric-label">Accuracy</span>
                      <span className="metric-value-highlight">{metrics.male.accuracy}%</span>
                    </div>
                  </div>
                </div>
              )}

              {/* FEMALE METRICS */}
              {metrics.female && (
                <div className="metric-card">
                  <div className="metric-card-header">
                    <div className="metric-icon female">👩</div>
                    <h3>Female Model Metrics</h3>
                  </div>
                  <div className="metric-items">
                    <div className="metric-item">
                      <span className="metric-label">Mean Absolute Error</span>
                      <span className="metric-value-highlight">{metrics.female.mae}</span>
                    </div>
                    <div className="metric-item">
                      <span className="metric-label">Root Mean Squared Error</span>
                      <span className="metric-value-highlight">{metrics.female.rmse}</span>
                    </div>
                    <div className="metric-item">
                      <span className="metric-label">Mean Absolute % Error</span>
                      <span className="metric-value-highlight">{metrics.female.mape}%</span>
                    </div>
                    <div className="metric-item">
                      <span className="metric-label">R² Score</span>
                      <span className="metric-value-highlight">{metrics.female.r2}</span>
                    </div>
                    <div className="metric-item">
                      <span className="metric-label">Accuracy</span>
                      <span className="metric-value-highlight">{metrics.female.accuracy}%</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TABLES */}
          {tableData && (
            <>
              {/* MALE TABLE */}
              {tableData.male && (
                <div className="table-section">
                  <div className="table-header">
                    <div className="table-icon male">👨</div>
                    <h3>Male Forecast Data</h3>
                  </div>
                  <div className="table-wrapper">
                    <table className="modern-table">
                      <thead>
                        <tr>
                          <th>Year</th>
                          <th>Predicted Count</th>
                        </tr>
                      </thead>
                      <tbody>
                        {(() => {
                          const maxPrediction = Math.max(...tableData.male.map(row => 
                            typeof row.predicted === 'number' ? row.predicted : 0
                          ));
                          return tableData.male.map((row, i) => {
                            const isMax = typeof row.predicted === 'number' && row.predicted === maxPrediction;
                            return (
                              <tr key={i} className={isMax ? "highlight-row" : ""}>
                                <td style={{ fontWeight: 700 }}>{row.year}</td>
                                <td>
                                  <span className={isMax ? "best-value" : ""} style={{ 
                                    fontWeight: 800, 
                                    color: isMax ? "white" : "#3b82f6",
                                    fontSize: "1.1rem" 
                                  }}>
                                    {typeof row.predicted === 'number' 
                                      ? row.predicted.toLocaleString() 
                                      : row.predicted}
                                  </span>
                                </td>
                              </tr>
                            );
                          });
                        })()}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* FEMALE TABLE */}
{tableData.female && (
  <div className="table-section">
    <div className="table-header">
      <div className="table-icon female">👩</div>
      <h3>Female Forecast Data</h3>
    </div>
    <div className="table-wrapper">
      <table className="modern-table">
        <thead>
          <tr>
            <th>Year</th>
            <th>Predicted Count</th>
          </tr>
        </thead>
        <tbody>
          {(() => {
            const maxPrediction = Math.max(...tableData.female.map(row => 
              typeof row.predicted === 'number' ? row.predicted : 0
            ));
            return tableData.female.map((row, i) => {
              const isMax = typeof row.predicted === 'number' && row.predicted === maxPrediction;
              return (
                <tr key={i} className={isMax ? "highlight-row" : ""}>
                  <td style={{ fontWeight: 700 }}>{row.year}</td>
                  <td>
                    <span className={isMax ? "best-value" : ""} style={{ 
                      fontWeight: 800, 
                      color: isMax ? "white" : "#ec4899",
                      fontSize: "1.1rem" 
                    }}>
                      {typeof row.predicted === 'number' 
                        ? row.predicted.toLocaleString() 
                        : row.predicted}
                    </span>
                  </td>
                </tr>
              );
            });
          })()}
        </tbody>
      </table>
    </div>
  </div>
)}
            </>
          )}

          {/* CHART */}
          {chartData && (
            <div className="chart-container">
              {chartData}
            </div>
          )}
        </div>
      </div>
    </>
  );
}