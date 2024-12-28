require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Import routes
const taskRoutes = require('./routes/tasks');
const authRoutes = require('./routes/auth');

// Gunakan router
app.use('/tasks', taskRoutes);
app.use('/auth', authRoutes);

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
