// src/pages/AddTerm/AddTerm.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { createTerm, getTerms } from "../../services/courseService";

export default function AddTerm() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [year, setYear] = useState(new Date().getFullYear());
  const [semester, setSemester] = useState("前期");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [existing, setExisting] = useState([]);

  // すでにある term を取得しておき、重複チェックに使う
  useEffect(() => {
    if (!user?.uid) return;
    (async () => {
      const list = await getTerms(user.uid);
      setExisting(list);
    })();
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!user?.uid) {
      setError("ログインされていません");
      return;
    }

    // 🔥 ここで重複チェック
    const exists = existing.some(
      (t) => t.year === year && t.semester === semester
    );

    if (exists) {
      setError(`すでに ${year}年 ${semester} が存在しています`);
      return;
    }

    try {
      setSaving(true);
      await createTerm(user.uid, { year, semester });
      navigate("/home");
    } catch (err) {
      console.error(err);
      setError("保存に失敗しました");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: "20px auto" }}>
      <h2>新しい学期を作成</h2>

      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        <label>
          年度
          <input
            type="number"
            value={year}
            onChange={(e) => setYear(Number(e.target.value))}
            min="2000"
            max="2100"
            required
          />
        </label>

        <label>
          学期
          <select value={semester} onChange={(e) => setSemester(e.target.value)}>
            <option value="前期">前期</option>
            <option value="後期">後期</option>
          </select>
        </label>

        {error && <div style={{ color: "red" }}>{error}</div>}

        <div style={{ display: "flex", justifyContent: "flex-end", gap: 8 }}>
          <button type="button" onClick={() => navigate("/home")}>キャンセル</button>
          <button type="submit" disabled={saving}>
            {saving ? "保存中..." : "保存"}
          </button>
        </div>
      </form>
    </div>
  );
}
