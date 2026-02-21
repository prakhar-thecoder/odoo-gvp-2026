const app = require('../src/app');
const connectDB = require('../src/config/db');

// Connect to Database internally before handling requests 
connectDB();

module.exports = app;
