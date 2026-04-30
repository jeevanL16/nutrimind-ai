/**
 * Generates a dynamic response based on the user's current stats and their query.
 * @param {string} input - User's chat message
 * @param {object} state - Current state containing user, todayLog, and goals
 * @returns {string} - AI coach response
 */
export const generateCoachResponse = (input, state) => {
  const { user, todayLog, goals } = state;
  const lowerInput = input.toLowerCase();
  
  // 1. Check for specific status queries
  if (lowerInput.includes('status') || lowerInput.includes('how am i doing') || lowerInput.includes('progress')) {
    const calRemaining = goals.calories - todayLog.calories;
    if (calRemaining < 0) {
      return `You've exceeded your calorie target by ${Math.abs(calRemaining)} kcal today. Focus on light, high-protein snacks if you're still hungry, and try to get some extra steps in!`;
    }
    return `You're doing great! You have ${calRemaining} kcal left for the day. You've hit ${Math.round((todayLog.protein/goals.protein)*100)}% of your protein goal. Keep it up!`;
  }

  // 2. Check for step-related queries
  if (lowerInput.includes('steps') || lowerInput.includes('walk') || lowerInput.includes('exercise')) {
    if (todayLog.steps < 5000) {
      return `You're currently at ${todayLog.steps} steps. Since your goal is ${user.goalMode}, hitting at least 8,000 steps will significantly help your metabolic health. Ready for a quick walk?`;
    }
    if (todayLog.steps > 10000) {
      return `Impressive! ${todayLog.steps} steps is fantastic. You're crushing your activity goals today.`;
    }
    return `You're at ${todayLog.steps} steps. A bit more movement before the day ends would be perfect!`;
  }

  // 3. Check for hunger/cravings
  if (lowerInput.includes('hungry') || lowerInput.includes('starving') || lowerInput.includes('craving')) {
    if (todayLog.calories > goals.calories * 0.9) {
      return "You're close to your calorie limit. Try drinking a large glass of water or herbal tea. Often thirst is mistaken for hunger!";
    }
    if (todayLog.protein < goals.protein * 0.5) {
      return "Your protein intake is low today. This might be why you're feeling hungry. Try a high-protein snack like Greek yogurt or a few almonds.";
    }
    return "If you're truly hungry, go for high-volume, low-calorie foods like cucumber, celery, or a large salad. They'll keep you full without breaking the bank!";
  }

  // 4. Time-based advice (simplified)
  const hour = new Date().getHours();
  if (lowerInput.includes('dinner') || lowerInput.includes('night')) {
    if (hour > 20) {
      return "It's getting late. If you're eating now, keep it light and easy to digest so it doesn't affect your sleep quality.";
    }
  }
  
  if (lowerInput.includes('breakfast')) {
    const hadBreakfast = todayLog.items.some(item => {
        const h = parseInt(item.time.split(':')[0]);
        const isAM = item.time.includes('AM');
        return isAM && h >= 6 && h <= 11;
    });
    if (!hadBreakfast && hour > 11) {
        return "I noticed you skipped breakfast today. Consistency is key for " + user.goalMode + ". Try to plan a balanced meal for tomorrow morning!";
    }
  }

  // 5. Goal specific advice
  if (lowerInput.includes('advice') || lowerInput.includes('tips')) {
    if (user.goalMode === 'Fat Loss') {
      return "For fat loss, prioritize protein and fiber. They keep you satiated. Also, don't ignore the 'hidden' calories in cooking oils and sauces!";
    }
    if (user.goalMode === 'Muscle Gain') {
      return "To gain muscle effectively, ensure you're in a slight calorie surplus and hitting your protein targets consistently. Recovery is just as important as the workout!";
    }
  }

  // 6. Generic Fallback based on real data
  const proteinPercent = (todayLog.protein / goals.protein) * 100;
  if (proteinPercent < 50) {
    return "I'm here to help! Looking at your logs, you're a bit low on protein today. Try to prioritize that in your next meal.";
  }

  return "I understand! Based on your current data, you are on a good path. Is there anything specific about your nutrition or activity you'd like to adjust?";
};
