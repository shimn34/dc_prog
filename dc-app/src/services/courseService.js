import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
} from "firebase/firestore";
import { db } from "./firebase";

/* ============================
   Term（学期）関連 CRUD
   users/{uid}/terms/{termId}
============================ */

/** 学期作成（重複チェック付き） */
export async function createTerm(uid, { year, semester }) {
  const termsRef = collection(db, "users", uid, "terms");

  // 📌 まず重複チェック
  const q = query(
    termsRef,
    where("year", "==", year),
    where("semester", "==", semester)
  );

  const snap = await getDocs(q);
  if (!snap.empty) {
    // 同一の年度＋学期が存在する場合
    throw new Error("同じ年度・学期の学期がすでに存在しています");
  }

  // 📌 重複なし → 新規作成
  const ref = doc(termsRef);
  await setDoc(ref, {
    id: ref.id,
    year,
    semester,
    createdAt: new Date(),
  });
  return ref.id;
}

/** 学期一覧取得 */
export async function getTerms(uid) {
  const q = query(collection(db, "users", uid, "terms"));
  const snap = await getDocs(q);
  return snap.docs.map((d) => d.data());
}

/* ============================
   Course（授業）CRUD
   users/{uid}/terms/{termId}/courses/{courseId}
============================ */

/** 授業追加 */
export async function addCourse(uid, termId, courseData) {
  const ref = doc(collection(db, "users", uid, "terms", termId, "courses"));
  await setDoc(ref, {
    ...courseData,
    courseId: ref.id,
    createdAt: new Date(),
  });
  return ref.id;
}

/** 授業一覧（学期ごと） */
export async function getCourses(uid, termId) {
  const q = query(collection(db, "users", uid, "terms", termId, "courses"));
  const snap = await getDocs(q);
  return snap.docs.map((d) => d.data());
}

/** 授業1件取得 */
export async function getCourse(uid, termId, courseId) {
  const ref = doc(db, "users", uid, "terms", termId, "courses", courseId);
  const snap = await getDoc(ref);
  return snap.exists() ? snap.data() : null;
}

/** 授業更新 */
export async function updateCourse(uid, termId, courseId, newData) {
  const ref = doc(db, "users", uid, "terms", termId, "courses", courseId);
  await updateDoc(ref, newData);
}

/** 授業削除 */
export async function deleteCourse(uid, termId, courseId) {
  const ref = doc(db, "users", uid, "terms", termId, "courses", courseId);
  await deleteDoc(ref);
}

/* ============================
   成績計算ロジック
============================ */

export function calcProgress(course) {
  if (!course.tasks || course.tasks.length === 0) return 0;

  let totalWeight = 0;
  let earned = 0;

  for (const task of course.tasks) {
    const { weight, score, maxScore } = task;

    if (!weight || !maxScore) continue;
    totalWeight += weight;

    if (score != null) {
      earned += (score / maxScore) * weight;
    }
  }

  if (totalWeight === 0) return 0;

  return Math.round((earned / totalWeight) * 100);
}

export function calcGradeRank(progress) {
  if (progress >= 90) return "S";
  if (progress >= 80) return "A";
  if (progress >= 70) return "B";
  if (progress >= 60) return "C";
  return "-";
}
