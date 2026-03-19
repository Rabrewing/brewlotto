/**
 * Data Integrity Tests
 * Validates ingestion pipeline accuracy and completeness
 */

describe('Data Integrity Tests', () => {
  describe('Draw Data Validation', () => {
    test('should validate number ranges for Pick 3', () => {
      const validatePick3 = (numbers) => {
        return Array.isArray(numbers) &&
          numbers.length === 3 &&
          numbers.every(n => Number.isInteger(n) && n >= 0 && n <= 9);
      };

      expect(validatePick3([1, 2, 3])).toBe(true);
      expect(validatePick3([0, 0, 0])).toBe(true);
      expect(validatePick3([9, 9, 9])).toBe(true);
      expect(validatePick3([10, 2, 3])).toBe(false);
      expect(validatePick3([1, 2])).toBe(false);
      expect(validatePick3([1.5, 2, 3])).toBe(false);
    });

    test('should validate number ranges for Cash 5', () => {
      const validateCash5 = (numbers) => {
        return Array.isArray(numbers) &&
          numbers.length === 5 &&
          numbers.every(n => Number.isInteger(n) && n >= 1 && n <= 39) &&
          new Set(numbers).size === numbers.length;
      };

      expect(validateCash5([1, 2, 3, 4, 5])).toBe(true);
      expect(validateCash5([1, 2, 3, 4, 39])).toBe(true);
      expect(validateCash5([0, 1, 2, 3, 4])).toBe(false);
      expect(validateCash5([1, 2, 3, 4, 40])).toBe(false);
      expect(validateCash5([1, 1, 2, 3, 4])).toBe(false);
    });

    test('should validate Powerball numbers', () => {
      const validatePowerball = (primary, bonus) => {
        if (!Array.isArray(primary)) return false;
        if (primary.length !== 5) return false;
        if (primary.some(n => !Number.isInteger(n) || n < 1 || n > 69)) return false;
        if (new Set(primary).size !== 5) return false; // all unique
        if (!Number.isInteger(bonus) || bonus < 1 || bonus > 26) return false;
        return true;
      };

      expect(validatePowerball([1, 2, 3, 4, 5], 10)).toBe(true);
      expect(validatePowerball([69, 69, 69, 69, 69], 26)).toBe(false);
      expect(validatePowerball([1, 2, 3, 4, 5], 27)).toBe(false);
    });

    test('should validate Mega Millions numbers', () => {
      const validateMegaMillions = (primary, bonus) => {
        if (!Array.isArray(primary)) return false;
        if (primary.length !== 5) return false;
        if (primary.some(n => !Number.isInteger(n) || n < 1 || n > 70)) return false;
        if (new Set(primary).size !== 5) return false; // all unique
        if (!Number.isInteger(bonus) || bonus < 1 || bonus > 25) return false;
        return true;
      };

      expect(validateMegaMillions([1, 2, 3, 4, 5], 10)).toBe(true);
      expect(validateMegaMillions([70, 70, 70, 70, 70], 25)).toBe(false);
      expect(validateMegaMillions([1, 2, 3, 4, 5], 26)).toBe(false);
    });
  });

  describe('Date Validation', () => {
    test('should validate draw date format', () => {
      const validateDate = (dateStr) => {
        const regex = /^\d{4}-\d{2}-\d{2}$/;
        if (!regex.test(dateStr)) return false;
        const date = new Date(dateStr);
        return !isNaN(date.getTime());
      };

      expect(validateDate('2024-01-15')).toBe(true);
      expect(validateDate('2024-12-31')).toBe(true);
      expect(validateDate('01-15-2024')).toBe(false);
      expect(validateDate('2024/01/15')).toBe(false);
      expect(validateDate('invalid')).toBe(false);
    });

    test('should detect future dates', () => {
      const isFutureDate = (dateStr) => {
        const date = new Date(dateStr);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return date > today;
      };

      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + 1);
      
      expect(isFutureDate(futureDate.toISOString().split('T')[0])).toBe(true);
      expect(isFutureDate('2020-01-01')).toBe(false);
    });
  });

  describe('Duplicate Detection', () => {
    test('should detect duplicate draws', () => {
      const detectDuplicates = (draws) => {
        const seen = new Set();
        const duplicates = [];

        for (const draw of draws) {
          const key = `${draw.draw_date}-${draw.draw_window_label || 'daily'}-${JSON.stringify(draw.primary_numbers)}`;
          if (seen.has(key)) {
            duplicates.push(draw);
          }
          seen.add(key);
        }

        return duplicates;
      };

      const draws = [
        { draw_date: '2024-01-01', draw_window_label: 'day', primary_numbers: [1, 2, 3] },
        { draw_date: '2024-01-01', draw_window_label: 'day', primary_numbers: [1, 2, 3] }, // exact duplicate
        { draw_date: '2024-01-02', primary_numbers: [1, 2, 3] },
      ];

      expect(detectDuplicates(draws).length).toBe(1);
    });

    test('should not flag different draws as duplicates', () => {
      const detectDuplicates = (draws) => {
        const seen = new Set();
        const duplicates = [];

        for (const draw of draws) {
          const key = `${draw.draw_date}-${draw.draw_window_label || 'daily'}-${JSON.stringify(draw.primary_numbers)}`;
          if (seen.has(key)) {
            duplicates.push(draw);
          }
          seen.add(key);
        }

        return duplicates;
      };

      const draws = [
        { draw_date: '2024-01-01', draw_window_label: 'day', primary_numbers: [1, 2, 3] },
        { draw_date: '2024-01-01', draw_window_label: 'evening', primary_numbers: [1, 2, 3] },
      ];

      expect(detectDuplicates(draws).length).toBe(0);
    });
  });

  describe('Data Freshness', () => {
    test('should calculate staleness correctly', () => {
      const calculateStalenessMinutes = (lastDrawDate) => {
        const lastDraw = new Date(lastDrawDate);
        const now = new Date();
        const diffMs = now - lastDraw;
        return Math.floor(diffMs / (1000 * 60));
      };

      const recentDate = new Date();
      recentDate.setMinutes(recentDate.getMinutes() - 30);
      
      const staleness = calculateStalenessMinutes(recentDate.toISOString());
      expect(staleness).toBeGreaterThanOrEqual(29);
      expect(staleness).toBeLessThanOrEqual(31);
    });

    test('should identify stale data correctly', () => {
      const isStale = (stalenessMinutes, threshold = 1440) => {
        return stalenessMinutes >= threshold;
      };

      expect(isStale(1500)).toBe(true);
      expect(isStale(1440)).toBe(true);
      expect(isStale(1439)).toBe(false);
      expect(isStale(60)).toBe(false);
    });
  });

  describe('Game Configuration Validation', () => {
    const GAME_CONFIGS = {
      pick3: { primary_count: 3, primary_min: 0, primary_max: 9, has_bonus: false },
      pick4: { primary_count: 4, primary_min: 0, primary_max: 9, has_bonus: false },
      cash5: { primary_count: 5, primary_min: 1, primary_max: 39, has_bonus: false },
      powerball: { primary_count: 5, primary_min: 1, primary_max: 69, has_bonus: true, bonus_min: 1, bonus_max: 26 },
      mega_millions: { primary_count: 5, primary_min: 1, primary_max: 70, has_bonus: true, bonus_min: 1, bonus_max: 25 },
    };

    test('should validate against game config', () => {
      const validateAgainstConfig = (numbers, config) => {
        if (!Array.isArray(numbers)) return false;
        if (numbers.length !== config.primary_count) return false;
        if (numbers.some(n => n < config.primary_min || n > config.primary_max)) return false;
        if (new Set(numbers).size !== numbers.length) return false;
        return true;
      };

      expect(validateAgainstConfig([1, 2, 3], GAME_CONFIGS.pick3)).toBe(true);
      expect(validateAgainstConfig([1, 2, 3, 4], GAME_CONFIGS.pick3)).toBe(false);
      expect(validateAgainstConfig([1, 2, 10], GAME_CONFIGS.pick3)).toBe(false);
      expect(validateAgainstConfig([1, 2, 2, 3], GAME_CONFIGS.pick4)).toBe(false);
    });
  });
});
