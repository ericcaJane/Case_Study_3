import { db } from "../firebase";
import {
  collection,
  doc,
  setDoc,       // ✅ replaces addDoc
  getDocs,
  updateDoc,
  deleteDoc,
  writeBatch
} from "firebase/firestore";

const collectionName = "emigrantsBySex";
const emigrantsBySexCollection = collection(db, collectionName);

/* ===========================
   CREATE (custom ID = year)
=========================== */
export const addEmigrantBySex = async (data) => {
  if (!data.year) throw new Error("Missing year in record");

  const yearId = data.year.toString();
  const docRef = doc(db, collectionName, yearId);

  // ✅ store record with ID = year
  await setDoc(docRef, data);
  return { id: yearId, ...data };
};

/* ===========================
   READ ALL
=========================== */
export const getEmigrantsBySex = async () => {
  const snapshot = await getDocs(emigrantsBySexCollection);
  return snapshot.docs.map((docSnap) => ({
    id: docSnap.id,
    ...docSnap.data(),
  }));
};

/* ===========================
   UPDATE
=========================== */
export const updateEmigrantBySex = async (id, data) => {
  const docRef = doc(db, collectionName, id.toString());
  await updateDoc(docRef, data);
};

/* ===========================
   DELETE SINGLE
=========================== */
export const deleteEmigrantBySex = async (id) => {
  const docRef = doc(db, collectionName, id.toString());
  await deleteDoc(docRef);
};

/* ===========================
   DELETE ALL
=========================== */
export const deleteAllEmigrantsBySex = async () => {
  const snapshot = await getDocs(emigrantsBySexCollection);
  const batch = writeBatch(db);
  snapshot.forEach((docSnap) => batch.delete(docSnap.ref));
  await batch.commit();
};
