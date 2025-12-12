// src/App.jsx
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./hooks/useAuth";

import Login from "./pages/Login/Login";
import Home from "./pages/Home/Home";
import AddCourse from "./pages/AddCourse/AddCourse";
import CourseDetail from "./pages/CourseDetail/CourseDetail";
import EditCourse from "./pages/EditCourse/EditCourse";
import AddTerm from "./pages/AddTerm/AddTerm";   // ←★ 追加

import ProtectedRoute from "./routes/ProtectedRoute";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>

          {/* デフォルトは /login */}
          <Route path="/" element={<Navigate to="/login" replace />} />

          {/* ログインページ */}
          <Route path="/login" element={<Login />} />

          {/* ホーム */}
          <Route
            path="/home"
            element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            }
          />

          {/* 授業追加（曜日・時限・termId はクエリで受け取る） */}
          <Route
            path="/add"
            element={
              <ProtectedRoute>
                <AddCourse />
              </ProtectedRoute>
            }
          />

          {/* 新しい学期を追加する画面 */}
          <Route
            path="/add-term"
            element={
              <ProtectedRoute>
                <AddTerm />
              </ProtectedRoute>
            }
          />

          {/* 授業詳細（courseId を URL パラメータで受け取る） */}
          <Route
            path="/detail/:courseId"
            element={
              <ProtectedRoute>
                <CourseDetail />
              </ProtectedRoute>
            }
          />

          {/* 授業編集 */}
          <Route
            path="/edit-course/:courseId"
            element={
              <ProtectedRoute>
                <EditCourse />
              </ProtectedRoute>
            }
          />

        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
