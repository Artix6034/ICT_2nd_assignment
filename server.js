import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './config/db.js'; // ✅ correct path
require('dotenv').config();

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());
app.use('/api/auth', authRoutes);

const PORT = process.env.PORT || 5000;

connectDB();

app.get('/', (req, res) => {
  res.send('✅ Trading System Backend Running');
});

app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
