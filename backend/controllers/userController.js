const asyncHandler = require('express-async-handler');
const jwt = require('jsonwebtoken');
const { check, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const prisma = require('../config/prisma');
const { uploadBufferToS3 } = require('../services/s3Service');
const { defaultProfilePicture, serializeUser, serializePost } = require('../utils/serializers');

const getAuthenticatedUserId = (req) => req.user?.id || req.user?._id?.toString() || null;

const findUserByAnyId = async (id) =>
  prisma.user.findFirst({
    where: {
      OR: [{ id }, { legacyMongoId: id }],
    },
    include: {
      following: true,
      followers: true,
    },
  });

// you can update a user's profile picture and that's it
const updateUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const currentUserId = getAuthenticatedUserId(req);

  if (!currentUserId) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const targetUser = await findUserByAnyId(id);
  if (!targetUser) {
    return res.status(400).json({ error: 'No such user' });
  }

  if (targetUser.id !== currentUserId && targetUser.legacyMongoId !== currentUserId) {
    return res.status(403).json({ error: 'You can only update your own profile' });
  }

  let location = null;

  if (req.file) {
    try {
      location = await uploadBufferToS3(req.file.buffer, req.file.originalname);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: 'Error uploading file' });
    }
  }

  const user = await prisma.user.update({
    where: { id: targetUser.id },
    data: {
      profilePicture: location || req.body.profilePicture,
    },
    include: {
      following: true,
      followers: true,
    },
  });

  const userResponse = serializeUser(
    {
      ...user,
      following: user.following.map((f) => f.followingId),
      followers: user.followers.map((f) => f.followerId),
    },
    { excludePassword: true }
  );
  res.status(200).json(userResponse);
});

// shows all users
const getUsers = asyncHandler(async (req, res) => {
  const currentUserId = getAuthenticatedUserId(req);
  if (!currentUserId) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const users = await prisma.user.findMany({
    orderBy: { username: 'asc' },
    include: {
      following: true,
      followers: true,
    },
  });

  const usersWithIsFollowing = users.map((user) => ({
    ...serializeUser(
      {
        ...user,
        following: user.following.map((f) => f.followingId),
        followers: user.followers.map((f) => f.followerId),
      },
      { excludePassword: true }
    ),
    isFollowing: user.followers.some((follower) => follower.followerId === currentUserId),
  }));

  res.status(200).json(usersWithIsFollowing);
});

// get a single user, this is their profile page with all the posts they have created
// The posts are then included in the response by spreading the user document into a new object and adding a posts property that contains the posts.

const getUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const user = await findUserByAnyId(id);
  if (!user) {
    return res.status(404).json({ error: 'No such user' });
  }

  const posts = await prisma.post.findMany({
    where: { authorId: user.id },
    orderBy: { createdAt: 'desc' },
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

  res.status(200).json({
    ...serializeUser(
      {
        ...user,
        following: user.following.map((f) => f.followingId),
        followers: user.followers.map((f) => f.followerId),
      },
      { excludePassword: true }
    ),
    posts: posts.map(serializePost),
  });
});

// create a new user
const createUser = [
  check('username')
    .trim()
    .notEmpty()
    .withMessage('Username is required')
    .isLength({ min: 3 })
    .withMessage('Username must be at least 3 characters long')
    .custom(async (username) => {
      const existingUser = await prisma.user.findUnique({ where: { username } });
      if (existingUser) {
        throw new Error('Username already taken');
      }
    }),
  check('password')
    .notEmpty()
    .withMessage('Password is required')
    .isLength({ min: 3 })
    .withMessage('Password must be at least 3 characters long'),
  asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { username, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: {
        username,
        password: hashedPassword,
        profilePicture: defaultProfilePicture(),
      },
      include: {
        followers: true,
        following: true,
      },
    });

    const userResponse = serializeUser(
      {
        ...user,
        following: user.following.map((f) => f.followingId),
        followers: user.followers.map((f) => f.followerId),
      },
      { excludePassword: true }
    );
    return res.status(200).json(userResponse);
  }),
];

// login a user
const loginUser = [
  check('username').trim().notEmpty().withMessage('Username is required'),
  check('password').notEmpty().withMessage('Password is required'),

  asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    const { username, password } = req.body;
    const user = await prisma.user.findUnique({
      where: { username },
      include: {
        followers: true,
        following: true,
      },
    });

    if (!user || !user.password || !(await bcrypt.compare(password, user.password))) {
      errors.errors.push({ msg: 'Invalid username or password' });
    }

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const tokenUserId = user.legacyMongoId || user.id;
    const token = jwt.sign({ id: tokenUserId }, process.env.JWT_SECRET);

    const userResponse = serializeUser(
      {
        ...user,
        following: user.following.map((f) => f.followingId),
        followers: user.followers.map((f) => f.followerId),
      },
      { excludePassword: true }
    );

    return res.status(200).json({ token, user: userResponse });
  }),
];

// In this code, the /:id/follow route receives the ID of the user to follow as a URL parameter. It finds the user with this ID and the current user in the database. If the current user is not already following the user, it adds the current user's ID to the user's followers array and the user's ID to the current user's following array. If the current user is already following the user, it sends a 403 Forbidden response.

const followUser = asyncHandler(async (req, res) => {
  const currentUserId = getAuthenticatedUserId(req);
  if (!currentUserId) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const targetUser = await findUserByAnyId(req.params.id);
  const currentUser = await findUserByAnyId(currentUserId);

  if (!targetUser || !currentUser) {
    return res.status(404).json({ error: 'User not found' });
  }

  if (targetUser.id === currentUser.id) {
    return res.status(400).json({ error: 'You cannot follow yourself' });
  }

  const existing = await prisma.follow.findUnique({
    where: {
      followerId_followingId: {
        followerId: currentUser.id,
        followingId: targetUser.id,
      },
    },
  });

  if (existing) {
    return res.status(403).json('You already follow this user');
  }

  await prisma.follow.create({
    data: {
      followerId: currentUser.id,
      followingId: targetUser.id,
    },
  });

  res.status(200).json('User has been followed');
});

module.exports = {
  getUsers,
  getUser,
  createUser,
  updateUser,
  loginUser,
  followUser,
};
