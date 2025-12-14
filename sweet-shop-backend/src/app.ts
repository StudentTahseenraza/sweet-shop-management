import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import * as dotenv from 'dotenv';
import routes from './routes';
import { notFound, errorHandler } from './middleware/error.middleware';

dotenv.config();

const app = express();

app.use(helmet());
app.use(cors({
   origin: [
    'https://sweet-shop-management-iota.vercel.app', // Your Vercel frontend
    'http://localhost:3000', // Local development
    'http://localhost:5173' // Vite default
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
}));

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined'));
}

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/health', (_, res) => {
  res.status(200).json({
    success: true,
    message: 'Sweet Shop API is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
  });
});

app.use('/api', routes);

app.use(notFound);
app.use(errorHandler);

export default app;