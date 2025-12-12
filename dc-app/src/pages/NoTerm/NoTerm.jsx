// src/pages/NoTerm/NoTerm.jsx
import "./NoTerm.css";
import { useNavigate } from "react-router-dom";

export default function NoTerm() {
  const navigate = useNavigate();

  return (
    <div className="no-term-container">
      <div className="no-term-card">
        <h2>初めに、学期を選択して作成してください。</h2>

        <button
          className="no-term-btn"
          onClick={() => navigate("/add-term")}
        >
          ＋ 学期を作成
        </button>
      </div>
    </div>
  );
}
