// ================================
// 📌 Sex Dataset Handlers (Male/Female)
// ================================

import {
  addEmigrantBySex,
  getEmigrantsBySex,
  updateEmigrantBySex,
  deleteEmigrantBySex,
  deleteAllEmigrantsBySex,
} from "../services/emigrantsBySexService";
import Papa from "papaparse";

// ---------- FETCH ----------
export const fetchSexData = async (setSexTrendData) => {
  try {
    const data = await getEmigrantsBySex();
    const sorted = (data || []).sort((a, b) => a.year - b.year);
    setSexTrendData(sorted);
  } catch (err) {
    console.error("Error fetching sex dataset:", err);
  }
};

// ---------- ADD ----------
export const handleSexAdd = async (sexForm, setSexForm, fetchSexData) => {
  try {
    await addEmigrantBySex({
      year: Number(sexForm.year),
      male: Number(sexForm.male) || 0,
      female: Number(sexForm.female) || 0,
    });

    setSexForm({ year: "", male: "", female: "" });
    await fetchSexData();
    alert("✅ Sex record added!");
  } catch (err) {
    console.error("Error:", err);
    alert("❌ Failed to add record.");
  }
};

// ---------- DELETE ----------
export const handleSexDelete = async (id, fetchSexData) => {
  if (!window.confirm("Delete this record?")) return;

  try {
    await deleteEmigrantBySex(id);
    await fetchSexData();
    alert("🗑️ Sex record deleted!");
  } catch (err) {
    console.error("Error:", err);
    alert("❌ Delete failed.");
  }
};

// ---------- DELETE ALL ----------
export const handleDeleteAllSex = async (fetchSexData) => {
  if (!window.confirm("⚠️ Delete ALL male/female records?")) return;

  try {
    await deleteAllEmigrantsBySex();
    await fetchSexData();
    alert("🗑️ All sex records deleted!");
  } catch (err) {
    console.error(err);
    alert("❌ Failed to delete all.");
  }
};

// ---------- EDIT ----------
export const startSexEdit = (record, setSexEditingId, setSexEditForm) => {
  setSexEditingId(record.id);
  setSexEditForm(record);
};

export const cancelSexEdit = (setSexEditingId, setSexEditForm) => {
  setSexEditingId(null);
  setSexEditForm({ year: "", male: "", female: "" });
};

export const saveSexEdit = async (id, sexEditForm, fetchSexData) => {
  try {
    await updateEmigrantBySex(id, {
      year: Number(sexEditForm.year),
      male: Number(sexEditForm.male) || 0,
      female: Number(sexEditForm.female) || 0,
    });

    await fetchSexData();
    alert("✅ Sex record updated!");
  } catch (err) {
    console.error(err);
    alert("❌ Update failed.");
  }
};

// ---------- CSV UPLOAD ----------
export const handleSexCsvUpload = async (file, fetchSexData) => {
  Papa.parse(file, {
    header: false,
    skipEmptyLines: true,
    complete: async (results) => {
      const cleaned = results.data
        .map((r) => ({
          YEAR: r[2],
          MALE: r[3],
          FEMALE: r[4],
        }))
        .filter((r) => /^\d+$/.test(r.YEAR))
        .map((r) => ({
          year: Number(r.YEAR),
          male: parseInt((r.MALE || "0").replace(/,/g, "")),
          female: parseInt((r.FEMALE || "0").replace(/,/g, "")),
        }));

      try {
        for (let row of cleaned) {
          await addEmigrantBySex(row);
        }

        await fetchSexData();
        alert("CSV uploaded into sex dataset!");
      } catch (err) {
        console.error("Error saving CSV:", err);
      }
    },
  });
};
