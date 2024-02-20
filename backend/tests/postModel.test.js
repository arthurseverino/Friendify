const mongoose = require('mongoose');
const Post = require('../models/postModel');

describe('Post Model Test', () => {

  it('create & save post successfully', async () => {
    const postData = { body: 'test post', author: 'test author' };
    const validPost = new Post(postData);
    const savedPost = await validPost.save();

    // Object Id should be defined when successfully saved to MongoDB.
    expect(savedPost._id).toBeDefined();
    expect(savedPost.body).toBe(postData.body);
    expect(savedPost.author).toBe(postData.author);
  });

  it('insert post successfully, but the field not defined in schema should be undefined', async () => {
    const postWithInvalidField = new Post({ body: 'test post', author: 'test author', location: 'Earth' });
    const savedPostWithInvalidField = await postWithInvalidField.save();
    expect(savedPostWithInvalidField._id).toBeDefined();
    expect(savedPostWithInvalidField.location).toBeUndefined();
  });

  it('create post without required field should failed', async () => {
    const postWithoutRequiredField = new Post({ body: 'test post' });
    let err;
    try {
      const savedPostWithoutRequiredField = await postWithoutRequiredField.save();
      error = savedPostWithoutRequiredField;
    } catch (error) {
      err = error;
    }
    expect(err).toBeInstanceOf(mongoose.Error.ValidationError);
    expect(err.errors.author).toBeDefined();
  });
});