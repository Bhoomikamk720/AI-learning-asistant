import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import "./ChatTutor.css";
import { useNavigate } from "react-router-dom";

const ChatTutor = () => {
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [mode, setMode] = useState("study"); // 'study' or 'fun'
  const [badges, setBadges] = useState([]);
  const recognitionRef = useRef(null);
  const synth = window.speechSynthesis;

  useEffect(() => {
    if (!("webkitSpeechRecognition" in window)) return;
    recognitionRef.current = new window.webkitSpeechRecognition();
    recognitionRef.current.continuous = false;
    recognitionRef.current.interimResults = false;
    recognitionRef.current.lang = "en-US";

    recognitionRef.current.onresult = (event) => {
      setInput(event.results[0][0].transcript);
    };
  }, []);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const newMessages = [...messages, { sender: "user", text: input }];
    setMessages(newMessages);
    setInput("");

    try {
      const response = await axios.post("/api/chatbot", {
        message: input,
        mode,
        conversationHistory: newMessages,
      });

      const botReply = response.data.reply;
      setMessages([...newMessages, { sender: "bot", text: botReply }]);
      handleTextToSpeech(botReply);

      checkForBadges(); // Check if user earns rewards
    } catch (error) {
      console.error("Error fetching chatbot response", error);
    }
  };

  const handleTextToSpeech = (text) => {
    const utterance = new SpeechSynthesisUtterance(text);
    synth.speak(utterance);
  };

  const startListening = () => {
    if (recognitionRef.current) recognitionRef.current.start();
  };

  const checkForBadges = () => {
    if (messages.length === 5 && !badges.includes("Quick Learner")) {
      setBadges([...badges, "Quick Learner"]);
    }
    if (messages.length === 10 && !badges.includes("Consistent Student")) {
      setBadges([...badges, "Consistent Student"]);
    }
  };

  return (
    <div className="chat-tutor-container">
      <h2>Chat Tutor ({mode === "study" ? "Study Mode" : "Fun Mode"})</h2>
      <button className="mode-switch" onClick={() => setMode(mode === "study" ? "fun" : "study")}>
        Switch to {mode === "study" ? "Fun Mode" : "Study Mode"}
      </button>
      <div className="chat-box">
        {messages.map((msg, index) => (
          <div key={index} className={msg.sender === "user" ? "user-msg" : "bot-msg"}>
            <strong>{msg.sender === "user" ? "You: " : "Tutor: "}</strong>
            {msg.text}
          </div>
        ))}
      </div>
      <div className="input-container">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your message..."
        />
        <button className="send-btn" onClick={sendMessage}>Send</button>
        <button className="voice-btn" onClick={startListening}>🎤 Speak</button>
      </div>
      <h3>Your Badges: <span className="badges">{badges.join(", ") || "None yet"}</span></h3>
      {/* Back to Home Button */}
      <button className="back-home-btn" onClick={() => navigate("/HomePage")}>
        ⬅ Back to Home
      </button>
    </div>
  );
};

export default ChatTutor;
