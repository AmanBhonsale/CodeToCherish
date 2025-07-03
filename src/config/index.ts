import dotenv from 'dotenv';

dotenv.config();

const config = {
  port: process.env.PORT || 3001,
  jwtSecret: process.env.JWT_SECRET || 'your-very-strong-secret-key',
  // Add other environment variables here
  // e.g., databaseUrl: process.env.DATABASE_URL
};

export default config;
