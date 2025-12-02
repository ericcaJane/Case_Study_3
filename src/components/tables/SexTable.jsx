// components/tables/SexTable.jsx
import React from "react";
import { Edit2, Trash2, Save, X } from "lucide-react";
import styles from "../../styles/appStyles";

export default function SexTable({
  sexTrendData,
  recordsLimit,
  sexEditingId,
  sexEditForm,
  startSexEdit,
  cancelSexEdit,
  saveSexEdit,
  handleSexDelete,
  setSexEditForm
}) {
  const rows =
    recordsLimit === "all"
      ? sexTrendData
      : sexTrendData.slice(0, Number(recordsLimit));

  return (
    <div style={styles.tableContainer}>
      <table style={styles.table}>
        <thead>
          <tr>
            <th style={styles.th}>Year</th>
            <th style={styles.th}>Male</th>
            <th style={styles.th}>Female</th>
            <th style={styles.th}>Total</th>
            <th style={styles.th}>Actions</th>
          </tr>
        </thead>

        <tbody>
          {rows.map((row) => {
            const total = row.male + row.female;
            const isEdit = sexEditingId === row.id;

            return (
              <tr key={row.id} style={styles.tableRow}>
                {isEdit ? (
                  <>
                    <td style={styles.td}>
                      <input
                        value={sexEditForm.year}
                        onChange={(e) =>
                          setSexEditForm({ ...sexEditForm, year: e.target.value })
                        }
                        type="number"
                        min="1900"
                        max="2030"
                        style={styles.tableInput}
                      />
                    </td>
                    <td style={styles.td}>
                      <input
                        value={sexEditForm.male}
                        onChange={(e) =>
                          setSexEditForm({ ...sexEditForm, male: e.target.value })
                        }
                        type="number"
                        min="0"
                        style={styles.tableInput}
                      />
                    </td>
                    <td style={styles.td}>
                      <input
                        value={sexEditForm.female}
                        onChange={(e) =>
                          setSexEditForm({ ...sexEditForm, female: e.target.value })
                        }
                        type="number"
                        min="0"
                        style={styles.tableInput}
                      />
                    </td>

                    <td style={styles.totalCell}>
                      {Number(sexEditForm.male) + Number(sexEditForm.female)}
                    </td>

                    <td style={styles.td}>
                      <button style={styles.actionButton} onClick={() => saveSexEdit(row.id)}>
                        <Save size={16} color="#3B82F6" />
                      </button>
                      <button style={styles.actionButton} onClick={cancelSexEdit}>
                        <X size={16} color="#EF4444" />
                      </button>
                    </td>
                  </>
                ) : (
                  <>
                    <td style={styles.td}>{row.year}</td>
                    <td style={styles.td}>{row.male}</td>
                    <td style={styles.td}>{row.female}</td>
                    <td style={styles.totalCell}>{total}</td>

                    <td style={styles.td}>
                      <button style={styles.actionButton} onClick={() => startSexEdit(row)}>
                        <Edit2 size={16} color="#3B82F6" />
                      </button>
                      <button style={styles.actionButton} onClick={() => handleSexDelete(row.id)}>
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
        Showing {rows.length} of {sexTrendData.length} records
      </p>
    </div>
  );
}
