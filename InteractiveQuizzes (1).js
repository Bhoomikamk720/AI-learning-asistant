import React, { useState, useEffect } from "react";
import axios from "axios";
import "./InteractiveQuizzes.css";
import { useNavigate } from "react-router-dom";

const InteractiveQuizzes = () => {
  const navigate = useNavigate();
  const [topic, setTopic] = useState("");
  const [grade, setGrade] = useState("");
  const [difficulty, setDifficulty] = useState("medium");
  const [numQuestions, setNumQuestions] = useState(5);
  const [quiz, setQuiz] = useState([]);
  const [answers, setAnswers] = useState({});
  const [result, setResult] = useState(null);
  const [xp, setXp] = useState(0);
  const [streak, setStreak] = useState(0);

  useEffect(() => {
    const storedXp = localStorage.getItem("xp");
    const storedStreak = localStorage.getItem("streak");
    if (storedXp) setXp(parseInt(storedXp));
    if (storedStreak) setStreak(parseInt(storedStreak));
  }, []);

  const fetchQuiz = async () => {
    try {
      const response = await axios.post("/api/generate-quiz", {
        topic,
        grade,
        difficulty,
        numQuestions,
      });
      setQuiz(response.data.questions);
      setAnswers({});
      setResult(null);
    } catch (error) {
      console.error("Error generating quiz:", error);
    }
  };

  const handleSubmit = async () => {
    try {
      const response = await axios.post("/api/submit-quiz", { quiz, answers });
      setResult(response.data);
      
      const correctAnswers = response.data.correctCount;
      const newXp = xp + correctAnswers * 10;
      const newStreak = correctAnswers === quiz.length ? streak + 1 : 0;
      setXp(newXp);
      setStreak(newStreak);
      localStorage.setItem("xp", newXp);
      localStorage.setItem("streak", newStreak);
    } catch (error) {
      console.error("Error submitting quiz:", error);
    }
  };

  return (
    <div className="quiz-container">
      <h1>🎯 Interactive Quizzes</h1>
      <p>XP: {xp} | Streak: {streak}🔥</p>
      <div className="quiz-settings">
        <input
          type="text"
          placeholder="Quiz Topic"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
        />
        <input
          type="number"
          placeholder="Grade (e.g. 10)"
          value={grade}
          onChange={(e) => setGrade(e.target.value)}
        />
        <select value={difficulty} onChange={(e) => setDifficulty(e.target.value)}>
          <option value="easy">Easy</option>
          <option value="medium">Medium</option>
          <option value="hard">Hard</option>
        </select>
        <input
          type="number"
          placeholder="Number of Questions"
          value={numQuestions}
          onChange={(e) => setNumQuestions(e.target.value)}
        />
        <button onClick={fetchQuiz}>Generate Quiz</button>
      </div>

      {quiz.length > 0 && (
        <div className="quiz-section">
          {quiz.map((q, index) => (
            <div key={index} className="question-box">
              <p>{q.question}</p>
              {q.options.map((option, i) => (
                <label key={i}>
                  <input
                    type="radio"
                    name={`q${index}`}
                    value={option}
                    onChange={() => setAnswers({ ...answers, [index]: option })}
                  />
                  {option}
                </label>
              ))}
            </div>
          ))}
          <button onClick={handleSubmit}>Submit Answers</button>
        </div>
      )}

      {result && (
        <div className="quiz-results">
          <h2>Quiz Results</h2>
          <p>Score: {result.score}/{quiz.length}</p>
          <p>XP Earned: {result.correctCount * 10}</p>
          {result.explanations.map((ex, index) => (
            <div key={index} className="explanation">
              <p><strong>Q{index + 1}:</strong> {ex.question}</p>
              <p><strong>Correct Answer:</strong> {ex.correctAnswer}</p>
              <p><strong>Explanation:</strong> {ex.explanation}</p>
            </div>
          ))}
        </div>
      )}
      {/* Back to Home Button */}
      <button className="back-home-btn" onClick={() => navigate("/HomePage")}>
        ⬅ Back to Home
      </button>
    </div>
  );
};

export default InteractiveQuizzes;
