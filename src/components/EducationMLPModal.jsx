import React from "react";
import { Line } from "react-chartjs-2";

import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend
} from "chart.js";

ChartJS.register(
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend
);

export default function EducationMLPModal({
  visible,
  onClose,
  onLoad,
  metrics,
  tableData,
  chartData,
  loading,
  message,
  explanation,
  allModelResults
}) {

  if (!visible) return null;

  const EDU_LABELS = {
    elementary: "Elementary",
    highschool: "High School",
    vocational: "Vocational",
    college: "College",
    postgrad: "Postgraduate",
    notReported: "Not Reported",
  };

  return (
    <>
      <style>{`
        .modal-overlay { 
          position: fixed; 
          top: 0; 
          left: 0; 
          width: 100vw; 
          height: 100vh; 
          background: rgba(0,0,0,0.6); 
          backdrop-filter: blur(12px); 
          z-index: 99998; 
          animation: fadeIn .3s ease; 
        }
        
        .modal-fullscreen { 
          position: fixed; 
          top: 0; 
          left: 0; 
          width: 100vw; 
          height: 100vh; 
          background: linear-gradient(135deg, #FFFBEB 0%, #FEF3C7 50%, #FDE68A 100%); 
          z-index: 99999; 
          overflow-y: auto; 
          animation: slideUp .4s cubic-bezier(0.4, 0, 0.2, 1); 
        }
        
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slideUp { from { transform: translateY(80px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
        @keyframes pulse { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.05); } }
        @keyframes shimmer {
          0% { background-position: -1000px 0; }
          100% { background-position: 1000px 0; }
        }

        .modal-header-modern {
          background: linear-gradient(135deg, #FDE047 0%, #FBBF24 50%, #F59E0B 100%);
          padding: 36px 48px;
          border-bottom: 4px solid #D97706;
          display: flex;
          justify-content: space-between;
          align-items: center;
          position: sticky;
          top: 0;
          z-index: 100;
          box-shadow: 0 8px 32px rgba(251, 191, 36, 0.5);
          background-size: 200% auto;
        }

        .modal-title { 
          display: flex; 
          align-items: center; 
          gap: 24px; 
          margin: 0; 
        }
        
        .title-icon { 
          width: 72px; 
          height: 72px; 
          background: white; 
          border-radius: 20px; 
          display: flex; 
          align-items: center; 
          justify-content: center; 
          font-size: 36px; 
          box-shadow: 0 8px 28px rgba(0,0,0,0.2);
          border: 4px solid #FCD34D;
          transition: all 0.3s ease;
        }
        .title-icon:hover {
          transform: rotate(10deg) scale(1.1);
        }
        
        .title-text h2 { 
          margin: 0 0 8px 0; 
          font-size: 2.2rem; 
          font-weight: 900; 
          color: white; 
          text-shadow: 0 3px 6px rgba(0,0,0,0.25);
          letter-spacing: -0.5px;
        }
        
        .title-text p {
          margin: 0;
          color: #FFFBEB;
          font-size: 1.05rem;
          font-weight: 700;
          text-shadow: 0 1px 3px rgba(0,0,0,0.15);
        }

        .btn-close-modern {
          background: white;
          color: #DC2626;
          border: 3px solid #DC2626;
          padding: 16px 36px;
          border-radius: 14px;
          cursor: pointer;
          font-size: 1.1rem;
          font-weight: 900;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          box-shadow: 0 4px 16px rgba(220, 38, 38, 0.3);
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .btn-close-modern:hover { 
          background: #DC2626; 
          color: white; 
          transform: translateY(-3px);
          box-shadow: 0 8px 24px rgba(220, 38, 38, 0.4);
        }

        .modal-content { 
          padding: 48px 48px 80px; 
          max-width: 1600px; 
          margin: 0 auto; 
        }

        .status-card { 
          padding: 28px 36px; 
          background: white; 
          border: 4px solid #FCD34D; 
          border-radius: 20px; 
          margin-bottom: 36px; 
          color: #92400E; 
          font-weight: 800; 
          display: flex; 
          align-items: center; 
          gap: 18px;
          font-size: 1.15rem;
          box-shadow: 0 6px 20px rgba(252, 211, 77, 0.3);
          transition: all 0.3s ease;
        }
        .status-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(252, 211, 77, 0.4);
        }

        .btn-predict {
          width: 100%;
          padding: 24px 48px;
          background: linear-gradient(135deg, #FDE047 0%, #FBBF24 50%, #F59E0B 100%);
          color: white;
          border-radius: 20px;
          border: none;
          cursor: pointer;
          font-weight: 900;
          font-size: 1.3rem;
          margin-bottom: 40px;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          box-shadow: 0 8px 28px rgba(251, 191, 36, 0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 14px;
          text-shadow: 0 2px 4px rgba(0,0,0,0.15);
          background-size: 200% auto;
        }
        .btn-predict:hover:not(:disabled) {
          transform: translateY(-4px);
          box-shadow: 0 12px 36px rgba(251, 191, 36, 0.6);
          background-position: right center;
        }
        .btn-predict:disabled {
          opacity: 0.7;
          cursor: not-allowed;
          transform: none;
          animation: pulse 2s infinite;
        }

        .explanation-box { 
          background: white; 
          border: 4px solid #FCD34D; 
          padding: 36px; 
          border-radius: 20px; 
          margin-bottom: 40px;
          box-shadow: 0 6px 24px rgba(252, 211, 77, 0.25);
          transition: all 0.3s ease;
        }
        .explanation-box:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 28px rgba(252, 211, 77, 0.35);
        }
        .explanation-box h3 {
          margin: 0 0 24px 0;
          color: #92400E;
          font-size: 1.5rem;
          font-weight: 900;
          display: flex;
          align-items: center;
          gap: 12px;
          padding-bottom: 16px;
          border-bottom: 4px solid #FCD34D;
        }
        .explanation-box ul {
          margin: 0;
          padding-left: 28px;
        }
        .explanation-box li {
          margin-bottom: 14px;
          color: #78350F;
          font-weight: 700;
          line-height: 1.7;
          font-size: 1.05rem;
        }

        .comparison-box { 
          background: linear-gradient(135deg, #FFFBEB 0%, #FEF3C7 100%); 
          border: 4px solid #FBBF24; 
          padding: 40px; 
          border-radius: 24px; 
          margin-bottom: 48px;
          box-shadow: 0 10px 36px rgba(251, 191, 36, 0.3);
          transition: all 0.3s ease;
        }
        .comparison-box:hover {
          transform: translateY(-3px);
          box-shadow: 0 12px 40px rgba(251, 191, 36, 0.4);
        }
        .comparison-box h3 {
          margin: 0 0 28px 0;
          color: #78350F;
          font-size: 1.6rem;
          font-weight: 900;
          display: flex;
          align-items: center;
          gap: 14px;
          padding-bottom: 18px;
          border-bottom: 4px solid #FBBF24;
        }
        
        .comparison-table { 
          width: 100%; 
          border-collapse: collapse; 
          margin-top: 24px;
          border-radius: 16px;
          overflow: hidden;
          box-shadow: 0 4px 16px rgba(0,0,0,0.08);
        }
        .comparison-table th { 
          background: linear-gradient(135deg, #FBBF24 0%, #F59E0B 100%); 
          color: white; 
          padding: 20px 18px; 
          font-weight: 900;
          font-size: 1.05rem;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          text-shadow: 0 1px 3px rgba(0,0,0,0.15);
        }
        .comparison-table td { 
          padding: 18px; 
          text-align: center; 
          color: #78350F; 
          font-weight: 800; 
          border-bottom: 2px solid #FEF3C7;
          font-size: 1rem;
          background: white;
        }
        .comparison-table tbody tr:hover {
          background: #FFFBEB !important;
          transform: scale(1.01);
          transition: all 0.2s ease;
        }

        .highlight-row {
          background: linear-gradient(135deg, #FEF3C7 0%, #FDE68A 100%) !important;
          border: 3px solid #FBBF24 !important;
        }
        .highlight-row td {
          font-weight: 900 !important;
          color: #92400E !important;
          font-size: 1.1rem !important;
        }

        .best-model-note {
          margin-top: 28px; 
          padding: 24px 32px; 
          background: linear-gradient(135deg, #FDE047 0%, #FCD34D 100%); 
          border: 4px solid #FBBF24; 
          border-radius: 18px;
          font-weight: 900; 
          color: #78350F; 
          display: flex; 
          align-items: center;
          gap: 14px;
          font-size: 1.2rem;
          box-shadow: 0 6px 20px rgba(251, 191, 36, 0.35);
          text-shadow: 0 1px 2px rgba(0,0,0,0.05);
        }

        .table-section { 
          margin-top: 48px; 
        }
        .table-section h3 {
          margin: 0 0 24px 0;
          color: #92400E;
          font-size: 1.5rem;
          font-weight: 900;
          display: flex;
          align-items: center;
          gap: 12px;
          padding-bottom: 16px;
          border-bottom: 4px solid #FCD34D;
        }
        
        .table-wrapper { 
          background: white; 
          border: 4px solid #FCD34D; 
          border-radius: 20px; 
          overflow: hidden;
          box-shadow: 0 6px 24px rgba(252, 211, 77, 0.25);
          transition: all 0.3s ease;
        }
        .table-wrapper:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 28px rgba(252, 211, 77, 0.35);
        }
        
        .modern-table { 
          width: 100%; 
          border-collapse: collapse; 
        }
        .modern-table th { 
          background: linear-gradient(135deg, #FBBF24 0%, #F59E0B 100%); 
          color: white; 
          padding: 20px 28px;
          font-weight: 900;
          font-size: 1.05rem;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          text-shadow: 0 1px 3px rgba(0,0,0,0.15);
        }
        .modern-table td { 
          padding: 18px 28px; 
          font-weight: 800; 
          border-bottom: 2px solid #FEF3C7; 
          color: #92400E;
          font-size: 1.05rem;
        }
        .modern-table tbody tr:hover {
          background: #FFFBEB;
          transform: scale(1.005);
          transition: all 0.2s ease;
        }

        .charts-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 32px;
          margin-top: 48px;
        }
        
        @media (max-width: 900px) {
          .charts-grid {
            grid-template-columns: 1fr;
          }
        }

        .chart-container { 
          background: white; 
          border: 4px solid #FCD34D; 
          border-radius: 20px; 
          padding: 32px; 
          min-height: 450px;
          box-shadow: 0 6px 24px rgba(252, 211, 77, 0.25);
          display: flex;
          flex-direction: column;
          transition: all 0.3s ease;
        }
        .chart-container:hover {
          transform: translateY(-4px);
          box-shadow: 0 10px 32px rgba(252, 211, 77, 0.35);
        }
        .chart-container h3 {
          margin: 0 0 20px 0;
          color: #92400E;
          font-size: 1.3rem;
          font-weight: 900;
          display: flex;
          align-items: center;
          gap: 12px;
          padding-bottom: 16px;
          border-bottom: 4px solid #FCD34D;
        }
        .chart-wrapper {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        /* Scrollbar Styling */
        .modal-fullscreen::-webkit-scrollbar {
          width: 12px;
        }
        .modal-fullscreen::-webkit-scrollbar-track {
          background: #FEF3C7;
        }
        .modal-fullscreen::-webkit-scrollbar-thumb {
          background: linear-gradient(135deg, #FBBF24 0%, #F59E0B 100%);
          border-radius: 6px;
          border: 2px solid #FEF3C7;
        }
        .modal-fullscreen::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(135deg, #F59E0B 0%, #D97706 100%);
        }
      `}</style>

      <div className="modal-fullscreen">

        {/* HEADER */}
        <div className="modal-header-modern">
          <div className="modal-title">
            <div className="title-icon">🎓</div>
            <div className="title-text">
              <h2>MLP Education Forecasting</h2>
              <p>Neural Network Projection by Education Level</p>
            </div>
          </div>
          <button className="btn-close-modern" onClick={onClose}>
            <span>✕</span>
            <span>Close</span>
          </button>
        </div>

        <div className="modal-content">

          {/* STATUS MESSAGE */}
          {message && (
            <div className="status-card">
              <span style={{ fontSize: "1.8rem" }}>{loading ? "⏳" : "💡"}</span>
              <span>{message}</span>
            </div>
          )}

          {/* PREDICT BUTTON */}
          <button className="btn-predict" onClick={onLoad} disabled={loading}>
            <span style={{ fontSize: "1.8rem" }}>🎯</span>
            <span>{loading ? "Analyzing Data..." : "Generate Education Forecast"}</span>
          </button>

          {/* EXPLANATION */}
          {explanation && (
            <div className="explanation-box">
              <h3>
                <span style={{ fontSize: "1.6rem" }}>🏆</span>
                {explanation.title}
              </h3>
              <ul>
                {explanation.points.map((p, i) => <li key={i}>{p}</li>)}
              </ul>
            </div>
          )}

          {/* MODEL COMPARISON */}
          {allModelResults && allModelResults.best_model && (
            <div className="comparison-box">
              <h3>
                <span style={{ fontSize: "1.7rem" }}>📊</span>
                MLP Model Comparison (Averaged Across All Categories)
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
                  {(() => {
                    // Calculate all averages first to find best values
                    const modelData = ["mlp1", "mlp2", "mlp3"].map(model => {
                      const metrics = allModelResults[model]?.metrics || {};
                      
                      const avg = key => {
                        const EXCLUDED = ["vocational", "notReported"];
                        const validCategories = Object.keys(metrics)
                          .filter(cat => !EXCLUDED.includes(cat))
                          .map(cat => metrics[cat][key])
                          .filter(v => typeof v === "number" && !Number.isNaN(v));

                        if (validCategories.length === 0) return null;

                        return validCategories.reduce((a, b) => a + b, 0) / validCategories.length;
                      };

                      return {
                        model,
                        mae: avg("mae"),
                        rmse: avg("rmse"),
                        mape: avg("mape"),
                        r2: avg("r2"),
                        accuracy: avg("accuracy")
                      };
                    });

                    // Find best values (lowest for mae/rmse/mape, highest for r2/accuracy)
                    const validMAE = modelData.map(d => d.mae).filter(v => v !== null);
                    const validRMSE = modelData.map(d => d.rmse).filter(v => v !== null);
                    const validMAPE = modelData.map(d => d.mape).filter(v => v !== null);
                    const validR2 = modelData.map(d => d.r2).filter(v => v !== null);
                    const validAccuracy = modelData.map(d => d.accuracy).filter(v => v !== null);

                    const bestMAE = validMAE.length > 0 ? Math.min(...validMAE) : null;
                    const bestRMSE = validRMSE.length > 0 ? Math.min(...validRMSE) : null;
                    const bestMAPE = validMAPE.length > 0 ? Math.min(...validMAPE) : null;
                    const bestR2 = validR2.length > 0 ? Math.max(...validR2) : null;
                    const bestAccuracy = validAccuracy.length > 0 ? Math.max(...validAccuracy) : null;

                    return modelData.map(data => {
                      const isBestModel = allModelResults.best_model === data.model;
                      
                      const getCellStyle = (value, bestValue, isLowerBetter = true) => {
                        if (value === null || bestValue === null) return {};
                        const isBestValue = isLowerBetter 
                          ? Math.abs(value - bestValue) < 0.001 
                          : Math.abs(value - bestValue) < 0.001;
                        
                        if (isBestValue) {
                          return {
                            background: "linear-gradient(135deg, #FEF3C7 0%, #FDE68A 100%)",
                            color: '#065F46',
                            fontWeight: 900,
                            fontSize: '1.1rem',
                            position: 'relative'
                          };
                        }
                        return {};
                      };

                      return (
                        <tr key={data.model} className={isBestModel ? "highlight-row" : ""}>
                          <td style={{ fontWeight: 900, fontSize: "1.1rem" }}>
                            {data.model.toUpperCase()}
                            {isBestModel && " ⭐"}
                          </td>
                          <td style={getCellStyle(data.mae, bestMAE, true)}>
                            {data.mae !== null ? data.mae.toFixed(3) : "—"}
                            {data.mae === bestMAE && data.mae !== null && " 🏆"}
                          </td>
                          <td style={getCellStyle(data.rmse, bestRMSE, true)}>
                            {data.rmse !== null ? data.rmse.toFixed(3) : "—"}
                            {data.rmse === bestRMSE && data.rmse !== null && " 🏆"}
                          </td>
                          <td style={getCellStyle(data.mape, bestMAPE, true)}>
                            {data.mape !== null ? data.mape.toFixed(3) : "—"}
                            {data.mape === bestMAPE && data.mape !== null && " 🏆"}
                          </td>
                          <td style={getCellStyle(data.r2, bestR2, false)}>
                            {data.r2 !== null ? data.r2.toFixed(3) : "—"}
                            {data.r2 === bestR2 && data.r2 !== null && " 🏆"}
                          </td>
                          <td style={getCellStyle(data.accuracy, bestAccuracy, false)}>
                            {data.accuracy !== null ? data.accuracy.toFixed(3) : "—"}
                            {data.accuracy === bestAccuracy && data.accuracy !== null && " 🏆"}
                          </td>
                        </tr>
                      );
                    });
                  })()}
                </tbody>
              </table>

              <div className="best-model-note">
                <span style={{ fontSize: "1.8rem" }}>🏆</span>
                <span>Best Model: <strong>{allModelResults.best_model.toUpperCase()}</strong></span>
              </div>
            </div>
          )}

          {/* TABLES */}
          {tableData &&
            Object.keys(tableData).map((cat) => {
              const allPredictions = tableData[cat].map(r => r.predicted);
              const maxPrediction = Math.max(...allPredictions);
              
              return (
                <div key={cat} className="table-section">
                  <h3>
                    <span style={{ fontSize: "1.5rem" }}>📘</span>
                    {EDU_LABELS[cat]} Forecast
                  </h3>

                  <div className="table-wrapper">
                    <table className="modern-table">
                      <thead>
                        <tr>
                          <th>Year</th>
                          <th>Predicted</th>
                        </tr>
                      </thead>

                      <tbody>
                        {tableData[cat].map((row, i) => {
                          const isBest = row.predicted === maxPrediction;
                          
                          return (
                            <tr key={i} style={isBest ? { 
                              background: 'linear-gradient(135deg, #FEF3C7 0%, #FDE68A 100%)',
                              border: '3px solid #FBBF24'
                            } : {}}>
                              <td style={{ fontWeight: 900 }}>{row.year}</td>
                              <td style={{ 
                                color: isBest ? "#92400E" : "#D97706", 
                                fontWeight: 900, 
                                fontSize: isBest ? "1.25rem" : "1.15rem" 
                              }}>
                                {row.predicted.toLocaleString()}
                                {isBest && " 🏆"}
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

          {/* CHARTS IN 2x3 GRID */}
          {chartData && Object.keys(chartData).length > 0 && (
            <div className="charts-grid">
              {Object.keys(chartData).map((cat) => (
                <div key={cat} className="chart-container">
                  <h3>
                    <span style={{ fontSize: "1.4rem" }}>📈</span>
                    {EDU_LABELS[cat]}
                  </h3>
                  <div className="chart-wrapper">
                    <Line data={chartData[cat]} options={{
                      responsive: true,
                      maintainAspectRatio: true,
                      plugins: {
                        legend: {
                          display: true,
                          labels: {
                            font: { size: 13, weight: 'bold' },
                            color: '#92400E',
                            padding: 14
                          }
                        },
                        tooltip: {
                          backgroundColor: 'white',
                          titleColor: '#92400E',
                          bodyColor: '#78350F',
                          borderColor: '#FCD34D',
                          borderWidth: 3,
                          padding: 14,
                          titleFont: { size: 14, weight: 'bold' },
                          bodyFont: { size: 13, weight: '700' },
                          boxShadow: '0 4px 12px rgba(252, 211, 77, 0.3)'
                        }
                      },
                      scales: {
                        y: {
                          ticks: { 
                            color: '#92400E', 
                            font: { weight: 'bold', size: 12 } 
                          },
                          grid: { color: '#FEF3C7', lineWidth: 1.5 }
                        },
                        x: {
                          ticks: { 
                            color: '#92400E', 
                            font: { weight: 'bold', size: 12 } 
                          },
                          grid: { color: '#FEF3C7', lineWidth: 1.5 }
                        }
                      }
                    }} />
                  </div>
                </div>
              ))}
            </div>
          )}

        </div>
      </div>
    </>
  );
}