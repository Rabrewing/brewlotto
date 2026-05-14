function percentile(sorted, p) {
  if (sorted.length === 0) return 0;
  const idx = Math.floor((p / 100) * sorted.length);
  return sorted[Math.min(idx, sorted.length - 1)];
}

export function computeTimingProfile(predictions, draws, strategyKey) {
  const lags = [];

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
      const remaining = [...drawNums];
      let hits = 0;
      for (const v of predNums) {
        const idx = remaining.indexOf(v);
        if (idx >= 0) { hits += 1; remaining.splice(idx, 1); }
      }

      if (hits >= 2) {
        const lag = Math.round((drawDate.getTime() - createdDate.getTime()) / (1000 * 60 * 60 * 24));
        lags.push(lag);
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

  const now = new Date();
  const windowStart = new Date(now.getTime() + p25 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10);
  const windowEnd = new Date(now.getTime() + p75 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10);

  return { median, p25, p75, spread, sampleSize: lags.length, windowStart, windowEnd, confidence };
}
