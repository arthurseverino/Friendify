const Post = require('../models/postModel');
const asyncHandler = require('express-async-handler');
const { body, validationResult } = require('express-validator');

// get all posts on timeline for one user
const getPosts = asyncHandler(async (req, res) => {
  //populate('author', 'username') replaces the author field, which is an ID, with the corresponding user document from the User collection, and selects only the username field.
  const posts = await Post.find({}).populate('author', 'username');

  res.status(200).json(posts);
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

// In this code, likePost finds the post with the provided ID and adds the user's ID to the likes array if it's not already there, or removes it if it is. addComment creates a new comment with the provided text and the user's ID as the author, saves it, finds the post with the provided ID, and adds the comment's ID to the comments array.

const likePost = asyncHandler(async (req, res) => {
  const post = await Post.findById(req.params.postId);

  if (!post) {
    return res.status(404).json({ message: 'Post not found' });
  }

  if (!post.likes.includes(req.user._id)) {
    await post.updateOne({ $push: { likes: req.user._id } });
  } else {
    await post.updateOne({ $pull: { likes: req.user._id } });
  }

  const updatedPost = await Post.findById(req.params.postId);
  res.status(200).json({ post: updatedPost });
});

const addComment = asyncHandler(async (req, res) => {
  const post = await Post.findById(req.params.postId);

  if (!post) {
    return res.status(404).json({ message: 'Post not found' });
  }

  const comment = {
    text: req.body.text,
    author: req.user._id,
  };

  await post.updateOne({ $push: { comments: comment } });

  const updatedPost = await Post.findById(req.params.postId).populate(
    'comments.author',
    'username'
  );
  res.status(200).json({ post: updatedPost });
});

/*
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
*/
module.exports = {
  getPosts,
  createPost,
  likePost,
  addComment,
  //deletePost,
  //updatePost,
};
