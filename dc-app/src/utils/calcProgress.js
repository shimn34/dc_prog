// src/utils/calcProgress.js
/**
 * assignments: [{ score, maxScore, weight }, ...]
 * - score === null or undefined -> 未入力扱いして計算対象から除外
 * - weight は割合の合計を期待（例 total=100）
 *
 * 戻り値:
 * { percent: 0-100, weightedSum, totalWeightUsed }
 */
export function calcProgress(assignments = []) {
  let weightedSum = 0;
  let totalWeight = 0;

  for (const a of assignments) {
    const weight = Number(a.weight ?? 0);
    const maxScore = Number(a.maxScore ?? 100);

    if (a.score === null || a.score === undefined) {
      // 未入力：除外
      continue;
    }

    const score = Number(a.score);
    // 正規化された割合 (0~1)
    const pct = maxScore > 0 ? score / maxScore : 0;

    weightedSum += pct * weight;
    totalWeight += weight;
  }

  const percent = totalWeight > 0 ? (weightedSum / totalWeight) * 100 : 0;
  return { percent, weightedSum, totalWeight };
}
