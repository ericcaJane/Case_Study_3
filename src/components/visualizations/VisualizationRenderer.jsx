// VisualizationRenderer.jsx
import React from "react";
import TrendsFilters from "./filters/TrendsFilters";
import DistributionFilters from "./filters/DistributionFilters";
import CompositionFilters from "./filters/CompositionFilters";

import TrendsChart from "./charts/TrendsChart";
import DistributionChart from "./charts/DistributionChart";
import CompositionChart from "./charts/CompositionChart";
import ComparisonChartSection from "./charts/ComparisonChartSection";
import RelationshipsChart from "./charts/RelationshipsChart";
import GeographicChart from "./charts/GeographicChart";

export default function VisualizationRenderer({
  activeVisualization,
  chartDescriptions,
  ...props
}) {
  return (
    <div style={props.styles.chartCard}>
      <div style={props.styles.cardHeader}>
        <h2 style={props.styles.cardTitle}>Data Visualization</h2>

        <p style={{
          fontSize: "0.9rem",
          color: "#4B5563",
          marginTop: "0.3rem",
        }}>
          {chartDescriptions?.[activeVisualization] ?? ""}
        </p>
      </div>

      {/* ===========================
          FILTER PANELS
         =========================== */}
      {activeVisualization === "trends" && (
        <TrendsFilters {...props} />
      )}

      {activeVisualization === "distribution" && (
        <DistributionFilters {...props} />
      )}

      {activeVisualization === "composition" && (
        <CompositionFilters {...props} />
      )}

      {/* ===========================
          CHART DISPLAY
         =========================== */}
      {activeVisualization === "trends" && (
        <TrendsChart {...props} />
      )}

      {activeVisualization === "comparison" && (
        <ComparisonChartSection {...props} />
      )}

      {activeVisualization === "composition" && (
        <CompositionChart {...props} />
      )}

      {activeVisualization === "distribution" && (
        <DistributionChart {...props} />
      )}

      {activeVisualization === "relationships" && (
        <RelationshipsChart {...props} />
      )}

      {activeVisualization === "geographic" && (
        <GeographicChart {...props} />
      )}
    </div>
  );
}
