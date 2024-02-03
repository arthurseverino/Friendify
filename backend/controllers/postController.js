const Post = require('../models/postModel');
const asyncHandler = require('express-async-handler');
const { body, validationResult } = require('express-validator');
const mongoose = require('mongoose');
const User = require('../models/userModel');

// get all posts on timeline for one user
const getPosts = asyncHandler(async (req, res) => {
  const posts = await Post.find({});
  res.status(200).json(posts);
});

// get a single post
const getPost = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: 'No such post' });
  }

  const post = await Post.findById(id);
  if (!post) {
    return res.status(404).json({ error: 'No such post' });
  }
  res.status(200).json(post);
});

// create a new post
const createPost = asyncHandler(async (req, res, next) => {
  const { body, likes, comments, author } = req.body;
  // store new post in db
  const newPost = await Post.create({
    body,
    likes,
    comments,
    author,
  });
  res.status(200).json(newPost);
});

// delete a post
const deletePost = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: 'No such post' });
  }

  const post = await Post.findOneAndDelete({ _id: id });

  if (!post) {
    return res.status(400).json({ error: 'That post no longer exists.' });
  }

  res.status(200).json(post);
});

// update a post
const updatePost = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: 'No such post' });
  }

  const post = await Post.findOneAndUpdate(
    { _id: id },
    // req.body contains all the previous fields in the model
    {
      ...req.body,
    }
  );

  if (!post) {
    return res.status(400).json({ error: 'No such post' });
  }

  res.status(200).json(post);
});

module.exports = {
  getPosts,
  getPost,
  createPost,
  deletePost,
  updatePost,
};
