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

const collectionName = "educationData";
const educationCollection = collection(db, collectionName);

/* ===========================
   CREATE (custom ID = year)
=========================== */
export async function addEducationRecord(record) {
  if (!record.year) throw new Error("Missing year in record");

  const yearId = record.year.toString();
  const docRef = doc(db, collectionName, yearId);

  // ✅ Using setDoc lets you name documents by year
  await setDoc(docRef, record);
  return { id: yearId, ...record };
}

/* ===========================
   READ ALL
=========================== */
export async function getEducationRecords() {
  const snapshot = await getDocs(educationCollection);
  return snapshot.docs.map((docSnap) => ({
    id: docSnap.id,
    ...docSnap.data(),
  }));
}

/* ===========================
   UPDATE
=========================== */
export async function updateEducationRecord(id, record) {
  const ref = doc(db, collectionName, id.toString());
  return await updateDoc(ref, record);
}

/* ===========================
   DELETE SINGLE
=========================== */
export async function deleteEducationRecord(id) {
  const ref = doc(db, collectionName, id.toString());
  return await deleteDoc(ref);
}

/* ===========================
   DELETE ALL
=========================== */
export async function deleteAllEducationRecords() {
  const snapshot = await getDocs(educationCollection);
  const batch = writeBatch(db);
  snapshot.forEach((docSnap) => batch.delete(docSnap.ref));
  await batch.commit();
}
