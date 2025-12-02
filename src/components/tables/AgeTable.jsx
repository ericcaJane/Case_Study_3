// components/tables/AgeTable.jsx
import React from "react";
import { Edit2, Trash2, Save, X } from "lucide-react";
import styles from "../../styles/appStyles";

export default function AgeTable({
  ageData,
  recordsLimit,
  ageEditingId,
  ageEditForm,
  setAgeEditForm,
  startAgeEdit,
  saveAgeEdit,
  cancelAgeEdit,
  handleAgeDelete
}) {
  const rows =
    recordsLimit === "all"
      ? ageData
      : ageData.slice(0, Number(recordsLimit));

  return (
    <div style={styles.tableContainer}>
      <table style={styles.table}>
        <thead>
          <tr>
            <th style={styles.th}>Year</th>
            <th style={styles.th}>Age Group</th>
            <th style={styles.th}>Count</th>
            <th style={styles.th}>Actions</th>
          </tr>
        </thead>

        <tbody>
          {rows.map((row) => {
            const isEdit = ageEditingId === row.id;

            return (
              <tr key={row.id} style={styles.tableRow}>
                {isEdit ? (
                  <>
                    <td style={styles.td}>
                      <input
                        value={ageEditForm.year}
                        onChange={(e) =>
                          setAgeEditForm({ ...ageEditForm, year: e.target.value })
                        }
                        type="number"
                        style={styles.tableInput}
                      />
                    </td>

                    <td style={styles.td}>
                      <input
                        value={ageEditForm.ageGroup}
                        onChange={(e) =>
                          setAgeEditForm({ ...ageEditForm, ageGroup: e.target.value })
                        }
                        type="text"
                        style={styles.tableInput}
                      />
                    </td>

                    <td style={styles.td}>
                      <input
                        value={ageEditForm.count}
                        onChange={(e) =>
                          setAgeEditForm({ ...ageEditForm, count: e.target.value })
                        }
                        type="number"
                        min="0"
                        style={styles.tableInput}
                      />
                    </td>

                    <td style={styles.td}>
                      <button style={styles.actionButton} onClick={() => saveAgeEdit(row.id)}>
                        <Save size={16} color="#3B82F6" />
                      </button>
                      <button style={styles.actionButton} onClick={cancelAgeEdit}>
                        <X size={16} color="#EF4444" />
                      </button>
                    </td>
                  </>
                ) : (
                  <>
                    <td style={styles.td}>{row.year}</td>
                    <td style={styles.td}>{row.ageGroup}</td>
                    <td style={styles.td}>{row.count}</td>
                    <td style={styles.td}>
                      <button style={styles.actionButton} onClick={() => startAgeEdit(row)}>
                        <Edit2 size={16} color="#3B82F6" />
                      </button>
                      <button style={styles.actionButton} onClick={() => handleAgeDelete(row.id)}>
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
        Showing {rows.length} of {ageData.length} records
      </p>
    </div>
  );
}
