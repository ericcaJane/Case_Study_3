import React from "react";
import { BarChart3, TrendingUp, Activity, Users, Globe } from "lucide-react";
import styles from "../../styles/appStyles";

export default function VisualizationSelector({ active, setActive }) {
  const items = [
    { value: "trends", label: "Trends", icon: TrendingUp },
    { value: "comparison", label: "Comparison", icon: BarChart3 },
    { value: "composition", label: "Composition", icon: Activity },
    { value: "distribution", label: "Distribution", icon: Users },
    { value: "relationships", label: "Relationships", icon: Globe },
    { value: "geographic", label: "Geographic", icon: Globe },
  ];

  return (
    <div style={styles.selectorCard}>
      <div style={styles.selectorHeader}>
        <BarChart3 size={20} />
        <span>Select Visualization [All Dataset]</span>
      </div>

      <div style={styles.visualizationGrid}>
        {items.map(({ value, label, icon: Icon }) => (
          <button
            key={value}
            onClick={() => setActive(value)}
            style={{
              ...styles.vizButton,
              ...(active === value ? styles.vizButtonActive : {}),
            }}
          >
            <Icon size={16} />
            <span>{label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
