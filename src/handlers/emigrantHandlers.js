// ================================
// 📌 Marital Status (Civil Status) Handlers
// ================================

import {
  addEmigrant,
  getEmigrants,
  updateEmigrant,
  deleteEmigrant,
  deleteAllEmigrants,
} from "../services/emigrantsService";

// ---------- VALIDATION ----------
export const validateEmigrantForm = (formData, emigrants, editingId, setErrors) => {
  const newErrors = {};

  if (!formData.year || formData.year < 1900 || formData.year > 2030) {
    newErrors.year = "Valid year is required (1900–2030)";
  }

  if (
    emigrants.some(
      (e) => e.year === Number(formData.year) && e.id !== editingId
    )
  ) {
    newErrors.year = "Year already exists";
  }

  ["single", "married", "widower", "separated", "divorced", "notReported"].forEach(
    (field) => {
      if (
        formData[field] &&
        (isNaN(formData[field]) || Number(formData[field]) < 0)
      ) {
        newErrors[field] = "Must be a valid positive number";
      }
    }
  );

  setErrors(newErrors);
  return Object.keys(newErrors).length === 0;
};

// ---------- FETCH ----------
export const fetchEmigrants = async (setEmigrants, setLoading) => {
  try {
    setLoading(true);
    const data = await getEmigrants();
    const sorted = (data || []).sort((a, b) => a.year - b.year);
    setEmigrants(sorted);
  } catch (err) {
    console.error("Error fetching emigrants:", err);
  } finally {
    setLoading(false);
  }
};

// ---------- ADD ----------
export const handleAddEmigrant = async (form, setForm, fetchEmigrants, validate) => {
  if (!validate()) return;

  try {
    await addEmigrant({
      ...form,
      year: Number(form.year),
      single: Number(form.single) || 0,
      married: Number(form.married) || 0,
      widower: Number(form.widower) || 0,
      separated: Number(form.separated) || 0,
      divorced: Number(form.divorced) || 0,
      notReported: Number(form.notReported) || 0,
    });

    setForm({
      year: "",
      single: "",
      married: "",
      widower: "",
      separated: "",
      divorced: "",
      notReported: "",
    });

    await fetchEmigrants();
    alert("✅ Record added successfully!");
  } catch (err) {
    console.error("Error adding emigrant:", err);
    alert("❌ Failed to add record.");
  }
};

// ---------- DELETE ----------
export const handleDeleteEmigrant = async (id, fetchEmigrants) => {
  if (!window.confirm("Delete this record?")) return;
  try {
    await deleteEmigrant(id);
    await fetchEmigrants();
    alert("🗑️ Record deleted successfully!");
  } catch (err) {
    console.error("Error:", err);
    alert("❌ Failed to delete record.");
  }
};

// ---------- DELETE ALL ----------
export const handleDeleteAllEmigrants = async (fetchEmigrants) => {
  if (!window.confirm("⚠️ Delete ALL marital status records?")) return;
  try {
    await deleteAllEmigrants();
    await fetchEmigrants();
    alert("🗑️ All records deleted!");
  } catch (err) {
    console.error("Error:", err);
    alert("❌ Failed to delete all records.");
  }
};

// ---------- EDIT ----------
export const startEditEmigrant = (record, setEditingId, setEditForm) => {
  setEditingId(record.id);
  setEditForm(record);
};

export const cancelEditEmigrant = (setEditingId, setEditForm, initialForm) => {
  setEditingId(null);
  setEditForm(initialForm);
};

export const saveEditEmigrant = async (id, editForm, fetchEmigrants, validate) => {
  if (!validate()) return;

  try {
    await updateEmigrant(id, {
      ...editForm,
      year: Number(editForm.year),
      single: Number(editForm.single) || 0,
      married: Number(editForm.married) || 0,
      widower: Number(editForm.widower) || 0,
      separated: Number(editForm.separated) || 0,
      divorced: Number(editForm.divorced) || 0,
      notReported: Number(editForm.notReported) || 0,
    });

    await fetchEmigrants();
    alert("✅ Record updated!");
  } catch (err) {
    console.error("Error:", err);
    alert("❌ Failed to update record.");
  }
};
