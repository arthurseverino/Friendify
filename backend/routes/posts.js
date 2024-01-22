const express = require('express');
const router = express.Router();
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
router.get('/', getPosts);

// GET a single post
//check other projects, does it open another page? 
router.get('/:id', getPost);

// POST(Create) a new post
router.post('/', createPost);

// DELETE a post
router.delete('/:id', deletePost);

// UPDATE a post
router.patch('/:id', updatePost);

module.exports = router;
