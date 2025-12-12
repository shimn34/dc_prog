// src/components/Layout.jsx
import { Outlet, useLocation, Link } from "react-router-dom";
import "./Layout.css";

export default function Layout() {
  const location = useLocation();
  const isHome = location.pathname === "/home";

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
        <Link to="/add" className="nav-item">追加</Link>
        <Link to="/profile" className="nav-item">プロフィール</Link>
      </nav>

    </div>
  );
}
