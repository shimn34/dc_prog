// src/App.jsx
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./hooks/useAuth";
import Login from "./pages/Login/Login";
import Home from "./pages/Home/Home";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* デフォルトは /login に飛ばす */}
          <Route path="/" element={<Navigate to="/login" replace />} />

          <Route path="/login" element={<Login />} />

          {/* /home はログインしてないと見れない */}
          <Route
            path="/home"
            element={
              <ProtectedRouteWrapper>
                <Home />
              </ProtectedRouteWrapper>
            }
          />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

/**
 * ProtectedRoute を別コンポーネントとして包んで使う
 * （同ファイル内に定義してもOK）
 */
import ProtectedRoute from "./routes/ProtectedRoute";

function ProtectedRouteWrapper({ children }) {
  return <ProtectedRoute>{children}</ProtectedRoute>;
}

export default App;
