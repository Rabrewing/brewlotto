const fs = require('fs');
const path = require('path');

function loadTierUtils() {
  const sourcePath = path.join(__dirname, '..', 'utils', 'tier-utils.js');
  const source = fs
    .readFileSync(sourcePath, 'utf8')
    .replace(/^export\s+\{[^}]+\};?$/gm, '')
    .replace(/^export\s+function\s+/gm, 'function ');

  const factory = new Function(
    `${source}\nreturn { hasTierAccess, normalizeTierValue, TIER_ORDER };`
  );

  return factory();
}

const { hasTierAccess, normalizeTierValue, TIER_ORDER } = loadTierUtils();

describe('tier utils', () => {
  test('normalizes legacy and current tier labels', () => {
    expect(normalizeTierValue('free')).toBe(TIER_ORDER.free);
    expect(normalizeTierValue('brew')).toBe(TIER_ORDER.starter);
    expect(normalizeTierValue('starter')).toBe(TIER_ORDER.starter);
    expect(normalizeTierValue('pro')).toBe(TIER_ORDER.pro);
    expect(normalizeTierValue('master')).toBe(TIER_ORDER.master);
    expect(normalizeTierValue(2)).toBe(2);
  });

  test('allows higher tiers to access lower tiers', () => {
    expect(hasTierAccess('starter', 'starter')).toBe(true);
    expect(hasTierAccess('pro', 'starter')).toBe(true);
    expect(hasTierAccess('master', 'pro')).toBe(true);
    expect(hasTierAccess('free', 'starter')).toBe(false);
  });

  test('supports numeric strategy tiers', () => {
    expect(hasTierAccess('starter', 1)).toBe(true);
    expect(hasTierAccess('starter', 2)).toBe(false);
    expect(hasTierAccess('master', 3)).toBe(true);
    expect(hasTierAccess('pro', 3)).toBe(false);
  });
});
