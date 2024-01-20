const User = require('../models/userModel');
const asyncHandler = require('express-async-handler');
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');

// get all users
const getUsers = asyncHandler(async (req, res) => {
  const users = await User.find({}).sort({ name: 1 });
  res.status(200).json(users);
});

// get a single user
const getUser = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: 'No such user' });
  }

  const user = await User.findById(id);
  if (!user) {
    return res.status(404).json({ error: 'No such user' });
  }
  res.status(200).json(user);
};

// create a new user
const createUser = asyncHandler(async (req, res, next) => {
  const { username, password, email, first_name, last_name } = req.body;
  // store new user in db
  bcrypt.hash(password, 10, async (err, hashedPassword) => {
    if (err) {
      return next(err);
    }
    const user = await User.create({
      username,
      password: hashedPassword,
      email,
      first_name,
      last_name,
    });
    // authenticate the user
    req.login(user, (err) => {
      if (err) {
        return next(err);
      }
      // if successful, respond with the new user
      return res.status(200).json(user);
    });
  });
});

// delete a user
const deleteUser = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: 'No such user' });
  }

  const user = await User.findOneAndDelete({ _id: id });

  if (!user) {
    return res.status(400).json({ error: 'No such user' });
  }

  res.status(200).json(user);
};

// update a user
const updateUser = async (req, res) => {
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
};

module.exports = {
  getUsers,
  getUser,
  createUser,
  deleteUser,
  updateUser,
};
