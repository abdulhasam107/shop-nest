import express from 'express';
import cors from 'cors';
import connectDB from './config/db.js';
import dotenv from "dotenv";
import authRoutes from './routes/authRoutes.js';
import productRoutes from './routes/productRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
// import paymentRoutes from './routes/paymentRoutes.js';
import analyticsRoutes from './routes/analyticsRoutes.js';

dotenv.config();

connectDB();
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors());


app.get('/', (req, res) => {    
    res.send('Hello World!');
});

app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
// app.use('/api/payment', paymentRoutes);
app.use('/api/analytics', analyticsRoutes);



const PORT = process.env.PORT || 3000;  
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
 