const Post = require('../models/postModel');
const asyncHandler = require('express-async-handler');
const { body, validationResult } = require('express-validator');
const mongoose = require('mongoose');

// get all posts
const getPosts = asyncHandler(async (req, res) => {
  const posts = await Post.find({}).sort({ createdAt: -1 });
  res.status(200).json(posts);
});

// get a single post
const getPost = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: 'No such post' });
  }

  const post = await Post.findById(id);
  if (!user) {
    return res.status(404).json({ error: 'No such post' });
  }
  res.status(200).json(post);
};

// create a new post
const createPost = asyncHandler(async (req, res, next) => {
  const {title, likes, body, comments, author } = req.body;
  // store new post in db
    const newPost = await Post.create({
        title,
        likes,
        body,
        comments,
        author
    });
    res.status(200).json(newPost);
});

// delete a post
const deletePost = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: 'No such post' });
  }

  const post = await Post.findOneAndDelete({ _id: id });

  if (!post) {
    return res.status(400).json({ error: 'That post no longer exists.' });
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
  getUsers: getPosts,
  getUser,
  createUser,
  deleteUser,
  updateUser,
};
