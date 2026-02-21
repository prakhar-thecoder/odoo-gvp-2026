const express = require('express');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', require('./modules/auth/auth.routes'));
app.use('/api/vehicles', require('./modules/vehicles/vehicles.routes'));
app.use('/api/trips', require('./modules/trips/trips.routes'));
app.use('/api/maintenance', require('./modules/maintenance/maintenance.routes'));
app.use('/api/dashboard', require('./modules/dashboard/dashboard.routes'));

// Basic error handling
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Internal Server Error' });
});

module.exports = app;
