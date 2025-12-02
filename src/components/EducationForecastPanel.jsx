import React, { useState } from "react";

export default function EducationForecastPanel({
  handleEducationForecast,
  educationForecastData,
  educationForecastYears,
  setEducationForecastYears
}) {
  const [loading, setLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);

  const categories = [
    { id: "elementary", label: "Elementary", emoji: "📚", color: "#F59E0B", gradient: "from-amber-500 to-yellow-500" },
    { id: "highschool", label: "High School", emoji: "🎓", color: "#FBBF24", gradient: "from-yellow-400 to-amber-400" },
    { id: "vocational", label: "Vocational", emoji: "🔧", color: "#F59E0B", gradient: "from-amber-500 to-orange-500" },
    { id: "college", label: "College", emoji: "🏛️", color: "#D97706", gradient: "from-amber-600 to-yellow-600" },
    { id: "postgrad", label: "Post Graduate", emoji: "👨‍🎓", color: "#FBBF24", gradient: "from-yellow-400 to-amber-500" },
    { id: "notReported", label: "Not Reported", emoji: "❓", color: "#D97706", gradient: "from-amber-600 to-orange-600" }
  ];

  const handlePrediction = async (categoryId) => {
    setLoading(true);
    setSelectedCategory(categoryId);
    await handleEducationForecast(categoryId);
    setLoading(false);
  };

  const getCategoryColor = (id) => {
    return categories.find(c => c.id === id)?.color || "#F59E0B";
  };

  return (
    <div style={{ maxWidth: "1400px", margin: "0 auto" }}>
      {/* Header */}
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
        <h2
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
          <span style={{ fontSize: "2.8rem" }}>🎓</span>
          Education Level Forecasting
        </h2>
        <p
          style={{
            margin: 0,
            color: "#92400E",
            fontSize: "1.1rem",
            fontWeight: 600
          }}
        >
          Select an education category to predict emigrant trends
        </p>
      </div>

      {/* Controls */}
      <div
        style={{
          background: "white",
          padding: "36px",
          borderRadius: "24px",
          boxShadow: "0 8px 32px rgba(251, 191, 36, 0.15)",
          marginBottom: "36px",
          border: "3px solid #FEF3C7"
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "28px"
          }}
        >
          <h3
            style={{
              margin: 0,
              fontSize: "1.3rem",
              fontWeight: 800,
              color: "#78350F"
            }}
          >
            Choose Education Level
          </h3>

          {/* Years Selector */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 14,
              background: "linear-gradient(135deg, #FEF3C7 0%, #FDE68A 100%)",
              padding: "14px 24px",
              borderRadius: "16px",
              border: "2px solid #FBBF24"
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
              value={educationForecastYears}
              onChange={(e) => setEducationForecastYears(parseInt(e.target.value))}
              style={{
                padding: "12px 18px",
                borderRadius: "12px",
                border: "2px solid #F59E0B",
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

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(190px, 1fr))",
            gap: 18
          }}
        >
          {categories.map((cat) => {
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => handlePrediction(cat.id)}
                disabled={loading}
                className="education-category-btn"
                style={{
                  padding: "24px",
                  background: isSelected && !loading
                    ? `linear-gradient(135deg, ${cat.color} 0%, ${cat.color}dd 100%)`
                    : loading
                    ? "#FEF3C7"
                    : "white",
                  color: isSelected && !loading ? "white" : "#78350F",
                  borderRadius: "18px",
                  border: isSelected && !loading ? "3px solid #FCD34D" : "3px solid #FEF3C7",
                  cursor: loading ? "not-allowed" : "pointer",
                  fontWeight: 800,
                  fontSize: "1.05rem",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 14,
                  transition: "all 0.3s ease",
                  boxShadow: isSelected && !loading
                    ? `0 10px 30px ${cat.color}50`
                    : "0 4px 12px rgba(251, 191, 36, 0.1)",
                  transform: isSelected && !loading ? "translateY(-6px)" : "translateY(0)",
                  opacity: loading ? 0.6 : 1,
                  textShadow: isSelected && !loading ? "0 1px 2px rgba(0, 0, 0, 0.1)" : "none"
                }}
              >
                <span style={{ fontSize: "2.8rem" }}>{cat.emoji}</span>
                <span>{cat.label}</span>
                {isSelected && !loading && (
                  <span style={{ fontSize: "0.8rem", opacity: 0.95 }}>✓ Selected</span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Loading Card */}
      {loading && (
        <div
          style={{
            padding: "52px",
            textAlign: "center",
            background: "linear-gradient(135deg, #FFFBEB 0%, #FEF3C7 100%)",
            borderRadius: "24px",
            boxShadow: "0 8px 32px rgba(251, 191, 36, 0.2)",
            border: "3px solid #FDE68A"
          }}
        >
          <div
            style={{
              fontSize: "4.5rem",
              marginBottom: "20px",
              animation: "float 2s ease-in-out infinite"
            }}
          >
            🔮
          </div>
          <h3
            style={{
              margin: 0,
              fontSize: "1.7rem",
              fontWeight: 900,
              color: "#78350F",
              marginBottom: "12px"
            }}
          >
            Analyzing Data...
          </h3>
          <p style={{ margin: 0, color: "#92400E", fontSize: "1rem", fontWeight: 600 }}>
            Generating {educationForecastYears}-year education forecast
          </p>

          {/* Progress Bar */}
          <div
            style={{
              marginTop: "28px",
              height: "8px",
              background: "#FEF3C7",
              borderRadius: "12px",
              overflow: "hidden",
              maxWidth: "320px",
              margin: "28px auto 0",
              border: "2px solid #FDE68A"
            }}
          >
            <div
              style={{
                height: "100%",
                background: selectedCategory ? getCategoryColor(selectedCategory) : "#F59E0B",
                width: "100%",
                animation: "progress 1.5s ease-in-out infinite"
              }}
            />
          </div>
        </div>
      )}

      {/* Result Preview */}
      {educationForecastData && !loading && (
        <div
          style={{
            background: "white",
            borderRadius: "24px",
            boxShadow: "0 8px 32px rgba(251, 191, 36, 0.2)",
            overflow: "hidden",
            border: "3px solid #FEF3C7"
          }}
        >
          {/* Header */}
          <div
            style={{
              background: selectedCategory
                ? `linear-gradient(135deg, ${getCategoryColor(selectedCategory)} 0%, ${getCategoryColor(selectedCategory)}dd 100%)`
                : "linear-gradient(135deg, #FBBF24 0%, #F59E0B 100%)",
              padding: "32px 36px",
              color: "white",
              borderBottom: "3px solid #FCD34D"
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "16px" }}>
              <div>
                <h3
                  style={{
                    margin: 0,
                    fontSize: "1.8rem",
                    fontWeight: 900,
                    marginBottom: "6px",
                    textShadow: "0 2px 4px rgba(0, 0, 0, 0.15)"
                  }}
                >
                  📈 Forecast Results
                </h3>
                <p style={{ margin: 0, opacity: 0.95, fontSize: "1rem", fontWeight: 600 }}>
                  {educationForecastYears}-year emigrant projection
                </p>
              </div>
              <div
                style={{
                  background: "rgba(255,255,255,0.25)",
                  backdropFilter: "blur(10px)",
                  padding: "14px 28px",
                  borderRadius: "14px",
                  fontWeight: 900,
                  fontSize: "1.2rem",
                  border: "2px solid rgba(255,255,255,0.3)"
                }}
              >
                {categories.find(c => c.id === selectedCategory)?.label || "Category"}
              </div>
            </div>
          </div>

          {/* Results Grid */}
          <div style={{ padding: "36px" }}>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))",
                gap: 18
              }}
            >
              {educationForecastData.years.slice(0, educationForecastYears).map((year, i) => {
                const value = Math.round(educationForecastData.values[i]);
                const prevValue = i > 0 ? Math.round(educationForecastData.values[i - 1]) : value;
                const change = value - prevValue;
                const percentChange = prevValue > 0 ? ((change / prevValue) * 100).toFixed(1) : 0;
                const isIncrease = change > 0;

                return (
                  <div
                    key={i}
                    className="forecast-card"
                    style={{
                      padding: "22px",
                      background: "linear-gradient(135deg, #FFFBEB 0%, #FEF3C7 100%)",
                      borderRadius: "18px",
                      border: "3px solid #FDE68A",
                      transition: "all 0.3s ease",
                      position: "relative",
                      overflow: "hidden"
                    }}
                  >
                    {/* Year Badge */}
                    <div
                      style={{
                        fontSize: "0.85rem",
                        fontWeight: 800,
                        color: "#92400E",
                        marginBottom: "10px",
                        display: "flex",
                        alignItems: "center",
                        gap: "5px"
                      }}
                    >
                      <span style={{ fontSize: "1rem" }}>📅</span>
                      {year}
                    </div>

                    {/* Value */}
                    <div
                      style={{
                        fontSize: "1.7rem",
                        fontWeight: 900,
                        color: "#78350F",
                        marginBottom: "10px"
                      }}
                    >
                      {value.toLocaleString()}
                    </div>

                    {/* Change Indicator */}
                    {i > 0 && (
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "5px",
                          fontSize: "0.8rem",
                          fontWeight: 800,
                          color: isIncrease ? "#10b981" : "#ef4444"
                        }}
                      >
                        <span>{isIncrease ? "↗" : "↘"}</span>
                        {Math.abs(percentChange)}%
                      </div>
                    )}

                    {/* Accent Bar */}
                    <div
                      style={{
                        position: "absolute",
                        bottom: 0,
                        left: 0,
                        right: 0,
                        height: "5px",
                        background: selectedCategory
                          ? getCategoryColor(selectedCategory)
                          : "#F59E0B",
                        opacity: 0.7
                      }}
                    />
                  </div>
                );
              })}
            </div>

            {/* Summary Stats */}
            {educationForecastData.values.length > 1 && (
              <div
                style={{
                  marginTop: "36px",
                  padding: "28px",
                  background: "linear-gradient(135deg, #FEF3C7 0%, #FDE68A 100%)",
                  borderRadius: "18px",
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
                  gap: 20,
                  border: "3px solid #FBBF24"
                }}
              >
                <div>
                  <div style={{ fontSize: "0.9rem", color: "#78350F", fontWeight: 800, marginBottom: "6px" }}>
                    Starting Count
                  </div>
                  <div style={{ fontSize: "1.5rem", fontWeight: 900, color: "#92400E" }}>
                    {Math.round(educationForecastData.values[0]).toLocaleString()}
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: "0.9rem", color: "#78350F", fontWeight: 800, marginBottom: "6px" }}>
                    Projected Count
                  </div>
                  <div style={{ fontSize: "1.5rem", fontWeight: 900, color: "#92400E" }}>
                    {Math.round(educationForecastData.values[educationForecastYears - 1]).toLocaleString()}
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: "0.9rem", color: "#78350F", fontWeight: 800, marginBottom: "6px" }}>
                    Total Change
                  </div>
                  <div style={{ fontSize: "1.5rem", fontWeight: 900, color: "#92400E" }}>
                    {(Math.round(educationForecastData.values[educationForecastYears - 1]) - Math.round(educationForecastData.values[0])).toLocaleString()}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }

        @keyframes progress {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }

        .education-category-btn:hover:not(:disabled) {
          transform: translateY(-8px) !important;
          box-shadow: 0 14px 36px rgba(251, 191, 36, 0.25) !important;
          border-color: #FBBF24 !important;
        }

        .forecast-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 14px 36px rgba(251, 191, 36, 0.25);
          border-color: #FBBF24;
        }
      `}</style>
    </div>
  );
}