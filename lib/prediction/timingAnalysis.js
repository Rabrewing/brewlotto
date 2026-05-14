function percentile(sorted, p) {
  if (sorted.length === 0) return 0;
  const idx = Math.floor((p / 100) * sorted.length);
  return sorted[Math.min(idx, sorted.length - 1)];
}

function countExactPositions(pred, draw) {
  let exact = 0;
  for (let i = 0; i < Math.min(pred.length, draw.length); i++) {
    if (pred[i] === draw[i]) exact++;
  }
  return exact;
}

function bestPlayStyle(predNums, drawNums) {
  const contentHits = predNums.filter(function(v) { return drawNums.indexOf(v) >= 0; }).length;
  const exactHits = countExactPositions(predNums, drawNums);
  const len = Math.min(predNums.length, drawNums.length);

  if (contentHits === len && exactHits === len) return 'straight';
  if (contentHits === len) return 'box';
  if (contentHits >= 2 && exactHits >= Math.ceil(len / 2)) return '50_50';
  if (contentHits >= 2) return 'box';
  return null;
}

export function computeTimingProfile(predictions, draws, strategyKey) {
  const lags = [];
  const styleCounts = { straight: 0, box: 0, '50_50': 0 };

  for (const prediction of predictions) {
    if (strategyKey && prediction.source_strategy_key !== strategyKey) continue;
    if (!prediction.created_at) continue;
    const createdDate = new Date(prediction.created_at);
    const predNums = Array.isArray(prediction.predicted_numbers) ? prediction.predicted_numbers : [];
    if (predNums.length === 0) continue;

    for (const draw of draws) {
      const drawDate = new Date(draw.draw_date);
      if (drawDate <= createdDate) continue;

      const drawNums = Array.isArray(draw.primary_numbers) ? draw.primary_numbers : [];
      const hits = predNums.filter(function(v) { return drawNums.indexOf(v) >= 0; }).length;

      if (hits >= 2) {
        const lag = Math.round((drawDate.getTime() - createdDate.getTime()) / (1000 * 60 * 60 * 24));
        lags.push(lag);

        const style = bestPlayStyle(predNums, drawNums);
        if (style) styleCounts[style]++;

        break;
      }
    }
  }

  if (lags.length < 3) return null;

  lags.sort(function(a, b) { return a - b; });
  const median = percentile(lags, 50);
  const p25 = percentile(lags, 25);
  const p75 = percentile(lags, 75);
  const spread = p75 - p25;

  let confidence = 'low';
  if (lags.length >= 20 && spread <= 7) confidence = 'high';
  else if (lags.length >= 10 && spread <= 14) confidence = 'medium';

  const total = styleCounts.straight + styleCounts.box + styleCounts['50_50'];
  let recommendedStyle = null;
  if (total > 0) {
    const sorted = Object.entries(styleCounts).sort(function(a, b) { return b[1] - a[1]; });
    const top = sorted[0][1];
    const winners = sorted.filter(function(s) { return s[1] === top; });
    if (winners.length === 1 && winners[0][1] >= 2) {
      recommendedStyle = winners[0][0];
    }
  }

  const now = new Date();
  const windowStart = new Date(now.getTime() + p25 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10);
  const windowEnd = new Date(now.getTime() + p75 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10);

  return {
    median, p25, p75, spread,
    sampleSize: lags.length,
    windowStart, windowEnd,
    confidence,
    recommendedStyle,
    styleDistribution: total > 0 ? styleCounts : null,
  };
}
