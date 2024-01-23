const express = require('express');
const router = express.Router();
const verifyToken = require('../authMiddleware');
const {
  getPosts,
  getPost,
  createPost,
  deletePost,
  updatePost,
} = require('../controllers/postController');

//jwt.verify here?

// GET all posts
// Show your posts and whatever users you are following (Home Page)
router.get('/', verifyToken, getPosts);

// GET a single post
//check other projects, does it open another page?
router.get('/:id', verifyToken, getPost);

// POST(Create) a new post
router.post('/', verifyToken, createPost);

// DELETE a post
router.delete('/:id', verifyToken, deletePost);

// UPDATE a post
router.patch('/:id', verifyToken, updatePost);

module.exports = router;
