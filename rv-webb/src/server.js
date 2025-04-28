import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();


app.use(cors({
  origin: process.env.FRONTEND_DEV,
  credentials: true
}));

app.use(express.json());

const PORT = process.env.PORT_DEV || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});