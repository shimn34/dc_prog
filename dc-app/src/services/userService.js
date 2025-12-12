// src/services/userService.js
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { db } from "./firebase";

/**
 * ユーザードキュメント（users/{uid}）がなければ作る
 */
export async function createUserDocIfNeeded(user) {
  if (!user) return;

  const ref = doc(db, "users", user.uid);
  const snap = await getDoc(ref);

  if (!snap.exists()) {
    await setDoc(ref, {
      uid: user.uid,
      email: user.email ?? null,
      displayName: user.displayName ?? null,
      createdAt: serverTimestamp(),
      lastLogin: serverTimestamp(),
    });
  } else {
    // すでにある場合は lastLogin だけ更新しておいても良い
    await setDoc(
      ref,
      {
        lastLogin: serverTimestamp(),
      },
      { merge: true }
    );
  }
}
