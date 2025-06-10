import React, { useState, useEffect, useRef } from 'react';
import * as tf from '@tensorflow/tfjs';
import * as use from '@tensorflow-models/universal-sentence-encoder';
import { Send, Dumbbell } from 'lucide-react';
import { workoutPlans } from '../data/workoutData';
import { targetTrainingData } from '../data/targetTrainingData';
import { exerciseInstructions } from '../data/exerciseInstructions';
import weightGainData from '../data/weightGainData';
import weightGainWorkouts from '../data/weightGainWorkout';
import Navbar from './Navbar';
import './Chatbot.css';
import { supabase } from '../supabase';


import  nutritionPlans  from '../data/nutritionPlans';
import  recoveryTips  from '../data/recoveryTips';

import stretchingData from '../data/stretchingData';
import mentalWellnessData from '../data/mentalWellnessData';

export default function ChatBot() {
  const [userName, setUserName] = useState('');
  const [messages, setMessages] = useState([
    { text: "Hi! I'm your AI fitness assistant.How would you like to be assisted?😊", isBot: true },
    { text: "Would you like to focus on improving a specific body part or overall fitness?", isBot: true }
  ]);
  const [input, setInput] = useState('');
  const [model, setModel] = useState(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    loadModel();
  }, []);

  useEffect(() => {
    const fetchName = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data, error } = await supabase
          .from('profiles')
          .select('first_name')
          .eq('id', user.id)
          .single();
        if (!error && data?.first_name) {
          setUserName(data.first_name);
        }
      }
    };
    fetchName();
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const loadModel = async () => {
    try {
      const loadedModel = await use.load();
      setModel(loadedModel);
    } catch (error) {
      console.error('Error loading model:', error);
    }
  };

  const findBestMatch = async (input) => {
    if (!model) return workoutPlans[2];

    const inputEmbedding = await model.embed([input.toLowerCase()]);
    const planDescriptions = workoutPlans.map(plan =>
      `${plan.type.toLowerCase()} ${plan.description.toLowerCase()}`
    );

    const planEmbeddings = await model.embed(planDescriptions);
    const scores = tf.matMul(inputEmbedding, planEmbeddings.transpose());
    const bestMatchIndex = scores.argMax(1).dataSync()[0];

    return workoutPlans[bestMatchIndex];
  };

  const generateBotResponse = async (userInput) => {
    const lowerInput = userInput.toLowerCase();

    if (
      lowerInput.includes('hello') ||
      lowerInput.includes('hi') ||
      lowerInput.includes('hey') ||
      lowerInput.includes('good morning') ||
      lowerInput.includes('good afternoon')
    ) {
      return `Hello${userName ? `, ${userName}` : ''}! 😊 I'm here to help with your fitness goals. How can I assist you today?`;
    }

    const matchedExercise = Object.keys(exerciseInstructions).find(ex =>
      lowerInput.includes(ex.toLowerCase())
    );
    if (matchedExercise) {
      return `Here's how to perform **${matchedExercise}**:\n\n${exerciseInstructions[matchedExercise]}`;
    }

    const matchedTarget = targetTrainingData.find(item =>
      lowerInput.includes(item.target.toLowerCase())
    );
    if (matchedTarget) {
      return `To improve your **${matchedTarget.target}**, here's a good set of exercises:\n\n${matchedTarget.exercises.join('\n')}`;
    }

    if (
      lowerInput.includes('15 minutes') ||
      lowerInput.includes('10 minutes') ||
      lowerInput.includes('quick') ||
      lowerInput.includes('short')
    ) {
      return "Here’s a quick full-body routine:\n- 30s Jumping Jacks\n- 30s Push-Ups\n- 30s Squats\n- 30s Mountain Climbers\nRepeat 3x for a quick burn!";
    }

    else if (
      lowerInput.includes('plan') ||
      lowerInput.includes('recommend') ||
      lowerInput.includes('routine') ||
      lowerInput.includes('workout') ||
      lowerInput.includes('program')
    ) {
      const bestMatch = await findBestMatch(userInput);
      return ` I recommend this ${bestMatch.type} workout plan:\n\n${bestMatch.description}\n\nExercises:\n${bestMatch.exercises.join('\n')}\n\nDuration: ${bestMatch.duration}\nIntensity Level: ${bestMatch.intensity}`;
    }

    else if (
      lowerInput.includes('gain weight') ||
      lowerInput.includes('weight gain') ||
      lowerInput.includes('bulk') ||
      lowerInput.includes('muscle')
    ) {
      const plan = nutritionPlans.find(p => p.goal === 'weight_gain');
      let response = "To gain weight and build muscle, here are some key tips:\n\n";
      response += `💡 **Tips:**\n${weightGainData.tips.slice(0, 5).map(tip => `- ${tip}`).join('\n')}\n\n`;
      response += `🥣 **Sample Breakfast:**\n${weightGainData.mealPlan.breakfast.slice(0, 2).join('\n')}\n\n`;
      response += `💪 **Beginner Workout Plan:**\n${weightGainWorkouts.beginner.exercises.slice(0, 4).join('\n')}\n\n`;
      response += `🍽️ **Meal Plan:**\n**${plan.planName}**\n${plan.description}\n\n**Breakfast:**\n${plan.meals.breakfast.join('\n')}\n\n**Lunch:**\n${plan.meals.lunch.join('\n')}\n\n**Dinner:**\n${plan.meals.dinner.join('\n')}\n\n**Snacks:**\n${plan.meals.snacks.join('\n')}\n\n`;
      response += "Would you like advanced workouts or supplement suggestions?";
      return response;
    }

    else if (lowerInput.includes('advanced workout')) {
      const adv = weightGainWorkouts.advanced;
      return `💪 **${adv.level} Weight Gain Workout**:\n${adv.description}\n\n${adv.exercises.join('\n')}\n\nDuration: ${adv.duration}\nFrequency: ${adv.frequency}`;
    }

    else if (lowerInput.includes('supplement')) {
      return `Here are useful supplements for weight gain:\n\n${weightGainData.supplements.map(s => `- ${s}`).join('\n')}`;
    }

    else if (lowerInput.includes('full meal') || lowerInput.includes('meal plan')) {
      const { breakfast, lunch, dinner, snacks } = weightGainData.mealPlan;
      return `🍽️ **Full Weight Gain Meal Plan**:\n\n**Breakfast:**\n${breakfast.join('\n')}\n\n**Lunch:**\n${lunch.join('\n')}\n\n**Dinner:**\n${dinner.join('\n')}\n\n**Snacks:**\n${snacks.join('\n')}`;
    }

    else if (
      lowerInput.includes('lose weight') ||
      lowerInput.includes('weight loss') ||
      lowerInput.includes('burn fat') ||
      lowerInput.includes('fat')
    ) {
      const plan = nutritionPlans.find(p => p.goal === 'weight_loss');
      return `To lose weight, here’s a recommended meal plan:\n\n**${plan.planName}**\n${plan.description}\n\n**Breakfast:**\n${plan.meals.breakfast.join('\n')}\n\n**Lunch:**\n${plan.meals.lunch.join('\n')}\n\n**Dinner:**\n${plan.meals.dinner.join('\n')}\n\n**Snacks:**\n${plan.meals.snacks.join('\n')}`;
    }

    else if (
      lowerInput.includes('recovery') ||
      lowerInput.includes('tip') ||
      lowerInput.includes('tips') ||
      lowerInput.includes('advice')
    ) {
      const randomTip = recoveryTips[Math.floor(Math.random() * recoveryTips.length)];
      return `💡 **${randomTip.title}**:\n${randomTip.tip}`;
    }

    else if (
      lowerInput.includes('stretch') ||
      lowerInput.includes('flexibility') ||
      lowerInput.includes('warm up')
    ) {
      return `🧘 **Stretching Routine**:\n\n${stretchingData.routines.join('\n')}\n\n📝 Tip: ${stretchingData.tip}`;
    }

    else if (
      lowerInput.includes('mental') ||
      lowerInput.includes('stress') ||
      lowerInput.includes('relax') ||
      lowerInput.includes('anxiety') ||
      lowerInput.includes('mind')
    ) {
      return `🧠 **Mental Wellness Tip:**\n${mentalWellnessData.tips[Math.floor(Math.random() * mentalWellnessData.tips.length)]}`;
    }

    else if (
      lowerInput.includes('fitness') ||
      lowerInput.includes('exercise') ||
      lowerInput.includes('healthy') ||
      lowerInput.includes('diet')
    ) {
      return "Do you want tips, a workout plan, or help with a specific body part?";
    }

    return "I'm not sure how to help with that. Try asking things like 'Give me a workout plan', 'How to do push-ups', or 'Tips to gain weight'.";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = { text: input, isBot: false };
    setMessages(prev => [...prev, userMessage]);
    setInput('');

    const botText = await generateBotResponse(input);
    const botMessage = { text: botText, isBot: true };

    setTimeout(() => {
      setMessages(prev => [...prev, botMessage]);
    }, 1000);
  };

  return (
    <>
      <div className="chatbot-wrapper">
        <Navbar />
        <div className="chatbot-container">
          <div className="chatbot-header">
            <Dumbbell className="chatbot-icon" size={24} />
            <h2 className="chatbot-title">Fitness Assistant</h2>
          </div>

          <div className="chatbot-messages">
            {messages.map((message, index) => (
              <div key={index} className={`chatbot-message ${message.isBot ? 'bot-message' : 'user-message'}`}>
                <div className={`message-bubble ${message.isBot ? 'bot-bubble' : 'user-bubble'}`}>
                  <pre className="message-text">{message.text}</pre>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          <form onSubmit={handleSubmit} className="chatbot-input-form">
            <div className="input-container">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask anything "
                className="chatbot-input"
              />
              <button type="submit" className="chatbot-send-button">
                <Send size={18} />
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
