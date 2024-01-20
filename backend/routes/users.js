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
Get requests for these are handled by react router
router.get('/login');
router.get('/signup'); 
*/

// GET all users
// this function might be useless too but you need it before you use :id
router.get('/', getUsers);

// GET a single user
// the profile page
router.get('/:id', getUser);

// POST a new user
router.post(
  '/signup',
  passport.authenticate('local', {
    successRedirect: '/login',
    failureRedirect: '/signup',
  }),
  createUser
);



// DELETE a user, should you be able to delete users?
router.delete('/:id', deleteUser);

// UPDATE a user
router.patch('/:id', updateUser);

router.get('/logout', (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    res.redirect('/');
  });
});

module.exports = router;
