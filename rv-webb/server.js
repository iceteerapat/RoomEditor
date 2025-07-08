import express from 'express';
import cors from 'cors';
import route from './src/routes/apis.js';
import sequelize from './sequelize-instance.js';
import path from 'path';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { handleWebhook } from './src/controllers/StripeController.js';

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// if (process.env.NODE_ENV === 'production') {
//   dotenv.config({ path: path.resolve(__dirname, '../.env.production') });
// } else {
//   dotenv.config({ path: path.resolve(__dirname, '../.env') });
// }

sequelize.authenticate()
  .then(() => console.log('Sequelize connection successful!'))
  .catch((err) => console.error('Sequelize connection error:', err));

app.use(cors({
  origin: process.env.BASE_URL,
  credentials: true
}));

app.use(express.static(path.join(__dirname, '../rv-webf/dist')));
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../rv-webf/dist/index.html'));
});

app.post('/webhook', express.raw({ type: 'application/json' }), handleWebhook);
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use('/api', route);

const PORT_URL = process.env.PORT_URL || 3000;
app.listen(PORT_URL, () => {
  console.log(`🚀 Server running at ${PORT_URL}`);
});