import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import "./db.js"; // <--- important
import { connectDB } from './config/db.js';

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Example API endpoint
app.get("/api/test", (req, res) => {
  res.json({ message: "Backend connected successfully!" });
});

// Example for saving data
app.post("/api/save", (req, res) => {
  const data = req.body;
  console.log("Received data:", data);
  res.json({ success: true, message: "Data saved (in-memory)" });
});

const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
