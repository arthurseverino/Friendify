const defaultProfilePicture = () => {
  return process.env.NODE_ENV === 'production'
    ? 'https://friendify-afc27231acd7.herokuapp.com/public/profilePic.jpg'
    : 'http://localhost:3000/public/profilePic.jpg';
};

const normalizeId = (entity) => {
  if (!entity) {
    return null;
  }

  return entity.id || entity._id?.toString() || null;
};

const serializeUser = (user, options = {}) => {
  if (!user) {
    return null;
  }

  const id = normalizeId(user);
  const result = {
    _id: id,
    username: user.username,
    profilePicture: user.profilePicture || defaultProfilePicture(),
    following: user.following || [],
    followers: user.followers || [],
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };

  if (!options.excludePassword && user.password) {
    result.password = user.password;
  }

  if (typeof options.isFollowing === 'boolean') {
    result.isFollowing = options.isFollowing;
  }

  return result;
};

const serializeComment = (comment) => {
  if (!comment) {
    return null;
  }

  return {
    _id: normalizeId(comment),
    text: comment.text,
    author: comment.author
      ? {
          _id: normalizeId(comment.author),
          username: comment.author.username,
          profilePicture: comment.author.profilePicture || defaultProfilePicture(),
        }
      : null,
    createdAt: comment.createdAt,
    updatedAt: comment.updatedAt,
  };
};

const serializePost = (post) => {
  if (!post) {
    return null;
  }

  const likes = post.likes || [];
  const comments = post.comments || [];

  return {
    _id: normalizeId(post),
    body: post.body,
    image: post.image,
    likes: likes.map((like) => {
      if (typeof like === 'string') {
        return like;
      }
      if (like.userId) {
        return like.userId;
      }
      return normalizeId(like.user || like);
    }),
    comments: comments.map(serializeComment),
    author: post.author
      ? {
          _id: normalizeId(post.author),
          username: post.author.username,
          profilePicture: post.author.profilePicture || defaultProfilePicture(),
        }
      : null,
    createdAt: post.createdAt,
    updatedAt: post.updatedAt,
  };
};

module.exports = {
  defaultProfilePicture,
  normalizeId,
  serializeUser,
  serializePost,
};
