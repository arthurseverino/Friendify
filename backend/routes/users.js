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

router.get('/login');

<Route path="/api/users/signup" element={<SignupForm />} />
<Route path="/api/users/login" element={<LoginForm />} />

passport.authenticate('local', {
  successRedirect: '/login',
  failureRedirect: '/signup',
}),
*/

// GET all users, a list of all users
router.get('/', getUsers);

// GET a single user, the profile page
router.get('/:id', getUser);

// CREATE a new user, you can create a new user from the signup page
router.post('/signup', createUser);

// DELETE a user, you can delete a user from its profile page
router.delete('/:id', deleteUser);

// UPDATE a user, you can update a user from its profile page
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
