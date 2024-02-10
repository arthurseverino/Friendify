const mongoose = require('mongoose');
const Schema = mongoose.Schema;
require('dotenv').config();
const userSchema = new Schema({
  username: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  profilePicture: {
    type: String,
    default:
      process.env.NODE_ENV === 'production'
        ? `https://friendify-afc27231acd7.herokuapp.com/public/profilePic.jpg`
        : `http://localhost:3005/public/profilePic.jpg`,
  },
  following: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  ],
  followers: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  ],
});

userSchema.virtual('name').get(function () {
  return this.first_name + ' ' + this.last_name;
});

module.exports = mongoose.model('User', userSchema);
