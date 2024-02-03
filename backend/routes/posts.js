const express = require('express');
const router = express.Router();
const passport = require('passport');
const {
  getPosts,
  createPost,
  likePost,
  addComment,
  getAllPosts,
  //deletePost,
  //updatePost,
} = require('../controllers/postController');

// Get all your posts and whatever users you are following (Home Page)
// the full route here is /api/users/:userId/posts
router.get('/', getPosts);

// GET all posts in the database
// the full route here is /api/users/:userId/posts/allPosts
router.get(
  '/allPosts',
  passport.authenticate('jwt', { session: false }),
  getAllPosts
);

// POST(Create) a new post
router.post('/', passport.authenticate('jwt', { session: false }), createPost);

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
/*
// DELETE a post
router.delete(
  '/:postId',
  passport.authenticate('jwt', { session: false }),
  deletePost
);

// UPDATE a post
router.patch(
  '/:postId',
  passport.authenticate('jwt', { session: false }),
  updatePost
);
*/
module.exports = router;
