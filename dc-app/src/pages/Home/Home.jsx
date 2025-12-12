// src/pages/Home/Home.jsx
import "./Home.css";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getCourses } from "../../services/courseService";
import { useAuth } from "../../hooks/useAuth";

export default function Home() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  // days/periods (same as before)
  const days = ["月", "火", "水", "木", "金", "土"];
  const periods = [
    { label: "1限", time: "9:00-10:30" },
    { label: "2限", time: "10:40-12:10" },
    { label: "3限", time: "13:00-14:30" },
    { label: "4限", time: "14:40-16:10" },
    { label: "5限", time: "16:20-17:50" },
    { label: "6限", time: "18:00-19:30" },
  ];

  useEffect(() => {
    if (!user?.uid) return;
    let mounted = true;
    setLoading(true);
    getCourses(user.uid)
      .then((list) => {
        if (!mounted) return;
        // normalize: ensure day/period numbers
        setCourses(list || []);
      })
      .catch((e) => {
        console.error("getCourses error", e);
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });
    return () => (mounted = false);
  }, [user?.uid]);

  // helper: find course by day+period
  const findCourse = (day, period) =>
    courses.find((c) => Number(c.day) === day && Number(c.period) === period);

  const handleCellClick = (dayIndex, periodIndex) => {
    const dayVal = dayIndex + 1;
    const periodVal = periodIndex + 1;
    const exist = findCourse(dayVal, periodVal);
    if (exist) {
      // go to detail
      navigate(`/course/${exist.courseId}`);
    } else {
      // go to add with query
      navigate(`/add?day=${dayVal}&period=${periodVal}`);
    }
  };

  return (
    <div className="timetable-wrapper">
      {loading ? null : (
        <div className="timetable" role="grid" aria-label="時間割">
          <div className="cell header" aria-hidden="true"></div>

          {days.map((d) => (
            <div key={d} className="cell header day-header">
              {d}
            </div>
          ))}

          {periods.map((p, pi) => (
            <div key={pi} className="row" role="row">
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
                    className={`cell course-cell ${course ? "occupied" : "empty"}`}
                    onClick={() => handleCellClick(di, pi)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") handleCellClick(di, pi);
                    }}
                    aria-label={
                      course
                        ? `${course.courseName} (${course.teacher ?? ""})`
                        : `${dayVal}曜${periodVal}限に追加`
                    }
                    style={{ cursor: "pointer" }}
                  >
                    {course ? (
                      <div className="course-card">
                        <div className="course-name">{course.courseName}</div>
                        <div className="course-meta">{course.teacher ?? ""}</div>
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
  );
}
