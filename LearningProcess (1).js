import { useState } from "react";
import axios from "axios";
import "./LearningProcess.css";
import { useNavigate } from "react-router-dom";

function LearningProcess() {
  const navigate = useNavigate();
  const [subject, setSubject] = useState("");
  const [chapters, setChapters] = useState("");
  const [deadline, setDeadline] = useState("");
  const [marks, setMarks] = useState("");
  const [studyHours, setStudyHours] = useState("");
  const [response, setResponse] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await axios.post("http://localhost:5000/api/learning-process", {
      subject, chapters, deadline, marks, studyHours
    });
    setResponse(res.data.reply);
  };

  return (
    <div className="learning-container">
      <h1>📚 Learning Process</h1>
      <form onSubmit={handleSubmit}>
        <input type="text" placeholder="Enter Subject" value={subject} onChange={(e) => setSubject(e.target.value)} required />
        <input type="text" placeholder="Enter Chapters (comma-separated)" value={chapters} onChange={(e) => setChapters(e.target.value)} required />
        <input type="text" placeholder="Study Deadline (e.g., 2 weeks)" value={deadline} onChange={(e) => setDeadline(e.target.value)} required />
        <input type="number" placeholder="Previous Marks (%)" value={marks} onChange={(e) => setMarks(e.target.value)} required />
        <input type="text" placeholder="Study Hours per Day/Week" value={studyHours} onChange={(e) => setStudyHours(e.target.value)} required />
        <button type="submit">Generate Study Plan</button>
      </form>
      <div className="output">
        <h2>📖 AI Generated Roadmap</h2>
        <p>{response}</p>
      </div>
      {/* Back to Home Button */}
      <button className="back-home-btn" onClick={() => navigate("/HomePage")}>
        ⬅ Back to Home
      </button>
    </div>
  );
}

export default LearningProcess;
