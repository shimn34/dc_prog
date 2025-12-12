// src/utils/gradeRank.js
export function gradeRank(percent) {
  if (percent >= 90) return "S";
  if (percent >= 80) return "A";
  if (percent >= 70) return "B";
  if (percent >= 60) return "C";
  return "-";
}
