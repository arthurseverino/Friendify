const Post = require('../models/postModel');
const asyncHandler = require('express-async-handler');
const User = require('../models/userModel');
const multer = require('multer');

// get all posts on timeline for one user
const getPosts = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  const currentUser = await User.findById(req.user._id);
  const followingIds = currentUser.following;
  followingIds.push(req.user._id); // Include the current user's ID

  const posts = await Post.find({
    author: { $in: followingIds },
  })
    .sort('-createdAt')
    .skip(skip)
    .limit(limit)
    .populate('author', 'username profilePicture')
    .populate('comments.author', 'username profilePicture');
  res.status(200).json(posts);
});

//show all posts in the database
const getAllPosts = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  const posts = await Post.find({})
    .sort('-createdAt')
    .skip(skip)
    .limit(limit)
    .populate('author', 'username profilePicture')
    .populate('comments.author', 'username profilePicture');

  res.status(200).json(posts);
});

// create a new post
const createPost = asyncHandler(async (req, res, next) => {
  const { body, author } = req.body;
  const image = req.file ? req.file.path : null;
  const newPost = await Post.create({
    body,
    image,
    likes: [],
    comments: [],
    author,
  });

  const populatedPost = await newPost.populate(
    'author',
    'username profilePicture'
  );

  res.status(200).json(populatedPost);
});

// In this code, likePost finds the post with the provided ID and adds the user's ID to the likes array if it's not already there, or removes it if it is.

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

  const updatedPost = await Post.findById(req.params.postId)
    .populate('author', 'username profilePicture')
    .populate('comments.author', 'username profilePicture');
  res.status(200).json({ post: updatedPost });
});

// addComment creates a new comment with the provided text and the user's ID as the author, saves it, finds the post with the provided ID, and adds the comment's ID to the comments array.

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

  const updatedPost = await Post.findById(req.params.postId)
    .populate('author', 'username profilePicture')
    .populate('comments.author', 'username profilePicture');
  res.status(200).json({ post: updatedPost });
});


module.exports = {
  getPosts,
  createPost,
  likePost,
  addComment,
  getAllPosts,
};
