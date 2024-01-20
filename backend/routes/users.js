const express = require('express');
const jwt = require('jsonwebtoken');
const passport = require('passport');
const {
  getUsers,
  getUser,
  createUser,
  deleteUser,
  updateUser,
} = require('../controllers/userController');

const router = express.Router();

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

// api/users/login
router.get('/login', (req, res) => {
  res.send('login not implemented yet' + req.path);
});
// This directly below and above should be react router links as they are not RESTful API routes
router.get('/signup', (req, res) => {
  res.send('signup not implemented yet' + req.path);
});

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
