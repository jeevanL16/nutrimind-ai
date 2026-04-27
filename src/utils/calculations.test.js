import { describe, it, expect } from 'vitest';
import { calculateTargets, calculateHealthScore, sanitizeInput } from './calculations';

describe('Calculations Utility', () => {
  
  describe('calculateTargets', () => {
    it('returns fat loss targets correctly', () => {
      const targets = calculateTargets('Fat Loss', 2000);
      expect(targets.calories).toBe(1500); // 2000 - 500
      expect(targets.protein).toBe(180);
    });

    it('returns muscle gain targets correctly', () => {
      const targets = calculateTargets('Muscle Gain', 2000);
      expect(targets.calories).toBe(2300); // 2000 + 300
      expect(targets.carbs).toBe(250);
    });
  });

  describe('calculateHealthScore', () => {
    it('returns 100 for perfect macros and high steps', () => {
      const log = { calories: 2000, protein: 150, steps: 11000 };
      const targets = { calories: 2000, protein: 140 };
      expect(calculateHealthScore(log, targets)).toBe(100);
    });

    it('deducts points for low steps and missing protein', () => {
      const log = { calories: 2000, protein: 50, steps: 3000 };
      const targets = { calories: 2000, protein: 140 };
      const score = calculateHealthScore(log, targets);
      expect(score).toBeLessThan(100);
    });
  });

  describe('sanitizeInput', () => {
    it('escapes dangerous XSS characters for security', () => {
      const dirty = '<script>alert("XSS")</script>';
      const clean = sanitizeInput(dirty);
      expect(clean).not.toContain('<script>');
      expect(clean).toContain('&lt;script&gt;');
    });
  });
});
