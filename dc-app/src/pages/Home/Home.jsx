import "./Home.css";
import { useAuth } from "../../hooks/useAuth";

export default function Home() {
  const { user } = useAuth();

  // 時間割の曜日
  const days = ["月", "火", "水", "木", "金", "土"];

  // 1〜6限
  const periods = [
    "1限<br/>9:00-10:30",
    "2限<br/>10:40-12:10",
    "3限<br/>13:00-14:30",
    "4限<br/>14:40-16:10",
    "5限<br/>16:20-17:50",
    "6限<br/>18:00-19:30",
  ];

  return (
    <div className="timetable-container">
      <h2>{user?.displayName ?? "ユーザー"} の時間割</h2>

      <div className="timetable">
        {/* 左上の空白マス */}
        <div className="cell header"></div>

        {/* 曜日ヘッダー */}
        {days.map((d) => (
          <div key={d} className="cell header day-header">
            {d}
          </div>
        ))}

        {/* 各時間帯 */}
        {periods.map((p, pi) => (
          <>
            {/* コマ番号（左の縦ヘッダー） */}
            <div
              key={`period-${pi}`}
              className="cell header period-header"
              dangerouslySetInnerHTML={{ __html: p }}
            />

            {/* 6曜日分マス */}
            {days.map((d, di) => (
              <div
                key={`cell-${pi}-${di}`}
                className="cell"
              >
                {/* 後でここに授業名を入れる */}
              </div>
            ))}
          </>
        ))}
      </div>
    </div>
  );
}
