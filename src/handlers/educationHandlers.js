// ================================
// 📌 Education Dataset Handlers
// ================================

import {
  addEducationRecord,
  getEducationRecords,
  updateEducationRecord,
  deleteEducationRecord,
  deleteAllEducationRecords,
} from "../services/educationService";

import { parseEducationCsv } from "../components/educationCsvService";


// ================================
// 🔹 FETCH ALL EDUCATION DATA
// ================================
export const fetchEducation = async (setEducationData) => {
  try {
    const data = await getEducationRecords();
    const sorted = (data || []).sort((a, b) => a.year - b.year);
    setEducationData(sorted);
  } catch (err) {
    console.error("Error fetching education data:", err);
  }
};


// ================================
// 🔹 ADD NEW EDUCATION RECORD
// ================================
export const handleEducationAdd = async (
  educationForm,
  setEducationForm,
  fetchEducation
) => {
  try {
    await addEducationRecord({
      year: Number(educationForm.year),
      elementary: Number(educationForm.elementary) || 0,
      highschool: Number(educationForm.highschool) || 0,
      college: Number(educationForm.college) || 0,
      postgrad: Number(educationForm.postgrad) || 0,
      notReported: Number(educationForm.notReported) || 0,
    });

    // Reset form
    setEducationForm({
      year: "",
      elementary: "",
      highschool: "",
      college: "",
      postgrad: "",
      notReported: "",
    });

    await fetchEducation();
    alert("✅ Education record added!");
  } catch (err) {
    console.error("Add Error:", err);
    alert("❌ Failed to add record.");
  }
};


// ================================
// 🔹 DELETE ONE RECORD
// ================================
export const handleEducationDelete = async (id, fetchEducation) => {
  if (!window.confirm("Delete this record?")) return;

  try {
    await deleteEducationRecord(id);
    await fetchEducation();
    alert("🗑️ Education record deleted!");
  } catch (err) {
    console.error("Delete Error:", err);
    alert("❌ Failed to delete record.");
  }
};


// ================================
// 🔹 DELETE ALL RECORDS
// ================================
export const handleDeleteAllEducation = async (fetchEducation) => {
  if (!window.confirm("⚠️ Delete ALL education records?")) return;

  try {
    await deleteAllEducationRecords();
    await fetchEducation();
    alert("🗑️ All education records deleted!");
  } catch (err) {
    console.error("Delete All Error:", err);
    alert("❌ Failed to delete all records.");
  }
};


// ================================
// 🔹 BEGIN EDIT MODE
// ================================
export const startEducationEdit = (
  record,
  setEducationEditingId,
  setEducationEditForm
) => {
  setEducationEditingId(record.id);
  setEducationEditForm(record);
};


// ================================
// 🔹 CANCEL EDIT
// ================================
export const cancelEducationEdit = (
  setEducationEditingId,
  setEducationEditForm
) => {
  setEducationEditingId(null);
  setEducationEditForm({
    year: "",
    elementary: "",
    highschool: "",
    college: "",
    postgrad: "",
    notReported: "",
  });
};


// ================================
// 🔹 SAVE EDITED RECORD
// ================================
export const saveEducationEdit = async (
  id,
  educationEditForm,
  fetchEducation
) => {
  try {
    await updateEducationRecord(id, {
      year: Number(educationEditForm.year),
      elementary: Number(educationEditForm.elementary) || 0,
      highschool: Number(educationEditForm.highschool) || 0,
      college: Number(educationEditForm.college) || 0,
      postgrad: Number(educationEditForm.postgrad) || 0,
      notReported: Number(educationEditForm.notReported) || 0,
    });

    await fetchEducation();
    alert("✅ Education record updated!");
  } catch (err) {
    console.error("Update Error:", err);
    alert("❌ Failed to update record.");
  }
};


// ================================
// 🔹 CSV UPLOAD HANDLER
// ================================
export const handleEducationCsvUpload = async (file, fetchEducation) => {
  try {
    const rows = await parseEducationCsv(file);

    await fetchEducation();
    alert(`📁 Uploaded ${rows.length} education records!`);
  } catch (err) {
    console.error("CSV Upload Error:", err);
    alert("❌ Failed to upload CSV.");
  }
};
