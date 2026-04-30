import * as mobilenet from '@tensorflow-models/mobilenet';
import '@tensorflow/tfjs';

let model = null;

/**
 * Loads the MobileNet model if not already loaded.
 */
export const loadModel = async () => {
  if (model) return model;
  model = await mobilenet.load({
    version: 2,
    alpha: 1.0
  });
  return model;
};

/**
 * Predicts food from an image element, video, or canvas.
 * @param {HTMLElement} element - The image, video, or canvas element to analyze.
 * @returns {Promise<Array>} - Top 3 predictions with nutritional estimates.
 */
export const predictFood = async (element) => {
  const loadedModel = await loadModel();
  const predictions = await loadedModel.classify(element);
  
  // Return top 3 with nutritional mapping
  return predictions.slice(0, 3).map(pred => {
    const nutrition = findNutrition(pred.className);
    return {
      className: pred.className,
      probability: pred.probability,
      ...nutrition
    };
  });
};

/**
 * A simple heuristic mapping from food names to nutritional data.
 */
export const findNutrition = (foodName) => {
  const name = foodName.toLowerCase();
  
  // Basic mapping for common categories
  if (name.includes('pizza')) return { name: 'Pizza', calories: 285, protein: 12, carbs: 36, fats: 10 };
  if (name.includes('burger') || name.includes('cheeseburger')) return { name: 'Burger', calories: 550, protein: 25, carbs: 45, fats: 30 };
  if (name.includes('salad')) return { name: 'Fresh Salad', calories: 120, protein: 3, carbs: 10, fats: 8 };
  if (name.includes('apple')) return { name: 'Apple', calories: 95, protein: 0.5, carbs: 25, fats: 0.3 };
  if (name.includes('banana')) return { name: 'Banana', calories: 105, protein: 1, carbs: 27, fats: 0.3 };
  if (name.includes('bread') || name.includes('toast')) return { name: 'Bread', calories: 80, protein: 3, carbs: 15, fats: 1 };
  if (name.includes('egg')) return { name: 'Egg', calories: 70, protein: 6, carbs: 0, fats: 5 };
  if (name.includes('chicken')) return { name: 'Chicken Breast', calories: 165, protein: 31, carbs: 0, fats: 4 };
  if (name.includes('rice')) return { name: 'White Rice', calories: 130, protein: 2, carbs: 28, fats: 0.5 };
  if (name.includes('pasta') || name.includes('spaghetti')) return { name: 'Pasta', calories: 220, protein: 8, carbs: 43, fats: 1 };
  if (name.includes('broccoli')) return { name: 'Broccoli', calories: 55, protein: 4, carbs: 11, fats: 0.5 };
  if (name.includes('steak') || name.includes('beef')) return { name: 'Steak', calories: 271, protein: 25, carbs: 0, fats: 19 };
  if (name.includes('coffee') || name.includes('espresso')) return { name: 'Coffee', calories: 2, protein: 0.2, carbs: 0.3, fats: 0.1 };
  if (name.includes('orange')) return { name: 'Orange', calories: 62, protein: 1, carbs: 15, fats: 0.2 };
  if (name.includes('cake') || name.includes('pastry')) return { name: 'Cake', calories: 350, protein: 4, carbs: 50, fats: 15 };
  
  // Try to find in COMMON_FOODS
  const common = COMMON_FOODS.find(f => f.name.toLowerCase() === name);
  if (common) return common;

  // Default fallback for unknown items
  return { 
    name: foodName, 
    calories: 200, 
    protein: 5, 
    carbs: 20, 
    fats: 10 
  };
};


export const COMMON_FOODS = [
  { name: 'Oatmeal', calories: 150, protein: 6, carbs: 27, fats: 3, servingSize: 1, servingType: 'unit' },
  { name: 'Greek Yogurt', calories: 100, protein: 10, carbs: 4, fats: 5, servingSize: 1, servingType: 'unit' },
  { name: 'Almonds', calories: 579, protein: 21, carbs: 22, fats: 50, servingSize: 30, servingType: 'per100g' },
  { name: 'Protein Shake', calories: 140, protein: 25, carbs: 3, fats: 2, servingSize: 1, servingType: 'unit' },
  { name: 'Brown Rice', calories: 110, protein: 3, carbs: 23, fats: 1, servingSize: 100, servingType: 'per100g' },
  { name: 'Lentils', calories: 116, protein: 9, carbs: 20, fats: 0, servingSize: 100, servingType: 'per100g' },
  { name: 'Avocado', calories: 160, protein: 2, carbs: 9, fats: 15, servingSize: 1, servingType: 'unit' },
  { name: 'Salmon', calories: 208, protein: 20, carbs: 0, fats: 13, servingSize: 100, servingType: 'per100g' },
];

