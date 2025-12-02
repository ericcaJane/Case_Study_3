// components/forms/SexForm.jsx
import React from "react";
import { Plus } from "lucide-react";
import styles from "../../styles/appStyles";

export default function SexForm({ sexForm, setSexForm, handleSexAdd }) {
  return (
    <div style={styles.card}>
      <div style={styles.cardHeader}>
        <h2 style={styles.cardTitle}>
          <Plus size={20} /> Add New Male/Female Record
        </h2>
        <div style={styles.cardSubtitle}>Enter emigrant data by sex</div>
      </div>

      <div style={styles.formGrid}>
        {/* Year */}
        <div style={styles.formGroup}>
          <label style={styles.label}>Year</label>
          <input
            name="year"
            value={sexForm.year}
            onChange={(e) =>
              setSexForm({ ...sexForm, year: e.target.value })
            }
            type="number"
            min="1900"
            max="2030"
            style={styles.input}
          />
        </div>

        {/* Male */}
        <div style={styles.formGroup}>
          <label style={styles.label}>Male</label>
          <input
            name="male"
            value={sexForm.male}
            onChange={(e) =>
              setSexForm({ ...sexForm, male: e.target.value })
            }
            type="number"
            min="0"
            style={styles.input}
          />
        </div>

        {/* Female */}
        <div style={styles.formGroup}>
          <label style={styles.label}>Female</label>
          <input
            name="female"
            value={sexForm.female}
            onChange={(e) =>
              setSexForm({ ...sexForm, female: e.target.value })
            }
            type="number"
            min="0"
            style={styles.input}
          />
        </div>
      </div>

      <button style={styles.primaryButton} onClick={handleSexAdd}>
        <Plus size={16} /> Add Record
      </button>
    </div>
  );
}
