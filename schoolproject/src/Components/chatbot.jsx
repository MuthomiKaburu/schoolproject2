import React, { useState, useEffect, useRef } from 'react';
import * as tf from '@tensorflow/tfjs';
import * as use from '@tensorflow-models/universal-sentence-encoder';
import { Send, Dumbbell } from 'lucide-react';
import { workoutPlans } from '../data/workoutData';


export default function ChatBot() {
  const [messages, setMessages] = useState([
    { text: "Hi! I'm your AI fitness assistant. Tell me your fitness goals!", isBot: true }
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
    if (!model) return workoutPlans[2]; // Default to general fitness if model not loaded

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
    <div>
      <div className="flex flex-col h-[600px] w-full max-w-2xl mx-auto bg-white rounded-lg shadow-xl overflow-hidden">
      <div className="bg-blue-600 p-4 flex items-center gap-2">
        <Dumbbell className="text-white" size={24} />
        <h2 className="text-xl font-bold text-white">Fitness Assistant</h2>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message, index) => (
          <div
            key={index}
            className={flex `${message.isBot ? 'justify-start' : 'justify-end'}`}
          >
            <div
              className={`max-w-[80%] p-3 rounded-lg ${
                message.isBot
                  ? 'bg-gray-100 text-gray-800'
                  : 'bg-blue-600 text-white'
              }`}
            >
              <pre className="whitespace-pre-wrap font-sans">{message.text}</pre>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSubmit} className="p-4 border-t">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Tell me your fitness goals..."
            className="flex-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            className="bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Send size={20} />
          </button>
        </div>
      </form>
    </div>

    </div>
    
  );
}