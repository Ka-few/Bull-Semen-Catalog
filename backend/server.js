require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const helmet = require('helmet');
const { getDb } = require('./db');

const authRoutes = require('./routes/auth');
const bullsRoutes = require('./routes/bulls');
const vetsRoutes = require('./routes/vets');
const cartRoutes = require('./routes/cart');
const ordersRoutes = require('./routes/orders');
const farmersRoutes = require('./routes/farmers');
const agriSuppliersRoutes = require('./routes/agri_suppliers');
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(morgan('dev'));

// Setup DB
getDb().then(() => {
    console.log('Database initialized successfully.');
}).catch(err => {
    console.error('Failed to initialize database:', err);
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/bulls', bullsRoutes);
app.use('/api/vets', vetsRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', ordersRoutes);
app.use('/api/farmers', farmersRoutes);
app.use('/api/agri-suppliers', agriSuppliersRoutes);
// Global Error Handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something broke!' });
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
