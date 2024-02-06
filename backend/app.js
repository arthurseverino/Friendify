require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const userRoutes = require('./routes/users');
const cors = require('cors');
const passport = require('passport');
const User = require('./models/userModel');
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
// app.use(express.static(path.join(__dirname, 'public')));

// routes
app.use('/api/users', userRoutes);

// Error handling
app.use((err, req, res, next) => {
  // Log the error for debugging purposes
  console.error('err.stack: ', err.stack);
  console.error('err.message: ', err.message);
  console.error('err.status: ', err.status);

  // Check if err has a status property and use that, otherwise default to 500
  const status = err.status || 500;

  // Respond with the status and the error message
  res.status(status).json({ error: err.message });
});
app.listen(process.env.PORT || 3000, () => {
  console.log('Server listening on port: ', process.env.PORT);
});
