require('dotenv').config();
const express = require('express');
const jwt = require('jsonwebtoken');
const passport = require('passport');
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
router.get('/', passport.authenticate('jwt', { session: false }), getUsers);

// GET a single user, the profile page
router.get('/:id', passport.authenticate('jwt', { session: false }), getUser);

// DELETE a user, you can delete a user from its profile page
router.delete(
  '/:id',
  passport.authenticate('jwt', { session: false }),
  deleteUser
);

// UPDATE a user, you can update a user from its profile page
router.patch(
  '/:id',
  passport.authenticate('jwt', { session: false }),
  updateUser
);

// CREATE a new user, you can create a new user from the signup page
router.post('/signup', createUser);

// LOGIN a user, handle login form submission
router.post(
  '/login',
  passport.authenticate('local', { failWithError: true, session: false}),
  async (req, res, next) => {
    //Password is correct, create and assign a token
    const token = jwt.sign({ id: req.user.id }, process.env.JWT_SECRET, {
      expiresIn: '5m',
    });
    return res.json({ token: token }); // send the token to the client
  },
  (error, req, res, next) => {
    // Handle error
    return res.status(500).json({ error: error.toString() });
  }
);

module.exports = router;
