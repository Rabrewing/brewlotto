import { getStrategyLabel } from '@/utils/strategyLabel';

function percentile(sorted, p) {
  if (sorted.length === 0) return 0;
  const idx = Math.floor((p / 100) * sorted.length);
  return sorted[Math.min(idx, sorted.length - 1)];
}

function weightedPercentile(sortedEntries, percentileTarget) {
  if (sortedEntries.length === 0) return 0;

  const totalWeight = sortedEntries.reduce((sum, entry) => sum + entry.weight, 0);
  if (totalWeight <= 0) {
    return sortedEntries[sortedEntries.length - 1].value;
  }

  const threshold = totalWeight * (percentileTarget / 100);
  let running = 0;
  for (const entry of sortedEntries) {
    running += entry.weight;
    if (running >= threshold) {
      return entry.value;
    }
  }

  return sortedEntries[sortedEntries.length - 1].value;
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

export function computeTimingProfile(predictions, draws, strategyKey, options = {}) {
  const mode = options.mode || 'pro';
  const lagEntries = [];
  const styleCounts = { straight: 0, box: 0, '50_50': 0 };
  const latestPredictionTime = predictions.reduce((latest, prediction) => {
    if (!prediction.created_at) return latest;
    const created = new Date(prediction.created_at).getTime();
    return Number.isFinite(created) && created > latest ? created : latest;
  }, 0);

  for (const prediction of predictions) {
    if (strategyKey) {
      const sourceStrategy = prediction.source_strategy_key || null;
      const sourceLabel = sourceStrategy ? getStrategyLabel(sourceStrategy) : null;
      if (sourceStrategy !== strategyKey && sourceLabel !== strategyKey) continue;
    }
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
        const ageDays = latestPredictionTime > 0
          ? Math.max(0, Math.round((latestPredictionTime - createdDate.getTime()) / (1000 * 60 * 60 * 24)))
          : 0;
        const weight = mode === 'master'
          ? Number((1 / (1 + ageDays / 30)).toFixed(4))
          : 1;
        lagEntries.push({ lag, weight });

        const style = bestPlayStyle(predNums, drawNums);
        if (style) {
          styleCounts[style] += weight;
        }

        break;
      }
    }
  }

  if (lagEntries.length < (mode === 'master' ? 5 : 3)) return null;

  const sortedEntries = [...lagEntries].sort(function(a, b) { return a.lag - b.lag; });
  const median = mode === 'master'
    ? weightedPercentile(sortedEntries.map((entry) => ({ value: entry.lag, weight: entry.weight })), 50)
    : percentile(sortedEntries.map((entry) => entry.lag), 50);
  const p25 = mode === 'master'
    ? weightedPercentile(sortedEntries.map((entry) => ({ value: entry.lag, weight: entry.weight })), 25)
    : percentile(sortedEntries.map((entry) => entry.lag), 25);
  const p75 = mode === 'master'
    ? weightedPercentile(sortedEntries.map((entry) => ({ value: entry.lag, weight: entry.weight })), 75)
    : percentile(sortedEntries.map((entry) => entry.lag), 75);
  const spread = p75 - p25;

  let confidence = 'low';
  const effectiveSampleSize = mode === 'master'
    ? Math.round(lagEntries.reduce((sum, entry) => sum + entry.weight, 0))
    : lagEntries.length;
  if ((mode === 'master' ? effectiveSampleSize >= 18 : lagEntries.length >= 20) && spread <= (mode === 'master' ? 6 : 7)) confidence = 'high';
  else if ((mode === 'master' ? effectiveSampleSize >= 8 : lagEntries.length >= 10) && spread <= (mode === 'master' ? 10 : 14)) confidence = 'medium';

  const total = styleCounts.straight + styleCounts.box + styleCounts['50_50'];
  let recommendedStyle = null;
  if (total > 0) {
    const sorted = Object.entries(styleCounts).sort(function(a, b) { return b[1] - a[1]; });
    const top = sorted[0][1];
    const winners = sorted.filter(function(s) { return s[1] === top; });
    if (winners.length === 1 && winners[0][1] >= (mode === 'master' ? 1.5 : 2)) {
      recommendedStyle = winners[0][0];
    }
  }

  const now = new Date();
  const windowStart = new Date(now.getTime() + p25 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10);
  const windowEnd = new Date(now.getTime() + p75 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10);

  return {
    median, p25, p75, spread,
    sampleSize: effectiveSampleSize,
    windowStart, windowEnd,
    confidence,
    recommendedStyle,
    styleDistribution: total > 0 ? styleCounts : null,
  };
}
