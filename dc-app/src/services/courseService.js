// src/services/courseService.js
import {
  collection,
  addDoc,
  getDocs,
  getDoc,
  doc,
  updateDoc,
  deleteDoc,
  query,
  where,
  serverTimestamp
} from "firebase/firestore";
import { db } from "./firebase";

/**
 * /users/{uid}/courses のコレクション参照を返す
 */
function coursesCollection(uid) {
  return collection(db, "users", uid, "courses");
}

/**
 * 授業を追加
 * courseData は以下のキーを推奨:
 * { courseName, teacher, room, year, semester, day, period, weight }
 */
export async function addCourse(uid, courseData) {
  const colRef = coursesCollection(uid);
  const docRef = await addDoc(colRef, {
    ...courseData,
    createdAt: serverTimestamp()
  });
  return docRef.id;
}

/**
 * 授業一覧（year, semester はオプション）
 */
export async function getCourses(uid, { year, semester } = {}) {
  let colRef = coursesCollection(uid);
  let q = colRef;
  if (year !== undefined) q = query(q, where("year", "==", year));
  if (semester !== undefined) q = query(q, where("semester", "==", semester));

  const snap = await getDocs(q);
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}

/**
 * 単一授業取得
 */
export async function getCourse(uid, courseId) {
  const ref = doc(db, "users", uid, "courses", courseId);
  const snap = await getDoc(ref);
  return snap.exists() ? { id: snap.id, ...snap.data() } : null;
}

/**
 * 授業更新（部分更新）
 */
export async function updateCourse(uid, courseId, data) {
  const ref = doc(db, "users", uid, "courses", courseId);
  await updateDoc(ref, { ...data, updatedAt: serverTimestamp() });
}

/**
 * 授業削除
 */
export async function deleteCourse(uid, courseId) {
  const ref = doc(db, "users", uid, "courses", courseId);
  await deleteDoc(ref);
}
