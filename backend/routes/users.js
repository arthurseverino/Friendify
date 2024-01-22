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

/* 

passport.authenticate('local', {
  successRedirect: '/login',
  failureRedirect: '/signup',
}),

*/

// GET all users, a list of all users
router.get('/', getUsers);

// GET a single user, the profile page
router.get('/:id', getUser);

// DELETE a user, you can delete a user from its profile page
router.delete('/:id', deleteUser);

// UPDATE a user, you can update a user from its profile page
router.patch('/:id', updateUser);

// CREATE a new user, you can create a new user from the signup page
router.post('/signup', createUser);

// LOGIN a user, handle login form submission
router.post(
  '/login',
  passport.authenticate('local', {
    successRedirect: `http://localhost:${process.env.PORT}/posts`,
    failureRedirect: '/login',
  })
);

// LOGOUT a user, handle logout
router.get('/logout', (req, res, next) => {
  req.logout();
  res.redirect('/');
});

module.exports = router;
