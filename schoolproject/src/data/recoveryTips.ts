export interface RecoveryTip {
  category: 'muscle_recovery' | 'sleep' | 'hydration' | 'mental_health';
  title: string;
  tip: string;
}

const recoveryTips: RecoveryTip[] = [
  {
    category: 'muscle_recovery',
    title: 'Prioritize Protein Intake',
    tip: 'Consume high-quality protein within 30-60 minutes post-workout to enhance muscle repair.'
  },
  {
    category: 'muscle_recovery',
    title: 'Use Active Recovery Days',
    tip: 'Incorporate light cardio or yoga on rest days to increase blood flow and reduce stiffness.'
  },
  {
    category: 'muscle_recovery',
    title: 'Foam Rolling',
    tip: 'Use a foam roller to target sore muscles and release tension after intense workouts.'
  },
  {
    category: 'sleep',
    title: 'Stick to a Consistent Sleep Schedule',
    tip: 'Go to bed and wake up at the same time daily to regulate your circadian rhythm.'
  },
  {
    category: 'sleep',
    title: 'Limit Screen Time Before Bed',
    tip: 'Reduce blue light exposure at least 1 hour before sleep to improve melatonin production.'
  },
  {
    category: 'sleep',
    title: 'Create a Cool, Dark Environment',
    tip: 'Keep your bedroom dark, quiet, and cool for optimal deep sleep and recovery.'
  },
  {
    category: 'hydration',
    title: 'Hydrate Before, During, and After Exercise',
    tip: 'Drink water consistently to maintain performance and accelerate recovery.'
  },
  {
    category: 'hydration',
    title: 'Use Electrolytes for Intense Workouts',
    tip: 'Replenish sodium, potassium, and magnesium through drinks or supplements post-sweat.'
  },
  {
    category: 'hydration',
    title: 'Check Urine Color',
    tip: 'Aim for light yellow urine as a simple indicator of proper hydration.'
  },
  {
    category: 'mental_health',
    title: 'Practice Mindfulness and Deep Breathing',
    tip: 'Use breathing techniques to reduce stress and improve recovery hormone balance.'
  },
  {
    category: 'mental_health',
    title: 'Journal Your Progress',
    tip: 'Writing about your workouts and emotions helps manage stress and improves focus.'
  },
  {
    category: 'mental_health',
    title: 'Take Digital Detoxes',
    tip: 'Break from screens regularly to reduce mental fatigue and promote emotional wellness.'
  }
];

export default recoveryTips;
