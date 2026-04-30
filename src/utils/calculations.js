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
 * Generic calculation for a single food item.
 * Supports "unit" and "per100g" scaling.
 * Formula: 
 * - Unit: base * quantity
 * - Per100g: (base / 100) * grams * quantity
 */
export const calculateFoodTotals = (food) => {
  // Point 5: Convert all values to numbers (parseFloat) and handle undefined safely
  const baseCals = parseFloat(food.calories) || 0;
  const baseProt = parseFloat(food.protein) || 0;
  const baseCarbs = parseFloat(food.carbs) || 0;
  const baseFats = parseFloat(food.fats) || 0;
  
  const quantity = parseFloat(food.quantity) || 0;
  const grams = parseFloat(food.servingSize) || 0;
  const type = food.servingType || 'unit';

  // Point 2: Correct Formula
  // If unit: multiplier = quantity
  // If per100g: multiplier = (grams / 100) * quantity
  const multiplier = type === 'per100g' 
    ? (grams / 100) * quantity 
    : quantity;

  // Prevent NaN errors by ensuring multiplier is a number
  const safeMult = isNaN(multiplier) ? 0 : multiplier;

  return {
    caloriesTotal: Math.round(baseCals * safeMult),
    proteinTotal: parseFloat((baseProt * safeMult).toFixed(1)),
    carbsTotal: parseFloat((baseCarbs * safeMult).toFixed(1)),
    fatsTotal: parseFloat((baseFats * safeMult).toFixed(1))
  };
};

/**
 * Calculates global totals for a list of logged items.
 * Points 4: totalCalories = sum(all food.caloriesTotal)
 */
export const calculateGlobalTotals = (items) => {
  if (!Array.isArray(items)) return { calories: 0, protein: 0, carbs: 0, fats: 0 };
  
  return items.reduce((acc, item) => {
    return {
      calories: Number(acc.calories) + (Number(item.caloriesTotal) || 0),
      protein: parseFloat((Number(acc.protein) + (Number(item.proteinTotal) || 0)).toFixed(1)),
      carbs: parseFloat((Number(acc.carbs) + (Number(item.carbsTotal) || 0)).toFixed(1)),
      fats: parseFloat((Number(acc.fats) + (Number(item.fatsTotal) || 0)).toFixed(1))
    };
  }, { calories: 0, protein: 0, carbs: 0, fats: 0 });
};




/**
 * Simple sanitizer to prevent XSS in chat inputs.
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

