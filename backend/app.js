require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const userRoutes = require('./routes/users');
const postRoutes = require('./routes/posts');
const methodOverride = require('method-override');
const cors = require('cors');
const passport = require('passport');
const bcrypt = require('bcryptjs');
const User = require('./models/userModel');
const JwtStrategy = require('passport-jwt').Strategy;
const LocalStrategy = require('passport-local').Strategy;
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

const opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = process.env.JWT_SECRET;

passport.use(
  new JwtStrategy(opts, async (jwt_payload, done) => {
    try {
      const user = await User.findById(jwt_payload.id);
      if (user) {
        return done(null, user);
      } else {
        return done(null, false);
      }
    } catch (err) {
      return done(err, false);
    }
  })
);

passport.use(
  'local',
  new LocalStrategy(async (username, password, done) => {
    try {
      // Find the user by username
      const user = await User.findOne({ username });

      if (!user) {
        return done(null, false, { message: 'Invalid username or password.' });
      }

      // Check the password
      const validPassword = await bcrypt.compare(password, user.password);

      if (!validPassword) {
        return done(null, false, { message: 'Invalid username or password.' });
      }

      // User found and password is correct
      return done(null, user);
    } catch (err) {
      return done(err);
    }
  })
);

// express app
const app = express();

// middleware
app.use(express.json());
app.use(cors());
app.use(methodOverride('_method'));
app.use(passport.initialize());
// app.use(express.static(path.join(__dirname, '../frontend')));

// routes
app.use('/api/users', userRoutes);
app.use('/api/posts', postRoutes);

app.use((err, req, res, next) => {
  res
    .status(500)
    .send(
      `Here is your err.stack dummy: ${err.stack}, AND your err.status: ${err.status}`
    );
});

app.listen(process.env.PORT || 3001, () => {
  console.log('Server listening on port: ', process.env.PORT);
});
