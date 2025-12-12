// src/pages/EditCourse/EditCourse.jsx
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { getCourse, updateCourse } from "../../services/courseService";
import { v4 as uuidv4 } from "uuid";
import "./EditCourse.css";

export default function EditCourse() {
  const { user } = useAuth();
  const { courseId } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [courseName, setCourseName] = useState("");
  const [teacher, setTeacher] = useState("");
  const [room, setRoom] = useState("");
  const [day, setDay] = useState(null);
  const [period, setPeriod] = useState(null);

  const [tasks, setTasks] = useState([]);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  // Firestore から現在の授業情報を取得
  useEffect(() => {
    if (!user?.uid) return;

    let mounted = true;
    getCourse(user.uid, courseId)
      .then((c) => {
        if (!mounted || !c) return;

        setCourseName(c.courseName);
        setTeacher(c.teacher || "");
        setRoom(c.room || "");
        setDay(c.day);       // Firestore は 0 始まり
        setPeriod(c.period); // 1 始まり

        // tasks に初期値をセット
        const loaded = (c.tasks || []).map((t) => ({
          id: t.id,
          name: t.name,
          maxScore: t.maxScore,
          weight: t.weight,
        }));

        // 最後に空行を追加
        loaded.push({
          id: uuidv4(),
          name: "",
          maxScore: "",
          weight: "",
        });

        setTasks(loaded);
      })
      .catch((e) => console.error(e))
      .finally(() => mounted && setLoading(false));

    return () => (mounted = false);
  }, [user?.uid, courseId]);


  // 行の追加を自動で行う
  useEffect(() => {
    const last = tasks[tasks.length - 1];
    if (!last) return;

    if (last.name || last.maxScore || last.weight) {
      setTasks((t) => [
        ...t,
        { id: uuidv4(), name: "", maxScore: "", weight: "" },
      ]);
    }
  }, [tasks]);

  const updateTask = (id, field, value) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, [field]: value } : t))
    );
  };

  const deleteTask = (id) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user?.uid) return;

    if (!courseName.trim()) {
      setError("授業名は必須です");
      return;
    }

    // 保存対象タスク（空行除外）
    const tasksToSave = tasks
      .filter((t) => t.name.trim())
      .map((t) => ({
        id: t.id,
        name: t.name.trim(),
        maxScore: Number(t.maxScore) || 100,
        weight: Number(t.weight) || 0,
      }));

    try {
      setSaving(true);
      await updateCourse(user.uid, courseId, {
        courseName: courseName.trim(),
        teacher: teacher.trim() || null,
        room: room.trim() || null,
        day,     // Firestore 用：0 始まり
        period,  // Firestore 用：1 始まり
        tasks: tasksToSave,
      });

      navigate("/home");
    } catch (err) {
      console.error(err);
      setError("更新に失敗しました");
    } finally {
      setSaving(false);
    }
  };


  if (loading) return <div style={{ padding: 16 }}>読み込み中…</div>;

  return (
    <div className="edit-container">
      <h2>授業を編集</h2>
      <p>
        <b>
          保存先： {["月","火","水","木","金","土"][day]}曜日 {period}限
        </b>
      </p>

      <form className="edit-form" onSubmit={handleSubmit}>
        <label>
          授業名（必須）
          <input value={courseName} onChange={(e) => setCourseName(e.target.value)} />
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

          <div className="eval-header">
            <div>項目名</div>
            <div>満点</div>
            <div>重み(%)</div>
            <div></div>
          </div>

          {tasks.map((t) => (
            <div key={t.id} className="eval-row">
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
              <button
                type="button"
                className="delete-btn"
                onClick={() => deleteTask(t.id)}
              >
                🗑
              </button>
            </div>
          ))}
        </div>

        {error && <div className="error-msg">{error}</div>}

        <div className="edit-actions">
          <button
            type="button"
            onClick={() => navigate("/home")}
            disabled={saving}
          >
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
