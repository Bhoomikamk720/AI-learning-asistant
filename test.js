require('dotenv').config();  // Ensure dotenv is configured at the top

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const axios = require("axios");

const app = express();
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/AI_Tutor";  // Fallback to default Mongo URI if not set
const SECRET_KEY = process.env.JWT_SECRET || "default-secret-key";  // Fallback JWT Secret if not set
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;  // Make sure to have the OpenAI API Key set

// Log environment variables for debugging (Do not log secrets in production!)
console.log("Mongo URI:", MONGO_URI); 
console.log("JWT Secret:", SECRET_KEY); 
console.log("OpenAI API Key Loaded:", OPENAI_API_KEY ? 'Loaded' : 'Not Loaded');

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log("✅ Connected to MongoDB"))
    .catch(err => {
        console.error("❌ MongoDB connection error:", err);
        process.exit(1);  // Exit if MongoDB connection fails
    });

// Define User Schema
const UserSchema = new mongoose.Schema({
    username: String,
    email: { type: String, unique: true },
    password: String,
});

const User = mongoose.model("User", UserSchema);

// Signup Route
app.post("/signup", async (req, res) => {
    const { username, email, password } = req.body;
    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) return res.status(400).json({ message: "Email already registered." });

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ username, email, password: hashedPassword });
        await newUser.save();

        res.json({ message: "User registered successfully!" });
    } catch (error) {
        res.status(500).json({ message: "Error signing up" });
    }
});

// Login Route
app.post("/signin", async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ message: "User not found" });

        const isValid = await bcrypt.compare(password, user.password);
        if (!isValid) return res.status(400).json({ message: "Invalid credentials" });

        const token = jwt.sign({ userId: user._id }, SECRET_KEY, { expiresIn: "1h" });

        res.json({ message: "Login successful", token });
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
});

// OpenAI Chatbot Route
app.post("/api/chatbot", async (req, res) => {
    const { message } = req.body;
    try {
        const response = await axios.post(
            "https://api.openai.com/v1/chat/completions",
            {
                model: "gpt-4",
                messages: [{ role: "user", content: message }],
            },
            {
                headers: {
                    "Authorization": `Bearer ${OPENAI_API_KEY}`,
                    "Content-Type": "application/json",
                },
            }
        );
        res.json({ reply: response.data.choices[0].message.content });
    } catch (error) {
        console.error("Error from OpenAI:", error);
        res.status(500).json({ reply: "Error fetching AI response" });
    }
});

// Generate AI-Based Quiz
app.post("/api/generate-quiz", async (req, res) => {
    const { topic, grade, difficulty, numQuestions } = req.body;

    try {
        const response = await axios.post("https://api.openai.com/v1/chat/completions", {
            model: "gpt-4",
            messages: [{ role: "system", content: `Generate a ${difficulty} quiz on ${topic} for grade ${grade} with ${numQuestions} questions.` }],
        }, { headers: { "Authorization": `Bearer ${OPENAI_API_KEY}` } });

        res.json({ questions: response.data.choices[0].message.content });
    } catch (error) {
        console.error("Error generating quiz:", error);
        res.status(500).json({ error: "Failed to generate quiz" });
    }
});

// Submit Quiz and Get AI Explanations
app.post("/api/submit-quiz", async (req, res) => {
    const { quiz, answers } = req.body;

    try {
        const response = await axios.post("https://api.openai.com/v1/chat/completions", {
            model: "gpt-4",
            messages: [
                { role: "system", content: "You are an AI tutor that evaluates quiz answers." },
                { role: "user", content: `Here is a quiz: ${JSON.stringify(quiz)}.\nThe student answered: ${JSON.stringify(answers)}.\nCompare the answers and return:\n- The number of correct answers.\n- The correct answers for wrong ones.\n- Explanations for wrong answers.` }
            ],
        }, { headers: { "Authorization": `Bearer ${OPENAI_API_KEY}` } });

        res.json(JSON.parse(response.data.choices[0].message.content));
    } catch (error) {
        console.error("Error evaluating quiz:", error);
        res.status(500).json({ error: "Failed to evaluate quiz" });
    }
});

// Learning Process AI Assistance
app.post("/api/learning-process", async (req, res) => {
    const { subject, chapters, deadline, marks, studyHours } = req.body;
    try {
        const response = await axios.post("https://api.openai.com/v1/chat/completions", {
            model: "gpt-4",
            messages: [{ role: "system", content: `Create a study plan for ${subject} covering chapters: ${chapters} within ${deadline}. Previous marks: ${marks}%. Study time available: ${studyHours}.` }],
        }, { headers: { "Authorization": `Bearer ${OPENAI_API_KEY}` } });
        res.json({ reply: response.data.choices[0].message.content });
    } catch (error) {
        console.error("Error generating study plan:", error);
        res.status(500).json({ reply: "Error generating study plan" });
    }
});

// Career Recommendation AI Assistance
app.post("/api/career-recommendation", async (req, res) => {
    const { query } = req.body;
    try {
        const response = await axios.post("https://api.openai.com/v1/chat/completions", {
            model: "gpt-4",
            messages: [{ role: "user", content: query }],
        }, { headers: { "Authorization": `Bearer ${OPENAI_API_KEY}` } });
        res.json({ reply: response.data.choices[0].message.content });
    } catch (error) {
        console.error("Error fetching career advice:", error);
        res.status(500).json({ reply: "Error fetching career advice" });
    }
});

// Start Server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
