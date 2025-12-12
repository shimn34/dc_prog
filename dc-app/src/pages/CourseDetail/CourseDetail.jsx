// src/pages/CourseDetail/CourseDetail.jsx
import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { getCourse, updateCourse, deleteCourse } from "../../services/courseService";
import "./CourseDetail.css";

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
  const [editingScores, setEditingScores] = useState({});
  const [showMenu, setShowMenu] = useState(false);

  useEffect(() => {
    if (!user?.uid) return;

    let mounted = true;
    getCourse(user.uid, courseId)
      .then((c) => {
        if (mounted) {
          setCourse(c);
          const map = {};
          (c?.tasks || []).forEach((t) => {
            map[t.id] = t.score ?? "";
          });
          setEditingScores(map);
        }
      })
      .catch(console.error)
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
      setCourse((c) => ({ ...c, tasks: updatedTasks }));
      alert("保存しました");
    } catch (e) {
      console.error(e);
      alert("保存に失敗しました");
    }
  };

  const handleDelete = async () => {
    const ok = window.confirm("本当に授業を削除しますか？");
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
    <div className="detail-container">

      {/* 左 1/3 */}
      <div className="detail-left">

        <div className="info-header">
          <h2 className="title">{course.courseName}</h2>
          <button className="menu-btn" onClick={() => setShowMenu((s) => !s)}>⋯</button>

          {showMenu && (
            <div className="menu-popup">
              <div onClick={() => navigate(`/edit-course/${course.courseId}`)}>授業を編集</div>
              <div className="delete-btn" onClick={handleDelete}>授業を削除</div>
            </div>
          )}
        </div>

        <div className="info-box">
          <p><b>教員：</b>{course.teacher || "-"}</p>
          <p><b>教室：</b>{course.room || "-"}</p>
        </div>

        <div className="score-summary">
          <div className="score-title">暫定成績</div>

          {/* ゲージ */}
          <div className="score-bar-container">
            <div className="score-bar-fill" style={{ width: `${progress}%` }}></div>
          </div>

          {/* % 表示 */}
          <div className="score-value">{progress}%</div>
        </div>
        <button className="home-btn" onClick={() => navigate("/home")}>
    ホームに戻る
  </button>
      </div>

      {/* 右 2/3 → ★ detail-left の外に正しく配置 */}
      <div className="detail-right">
        <table className="score-table">
          <thead>
            <tr>
              <th>成績項目</th>
              <th>自身の点数</th>
              <th>最大点</th>
              <th>重み(%)</th>
            </tr>
          </thead>

          <tbody>
            {course.tasks.map((t) => (
              <tr key={t.id}>
                <td>{t.name}</td>
                <td>
                  <input
                    type="number"
                    value={editingScores[t.id] ?? ""}
                    onChange={(e) => handleScoreChange(t.id, e.target.value)}
                    className="score-input"
                  />
                </td>
                <td>{t.maxScore}</td>
                <td>{t.weight}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <button className="save-btn" onClick={saveScores}>点数を保存</button>
      </div>
    </div>
  );
}
