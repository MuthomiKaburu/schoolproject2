import React, { useState } from "react";
import Navbar from "./Navbar";
import "./Recommendation.css";

const Recommendations = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  const handleSend = () => {
    if (input.trim() === "") return;
    setMessages([...messages, { text: input, sender: "user" }]);
    setInput("");
    

    setTimeout(() => {
      setMessages((prevMessages) => [
        ...prevMessages,
        { text: "This is a suggested workout recommendation.", sender: "bot" },
      ]);
    }, 1000);
  };

  return (
    <div className="recommendations">
      <Navbar />
      <div className="chat-container">
        <div className="chat-box">
          {messages.map((msg, index) => (
            <div key={index} className={`chat-message ${msg.sender}`}>
              {msg.text}
            </div>
          ))}
        </div>
        <div className="chat-input">
          <input
            type="text"
            placeholder="Ask for workout recommendations..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <button onClick={handleSend}>Send</button>
        </div>
      </div>
    </div>
  );
};

export default Recommendations;
