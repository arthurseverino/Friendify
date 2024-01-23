require('dotenv').config();
const express = require('express');
const jwt = require('jsonwebtoken');
const passport = require('passport');
const verifyToken = require('../authMiddleware');
const router = express.Router();
const {
  getUsers,
  getUser,
  createUser,
  deleteUser,
  updateUser,
} = require('../controllers/userController');

// GET all users, a list of all users
// shows all users and buttons for sending follow requests to users the user is not already following or have a pending request.
router.get('/', verifyToken, getUsers);

// GET a single user, the profile page
router.get('/:id', verifyToken, getUser);

// DELETE a user, you can delete a user from its profile page
router.delete('/:id', verifyToken, deleteUser);

// UPDATE a user, you can update a user from its profile page
router.patch('/:id', verifyToken, updateUser);

// CREATE a new user, you can create a new user from the signup page
router.post('/signup', createUser);

// LOGIN a user, handle login form submission
router.post('/login', (req, res, next) => {
  passport.authenticate('local', (err, user, info) => {
    if (err) {
      return res.status(500).json({ error: 'Internal Server Error' });
    }
    if (!user) {
      return res.status(401).json({ error: info.message });
    }
    //Password is correct, create and assign a token
    req.logIn(user, (err) => {
      if (err) {
        return res.status(500).json({ error: 'Internal Server Error' });
      }
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
        expiresIn: '5m',
      });
      return res.json({ token: token }); // send the token to the client
    });
  })(req, res, next);
});

// LOGOUT a user, handle logout
router.get('/logout', verifyToken, (req, res, next) => {
  req.logout();
  localStorage.removeItem('token');
  res.redirect('/');
});

module.exports = router;
