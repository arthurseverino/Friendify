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

// GET all users
router.get('/', getUsers);

// GET a single user
// the profile page
router.get('/:id', getUser);

// POST a new user
router.post('/', createUser);

// DELETE a user, should you be able to delete users?
router.delete('/:id', deleteUser);

// UPDATE a user
router.patch('/:id', updateUser);

// Get requests for these are handled by react router
/* router.get('/login');
router.get('/signup'); */

router.post(
  '/login',
  passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login',
  })
);

router.post(
  '/signup',
  passport.authenticate('local', {
    successRedirect: '/login',
    failureRedirect: '/signup',
  })
);

router.get('/logout', (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    res.redirect('/');
  });
});

module.exports = router;
