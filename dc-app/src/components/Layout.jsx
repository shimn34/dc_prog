// src/components/Layout.jsx
import { Outlet, useLocation, Link } from "react-router-dom";
import "./Layout.css";

export default function Layout() {
  const location = useLocation();
  const isHome = location.pathname.startsWith("/home");

  return (
    <div className="app-container">
      <header className="app-header">
        <h1 className="app-title">CampusLife</h1>
      </header>

      <main className={isHome ? "app-main home-fullscreen" : "app-main"}>
        <Outlet />
      </main>

      <nav className="app-nav">
        <Link to="/home" className="nav-item">Home</Link>
        {/* 追加ボタンは削除 */}
        <Link to="/profile" className="nav-item">プロフィール</Link>
      </nav>
    </div>
  );
}
