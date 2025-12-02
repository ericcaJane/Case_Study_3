// ================================
// 📌 Age Dataset Handlers
// ================================

import {
  addEmigrantByAge,
  getEmigrantsByAge,
  updateEmigrantByAge,
  deleteEmigrantByAge,
  deleteAllEmigrantsByAge,
} from "../services/emigrantsByAgeService";
import Papa from "papaparse";

// ---------- Helpers ----------
export const ageOrder = [
  "14 - Below",
  "15 - 19",
  "20 - 24",
  "25 - 29",
  "30 - 34",
  "35 - 39",
  "40 - 44",
  "45 - 49",
  "50 - 54",
  "55 - 59",
  "60 - 64",
  "65 - 69",
  "70 - Above",
];

export const normalizeAgeGroup = (ageGroup) => {
  if (!ageGroup) return "";
  return ageGroup
    .replace(/[–—]/g, "-")
    .replace(/\s*-\s*/g, " - ")
    .trim();
};

// ---------- FETCH ----------
export const fetchAgeData = async (setAgeData) => {
  try {
    const data = await getEmigrantsByAge();
    const sorted = (data || []).sort((a, b) => a.year - b.year);
    setAgeData(sorted);
  } catch (err) {
    console.error("Error fetching age data:", err);
  }
};

// ---------- ADD ----------
export const handleAgeAdd = async (ageForm, setAgeForm, setAgeData) => {
  try {
    const record = await addEmigrantByAge({
      year: Number(ageForm.year),
      ageGroup: normalizeAgeGroup(ageForm.ageGroup),
      count: Number(ageForm.count) || 0,
    });

    setAgeData((prev) => [...prev, record]);
    setAgeForm({ year: "", ageGroup: "", count: "" });
    alert("✅ Age record added!");
  } catch (err) {
    console.error(err);
    alert("❌ Add failed.");
  }
};

// ---------- DELETE ----------
export const handleAgeDelete = async (id, fetchAgeData) => {
  if (!window.confirm("Delete this age record?")) return;

  try {
    await deleteEmigrantByAge(id);
    await fetchAgeData();
    alert("🗑️ Age record deleted!");
  } catch (err) {
    console.error(err);
    alert("❌ Delete failed.");
  }
};

// ---------- DELETE ALL ----------
export const handleDeleteAllAge = async (fetchAgeData) => {
  if (!window.confirm("⚠️ Delete ALL age records?")) return;

  try {
    await deleteAllEmigrantsByAge();
    await fetchAgeData();
    alert("🗑️ All age records deleted!");
  } catch (err) {
    console.error(err);
    alert("❌ Failed to delete all.");
  }
};

// ---------- EDIT ----------
export const startAgeEdit = (record, setAgeEditingId, setAgeEditForm) => {
  setAgeEditingId(record.id);
  setAgeEditForm(record);
};

export const cancelAgeEdit = (setAgeEditingId, setAgeEditForm) => {
  setAgeEditingId(null);
  setAgeEditForm({ year: "", ageGroup: "", count: "" });
};

export const saveAgeEdit = async (id, ageEditForm, fetchAgeData) => {
  try {
    await updateEmigrantByAge(id, {
      year: Number(ageEditForm.year),
      ageGroup: normalizeAgeGroup(ageEditForm.ageGroup),
      count: Number(ageEditForm.count) || 0,
    });

    await fetchAgeData();
    alert("✔ Updated!");
  } catch (err) {
    console.error(err);
    alert("❌ Update failed.");
  }
};

// ---------- CSV UPLOAD ----------
export const handleAgeCsvUpload = async (file, setAgeData) => {
  Papa.parse(file, {
    skipEmptyLines: true,
    complete: async (results) => {
      const rows = results.data;

      const headers = rows[2].map((h) => (h || "").trim());
      const yearCols = headers.filter((h) => /^\d{4}$/.test(h));

      const cleaned = [];

      for (let i = 3; i < rows.length; i++) {
        const row = rows[i];
        if (!row || !row[0]) continue;

        const ageGroup = normalizeAgeGroup(row[0]);
        if (!ageOrder.includes(ageGroup)) continue;

        yearCols.forEach((year) => {
          const colIndex = headers.indexOf(year);
          if (colIndex === -1 || !row[colIndex]) return;

          cleaned.push({
            year: Number(year),
            ageGroup,
            count: parseInt(row[colIndex].replace(/,/g, "")) || 0,
          });
        });
      }

      try {
        for (const rec of cleaned) {
          await addEmigrantByAge(rec);
        }

        setAgeData((prev) => [...prev, ...cleaned]);
        alert(`Uploaded ${cleaned.length} age records!`);
      } catch (err) {
        console.error(err);
        alert("❌ CSV upload failed.");
      }
    },
  });
};
