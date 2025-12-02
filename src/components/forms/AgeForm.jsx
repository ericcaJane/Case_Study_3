// components/forms/AgeForm.jsx
import React from "react";
import { Plus } from "lucide-react";
import styles from "../../styles/appStyles";

export default function AgeForm({ ageForm, setAgeForm, handleAgeAdd }) {
  return (
    <div style={styles.card}>
      <div style={styles.cardHeader}>
        <h2 style={styles.cardTitle}>
          <Plus size={20} /> Add New Age Record
        </h2>
        <div style={styles.cardSubtitle}>Enter emigrant data by age group</div>
      </div>

      <div style={styles.formGrid}>
        {/* Year */}
        <div style={styles.formGroup}>
          <label style={styles.label}>Year</label>
          <input
            type="number"
            min="1980"
            max="2030"
            value={ageForm.year}
            onChange={(e) =>
              setAgeForm({ ...ageForm, year: e.target.value })
            }
            style={styles.input}
            placeholder="2020"
          />
        </div>

        {/* Age Group */}
        <div style={styles.formGroup}>
          <label style={styles.label}>Age Group</label>
          <input
            type="text"
            value={ageForm.ageGroup}
            onChange={(e) =>
              setAgeForm({ ...ageForm, ageGroup: e.target.value })
            }
            style={styles.input}
            placeholder="20 - 24"
          />
        </div>

        {/* Count */}
        <div style={styles.formGroup}>
          <label style={styles.label}>Count</label>
          <input
            type="number"
            min="0"
            value={ageForm.count}
            onChange={(e) =>
              setAgeForm({ ...ageForm, count: e.target.value })
            }
            style={styles.input}
            placeholder="1000"
          />
        </div>
      </div>

      <button style={styles.primaryButton} onClick={handleAgeAdd}>
        <Plus size={16} /> Add Record
      </button>
    </div>
  );
}
