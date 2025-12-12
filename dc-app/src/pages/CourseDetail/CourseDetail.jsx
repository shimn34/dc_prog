// src/pages/CourseDetail/CourseDetail.jsx
import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { getCourse, updateCourse, deleteCourse } from "../../services/courseService";

function calcProgress(tasks = []) {
  if (!tasks || tasks.length === 0) return 0;
  let totalWeight = 0;
  let earned = 0;
  for (const t of tasks) {
    if (!t.weight || !t.maxScore) continue;
    totalWeight += Number(t.weight);
    if (t.score != null && t.maxScore) {
      earned += (Number(t.score) / Number(t.maxScore)) * Number(t.weight);
    }
  }
  if (totalWeight === 0) return 0;
  return Math.round((earned / totalWeight) * 100);
}

export default function CourseDetail() {
  const { user } = useAuth();
  const { courseId } = useParams();
  const navigate = useNavigate();

  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editingScores, setEditingScores] = useState({}); // {taskId: score}
  const [showMenu, setShowMenu] = useState(false);

  useEffect(() => {
    if (!user?.uid) return;
    let mounted = true;
    getCourse(user.uid, courseId)
      .then((c) => {
        if (mounted) {
          setCourse(c);
          // initialize editingScores with current scores
          const map = {};
          (c?.tasks || []).forEach((t) => {
            map[t.id] = t.score ?? "";
          });
          setEditingScores(map);
        }
      })
      .catch((e) => console.error(e))
      .finally(() => mounted && setLoading(false));
    return () => (mounted = false);
  }, [user?.uid, courseId]);

  const progress = useMemo(() => calcProgress(course?.tasks || []), [course]);

  const handleScoreChange = (taskId, value) => {
    setEditingScores((s) => ({ ...s, [taskId]: value }));
  };

  const saveScores = async () => {
    if (!user?.uid || !course) return;
    const updatedTasks = (course.tasks || []).map((t) => ({
      ...t,
      score: editingScores[t.id] === "" ? null : Number(editingScores[t.id]),
    }));
    try {
      await updateCourse(user.uid, courseId, { tasks: updatedTasks });
      // refresh
      setCourse((c) => ({ ...c, tasks: updatedTasks }));
    } catch (e) {
      console.error(e);
      alert("保存に失敗しました");
    }
  };

  const handleDelete = async () => {
    const ok = window.confirm("本当にこの授業を削除しますか？ この操作は取り消せません。");
    if (!ok) return;
    try {
      await deleteCourse(user.uid, courseId);
      navigate("/home");
    } catch (e) {
      console.error(e);
      alert("削除に失敗しました");
    }
  };

  if (loading) return <div style={{ padding: 16 }}>読み込み中…</div>;
  if (!course) return <div style={{ padding: 16 }}>授業が見つかりません。</div>;

  return (
    <div style={{ maxWidth: 760, margin: "12px auto", padding: 12 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div>
          <h2 style={{ margin: 0 }}>{course.courseName}</h2>
          <div style={{ color: "#555" }}>{course.teacher} ・ {course.room}</div>
        </div>

        <div style={{ position: "relative" }}>
          <button onClick={() => setShowMenu((s) => !s)}>︙</button>
          {showMenu && (
            <div style={{
              position: "absolute",
              right: 0,
              top: "100%",
              background: "#fff",
              border: "1px solid #ddd",
              boxShadow: "0 6px 16px rgba(0,0,0,0.12)",
              zIndex: 20,
            }}>
              <button style={{ display: "block", padding: 8, width: 140, textAlign: "left" }} onClick={() => { setShowMenu(false); navigate(`/edit-course/${course.courseId}`); }}>編集</button>
              <button style={{ display: "block", padding: 8, width: 140, textAlign: "left", color: "red" }} onClick={() => { setShowMenu(false); handleDelete(); }}>削除</button>
            </div>
          )}
        </div>
      </div>

      <div style={{ marginTop: 12 }}>
        <h3>成績（暫定）: {progress}%</h3>
      </div>

      <div style={{ marginTop: 8 }}>
        <h4>評価基準</h4>
        <div style={{ display: "grid", gap: 12 }}>
          {(course.tasks || []).map((t) => (
            <div key={t.id} style={{ border: "1px solid #eee", padding: 8 }}>
              <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
                <div>
                  <div style={{ fontWeight: 600 }}>{t.name}</div>
                  <div style={{ color: "#666", fontSize: 13 }}>満点: {t.maxScore}　重み: {t.weight}</div>
                </div>

                <div style={{ minWidth: 140 }}>
                  <label style={{ fontSize: 12, color: "#666" }}>得点</label>
                  <input
                    type="number"
                    value={editingScores[t.id] ?? ""}
                    onChange={(e) => handleScoreChange(t.id, e.target.value)}
                    style={{ width: "100%", boxSizing: "border-box", marginTop: 6 }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        <div style={{ marginTop: 12, display: "flex", gap: 8, justifyContent: "flex-end" }}>
          <button onClick={saveScores}>点数を保存</button>
        </div>
      </div>
    </div>
  );
}
