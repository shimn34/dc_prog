// src/App.jsx
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./hooks/useAuth";

import Login from "./pages/Login/Login";
import Home from "./pages/Home/Home";
import AddCourse from "./pages/AddCourse/AddCourse";
import ProtectedRoute from "./routes/ProtectedRoute";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>

          {/* デフォルトは /login に飛ばす */}
          <Route path="/" element={<Navigate to="/login" replace />} />

          {/* ログインページ */}
          <Route path="/login" element={<Login />} />

          {/* ログイン必須ページ（ProtectedRouteで保護） */}
          <Route
            path="/home"
            element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            }
          />

          <Route
            path="/add"
            element={
              <ProtectedRoute>
                <AddCourse />
              </ProtectedRoute>
            }
          />

        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
