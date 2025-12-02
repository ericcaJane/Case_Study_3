import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCAAYTMvjEDMEbJcQGDNlNkVVvGgt0Xr74",
  authDomain: "filemigdb-a59ec.firebaseapp.com",
  projectId: "filemigdb-a59ec",
  storageBucket: "filemigdb-a59ec.firebasestorage.app",
  messagingSenderId: "721761292880",
  appId: "1:721761292880:web:1b27e239a93440c3df3755",
  measurementId: "G-V0ZZ21VEXV"
};



const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
