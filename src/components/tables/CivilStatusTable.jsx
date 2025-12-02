// components/tables/CivilStatusTable.jsx
import React from "react";
import { Edit2, Trash2, Save, X, Users } from "lucide-react";
import styles from "../../styles/appStyles";

export default function CivilStatusTable({
  emigrants,
  editingId,
  editForm,
  recordsLimit,
  handleEditChange,
  startEdit,
  cancelEdit,
  saveEdit,
  handleDelete
}) {
  if (!emigrants || emigrants.length === 0) {
    return (
      <div style={styles.emptyState}>
        <div style={styles.emptyStateIcon}>
          <Users size={48} />
        </div>
        <h3 style={styles.emptyStateTitle}>No records found</h3>
        <p style={styles.emptyStateText}>
          Add your first record above or upload CSV to get started.
        </p>
      </div>
    );
  }

  const rows =
    recordsLimit === "all"
      ? emigrants
      : emigrants.slice(0, Number(recordsLimit));

  return (
    <div style={styles.tableContainer}>
      <table style={styles.table}>
        <thead>
          <tr>
            <th style={styles.th}>Year</th>
            <th style={styles.th}>Single</th>
            <th style={styles.th}>Married</th>
            <th style={styles.th}>Widower</th>
            <th style={styles.th}>Separated</th>
            <th style={styles.th}>Divorced</th>
            <th style={styles.th}>Not Reported</th>
            <th style={styles.th}>Total</th>
            <th style={styles.th}>Actions</th>
          </tr>
        </thead>

        <tbody>
          {rows.map((row) => {
            const total =
              (row.single || 0) +
              (row.married || 0) +
              (row.widower || 0) +
              (row.separated || 0) +
              (row.divorced || 0) +
              (row.notReported || 0);

            const isEdit = editingId === row.id;

            return (
              <tr key={row.id} style={styles.tableRow}>
                {isEdit ? (
                  <>
                    {["year", "single", "married", "widower", "separated", "divorced", "notReported"]
                      .map((field) => (
                        <td style={styles.td} key={field}>
                          <input
                            name={field}
                            value={editForm[field]}
                            onChange={handleEditChange}
                            type="number"
                            min="0"
                            style={styles.tableInput}
                          />
                        </td>
                      ))}

                    <td style={styles.totalCell}>
                      {(Number(editForm.single) || 0) +
                        (Number(editForm.married) || 0) +
                        (Number(editForm.widower) || 0) +
                        (Number(editForm.separated) || 0) +
                        (Number(editForm.divorced) || 0) +
                        (Number(editForm.notReported) || 0)}
                    </td>

                    <td style={styles.td}>
                      <button style={styles.actionButton} onClick={() => saveEdit(row.id)}>
                        <Save size={16} color="#3B82F6" />
                      </button>
                      <button style={styles.actionButton} onClick={cancelEdit}>
                        <X size={16} color="#EF4444" />
                      </button>
                    </td>
                  </>
                ) : (
                  <>
                    <td style={styles.td}>{row.year}</td>
                    <td style={styles.td}>{row.single}</td>
                    <td style={styles.td}>{row.married}</td>
                    <td style={styles.td}>{row.widower}</td>
                    <td style={styles.td}>{row.separated}</td>
                    <td style={styles.td}>{row.divorced}</td>
                    <td style={styles.td}>{row.notReported}</td>
                    <td style={styles.totalCell}>{total}</td>
                    <td style={styles.td}>
                      <button style={styles.actionButton} onClick={() => startEdit(row)}>
                        <Edit2 size={16} color="#3B82F6" />
                      </button>
                      <button style={styles.actionButton} onClick={() => handleDelete(row.id)}>
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
        Showing {rows.length} of {emigrants.length} records
      </p>
    </div>
  );
}
