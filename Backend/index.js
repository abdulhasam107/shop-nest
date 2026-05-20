import express from 'express';
import cors from 'cors';
import path  from'path';
import { fileURLToPath } from 'url';

import connectDB from './config/db.js';
import dotenv from "dotenv";
import authRoutes from './routes/authRoutes.js';
import productRoutes from './routes/productRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
// import paymentRoutes from './routes/paymentRoutes.js';
import analyticsRoutes from './routes/analyticsRoutes.js';


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config();
connectDB();
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());


app.get('/api', (req, res) => {    
    res.send('Hello World!');
});

app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
// app.use('/api/payment', paymentRoutes);
app.use('/api/analytics', analyticsRoutes);

// Serve frontend build folder
app.use(
  express.static(
    path.join(__dirname, '../frontend/build')
  )
);

// Handle React routing
app.use((req, res) => {
  res.sendFile(
    path.join(__dirname, '../frontend/build/index.html')
  );
});



const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});
 