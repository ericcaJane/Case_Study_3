// components/forms/EducationForm.jsx
import React from "react";
import { Plus } from "lucide-react";
import styles from "../../styles/appStyles";

export default function EducationForm({
  educationForm,
  setEducationForm,
  handleEducationAdd
}) {
  return (
    <div style={styles.card}>
      <div style={styles.cardHeader}>
        <h2 style={styles.cardTitle}>
          <Plus size={20} /> Add New Education Record
        </h2>
        <div style={styles.cardSubtitle}>
          Enter emigrant data by educational attainment
        </div>
      </div>

      <div style={styles.formGrid}>
        <div style={styles.formGroup}>
          <label style={styles.label}>Year</label>
          <input
            name="year"
            value={educationForm.year}
            onChange={(e) =>
              setEducationForm({ ...educationForm, year: e.target.value })
            }
            type="number"
            min="1980"
            max="2030"
            style={styles.input}
            placeholder="2020"
          />
        </div>

        {[
          "elementary",
          "highschool",
          "college",
          "postgrad",
          "notReported",
        ].map((field) => (
          <div key={field} style={styles.formGroup}>
            <label style={styles.label}>
              {field.charAt(0).toUpperCase() + field.slice(1)}
            </label>
            <input
              name={field}
              value={educationForm[field]}
              onChange={(e) =>
                setEducationForm({
                  ...educationForm,
                  [field]: e.target.value,
                })
              }
              type="number"
              min="0"
              style={styles.input}
            />
          </div>
        ))}
      </div>

      <button style={styles.primaryButton} onClick={handleEducationAdd}>
        <Plus size={16} /> Add Record
      </button>
    </div>
  );
}
