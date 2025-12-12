// src/pages/Home/Home.jsx
import "./Home.css";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getCourses, getTerms, createTerm } from "../../services/courseService";
import { useAuth } from "../../hooks/useAuth";

export default function Home() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [courses, setCourses] = useState([]);
  const [terms, setTerms] = useState([]);
  const [currentTermId, setCurrentTermId] = useState(null);
  const [loading, setLoading] = useState(true);

  const days = ["月", "火", "水", "木", "金", "土"];
  const periods = [
    { label: "1限", time: "9:00-10:30" },
    { label: "2限", time: "10:40-12:10" },
    { label: "3限", time: "13:00-14:30" },
    { label: "4限", time: "14:40-16:10" },
    { label: "5限", time: "16:20-17:50" },
    { label: "6限", time: "18:00-19:30" },
  ];

  /* =======================
      1. 学期一覧の読み込み
     ======================= */
  useEffect(() => {
    if (!user?.uid) return;

    let mounted = true;

    getTerms(user.uid).then((list) => {
      if (!mounted) return;

      const sorted = [...(list || [])].sort((a, b) => {
        if (a.year !== b.year) return b.year - a.year;
        return a.semester === "後期" ? -1 : 1;
      });

      setTerms(sorted);

      if (sorted.length > 0) {
        setCurrentTermId(sorted[0].id);
      }
    });

    return () => (mounted = false);
  }, [user?.uid]);

  /* ===========================
      2. 選択中学期の授業一覧読み込み
     =========================== */
  useEffect(() => {
    if (!user?.uid || !currentTermId) return;

    let mounted = true;
    setLoading(true);

    getCourses(user.uid, currentTermId)
      .then((list) => mounted && setCourses(list || []))
      .finally(() => mounted && setLoading(false));

    return () => (mounted = false);
  }, [user?.uid, currentTermId]);

  /* =======================
      3. 授業セル検索
     ======================= */
  const findCourse = (day, period) =>
    courses.find(
      (c) => Number(c.day) === day && Number(c.period) === period
    );

  /* =======================
      4. セルクリック処理
     ======================= */
  const handleCellClick = (dayIndex, periodIndex) => {
    const dayVal = dayIndex + 1;
    const periodVal = periodIndex + 1;
    const exist = findCourse(dayVal, periodVal);

    if (exist)
      navigate(`/detail/${exist.courseId}`);
    else
      navigate(
        `/add?day=${dayVal}&period=${periodVal}&termId=${currentTermId}`
      );
  };

  /* =======================
      5. 学期追加ボタン
     ======================= */
  const handleAddTerm = async () => {
    if (!user?.uid) return;

    const year = new Date().getFullYear();
    const semester = "前期"; // デフォルト

    const newId = await createTerm(user.uid, {
      year,
      semester,
    });

    const newTerm = { id: newId, year, semester };

    const updated = [newTerm, ...terms];
    setTerms(updated);
    setCurrentTermId(newId);
  };

  /* =======================
      render
     ======================= */

  return (
    <div className="home-container">

      {/* 左：学期リスト */}
      <div className="term-panel">
        <div className="term-header">学期一覧</div>

        <div className="term-list">
          {terms.map((t) => (
            <div
              key={t.id}
              className={`term-item ${t.id === currentTermId ? "active" : ""}`}
              onClick={() => setCurrentTermId(t.id)}
            >
              {t.year}年度 {t.semester}
            </div>
          ))}
        </div>

        <button
        className="term-add-btn"
        onClick={() => navigate("/add-term")}>
          ＋ 新しい学期を追加
        </button>
      </div>

      {/* 右：時間割 */}
      <div className="timetable-wrapper">
        {loading ? null : (
          <div className="timetable" role="grid">
            <div className="cell header"></div>

            {days.map((d) => (
              <div key={d} className="cell header day-header">
                {d}
              </div>
            ))}

            {periods.map((p, pi) => (
              <div key={pi} className="row">
                <div className="cell header period-header">
                  <span className="period-label">{p.label}</span>
                  <span className="period-time">{p.time}</span>
                </div>

                {days.map((_, di) => {
                  const dayVal = di + 1;
                  const periodVal = pi + 1;
                  const course = findCourse(dayVal, periodVal);

                  return (
                    <div
                      key={di}
                      className={`cell course-cell ${
                        course ? "occupied" : "empty"
                      }`}
                      onClick={() => handleCellClick(di, pi)}
                      style={{ cursor: "pointer" }}
                    >
                      {course ? (
                        <div className="course-card">
                          <div className="course-name">{course.courseName}</div>
                        </div>
                      ) : (
                        <div className="course-empty">＋</div>
                      )}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
