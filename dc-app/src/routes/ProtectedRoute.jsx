// src/routes/ProtectedRoute.jsx
import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) {
    // 認証状態を確認中
    return <div>Loading...</div>;
  }

  if (!user) {
    // 未ログインならログイン画面へ
    return <Navigate to="/login" replace />;
  }

  // ログインしていれば中身の画面を表示
  return children;
}
