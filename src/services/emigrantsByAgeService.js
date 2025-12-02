import { db } from "../firebase";
import {
  collection,
  doc,
  setDoc,      // ✅ replaces addDoc
  getDocs,
  updateDoc,
  deleteDoc,
  writeBatch,
} from "firebase/firestore";

const collectionName = "emigrantsByAge";
const emigrantsByAgeCollection = collection(db, collectionName);

/* ===========================
   CREATE (Single Record)
   ID Format: "year_ageGroup" → e.g. "1989_25-29"
=========================== */
export const addEmigrantByAge = async (data) => {
  if (!data.year || !data.ageGroup) throw new Error("Missing year or ageGroup in record");

  const safeAgeGroup = data.ageGroup.replace(/\s+/g, "-"); // e.g. "25 - 29" → "25-29"
  const id = `${data.year}_${safeAgeGroup}`;
  const docRef = doc(db, collectionName, id);

  await setDoc(docRef, data);
  return { id, ...data };
};

/* ===========================
   CREATE MANY (Batch Upload)
=========================== */
export const addManyEmigrantsByAge = async (rows) => {
  const chunks = [];
  for (let i = 0; i < rows.length; i += 500) {
    chunks.push(rows.slice(i, i + 500));
  }

  for (const chunk of chunks) {
    const batch = writeBatch(db);
    chunk.forEach((row) => {
      if (!row.year || !row.ageGroup) return;
      const safeAgeGroup = row.ageGroup.replace(/\s+/g, "-");
      const id = `${row.year}_${safeAgeGroup}`;
      const newDocRef = doc(db, collectionName, id);
      batch.set(newDocRef, row);
    });
    await batch.commit();
  }
};

/* ===========================
   READ ALL
=========================== */
export const getEmigrantsByAge = async () => {
  const snapshot = await getDocs(emigrantsByAgeCollection);
  return snapshot.docs.map((docSnap) => ({
    id: docSnap.id,
    ...docSnap.data(),
  }));
};

/* ===========================
   UPDATE
=========================== */
export const updateEmigrantByAge = async (id, data) => {
  const docRef = doc(db, collectionName, id.toString());
  await updateDoc(docRef, data);
};

/* ===========================
   DELETE SINGLE
=========================== */
export const deleteEmigrantByAge = async (id) => {
  const docRef = doc(db, collectionName, id.toString());
  await deleteDoc(docRef);
};

/* ===========================
   DELETE ALL
=========================== */
export const deleteAllEmigrantsByAge = async () => {
  const snapshot = await getDocs(emigrantsByAgeCollection);
  const batch = writeBatch(db);
  snapshot.forEach((docSnap) => batch.delete(docSnap.ref));
  await batch.commit();
};
