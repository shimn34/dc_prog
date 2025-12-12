// src/App.jsx
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./hooks/useAuth";

import Login from "./pages/Login/Login";
import Home from "./pages/Home/Home";
import AddCourse from "./pages/AddCourse/AddCourse";
import CourseDetail from "./pages/CourseDetail/CourseDetail";
import EditCourse from "./pages/EditCourse/EditCourse";
import AddTerm from "./pages/AddTerm/AddTerm";

import ProtectedRoute from "./routes/ProtectedRoute";
import TermGate from "./routes/TermGate";      // ←★ 学期有無チェック
import NoTerm from "./pages/NoTerm/NoTerm";   // ←★ 学期ゼロのときの画面

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>

          {/* デフォルトは /login */}
          <Route path="/" element={<Navigate to="/login" replace />} />

          {/* ログインページ */}
          <Route path="/login" element={<Login />} />

          {/* 学期ゼロのときに表示する画面 */}
          <Route
            path="/no-term"
            element={
              <ProtectedRoute>
                <NoTerm />
              </ProtectedRoute>
            }
          />

          {/* ホーム（学期が無ければ /no-term へ飛ばす） */}
          <Route
            path="/home"
            element={
              <ProtectedRoute>
                <TermGate>
                  <Home />
                </TermGate>
              </ProtectedRoute>
            }
          />

          {/* 授業追加 */}
          <Route
            path="/add"
            element={
              <ProtectedRoute>
                <TermGate>
                  <AddCourse />
                </TermGate>
              </ProtectedRoute>
            }
          />

          {/* 学期追加 */}
          <Route
            path="/add-term"
            element={
              <ProtectedRoute>
                <AddTerm />
              </ProtectedRoute>
            }
          />

          {/* 授業詳細 */}
          <Route
            path="/detail/:courseId"
            element={
              <ProtectedRoute>
                <TermGate>
                  <CourseDetail />
                </TermGate>
              </ProtectedRoute>
            }
          />

          {/* 授業編集 */}
          <Route
            path="/edit-course/:courseId"
            element={
              <ProtectedRoute>
                <TermGate>
                  <EditCourse />
                </TermGate>
              </ProtectedRoute>
            }
          />

        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
