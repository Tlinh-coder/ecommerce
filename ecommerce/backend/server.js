const express = require('express');
const cors = require('cors');
require('dotenv').config();
const connectDB = require('./config/database');
const productRoutes = require('./routes/productRoutes');
const app = express();
const categoryRoutes = require('./routes/categoryRoutes');
const authRoutes = require('./routes/authRoutes');
const carRoutes = require('./routes/cartRoutes');
const orderRoutes = require('./routes/orderRoutes');
const userRoutes = require('./routes/userRoutes'); 

connectDB();
app.use(cors());
app.use(express.json());
app.use('/api/products', productRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/cart', carRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes); 
app.get('/', (req, res) => {
    console.log("Ecommerce API is running");
    res.json({
        message: "Ecommerce API is running"
    });
});
const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});