export function resolveTimingAccessLabel({ tierCode, timepulseAccess, timingAnalysisAccess }) {
  const tier = String(tierCode || '').toLowerCase();

  if (timingAnalysisAccess || tier === 'master') {
    return 'TimePulse II';
  }

  if (timepulseAccess || tier === 'pro') {
    return 'TimePulse';
  }

  return null;
}

export function resolveTimingAccessMode({ tierCode, timepulseAccess, timingAnalysisAccess }) {
  const tier = String(tierCode || '').toLowerCase();

  if (timingAnalysisAccess || tier === 'master') {
    return 'master';
  }

  if (timepulseAccess || tier === 'pro') {
    return 'pro';
  }

  return null;
}
