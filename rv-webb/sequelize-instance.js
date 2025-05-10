import dotenv from 'dotenv';
dotenv.config();

import { Sequelize } from 'sequelize';

const databaseUrl = process.env.DATABASE_DEV;

if (!databaseUrl) {
  throw new Error("DATABASE_DEV environment variable is not defined.");
}

const sequelize = new Sequelize(databaseUrl, {
  dialect: 'postgres',
  logging: false,
});

export default sequelize;