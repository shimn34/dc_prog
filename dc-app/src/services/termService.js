// src/services/termService.js
import {
  collection,
  doc,
  setDoc,
  getDocs,
  deleteDoc,
  query,
  orderBy
} from "firebase/firestore";
import { db } from "./firebase";

/**
 * 学期を作成
 * users/{uid}/terms/{termId}
 */
export async function createTerm(uid, { year, semester }) {
  const ref = doc(collection(db, "users", uid, "terms"));
  const termData = {
    termId: ref.id,
    year,
    semester, // "前期" or "後期"
    createdAt: new Date()
  };

  await setDoc(ref, termData);
  return termData;
}

/**
 * 学期一覧を取得
 * 年度：降順
 * 学期：後期 → 前期
 */
export async function getTerms(uid) {
  const q = query(collection(db, "users", uid, "terms"));
  const snap = await getDocs(q);
  const list = snap.docs.map((d) => d.data());

  // 並び替え（year DESC → semester）
  return list.sort((a, b) => {
    if (a.year !== b.year) return b.year - a.year;
    return (a.semester === "後期" ? -1 : 1) - (b.semester === "後期" ? -1 : 1);
  });
}

/**
 * 学期を削除
 */
export async function deleteTerm(uid, termId) {
  const ref = doc(db, "users", uid, "terms", termId);
  await deleteDoc(ref);
}
