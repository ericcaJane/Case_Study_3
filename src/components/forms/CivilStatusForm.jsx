// components/forms/CivilStatusForm.jsx
import React from "react";
import { Plus } from "lucide-react";
import styles from "../../styles/appStyles";

export default function CivilStatusForm({
  form,
  errors,
  handleChange,
  handleAdd,
  loading
}) {
  const fieldLabels = {
    year: "Year",
    single: "Single",
    married: "Married",
    widower: "Widower",
    separated: "Separated",
    divorced: "Divorced",
    notReported: "Not Reported",
  };

  return (
    <div style={styles.card}>
      <div style={styles.cardHeader}>
        <h2 style={styles.cardTitle}>
          <Plus size={20} /> Add New Record
        </h2>
        <div style={styles.cardSubtitle}>
          Enter emigrant data by marital status
        </div>
      </div>

      <div style={styles.formGrid}>
        {Object.keys(form).map((key) => (
          <div key={key} style={styles.formGroup}>
            <label style={styles.label}>{fieldLabels[key]}</label>
            <input
              name={key}
              value={form[key]}
              onChange={handleChange}
              type="number"
              min="0"
              placeholder={key === "year" ? "2024" : "0"}
              style={{
                ...styles.input,
                ...(errors[key] ? styles.inputError : {}),
              }}
            />
            {errors[key] && (
              <span style={styles.errorText}>{errors[key]}</span>
            )}
          </div>
        ))}
      </div>

      <button
        style={{
          ...styles.primaryButton,
          ...(loading ? styles.buttonDisabled : {}),
        }}
        onClick={handleAdd}
        disabled={loading}
      >
        <Plus size={16} />
        {loading ? "Adding..." : "Add Record"}
      </button>
    </div>
  );
}
