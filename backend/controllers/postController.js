const Post = require('../models/postModel');
const asyncHandler = require('express-async-handler');
const User = require('../models/userModel');
const AWS = require('aws-sdk');

// Configure AWS with your Bucketeer credentials.
const {
  BUCKETEER_AWS_ACCESS_KEY_ID,
  BUCKETEER_AWS_SECRET_ACCESS_KEY,
  BUCKETEER_BUCKET_NAME,
} = process.env;

AWS.config.update({
  accessKeyId: BUCKETEER_AWS_ACCESS_KEY_ID,
  secretAccessKey: BUCKETEER_AWS_SECRET_ACCESS_KEY,
  region: 'us-east-1', // Bucketeer is always in this region
});

const s3 = new AWS.S3();

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
  const image = req.file ? req.file.buffer : null;

  let location = null;

  if (image) {
    // Setting up S3 upload parameters
    const params = {
      Bucket: BUCKETEER_BUCKET_NAME,
      Key: req.file.originalname, // File name you want to save as in S3
      Body: image,
      ACL: 'public-read', // Allow read access to this file
    };

    // Uploading files to the bucket
    try {
      const { Location } = await s3.upload(params).promise();
      console.log(`File uploaded successfully. ${Location}`);
      location = Location;
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: 'Error uploading file' });
    }
  }

  const newPost = await Post.create({
    body,
    image: location, // Save the S3 file URL in the database
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
