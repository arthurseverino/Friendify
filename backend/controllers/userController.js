const User = require('../models/userModel');
const asyncHandler = require('express-async-handler');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');

// get all users
const getUsers = asyncHandler(async (req, res) => {
  const users = await User.find({}).sort({ name: 1 });
  res.status(200).json(users);
});

// get a single user
const getUser = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: 'No such user' });
  }

  const user = await User.findById(id);
  if (!user) {
    return res.status(404).json({ error: 'No such user' });
  }
  res.status(200).json(user);
});

const loginUser = asyncHandler(async (req, res) => {
  // Password and username are correct, create a token or get a token if it already exists
  const token = jwt.sign({ id: req.user.id }, process.env.JWT_SECRET, {
    expiresIn: '1h',
  });
  const user = await User.findById(req.user.id);
  //send token and user to the client
  console.log('user.id backend LoginUser: ', user.id);  
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

// update a user
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

module.exports = {
  getUsers,
  getUser,
  createUser,
  deleteUser,
  updateUser,
  loginUser,
};
