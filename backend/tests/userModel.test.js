const mongoose = require('mongoose');
const User = require('../models/userModel');

describe('User Model Test', () => {

  it('create & save user successfully', async () => {
    const userData = { username: 'test', password: 'test' };
    const validUser = new User(userData);
    const savedUser = await validUser.save();

    // Object Id should be defined when successfully saved to MongoDB.
    expect(savedUser._id).toBeDefined();
    expect(savedUser.username).toBe(userData.username);
    expect(savedUser.password).toBe(userData.password);
  });

  it('insert user successfully, but the field not defined in schema should be undefined', async () => {
    const userWithInvalidField = new User({ username: 'test', password: 'test', location: 'Earth' });
    const savedUserWithInvalidField = await userWithInvalidField.save();
    expect(savedUserWithInvalidField._id).toBeDefined();
    expect(savedUserWithInvalidField.location).toBeUndefined();
  });

  it('create user without required field should failed', async () => {
    const userWithoutRequiredField = new User({ username: 'test' });
    let err;
    try {
      const savedUserWithoutRequiredField = await userWithoutRequiredField.save();
      error = savedUserWithoutRequiredField;
    } catch (error) {
      err = error;
    }
    expect(err).toBeInstanceOf(mongoose.Error.ValidationError);
    expect(err.errors.password).toBeDefined();
  });
});