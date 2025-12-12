// src/services/attendanceService.js
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { db } from "./firebase";

/**
 * attendance を courses 内の単一ドキュメントで持つ想定
 * path: /users/{uid}/courses/{courseId}/attendance
 */
function attendanceDocRef(uid, courseId) {
  return doc(db, "users", uid, "courses", courseId, "attendance", "meta");
}

export async function getAttendance(uid, courseId) {
  const ref = attendanceDocRef(uid, courseId);
  const snap = await getDoc(ref);
  return snap.exists() ? snap.data() : { present: 0, absent: 0 };
}

export async function setAttendance(uid, courseId, data) {
  const ref = attendanceDocRef(uid, courseId);
  await setDoc(ref, { ...data, updatedAt: new Date() });
}

export async function incrementPresent(uid, courseId, delta = 1) {
  const ref = attendanceDocRef(uid, courseId);
  const docSnap = await getDoc(ref);
  if (!docSnap.exists()) {
    await setDoc(ref, { present: delta, absent: 0 });
  } else {
    const cur = docSnap.data();
    await updateDoc(ref, { present: (cur.present || 0) + delta });
  }
}

export async function incrementAbsent(uid, courseId, delta = 1) {
  const ref = attendanceDocRef(uid, courseId);
  const docSnap = await getDoc(ref);
  if (!docSnap.exists()) {
    await setDoc(ref, { present: 0, absent: delta });
  } else {
    const cur = docSnap.data();
    await updateDoc(ref, { absent: (cur.absent || 0) + delta });
  }
}
