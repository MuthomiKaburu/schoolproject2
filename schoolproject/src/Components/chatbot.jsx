import React, { useState, useEffect, useRef } from 'react';
import * as tf from '@tensorflow/tfjs';
import * as use from '@tensorflow-models/universal-sentence-encoder';
import { Send, Dumbbell } from 'lucide-react';
import { workoutPlans } from '../data/workoutData';
import { targetTrainingData } from '../data/targetTrainingData';
import { exerciseInstructions } from '../data/exerciseInstructions';
import Navbar from './Navbar';
import './ChatBot.css';

export default function ChatBot() {
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

    // 1. Specific exercise instruction
    const matchedExercise = Object.keys(exerciseInstructions).find(ex =>
      lowerInput.includes(ex.toLowerCase())
    );
    if (matchedExercise) {
      return `Here's how to perform **${matchedExercise}**:\n\n${exerciseInstructions[matchedExercise]}`;
    }

    // 2. Target body part training
    const matchedTarget = targetTrainingData.find(item =>
      lowerInput.includes(item.target.toLowerCase())
    );
    if (matchedTarget) {
      return `To improve your **${matchedTarget.target}**, here's a good set of exercises:\n\n${matchedTarget.exercises.join('\n')}`;
    }

    // 3. Quick workouts (e.g. "I have 15 minutes")
    if (
      lowerInput.includes('15 minutes') ||
      lowerInput.includes('10 minutes') ||
      lowerInput.includes('quick') ||
      lowerInput.includes('short')
    ) {
      return "Here’s a quick full-body routine:\n- 30s Jumping Jacks\n- 30s Push-Ups\n- 30s Squats\n- 30s Mountain Climbers\nRepeat 3x for a quick burn!";
    }

    // 4. General workout plan
    if (
      lowerInput.includes('plan') ||
      lowerInput.includes('recommend') ||
      lowerInput.includes('routine') ||
      lowerInput.includes('workout') ||
      lowerInput.includes('program')
    ) {
      const bestMatch = await findBestMatch(userInput);
      return `Based on your goals, I recommend this ${bestMatch.type} workout plan:\n\n${bestMatch.description}\n\nExercises:\n${bestMatch.exercises.join('\n')}\n\nDuration: ${bestMatch.duration}\nIntensity Level: ${bestMatch.intensity}`;
    }

    // 5. Tips and advice
    if (
      lowerInput.includes('tip') ||
      lowerInput.includes('tips') ||
      lowerInput.includes('advice')
    ) {
      return "💡 Tip: Consistency beats intensity. A 20-minute workout done daily is more effective than an hour once a week!";
    }

    // 6. Weight loss or fat burn
    if (
      lowerInput.includes('lose weight') ||
      lowerInput.includes('weight loss') ||
      lowerInput.includes('burn fat') ||
      lowerInput.includes('fat')
    ) {
      return "To lose weight, combine HIIT workouts, a calorie deficit, and hydration. Would you like a fat-burn routine?";
    }

    // 7. General fallback
    if (
      lowerInput.includes('fitness') ||
      lowerInput.includes('exercise') ||
      lowerInput.includes('healthy') ||
      lowerInput.includes('diet')
    ) {
      return "Do you want tips, a workout plan, or help with a specific body part?";
    }

    return "I'm not sure how to help with that. Try asking things like 'Give me a workout plan', 'How to do push-ups', or 'Tips to lose weight'.";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = { text: input, isBot: false };
    setMessages(prev => [...prev, userMessage]);
    setInput('');

    const botText = await generateBotResponse(input);

    const botMessage = {
      text: botText,
      isBot: true
    };

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
