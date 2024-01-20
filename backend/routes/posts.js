const express = require('express');
const router = express.Router();
const {
  getPosts,
  getPost,
  createPost,
  deletePost,
  updatePost,
} = require('../controllers/userController');

//pass in jwt token here maybe?

// GET all posts
// (Home Page)
router.get('/', getPosts);

// GET a single post
router.get('/:id', getPost);

// POST(Create) a new post
router.post('/', createPost);

// DELETE a post
router.delete('/:id', deletePost);

// UPDATE a post
router.patch('/:id', updatePost);

module.exports = router;
