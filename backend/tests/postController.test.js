const request = require('supertest');
const express = require('express');
const postController = require('../controllers/postController');
const Post = require('../models/postModel');
const User = require('../models/userModel');
const mongoose = require('mongoose');

const app = express();
app.use(express.json());
app.get('/posts', postController.getPosts);
app.get('/allPosts', postController.getAllPosts);
app.post('/createPost', postController.createPost);

describe('Post Controller Test', () => {
  it('should fetch posts', async () => {
    const res = await request(app).get('/posts');
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('posts');
  });

  it('should fetch all posts', async () => {
    const res = await request(app).get('/allPosts');
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('posts');
  });

  it('should create a new post', async () => {
    const res = await request(app).post('/createPost').send({
      body: 'Test post',
      author: 'Test author',
    });
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('post');
  });
});
