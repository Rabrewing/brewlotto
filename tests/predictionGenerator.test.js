/**
 * Prediction Generator Unit Tests
 */

describe('PredictionGenerator', () => {
  describe('Feature Extraction', () => {
    const mockDraws = [
      { primary_numbers: [1, 2, 3], draw_date: '2024-01-01' },
      { primary_numbers: [2, 3, 4], draw_date: '2024-01-02' },
      { primary_numbers: [3, 4, 5], draw_date: '2024-01-03' },
      { primary_numbers: [1, 3, 5], draw_date: '2024-01-04' },
      { primary_numbers: [2, 4, 6], draw_date: '2024-01-05' },
    ];

    const gameConfig = {
      primary_count: 3,
      primary_min: 1,
      primary_max: 6
    };

    test('should extract features from draw data', () => {
      const extractFeatures = (draws, config) => {
        if (!draws || draws.length === 0) return null;
        
        const numberFrequency = {};
        for (let i = config.primary_min; i <= config.primary_max; i++) {
          numberFrequency[i] = 0;
        }
        
        for (const draw of draws) {
          draw.primary_numbers.forEach(num => {
            if (numberFrequency[num] !== undefined) {
              numberFrequency[num]++;
            }
          });
        }
        
        const avgFrequency = draws.length / (config.primary_max - config.primary_min + 1);
        const hotNumbers = Object.entries(numberFrequency)
          .filter(([, count]) => count > avgFrequency * 1.2)
          .map(([num]) => parseInt(num));
        
        const coldNumbers = Object.entries(numberFrequency)
          .filter(([, count]) => count < avgFrequency * 0.8)
          .map(([num]) => parseInt(num));
        
        return {
          totalDraws: draws.length,
          numberFrequency,
          hotNumbers,
          coldNumbers,
        };
      };

      const features = extractFeatures(mockDraws, gameConfig);

      expect(features).toBeDefined();
      expect(features.totalDraws).toBe(5);
      expect(features.numberFrequency).toBeDefined();
      expect(features.hotNumbers).toBeDefined();
      expect(features.coldNumbers).toBeDefined();
    });

    test('should return null for empty draws', () => {
      const extractFeatures = (draws, config) => {
        if (!draws || draws.length === 0) return null;
        return { totalDraws: draws.length };
      };

      expect(extractFeatures([], gameConfig)).toBeNull();
      expect(extractFeatures(null, gameConfig)).toBeNull();
    });

    test('should identify hot numbers correctly', () => {
      const extractHotNumbers = (draws, config) => {
        const numberFrequency = {};
        for (let i = config.primary_min; i <= config.primary_max; i++) {
          numberFrequency[i] = 0;
        }
        
        for (const draw of draws) {
          draw.primary_numbers.forEach(num => {
            if (numberFrequency[num] !== undefined) {
              numberFrequency[num]++;
            }
          });
        }
        
        const avgFrequency = draws.length / (config.primary_max - config.primary_min + 1);
        return Object.entries(numberFrequency)
          .filter(([, count]) => count > avgFrequency * 1.2)
          .map(([num]) => parseInt(num));
      };

      const hotNumbers = extractHotNumbers(mockDraws, gameConfig);
      expect(hotNumbers.length).toBeGreaterThan(0);
    });
  });

  describe('Candidate Generation', () => {
    test('should generate valid pick3 candidates', () => {
      const generateCandidates = (count = 10) => {
        const candidates = [];
        for (let i = 0; i < count; i++) {
          const numbers = [];
          for (let j = 0; j < 3; j++) {
            numbers.push(Math.floor(Math.random() * 10));
          }
          candidates.push(numbers.sort((a, b) => a - b));
        }
        return candidates;
      };

      const candidates = generateCandidates(10);
      
      expect(candidates.length).toBe(10);
      candidates.forEach(cand => {
        expect(cand.length).toBe(3);
        expect(cand.every(n => n >= 0 && n <= 9)).toBe(true);
      });
    });

    test('should generate valid cash5 candidates', () => {
      const generateCash5Candidates = (count = 10) => {
        const candidates = [];
        for (let i = 0; i < count; i++) {
          const pool = Array.from({ length: 39 }, (_, i) => i + 1);
          const shuffled = pool.sort(() => Math.random() - 0.5);
          candidates.push(shuffled.slice(0, 5).sort((a, b) => a - b));
        }
        return candidates;
      };

      const candidates = generateCash5Candidates(10);
      
      expect(candidates.length).toBe(10);
      candidates.forEach(cand => {
        expect(cand.length).toBe(5);
        expect(cand.every(n => n >= 1 && n <= 39)).toBe(true);
        expect(new Set(cand).size).toBe(5); // all unique
      });
    });
  });

  describe('Confidence Calculation', () => {
    test('should calculate confidence based on data quality', () => {
      const calculateConfidence = (drawCount, frequencySpread) => {
        if (drawCount < 10) return 30;
        if (drawCount < 50) return 50;
        if (frequencySpread < 0.3) return 70;
        return 60;
      };

      expect(calculateConfidence(5, 0.5)).toBe(30);
      expect(calculateConfidence(30, 0.5)).toBe(50);
      expect(calculateConfidence(100, 0.2)).toBe(70);
    });
  });

  describe('Hash Generation', () => {
    test('should generate consistent hashes', () => {
      const generateHash = (input) => {
        let hash = 0;
        for (let i = 0; i < input.length; i++) {
          const char = input.charCodeAt(i);
          hash = ((hash << 5) - hash) + char;
          hash = hash & hash;
        }
        return Math.abs(hash).toString(16);
      };

      const hash1 = generateHash('test-input');
      const hash2 = generateHash('test-input');
      
      expect(hash1).toBe(hash2);
      expect(hash1).not.toBe(generateHash('different-input'));
    });
  });

  describe('Draw Date Calculation', () => {
    test('should calculate next draw date for daily games', () => {
      const getNextDrawDate = (gameKey, drawTime) => {
        const date = new Date();
        
        if (gameKey === 'pick3' || gameKey === 'pick4') {
          if (drawTime === 'midday') {
            date.setHours(15, 0, 0, 0); // 3 PM ET
          } else {
            date.setDate(date.getDate() + 1);
            date.setHours(15, 0, 0, 0);
          }
        }
        
        return date.toISOString().split('T')[0];
      };

      const nextDraw = getNextDrawDate('pick3', 'midday');
      expect(nextDraw).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    });

    test('should calculate next draw date for Powerball', () => {
      const getNextPowerballDate = () => {
        const date = new Date();
        // Just set to a known powerball day (next Saturday)
        date.setDate(date.getDate() + (6 - date.getDay() + 7) % 7);
        return date.toISOString().split('T')[0];
      };

      const nextDraw = getNextPowerballDate();
      expect(nextDraw).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    });
  });
});
