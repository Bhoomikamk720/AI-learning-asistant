import { useState } from "react";
import axios from "axios";
import "./CareerRecommendation.css";
import { useNavigate } from "react-router-dom";

function CareerRecommendation() {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [response, setResponse] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await axios.post("http://localhost:5000/api/career-recommendation", { query });
    setResponse(res.data.reply);
  };

  return (
    <div className="career-container">
      <h1>🎯 Career Recommendation</h1>
      <form onSubmit={handleSubmit}>
        <input type="text" placeholder="Ask career advice..." value={query} onChange={(e) => setQuery(e.target.value)} required />
        <button type="submit">Ask AI</button>
      </form>
      <div className="output">
        <h2>💡 AI's Response</h2>
        <p>{response}</p>
      </div>
      {/* Back to Home Button */}
      <button className="back-home-btn" onClick={() => navigate("/HomePage")}>
        ⬅ Back to Home
      </button>
    </div>
  );
}

export default CareerRecommendation;
