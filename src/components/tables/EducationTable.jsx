// components/tables/EducationTable.jsx
import React from "react";
import { Edit2, Trash2, Save, X } from "lucide-react";
import styles from "../../styles/appStyles";

export default function EducationTable({
  educationData,
  educationEditingId,
  educationEditForm,
  setEducationEditForm,
  startEducationEdit,
  saveEducationEdit,
  cancelEducationEdit,
  handleEducationDelete,
  recordsLimit
}) {
  const rows =
    recordsLimit === "all"
      ? educationData
      : educationData.slice(0, Number(recordsLimit));

  const fields = ["elementary", "highschool", "college", "postgrad", "notReported"];

  return (
    <div style={styles.tableContainer}>
      <table style={styles.table}>
        <thead>
          <tr>
            <th style={styles.th}>Year</th>
            {fields.map((f) => (
              <th key={f} style={styles.th}>
                {f.charAt(0).toUpperCase() + f.slice(1)}
              </th>
            ))}
            <th style={styles.th}>Total</th>
            <th style={styles.th}>Actions</th>
          </tr>
        </thead>

        <tbody>
          {rows.map((row) => {
            const total =
              row.elementary +
              row.highschool +
              row.college +
              row.postgrad +
              row.notReported;

            const isEdit = educationEditingId === row.id;

            return (
              <tr key={row.id} style={styles.tableRow}>
                {isEdit ? (
                  <>
                    <td style={styles.td}>
                      <input
                        value={educationEditForm.year}
                        onChange={(e) =>
                          setEducationEditForm({
                            ...educationEditForm,
                            year: e.target.value,
                          })
                        }
                        type="number"
                        style={styles.tableInput}
                      />
                    </td>

                    {fields.map((f) => (
                      <td key={f} style={styles.td}>
                        <input
                          value={educationEditForm[f]}
                          onChange={(e) =>
                            setEducationEditForm({
                              ...educationEditForm,
                              [f]: e.target.value,
                            })
                          }
                          type="number"
                          min="0"
                          style={styles.tableInput}
                        />
                      </td>
                    ))}

                    <td style={styles.totalCell}>
                      {fields.reduce(
                        (sum, f) => sum + Number(educationEditForm[f] || 0),
                        0
                      )}
                    </td>

                    <td style={styles.td}>
                      <button
                        style={styles.actionButton}
                        onClick={() => saveEducationEdit(row.id)}
                      >
                        <Save size={16} color="#3B82F6" />
                      </button>
                      <button
                        style={styles.actionButton}
                        onClick={cancelEducationEdit}
                      >
                        <X size={16} color="#EF4444" />
                      </button>
                    </td>
                  </>
                ) : (
                  <>
                    <td style={styles.td}>{row.year}</td>
                    {fields.map((f) => (
                      <td key={f} style={styles.td}>
                        {row[f].toLocaleString()}
                      </td>
                    ))}
                    <td style={styles.totalCell}>{total.toLocaleString()}</td>

                    <td style={styles.td}>
                      <button style={styles.actionButton} onClick={() => startEducationEdit(row)}>
                        <Edit2 size={16} color="#3B82F6" />
                      </button>
                      <button style={styles.actionButton} onClick={() => handleEducationDelete(row.id)}>
                        <Trash2 size={16} color="#EF4444" />
                      </button>
                    </td>
                  </>
                )}
              </tr>
            );
          })}
        </tbody>
      </table>

      <p style={styles.tableCountText}>
        Showing {rows.length} of {educationData.length} records
      </p>
    </div>
  );
}
