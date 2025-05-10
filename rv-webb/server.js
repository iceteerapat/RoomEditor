import express from 'express';
import cors from 'cors';
import route from './src/routes/apis.js';
import sequelize from './sequelize-instance.js';

const app = express();

sequelize.authenticate()
  .then(() => console.log('Sequelize connection successful!'))
  .catch((err) => console.error('Sequelize connection error:', err));

app.use(cors({
  origin: process.env.FRONTEND_DEV,
  credentials: true
}));

app.use(express.json());
app.use('/api', route);

const PORT = process.env.PORT_DEV || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});