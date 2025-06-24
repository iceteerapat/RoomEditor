import express from 'express';
import cors from 'cors';
import route from './src/routes/apis.js';
import sequelize from './sequelize-instance.js';
import { handleWebhook } from './src/controllers/StripeController.js';

const app = express();

sequelize.authenticate()
  .then(() => console.log('Sequelize connection successful!'))
  .catch((err) => console.error('Sequelize connection error:', err));

app.use(cors({
  origin: process.env.FRONTEND_DEV,
  credentials: true
}));

app.post('/webhook', express.raw({ type: 'application/json' }), handleWebhook);
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use('/api', route);

const PORT = process.env.PORT_DEV || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});