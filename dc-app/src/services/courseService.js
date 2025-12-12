// src/services/courseService.js

import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
} from "firebase/firestore";
import { db } from "./firebase";

/* ============================
   授業データ（courses）の CRUD
   ============================ */

/**
 * 授業を追加
 * users/{uid}/courses/{自動ID}
 */
export async function addCourse(uid, courseData) {
  const ref = doc(collection(db, "users", uid, "courses"));
  await setDoc(ref, {
    ...courseData,
    courseId: ref.id,
    createdAt: new Date(),
  });
  return ref.id;
}

/**
 * 授業一覧を取得
 * users/{uid}/courses
 */
export async function getCourses(uid) {
  const q = query(collection(db, "users", uid, "courses"));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((d) => d.data());
}

/**
 * 授業1件を取得
 * users/{uid}/courses/{courseId}
 */
export async function getCourse(uid, courseId) {
  const ref = doc(db, "users", uid, "courses", courseId);
  const snap = await getDoc(ref);
  return snap.exists() ? snap.data() : null;
}

/**
 * 授業を更新
 */
export async function updateCourse(uid, courseId, newData) {
  const ref = doc(db, "users", uid, "courses", courseId);
  await updateDoc(ref, newData);
}

/**
 * 授業を削除
 */
export async function deleteCourse(uid, courseId) {
  const ref = doc(db, "users", uid, "courses", courseId);
  await deleteDoc(ref);
}

/* ============================
   成績計算ロジック
   ============================ */

/**
 * 進捗計算（％）
 * tasks = [{ title, weight, score, maxScore }]
 */
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

/**
 * ランク計算（S / A / B / C / -）
 */
export function calcGradeRank(progress) {
  if (progress >= 90) return "S";
  if (progress >= 80) return "A";
  if (progress >= 70) return "B";
  if (progress >= 60) return "C";
  return "-";
}
