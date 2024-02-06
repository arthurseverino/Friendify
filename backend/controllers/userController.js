const User = require('../models/userModel');
const asyncHandler = require('express-async-handler');
const jwt = require('jsonwebtoken');
const { check, validationResult } = require('express-validator');
const Post = require('../models/postModel');
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');

// shows all users
const getUsers = asyncHandler(async (req, res) => {
  const users = await User.find({}).sort({ username: 1 });

  const usersWithIsFollowing = users.map((user) => ({
    ...user._doc,
    isFollowing: user.followers.includes(req.user._id),
  }));

  res.status(200).json(usersWithIsFollowing);
});

// get a single user, this is their profile page with all their posts
// The posts are then included in the response by spreading the user document into a new object and adding a posts property that contains the posts.

const getUser = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: 'No such user' });
  }

  const user = await User.findById(id);
  if (!user) {
    return res.status(404).json({ error: 'No such user' });
  }

  const posts = await Post.find({ author: id });
  res.status(200).json({ ...user._doc, posts });
});

// create a new user
const createUser = [
  // validation and sanitization middleware
  check('username')
    .trim() // remove leading and trailing whitespace
    .notEmpty()
    .withMessage('Username is required')
    .isLength({ min: 3 })
    .withMessage('Username must be at least 3 characters long')
    .custom(async (username) => {
      const existingUser = await User.findOne({ username });
      if (existingUser) {
        throw new Error('Username already in use');
      }
    }),
  check('password')
    .notEmpty()
    .withMessage('Password is required')
    .isLength({ min: 4 })
    .withMessage('Password must be at least 4 characters long'),
  asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { username, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      username,
      password: hashedPassword,
    });
    const userResponse = await User.findById(user._id).select('-password');
    return res.status(200).json(userResponse);
  }),
];

// login a user
const loginUser = [
  // validation and sanitization middleware
  check('username')
    .trim() // remove leading and trailing whitespace
    .notEmpty()
    .withMessage('Username is required'),
  check('password').notEmpty().withMessage('Password is required'),

  asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    const { username, password } = req.body;
    const user = await User.findOne({ username });

    // Check if user exists and if password is correct
    if (!user || !(await bcrypt.compare(password, user.password))) {
      errors.errors.push({ msg: 'Invalid username or password' });
    }

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // Password and username are correct, create a token or get a token if it already exists
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: '45m',
    });
    //send token and user to the client
    return res.status(200).json({ token, user });
  }),
];

// update a user, you can update your name and profile pic but thats it
const updateUser = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: 'No such user' });
  }

  const user = await User.findOneAndUpdate(
    { _id: id },
    // req.body contains all the previous fields in the model
    {
      ...req.body,
    }
  );

  if (!user) {
    return res.status(400).json({ error: 'No such user' });
  }

  res.status(200).json(user);
});

// In this code, the /:id/follow route receives the ID of the user to follow as a URL parameter. It finds the user with this ID and the current user in the database. If the current user is not already following the user, it adds the current user's ID to the user's followers array and the user's ID to the current user's following array. If the current user is already following the user, it sends a 403 Forbidden response.

const followUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  const currentUser = await User.findById(req.user._id);

  if (!user.followers.includes(req.user._id)) {
    await user.updateOne({ $push: { followers: req.user._id } });
    await currentUser.updateOne({ $push: { following: req.params.id } });
    res.status(200).json('User has been followed');
  } else {
    res.status(403).json('You already follow this user');
  }
});

module.exports = {
  getUsers,
  getUser,
  createUser,
  updateUser,
  loginUser,
  followUser,
};
