require('dotenv').config();
const express = require('express');
const jwt = require('jsonwebtoken');
const passport = require('passport');
const postRoutes = require('./posts');
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
  // move this to a function, loginUser in userController.js
  passport.authenticate('local', { failWithError: true, session: false }),
  async (req, res, next) => {
    try {
      // Password and username are correct, create a token or get a token if it already exists
      const token = jwt.sign({ id: req.user.id }, process.env.JWT_SECRET, {
        expiresIn: '1h',
      });
      console.log(
        'user that just logged in, in router.post(/login) in users.js right after: const token = jwt.sign({ id: req.user.id }: ',
        req.user
      );
      console.log('token that will be sent to the client that was assigned to the user:  ', token);
      return res.json({ token: token }); // send the token to the client
    } catch (error) {
      next(error);
    }
  }
);

// GET posts on timeline, shows all posts from users the user is following
router.use(
  '/:id/posts',
  passport.authenticate('jwt', { session: false }),
  postRoutes
);

module.exports = router;
