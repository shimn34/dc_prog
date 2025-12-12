// src/services/assignmentService.js
import {
  collection,
  addDoc,
  getDocs,
  getDoc,
  doc,
  updateDoc,
  deleteDoc,
  serverTimestamp
} from "firebase/firestore";
import { db } from "./firebase";

/**
 * assignments サブコレクションの参照
 * /users/{uid}/courses/{courseId}/assignments/{assignmentId}
 */
function assignmentsCollection(uid, courseId) {
  return collection(db, "users", uid, "courses", courseId, "assignments");
}

export async function addAssignment(uid, courseId, data) {
  const ref = await addDoc(assignmentsCollection(uid, courseId), {
    ...data,
    createdAt: serverTimestamp()
  });
  return ref.id;
}

export async function getAssignments(uid, courseId) {
  const col = assignmentsCollection(uid, courseId);
  const snap = await getDocs(col);
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}

export async function getAssignment(uid, courseId, assignmentId) {
  const ref = doc(db, "users", uid, "courses", courseId, "assignments", assignmentId);
  const snap = await getDoc(ref);
  return snap.exists() ? { id: snap.id, ...snap.data() } : null;
}

export async function updateAssignment(uid, courseId, assignmentId, data) {
  const ref = doc(db, "users", uid, "courses", courseId, "assignments", assignmentId);
  await updateDoc(ref, { ...data, updatedAt: serverTimestamp() });
}

export async function deleteAssignment(uid, courseId, assignmentId) {
  const ref = doc(db, "users", uid, "courses", courseId, "assignments", assignmentId);
  await deleteDoc(ref);
}
