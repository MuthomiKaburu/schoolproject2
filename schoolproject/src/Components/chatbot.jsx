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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = { text: input, isBot: false };
    setMessages(prev => [...prev, userMessage]);
    setInput('');

    const lowerInput = input.toLowerCase();

    // 1. Check for exercise instruction match
    const matchedExercise = Object.keys(exerciseInstructions).find(ex =>
      lowerInput.includes(ex.toLowerCase())
    );

    if (matchedExercise) {
      const response = {
        text: `Here's how to perform **${matchedExercise}**:\n\n${exerciseInstructions[matchedExercise]}`,
        isBot: true
      };
      setTimeout(() => {
        setMessages(prev => [...prev, response]);
      }, 1000);
      return;
    }

    // 2. Check for target training match
    const matchedTarget = targetTrainingData.find(item =>
      lowerInput.includes(item.target.toLowerCase())
    );

    if (matchedTarget) {
      const response = {
        text: `To improve your **${matchedTarget.target}**, here's a good set of exercises:\n\n${matchedTarget.exercises.join('\n')}`,
        isBot: true
      };
      setTimeout(() => {
        setMessages(prev => [...prev, response]);
      }, 1000);
      return;
    }

    // 3. Otherwise, match workout plan
    const bestMatch = await findBestMatch(input);
    const response = {
      text: `Based on your goals, I recommend this ${bestMatch.type} workout plan:\n\n` +
        `${bestMatch.description}\n\n` +
        `Exercises:\n${bestMatch.exercises.join('\n')}\n\n` +
        `Duration: ${bestMatch.duration}\n` +
        `Intensity Level: ${bestMatch.intensity}`,
      isBot: true
    };

    setTimeout(() => {
      setMessages(prev => [...prev, response]);
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
