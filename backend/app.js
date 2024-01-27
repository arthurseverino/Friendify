require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const userRoutes = require('./routes/users');
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

const app = express();

const opts = {};
//this extracts the JWT from Authorization Header
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = process.env.JWT_SECRET;

passport.use(
  // The payload typically contains the ID of the user
  new JwtStrategy(opts, async (jwt_payload, done) => {
    try {
      console.log('opts in JWTStrategy: ', opts);
      const user = await User.findById(jwt_payload.id);
      console.log('jwt_payload.id in JWTStrategy in app.js: ', jwt_payload.id);
      if (user) {
        console.log('user in JWTStrategy in app.js: ', user);
        return done(null, user);
      }
      console.log(
        'If the JWT is not valid in JWTStrategy, Passport will send a 401 Unauthorized response, this is the user that is not valid: ',
        user
      );
      return done(null, false);
    } catch (err) {
      console.log('try/catch error in JWTStrategy in app.js: ', err);
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
        return done(null, false, {
          error: 'Username does not exist. Please try again.',
        });
      }

      // Check the password
      const validPassword = await bcrypt.compare(password, user.password);

      if (!validPassword) {
        return done(null, false, {
          error: 'Password is not correct. Please try again',
        });
      }

      // User found and password is correct
      return done(null, user);
    } catch (err) {
      return done(err);
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

// sending errors to client...
app.use((err, req, res, next) => {
  res
    .status(500)
    .send(
      `This message is coming from your backend error handler in app.js! Here is your err.stack: ${err.stack}----------------------------- err.status: ${err.status}------------------------------- err.message: ${err.message},----------------------------- err.name: ${err.name} ----------------------------------Enjoy!`
    );
});

app.listen(process.env.PORT || 3001, () => {
  console.log('Server listening on port: ', process.env.PORT);
});
