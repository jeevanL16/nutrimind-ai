/**
 * Calculates macro and calorie targets based on the user's selected goal.
 * @param {string} mode - The goal mode: 'Fat Loss', 'Muscle Gain', or 'Maintenance'
 * @param {number} baseTDEE - The user's baseline Total Daily Energy Expenditure
 * @returns {object} The target calories and macros (protein, carbs, fats)
 */
export const calculateTargets = (mode, baseTDEE = 2200) => {
  switch (mode) {
    case 'Fat Loss':
      return { calories: baseTDEE - 500, protein: 180, carbs: 150, fats: 50 };
    case 'Muscle Gain':
      return { calories: baseTDEE + 300, protein: 160, carbs: 250, fats: 70 };
    case 'Maintenance':
    default:
      return { calories: baseTDEE, protein: 140, carbs: 200, fats: 60 };
  }
};

/**
 * Calculates a dynamic health score out of 100 based on daily logs vs targets.
 * @param {object} todayLog - The current day's logged nutrition and steps
 * @param {object} targets - The user's daily goals
 * @returns {number} The calculated health score bounded between 0 and 100
 */
export const calculateHealthScore = (todayLog, targets) => {
  let score = 100;

  // Calorie accuracy penalty (within 100 kcal is perfect, else deduct up to 30 points)
  const calDiff = Math.abs(todayLog.calories - targets.calories);
  if (calDiff > 100) {
    score -= Math.min(30, (calDiff - 100) / 20);
  }

  // Protein check penalty
  if (todayLog.protein < targets.protein * 0.8) {
    score -= 15;
  }

  // Step check penalty/bonus
  if (todayLog.steps < 5000) {
    score -= 10;
  } else if (todayLog.steps >= 10000) {
    score += 5;
  }

  return Math.max(0, Math.min(100, Math.round(score)));
};

/**
 * Simple sanitizer to prevent XSS in chat inputs.
 * @param {string} input - User input string
 * @returns {string} Sanitized string
 */
export const sanitizeInput = (input) => {
  if (!input) return '';
  return input.replace(/[<>&"']/g, (match) => {
    const escapeMap = {
      '<': '&lt;',
      '>': '&gt;',
      '&': '&amp;',
      '"': '&quot;',
      "'": '&#39;'
    };
    return escapeMap[match];
  });
};
