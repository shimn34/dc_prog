// src/components/Layout.jsx
import { Link } from "react-router-dom";
import "./Layout.css";

export default function Layout({ children }) {
  return (
    <div className="app-container">

      {/* 上部ヘッダー */}
      <header className="app-header">
        <h1 className="app-title">CampusLife</h1>
      </header>

      {/* メイン表示エリア */}
      <main className="app-main">
        {children}
      </main>

      {/* 下部ナビバー */}
      <nav className="app-nav">
        <Link to="/home" className="nav-item">Home</Link>
        <Link to="/add" className="nav-item">追加</Link>
        <Link to="/profile" className="nav-item">プロフィール</Link>
      </nav>

    </div>
  );
}
