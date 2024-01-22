require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const userRoutes = require('./routes/users');
const postRoutes = require('./routes/posts');
const methodOverride = require('method-override');
const cors = require('cors');
const session = require('express-session');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User = require('./models/userModel');

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

// bcrypt is for hashing password 
// PassportJS/LocalStrategy checks if username and password exists in the db
passport.use(
  new LocalStrategy(async (username, password, done) => {
    try {
      const user = await User.findOne({ username: username });
      if (!user) {
        return done(null, false, { message: 'Incorrect username' });
      }
      const match = await bcrypt.compare(password, user.password);
      if (!match) {
        return done(null, false, { message: 'Incorrect password' });
      }
      return done(null, user);
    } catch (err) {
      return done(err);
    }
  })
);

//called in the background by passport.authenticate
passport.serializeUser((user, done) => {
  done(null, user.id);
});

//called in the background by passport.authenticate
// it logs out the user
// 
passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err);
  }
});

// express app
const app = express();

// middleware
app.use(express.json());
app.use(cors());
app.use(methodOverride('_method'));
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
  })
);
app.use(passport.initialize());
app.use(passport.session());

app.use((req, res, next) => {
  console.log('Path: ' + req.path + ', Method: ' + req.method);
  next();
});

// routes
// keep users, make posts / 
// this means <Route path="/posts" element={Home} /> in frontend/src/App.js
// <Route path="/" element={<Navigate to="/posts" />} />
app.use('/users', userRoutes);
app.use('/', postRoutes);

app.use((err, req, res, next) => {
  res.status(500).send(`err.stack: ${err.stack}, err.status: ${err.status}`);
});

app.listen(process.env.PORT || 3000, () => {
  console.log('Server listening on port: ', process.env.PORT);
});
