const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const server = require('http').createServer(app);

mongoose.connect('mongodb://localhost:27017/advance-salary-db')
.then(() => console.log('MongoDB connected'))
.catch((error) => console.log('Error connecting to MongoDB:', error));

app.use(express.json());
app.use(cors());

// Import routes
const adminRoutes = require('./routes/admin');
const userRoutes = require('./routes/user');

app.use('/api/admin', adminRoutes);
app.use('/api/user', userRoutes);


server.listen(5000, () => {
  console.log('Server running on port 5000');
});
