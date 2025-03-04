import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./HomePage.css";

function HomePage() {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token"); // Check if token exists
    if (!token) {
        navigate("/AuthPage"); // Redirect to login if not authenticated
    }
}, [navigate]);


  const handleLogout = () => {
    localStorage.removeItem("isAuthenticated");
    navigate("/AuthPage");
  };

  return (
    <div className="homepage">
      {/* Navigation Bar */}
      <nav className="navbar">
        <h1>AI Learning Assistant</h1>
        <ul>
          <li onClick={() => navigate("/HomePage")}>Home</li>
          <li onClick={() => navigate("/Dashboard")}>Dashboard</li>
          <li onClick={() => navigate("/ChatTutor")}>Chat Tutor</li>
          <li onClick={() => navigate("/InteractiveQuizzes")}>Interactive Quizzes</li>
        </ul>
        <button onClick={handleLogout} className="logout-btn">Logout</button>
      </nav>

      {/* Main Content */}
      <div className="content">
      <h2>Welcome to AI-Based Tutor – Your Personalized Learning Assistant! 🚀</h2>
      <p>AI-Based Tutor is an intelligent adaptive learning platform designed to help students improve their study habits, 
      take AI-generated quizzes, receive career guidance, and interact with an AI tutor for doubt clarification.</p>
      <p>With features like an AI-powered chat tutor, interactive quizzes with explanations, and personalized study plans,
      students can enhance their learning experience. The platform also offers career recommendations and gamification elements like XP points 
      and streak tracking to keep students motivated. 🚀</p>
      <h3>🎯 Boost your learning experience with AI! Start exploring today!</h3>
      </div>
    </div>
  );
}

export default HomePage;