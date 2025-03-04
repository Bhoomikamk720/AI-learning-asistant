import { Link } from "react-router-dom";
import "./Dashboard.css";
import { useNavigate } from "react-router-dom";

function Dashboard() {
  const navigate = useNavigate();
  return (
    <div className="dashboard">
      <h1>Dashboard</h1>
      <nav>
        <ul>
          <li><Link to="/LearningProcess">📚 Learning Process</Link></li>
          <li><Link to="/CareerRecommendation">🎯 Career Recommendation</Link></li>
        </ul>
      </nav>
      {/* Back to Home Button */}
      <button className="back-home-btn" onClick={() => navigate("/HomePage")}>
        ⬅ Back to Home
      </button>
    </div>
  );
}

export default Dashboard;