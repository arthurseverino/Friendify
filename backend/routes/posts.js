const express = require('express');
const router = express.Router();
const passport = require('passport');
const {
  getPosts,
  getPost,
  createPost,
  deletePost,
  updatePost,
} = require('../controllers/postController');

// GET all posts
// Show your posts and whatever users you are following (Home Page)
router.get('/', passport.authenticate('jwt', { session: false }), getPosts);

// GET a single post
//check other projects, does it open another page?
router.get(
  '/:postId',
  passport.authenticate('jwt', { session: false }),
  getPost
);

// POST(Create) a new post
router.post('/', passport.authenticate('jwt', { session: false }), createPost);

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

module.exports = router;
