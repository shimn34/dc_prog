// src/pages/Home/Home.jsx
import "./Home.css";

export default function Home() {
  const days = ["月", "火", "水", "木", "金", "土"];
  const periods = [
    { label: "1限", time: "9:00-10:30" },
    { label: "2限", time: "10:40-12:10" },
    { label: "3限", time: "13:00-14:30" },
    { label: "4限", time: "14:40-16:10" },
    { label: "5限", time: "16:20-17:50" },
    { label: "6限", time: "18:00-19:30" },
  ];

  return (
    <div className="timetable-wrapper">

      <div className="timetable">
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

            {days.map((_, di) => (
              <div key={di} className="cell course-cell">
                <span className="course-text"></span>
              </div>
            ))}
          </div>
        ))}
      </div>

    </div>
  );
}
