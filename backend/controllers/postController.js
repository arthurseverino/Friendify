const asyncHandler = require('express-async-handler');
const prisma = require('../config/prisma');
const { uploadBufferToS3 } = require('../services/s3Service');
const { serializePost } = require('../utils/serializers');

const getAuthenticatedUserId = (req) => req.user?.id || req.user?._id?.toString() || null;

const findUserByAnyId = (id) =>
  prisma.user.findFirst({
    where: {
      OR: [{ id }, { legacyMongoId: id }],
    },
    include: { following: true },
  });

const fetchPostWithRelations = (postId) =>
  prisma.post.findUnique({
    where: { id: postId },
    include: {
      author: true,
      comments: {
        include: {
          author: true,
        },
        orderBy: { createdAt: 'asc' },
      },
      likes: true,
    },
  });

// get all posts on timeline for one user
const getPosts = asyncHandler(async (req, res) => {
  const currentUserId = getAuthenticatedUserId(req);
  if (!currentUserId) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  const currentUser = await findUserByAnyId(currentUserId);
  if (!currentUser) {
    return res.status(404).json({ error: 'User not found' });
  }

  const followingIds = [...currentUser.following.map((f) => f.followingId), currentUser.id];

  const posts = await prisma.post.findMany({
    where: {
      authorId: {
        in: followingIds,
      },
    },
    orderBy: { createdAt: 'desc' },
    skip,
    take: limit,
    include: {
      author: true,
      comments: {
        include: {
          author: true,
        },
        orderBy: { createdAt: 'asc' },
      },
      likes: true,
    },
  });

  res.status(200).json(posts.map(serializePost));
});

//show all posts in the database
const getAllPosts = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  const posts = await prisma.post.findMany({
    orderBy: { createdAt: 'desc' },
    skip,
    take: limit,
    include: {
      author: true,
      comments: {
        include: {
          author: true,
        },
        orderBy: { createdAt: 'asc' },
      },
      likes: true,
    },
  });

  res.status(200).json(posts.map(serializePost));
});

// create a new post
const createPost = asyncHandler(async (req, res, next) => {
  const currentUserId = getAuthenticatedUserId(req);
  if (!currentUserId) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const currentUser = await findUserByAnyId(currentUserId);
  if (!currentUser) {
    return res.status(404).json({ error: 'User not found' });
  }

  const { body } = req.body;
  const image = req.file ? req.file.buffer : null;

  let location = null;

  if (image) {
    try {
      location = await uploadBufferToS3(image, req.file.originalname);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: 'Error uploading file' });
    }
  }

  const newPost = await prisma.post.create({
    data: {
      body,
      image: location,
      authorId: currentUser.id,
    },
    include: {
      author: true,
      comments: {
        include: {
          author: true,
        },
      },
      likes: true,
    },
  });

  res.status(200).json(serializePost(newPost));
});

// In this code, likePost finds the post with the provided ID and adds the user's ID to the likes array if it's not already there, or removes it if it is.

const likePost = asyncHandler(async (req, res) => {
  const currentUserId = getAuthenticatedUserId(req);
  if (!currentUserId) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const currentUser = await findUserByAnyId(currentUserId);
  if (!currentUser) {
    return res.status(404).json({ error: 'User not found' });
  }

  const post = await prisma.post.findFirst({
    where: {
      OR: [{ id: req.params.postId }, { legacyMongoId: req.params.postId }],
    },
  });

  if (!post) {
    return res.status(404).json({ message: 'Post not found' });
  }

  const existingLike = await prisma.postLike.findUnique({
    where: {
      postId_userId: {
        postId: post.id,
        userId: currentUser.id,
      },
    },
  });

  if (!existingLike) {
    await prisma.postLike.create({
      data: {
        postId: post.id,
        userId: currentUser.id,
      },
    });
  } else {
    await prisma.postLike.delete({
      where: {
        postId_userId: {
          postId: post.id,
          userId: currentUser.id,
        },
      },
    });
  }

  const updatedPost = await fetchPostWithRelations(post.id);
  res.status(200).json({ post: serializePost(updatedPost) });
});

// addComment creates a new comment with the provided text and the user's ID as the author, saves it, finds the post with the provided ID, and adds the comment's ID to the comments array.

const addComment = asyncHandler(async (req, res) => {
  const currentUserId = getAuthenticatedUserId(req);
  if (!currentUserId) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const currentUser = await findUserByAnyId(currentUserId);
  if (!currentUser) {
    return res.status(404).json({ error: 'User not found' });
  }

  const post = await prisma.post.findFirst({
    where: {
      OR: [{ id: req.params.postId }, { legacyMongoId: req.params.postId }],
    },
  });

  if (!post) {
    return res.status(404).json({ message: 'Post not found' });
  }

  const text = req.body.text?.trim();
  if (!text) {
    return res.status(400).json({ error: 'Comment text is required' });
  }

  await prisma.comment.create({
    data: {
      text,
      postId: post.id,
      authorId: currentUser.id,
    },
  });

  const updatedPost = await fetchPostWithRelations(post.id);
  res.status(200).json({ post: serializePost(updatedPost) });
});

module.exports = {
  getPosts,
  createPost,
  likePost,
  addComment,
  getAllPosts,
};
