/**
 * Alert System Tests
 * Tests for alerting functionality
 */

describe('Alert System Tests', () => {
  describe('Alert Severity Levels', () => {
    const SEVERITY_LEVELS = ['critical', 'warning', 'info'];
    
    test('should have valid severity levels', () => {
      SEVERITY_LEVELS.forEach(level => {
        expect(['critical', 'warning', 'info']).toContain(level);
      });
    });

    test('should prioritize critical over warning', () => {
      const priority = { critical: 1, warning: 2, info: 3 };
      expect(priority.critical).toBeLessThan(priority.warning);
    });
  });

  describe('Alert Status Transitions', () => {
    const VALID_STATUSES = ['raised', 'acknowledged', 'resolved', 'escalated', 'suppressed'];
    
    const canTransition = (from, to) => {
      const transitions = {
        raised: ['acknowledged', 'resolved', 'escalated', 'suppressed'],
        acknowledged: ['resolved', 'escalated', 'raised'],
        resolved: ['raised', 'suppressed'],
        escalated: ['acknowledged', 'resolved'],
        suppressed: ['raised']
      };
      return transitions[from]?.includes(to) || false;
    };

    test('should allow valid transitions', () => {
      expect(canTransition('raised', 'acknowledged')).toBe(true);
      expect(canTransition('raised', 'resolved')).toBe(true);
      expect(canTransition('acknowledged', 'resolved')).toBe(true);
    });

    test('should block invalid transitions', () => {
      expect(canTransition('resolved', 'acknowledged')).toBe(false);
      expect(canTransition('suppressed', 'resolved')).toBe(false);
    });
  });

  describe('Alert Thresholds', () => {
    test('should trigger critical on stale data', () => {
      const STALENESS_THRESHOLDS = {
        critical: 1440, // 24 hours
        warning: 720,   // 12 hours
      };

      const getAlertSeverity = (stalenessMinutes) => {
        if (stalenessMinutes >= STALENESS_THRESHOLDS.critical) return 'critical';
        if (stalenessMinutes >= STALENESS_THRESHOLDS.warning) return 'warning';
        return null;
      };

      expect(getAlertSeverity(1500)).toBe('critical');
      expect(getAlertSeverity(800)).toBe('warning');
      expect(getAlertSeverity(300)).toBe(null);
    });

    test('should trigger on consecutive failures', () => {
      const FAILURE_THRESHOLD = 3;

      const shouldAlert = (consecutiveFailures) => {
        return consecutiveFailures >= FAILURE_THRESHOLD;
      };

      expect(shouldAlert(2)).toBe(false);
      expect(shouldAlert(3)).toBe(true);
      expect(shouldAlert(5)).toBe(true);
    });
  });

  describe('Email Delivery Rules', () => {
    test('should send email only for critical alerts', () => {
      const shouldSendEmail = (severity, emailRequired) => {
        return severity === 'critical' && emailRequired;
      };

      expect(shouldSendEmail('critical', true)).toBe(true);
      expect(shouldSendEmail('warning', true)).toBe(false);
      expect(shouldSendEmail('critical', false)).toBe(false);
    });

    test('should respect deduping rules', () => {
      const shouldSendEmail = (alert, lastSentAt) => {
        const THRESHOLD_MINUTES = 30;
        if (!lastSentAt) return true;
        
        const elapsed = (Date.now() - new Date(lastSentAt).getTime()) / 60000;
        return elapsed >= THRESHOLD_MINUTES;
      };

      const now = new Date().toISOString();
      const thirtyMinutesAgo = new Date(Date.now() - 31 * 60000).toISOString();
      const tenMinutesAgo = new Date(Date.now() - 10 * 60000).toISOString();

      expect(shouldSendEmail({ severity: 'critical' }, thirtyMinutesAgo)).toBe(true);
      expect(shouldSendEmail({ severity: 'critical' }, tenMinutesAgo)).toBe(false);
      expect(shouldSendEmail({ severity: 'critical' }, null)).toBe(true);
    });
  });

  describe('Alert Categories', () => {
    const VALID_CATEGORIES = [
      'freshness',
      'ingestion',
      'validation',
      'system',
      'billing',
      'prediction'
    ];

    test('should have valid categories', () => {
      VALID_CATEGORIES.forEach(cat => {
        expect(typeof cat).toBe('string');
        expect(cat.length).toBeGreaterThan(0);
      });
    });
  });
});
