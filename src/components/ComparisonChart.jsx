import React, { useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from "recharts";

function ComparisonChart({ data }) {
  const availableDecades = [...new Set(data.map((d) => d.decade))];
  const [selectedDecade, setSelectedDecade] = useState(
    availableDecades[0] || ""
  );
  const filteredData = data.filter((d) => d.decade === selectedDecade);

  // Professional, diverse color palette (colorblind-friendly)
   // Soft pastel color palette
  const COLORS = [
    "#B4D4FF", // Pastel Blue
    "#FFB4B4", // Pastel Pink
    "#B4E4B4", // Pastel Green
    "#FFD4B4", // Pastel Peach
    "#D4B4FF", // Pastel Lavender
    "#B4FFE4", // Pastel Mint
    "#FFE4B4", // Pastel Yellow
    "#FFB4D4", // Pastel Rose
    "#D4E4B4", // Pastel Lime
    "#B4D4E4", // Pastel Sky
  ];

  return (
    <div>
      {/* Decade Selector */}
      <div style={{ marginBottom: "16px", textAlign: "center" }}>
        {availableDecades.map((dec) => (
          <button
            key={dec}
            onClick={() => setSelectedDecade(dec)}
            style={{
              margin: "0 6px",
              padding: "8px 14px",
              borderRadius: "8px",
              border:
                selectedDecade === dec
                  ? "2px solid #FFC107"
                  : "1px solid #D1D5DB",
              background: selectedDecade === dec ? "#FFC107" : "white",
              color: selectedDecade === dec ? "white" : "#374151",
              fontWeight: "600",
              cursor: "pointer",
              transition: "all 0.2s ease",
            }}
          >
            {dec}
          </button>
        ))}
      </div>

      {/* Chart */}
      <ResponsiveContainer width="100%" height={400}>
        <BarChart
          data={filteredData}
          margin={{ top: 20, right: 30, left: 20, bottom: 120 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="country"
            angle={-45}
            textAnchor="end"
            interval={0}
            height={120}
            tick={{ fontSize: 12 }}
          />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="count">
            {filteredData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export default ComparisonChart;