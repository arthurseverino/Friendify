const User = require('../models/userModel');
const asyncHandler = require('express-async-handler');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
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
// In this code, Post.find({ author: id }) finds all posts where the author field is equal to id, which is the ID of the user. The posts are then included in the response by spreading the user document into a new object and adding a posts property that contains the posts.

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

// login a user
const loginUser = asyncHandler(async (req, res) => {
  // Password and username are correct, create a token or get a token if it already exists
  const token = jwt.sign({ id: req.user.id }, process.env.JWT_SECRET, {
    expiresIn: '45m',
  });
  const user = await User.findById(req.user.id);
  //send token and user to the client
  return res.status(200).json({ token, user });
});

// create a new user
const createUser = asyncHandler(async (req, res, next) => {
  const { username, password, email, firstName } = req.body;
  try {
    // Check if a user with the same username or email already exists
    const existingUser = await User.findOne({ $or: [{ username }, { email }] });
    if (existingUser) {
      return res
        .status(400)
        .json({ error: 'User with this username or email already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      username,
      password: hashedPassword,
      email,
      firstName,
    });
    const userResponse = await User.findById(user._id).select('-password');
    return res.status(200).json(userResponse);
  } catch (err) {
    console.log(err);
    return next(err);
  }
});

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

/*
// delete a user
const deleteUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: 'No such user' });
  }
  const user = await User.findOneAndDelete({ _id: id });
  if (!user) {
    return res.status(400).json({ error: 'No such user' });
  }
  res.status(200).json(user);
});
*/

module.exports = {
  getUsers,
  getUser,
  createUser,
  updateUser,
  loginUser,
  followUser,
};
