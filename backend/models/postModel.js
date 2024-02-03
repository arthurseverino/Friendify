const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const postSchema = new Schema(
  {
    body: {
      type: String,
    },
    likes: {
      type: Number,
      default: 0,
    },
    comments: {
      //make a Comment component
      type: Array,
      default: [],
    },
    author: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  { timestamps: true }
);

postSchema.virtual('url').get(function () {
  return '/posts/' + this._id;
});

module.exports = mongoose.model('Post', postSchema);
