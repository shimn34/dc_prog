// src/pages/AddCourse/AddCourse.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { addCourse } from "../../services/courseService";

export default function AddCourse() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [courseName, setCourseName] = useState("");
  const [teacher, setTeacher] = useState("");
  const [room, setRoom] = useState("");
  const [day, setDay] = useState(1);
  const [period, setPeriod] = useState(1);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user?.uid) {
      setError("ログインしていません。もう一度ログインしてください。");
      return;
    }

    if (!courseName.trim()) {
      setError("授業名は必須です。");
      return;
    }

    const courseData = {
      courseName: courseName.trim(),
      teacher: teacher.trim() || null,
      room: room.trim() || null,
      day: Number(day),
      period: Number(period),
    };

    try {
      setSaving(true);
      await addCourse(user.uid, courseData);
      navigate("/home");
    } catch (err) {
      console.error("AddCourse 保存エラー:", err);
      setError("保存に失敗しました。Console のエラーを確認してください。");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div style={{ maxWidth: 600, margin: "20px auto", padding: "0 12px" }}>
      <h2>授業を追加</h2>

      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <label>
          授業名（必須）
          <input
            value={courseName}
            onChange={(e) => setCourseName(e.target.value)}
            required
          />
        </label>

        <label>
          教員名
          <input
            value={teacher}
            onChange={(e) => setTeacher(e.target.value)}
          />
        </label>

        <label>
          教室
          <input
            value={room}
            onChange={(e) => setRoom(e.target.value)}
          />
        </label>

        <label>
          曜日
          <select value={day} onChange={(e) => setDay(e.target.value)}>
            <option value={1}>月</option>
            <option value={2}>火</option>
            <option value={3}>水</option>
            <option value={4}>木</option>
            <option value={5}>金</option>
            <option value={6}>土</option>
          </select>
        </label>

        <label>
          時限
          <select value={period} onChange={(e) => setPeriod(e.target.value)}>
            <option value={1}>1限</option>
            <option value={2}>2限</option>
            <option value={3}>3限</option>
            <option value={4}>4限</option>
            <option value={5}>5限</option>
            <option value={6}>6限</option>
          </select>
        </label>

        {error && <div style={{ color: "red", fontSize: 14 }}>{error}</div>}

        <div style={{ marginTop: 8, display: "flex", gap: 8, justifyContent: "flex-end" }}>
          <button type="button" onClick={() => navigate("/home")} disabled={saving}>
            キャンセル
          </button>
          <button type="submit" disabled={saving}>
            {saving ? "保存中..." : "保存"}
          </button>
        </div>
      </form>
    </div>
  );
}
