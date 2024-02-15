const express = require('express');
const router = express.Router();
const passport = require('passport');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });
const {
  getPosts,
  createPost,
  likePost,
  addComment,
  getAllPosts,
} = require('../controllers/postController');

// Get all your posts and whatever users you are following (Home Page)
router.get('/', getPosts);

// Get all posts in the database
router.get(
  '/allPosts',
  passport.authenticate('jwt', { session: false }),
  getAllPosts
);

// POST(Create) a new post
router.post(
  '/',
  passport.authenticate('jwt', { session: false }),
  upload.single('image'),
  createPost
);

// POST(Like) a post
router.post(
  '/:postId/like',
  passport.authenticate('jwt', { session: false }),
  likePost
);

// POST(Add comment) to a post
router.post(
  '/:postId/comments',
  passport.authenticate('jwt', { session: false }),
  addComment
);

module.exports = router;
