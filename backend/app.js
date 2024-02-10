require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const userRoutes = require('./routes/users');
const cors = require('cors');
const User = require('./models/userModel');
const path = require('path');
const passport = require('passport');
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;

const mongoDB = process.env.MONGO_URL;
mongoose.set('strictQuery', false);

async function main() {
  try {
    await mongoose.connect(mongoDB);
  } catch (err) {
    console.log(err);
  }
}
main();

const app = express();

const opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = process.env.JWT_SECRET;
passport.use(
  // The payload typically contains the ID of the user
  new JwtStrategy(opts, async (jwt_payload, done) => {
    try {
      const user = await User.findById(jwt_payload.id);
      if (user) {
        return done(null, user);
      }
      return done(null, false);
    } catch (err) {
      return done(err, false);
    }
  })
);

// middleware
app.use(passport.initialize());
app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }));

// routes
app.use('/api/users', userRoutes);

// Serve static files from the public directory
app.use('/public', express.static(path.join(__dirname, 'public')));

// Serve static files from the uploads directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Serve static files from the React app
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../frontend/dist')));

  // The "catchall" handler: for any request that doesn't match one above, send back React's index.html file.
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/dist/index.html'));
  });
}

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
app.listen(PORT, () => console.log(`Server started on port: ${PORT}`));
