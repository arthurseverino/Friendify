require('dotenv').config();
const express = require('express');
const userRoutes = require('./routes/users');
const cors = require('cors');
const path = require('path');
const prisma = require('./config/prisma');
const { passport, initializePassport } = require('./config/passport');

const connectToDatabase = async () => {
  await prisma.$connect();
  console.log('Connected to PostgreSQL');
};

const app = express();

initializePassport();

// middleware
app.use(passport.initialize());
app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }));

// routes
app.use('/api/users', userRoutes);

// Serve static files from the public directory
app.use('/public', express.static(path.join(__dirname, 'public')));

// Serve static files from the React app
app.use(express.static(path.join(__dirname, '../frontend/dist')));

// The "catchall" handler: for any request that doesn't match one above, send back React's index.html file.
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/dist/index.html'));
});

// Error handling
app.use((err, req, res, next) => {
  // Log the error for debugging purposes
  console.error('err.stack: ', err.stack);
  console.error('err.message: ', err.message);

  // Check if err has a status property and use that, otherwise default to 500
  const status = err.status || 500;

  // Respond with the status and the error message
  res.status(status).json({ error: err.message });
});

const PORT = process.env.PORT || 3000;
connectToDatabase()
  .then(() => {
    app.listen(PORT, () => console.log(`Server started on port: ${PORT}`));
  })
  .catch((err) => {
    console.error('Database connection failed:', err);
    process.exit(1);
  });
