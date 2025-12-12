// src/pages/AddCourse/AddCourse.jsx
import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { addCourse } from "../../services/courseService";
import { v4 as uuidv4 } from "uuid";

export default function AddCourse() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const day = Number(searchParams.get("day"));
  const period = Number(searchParams.get("period"));

  const dayNames = ["月", "火", "水", "木", "金", "土"];
  const dayLabel = dayNames[day - 1];

  const [courseName, setCourseName] = useState("");
  const [teacher, setTeacher] = useState("");
  const [room, setRoom] = useState("");
  const [tasks, setTasks] = useState([
    { id: uuidv4(), name: "", maxScore: "", weight: "" },
  ]);

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  // ensure there's always one empty task row at end
  useEffect(() => {
    const last = tasks[tasks.length - 1];
    if (!last || last.name || last.maxScore || last.weight) {
      setTasks((t) => [...t, { id: uuidv4(), name: "", maxScore: "", weight: "" }]);
    }
  }, [tasks]);

  const updateTask = (id, field, value) =>
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, [field]: value } : t)));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!user?.uid) {
      setError("ログインされていません");
      return;
    }
    if (!courseName.trim()) {
      setError("授業名は必須です");
      return;
    }

    // build tasks to save: filter out rows with no name
    const tasksToSave = tasks
      .filter((t) => t.name && t.name.trim())
      .map((t) => ({
        id: t.id,
        name: t.name.trim(),
        maxScore: Number(t.maxScore) || 100,
        weight: Number(t.weight) || 0,
        score: null,
      }));

    try {
      setSaving(true);
      await addCourse(user.uid, {
        courseName: courseName.trim(),
        teacher: teacher.trim() || null,
        room: room.trim() || null,
        day: day,
        period: period,
        tasks: tasksToSave,
      });
      // 保存後は Home に戻す
      navigate("/home");
    } catch (err) {
      console.error(err);
      setError("保存に失敗しました");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div style={{ maxWidth: 720, margin: "12px auto", padding: 12 }}>
      <h2>授業を追加</h2>
      <p>登録先： <b>{dayLabel}曜日 {period}限</b></p>

      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <label>
          授業名（必須）
          <input value={courseName} onChange={(e) => setCourseName(e.target.value)} required />
        </label>

        <label>
          教員名
          <input value={teacher} onChange={(e) => setTeacher(e.target.value)} />
        </label>

        <label>
          教室
          <input value={room} onChange={(e) => setRoom(e.target.value)} />
        </label>

        <div>
          <h3>成績評価基準</h3>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 120px 100px", gap: 8 }}>
            <div><strong>項目名</strong></div>
            <div><strong>満点</strong></div>
            <div><strong>重み(%)</strong></div>
          </div>

          {tasks.map((t, idx) =>
            t ? (
              <div key={t.id} style={{ display: "grid", gridTemplateColumns: "1fr 120px 100px", gap: 8, marginTop: 6 }}>
                <input
                  placeholder="例：中間テスト"
                  value={t.name}
                  onChange={(e) => updateTask(t.id, "name", e.target.value)}
                />
                <input
                  type="number"
                  min="0"
                  placeholder="100"
                  value={t.maxScore}
                  onChange={(e) => updateTask(t.id, "maxScore", e.target.value)}
                />
                <input
                  type="number"
                  min="0"
                  max="100"
                  placeholder="40"
                  value={t.weight}
                  onChange={(e) => updateTask(t.id, "weight", e.target.value)}
                />
              </div>
            ) : null
          )}
          <div style={{ fontSize: 12, color: "#666", marginTop: 6 }}>
            ※ 下の空欄に入力すると次の行が増えます。重みの合計は任意（合計で正規化して計算します）。
          </div>
        </div>

        {error && <div style={{ color: "red" }}>{error}</div>}

        <div style={{ display: "flex", gap: 8, justifyContent: "flex-end", marginTop: 8 }}>
          <button type="button" onClick={() => navigate("/home")} disabled={saving}>キャンセル</button>
          <button type="submit" disabled={saving}>{saving ? "保存中..." : "保存"}</button>
        </div>
      </form>
    </div>
  );
}
