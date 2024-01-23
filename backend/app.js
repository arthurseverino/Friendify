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

// express app
const app = express();

// middleware
app.use(express.json());
app.use(cors());
app.use(methodOverride('_method'));
app.use(passport.initialize());
app.use(passport.session());
// app.use(express.static(path.join(__dirname, '../frontend')));

// routes
app.use('/api/users', userRoutes);
app.use('/api/posts', postRoutes);

app.use((err, req, res, next) => {
  res.status(500).send(`err.stack dummy: ${err.stack}, err.status: ${err.status}`);
});

app.listen(process.env.PORT || 3001, () => {
  console.log('Server listening on port: ', process.env.PORT);
});
