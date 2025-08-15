import {
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  serverTimestamp,
  query,
  orderBy,
} from 'firebase/firestore';
import { db } from '../library/firebase';

const resumesCol = (uid) => collection(db, 'users', uid, 'resumes');
const resumeDoc = (uid, id) => doc(db, 'users', uid, 'resumes', id);

// Create
export const fbCreateResume = async (uid, data) => {
  const payload = {
    ...data,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  };
  const ref = await addDoc(resumesCol(uid), payload);
  return { id: ref.id, ...data }; // timestamps are server-set
};

// Read single
export const fbGetResume = async (uid, id) => {
  const snap = await getDoc(resumeDoc(uid, id));
  if (!snap.exists()) throw new Error('Resume not found');
  return { id: snap.id, ...snap.data() };
};

// Read all
export const fbGetResumes = async (uid) => {
  const q = query(resumesCol(uid), orderBy('updatedAt', 'desc'));
  const snaps = await getDocs(q);
  return snaps.docs.map((d) => ({ id: d.id, ...d.data() }));
};

// Update
export const fbUpdateResume = async (uid, id, data) => {
  await updateDoc(resumeDoc(uid, id), {
    ...data,
    updatedAt: serverTimestamp(),
  });
  return { id, ...data };
};

// Delete
export const fbDeleteResume = async (uid, id) => {
  await deleteDoc(resumeDoc(uid, id));
  return { success: true };
};
