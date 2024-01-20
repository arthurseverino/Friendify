const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
    },
    password: {
      type: Number,
      required: true,
    },
    email: {
      type: Number,
      required: true,
    },
    first_name: {
      type: Number,
      required: true,
    },
    last_name: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('User', userSchema);
