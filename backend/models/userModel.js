const mongoose = require('mongoose');
const Schema = mongoose.Schema;

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
        : `http://localhost:3000/public/profilePic.jpg`,
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

module.exports = mongoose.model('User', userSchema);
