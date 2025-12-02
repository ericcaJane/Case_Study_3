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

const collectionName = "emigrants";
const emigrantsCollection = collection(db, collectionName);

/* ===========================
   CREATE (custom ID = year)
=========================== */
export const addEmigrant = async (data) => {
  if (!data.year) throw new Error("Missing year in record");

  const yearId = data.year.toString(); // e.g., "1989"
  const docRef = doc(db, collectionName, yearId);

  // ✅ setDoc allows you to define your own ID (here, the year)
  await setDoc(docRef, data);
  return { id: yearId, ...data };
};

/* ===========================
   READ ALL
=========================== */
export const getEmigrants = async () => {
  const snapshot = await getDocs(emigrantsCollection);
  return snapshot.docs.map((docSnap) => ({
    id: docSnap.id,
    ...docSnap.data(),
  }));
};

/* ===========================
   UPDATE
=========================== */
export const updateEmigrant = async (id, data) => {
  const docRef = doc(db, collectionName, id.toString());
  await updateDoc(docRef, data);
};

/* ===========================
   DELETE SINGLE
=========================== */
export const deleteEmigrant = async (id) => {
  const docRef = doc(db, collectionName, id.toString());
  await deleteDoc(docRef);
};

/* ===========================
   DELETE ALL
=========================== */
export const deleteAllEmigrants = async () => {
  const snapshot = await getDocs(emigrantsCollection);
  const batch = writeBatch(db);
  snapshot.forEach((docSnap) => batch.delete(docSnap.ref));
  await batch.commit();
};
