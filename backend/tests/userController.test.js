const request = require('supertest');
const express = require('express');
const userController = require('../controllers/userController');
const User = require('../models/userModel');
const mongoose = require('mongoose');
const app = express();

app.use(express.json());
app.get('/users', userController.getUsers);
app.get('/users/:id', userController.getUser);
app.post('/users', userController.createUser);
app.post('/login', userController.loginUser);
app.post('/users/:id/follow', userController.followUser);

describe('User Controller', () => {

  it('should fetch all users', async () => {
    const res = await request(app).get('/users');
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('users');
  });

  it('should fetch a single user', async () => {
    const user = new User({ username: 'test', password: 'test' });
    await user.save();

    const res = await request(app).get(`/users/${user.id}`);
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('user');
    expect(res.body.user).toHaveProperty('username', 'test');
  });

  it('should create a new user', async () => {
    const res = await request(app)
      .post('/users')
      .send({
        username: 'test',
        password: 'test'
      });
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('username', 'test');
  });

  it('should login a user', async () => {
    const res = await request(app)
      .post('/login')
      .send({
        username: 'test',
        password: 'test'
      });
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('token');
    expect(res.body).toHaveProperty('user');
  });

  it('should follow a user', async () => {
    const user1 = new User({ username: 'test1', password: 'test1' });
    await user1.save();
    const user2 = new User({ username: 'test2', password: 'test2' });
    await user2.save();

    const res = await request(app)
      .post(`/users/${user2.id}/follow`)
      .set('Authorization', `Bearer ${user1.token}`);
    expect(res.statusCode).toEqual(200);
    expect(res.body).toEqual('User has been followed');
  });
});