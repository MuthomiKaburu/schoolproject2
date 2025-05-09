export interface MealPlan {
  goal: 'weight_gain' | 'weight_loss';
  planName: string;
  description: string;
  dailyCalories: number;
  meals: {
    breakfast: string[];
    lunch: string[];
    dinner: string[];
    snacks: string[];
  };
}

const nutritionPlans: MealPlan[] = [
  {
    goal: 'weight_gain',
    planName: 'High-Calorie Clean Bulk',
    description: 'Designed for healthy weight gain with nutrient-dense foods and lean protein sources.',
    dailyCalories: 3200,
    meals: {
      breakfast: [
        '4 scrambled eggs with spinach and feta',
        '2 slices of whole grain toast with almond butter',
        '1 banana',
        '1 glass of full-fat milk'
      ],
      lunch: [
        'Grilled chicken breast (200g)',
        '1.5 cups of brown rice',
        'Steamed broccoli with olive oil',
        'Avocado slices'
      ],
      dinner: [
        'Baked salmon with lemon and herbs (200g)',
        'Quinoa salad with chickpeas and cucumber',
        'Roasted sweet potatoes'
      ],
      snacks: [
        'Greek yogurt with honey and granola',
        'Handful of mixed nuts',
        'Protein smoothie (banana, whey protein, oats, milk)',
        'Hard-boiled eggs'
      ]
    }
  },
  {
    goal: 'weight_loss',
    planName: 'Lean Deficit Plan',
    description: 'Calorie deficit meal plan for effective fat loss while preserving muscle.',
    dailyCalories: 1800,
    meals: {
      breakfast: [
        'Oatmeal with chia seeds and blueberries',
        'Green tea or black coffee'
      ],
      lunch: [
        'Grilled turkey breast (150g)',
        'Mixed greens with cherry tomatoes and vinaigrette',
        '1 slice of whole grain bread'
      ],
      dinner: [
        'Stir-fried tofu with vegetables',
        'Cauliflower rice',
        'Side salad with lemon dressing'
      ],
      snacks: [
        'Sliced cucumber with hummus',
        'Apple slices with peanut butter (1 tbsp)',
        'Protein shake (low-carb, plant-based or whey)'
      ]
    }
  },
  {
    goal: 'weight_gain',
    planName: 'Muscle Mass Gainer',
    description: 'A plan rich in complex carbs and protein, optimized for muscle growth.',
    dailyCalories: 3500,
    meals: {
      breakfast: [
        'Omelet with 3 eggs, mushrooms, onions, and cheddar cheese',
        'Whole grain pancakes with maple syrup',
        '1 orange',
        'Milk smoothie with oats and whey protein'
      ],
      lunch: [
        'Beef stir fry with bell peppers and brown rice',
        'Side of kidney beans',
        'Greek yogurt'
      ],
      dinner: [
        'Grilled pork chops',
        'Mashed potatoes with butter',
        'Green beans',
        'Whole wheat dinner roll'
      ],
      snacks: [
        'Peanut butter sandwich',
        'Trail mix (nuts, dried fruits)',
        'Boiled eggs',
        'Cottage cheese with pineapple'
      ]
    }
  },
  {
    goal: 'weight_loss',
    planName: 'Low-Carb Weight Loss',
    description: 'A low-carb approach to weight loss focusing on satiety and blood sugar control.',
    dailyCalories: 1600,
    meals: {
      breakfast: [
        'Avocado toast (1 slice whole grain, ½ avocado)',
        'Poached egg',
        'Black coffee'
      ],
      lunch: [
        'Tuna salad (lettuce, tuna, olive oil, boiled egg)',
        '1 whole grain cracker'
      ],
      dinner: [
        'Baked cod with herbs',
        'Steamed asparagus',
        'Zucchini noodles with tomato sauce'
      ],
      snacks: [
        'Boiled egg',
        'Celery sticks with almond butter',
        'Greek yogurt with cinnamon'
      ]
    }
  }
];

export default nutritionPlans;
