require('dotenv').config();
const crypto = require('crypto');
const { MongoClient } = require('mongodb');
const prisma = require('../config/prisma');
const { defaultProfilePicture } = require('../utils/serializers');

const DRY_RUN = process.argv.includes('--dry-run');
let mongoClient;
let mongoDb;

const ensureMongoConnection = async () => {
  const mongoDbUrl = process.env.MONGO_URL;
  if (!mongoDbUrl) {
    throw new Error('Missing MONGO_URL for migration.');
  }

  mongoClient = new MongoClient(mongoDbUrl);
  await mongoClient.connect();
  mongoDb = mongoClient.db();
};

const makeDeterministicUuid = (prefix, value) => {
  const hash = crypto
    .createHash('sha256')
    .update(`${prefix}:${value}`)
    .digest('hex')
    .slice(0, 32)
    .split('');

  hash[12] = '4';
  hash[16] = ((parseInt(hash[16], 16) & 0x3) | 0x8).toString(16);

  return `${hash.slice(0, 8).join('')}-${hash.slice(8, 12).join('')}-${hash
    .slice(12, 16)
    .join('')}-${hash.slice(16, 20).join('')}-${hash.slice(20).join('')}`;
};

const mapMongoIdToUuid = (map, prefix, mongoId) => {
  const rawId = mongoId?.toString();
  if (!rawId) {
    return null;
  }

  if (!map.has(rawId)) {
    map.set(rawId, makeDeterministicUuid(prefix, rawId));
  }
  return map.get(rawId);
};

const migrateUsers = async (idMap) => {
  const users = await mongoDb.collection('users').find({}).toArray();
  for (const user of users) {
    const newId = mapMongoIdToUuid(idMap.user, 'user', user._id);
    const payload = {
      id: newId,
      legacyMongoId: user._id.toString(),
      username: user.username,
      password: user.password || null,
      profilePicture: user.profilePicture || defaultProfilePicture(),
      oauthProvider: user.oauthProvider || null,
      oauthId: user.oauthId || null,
    };

    if (!DRY_RUN) {
      await prisma.user.upsert({
        where: { legacyMongoId: payload.legacyMongoId },
        update: payload,
        create: payload,
      });
    }
  }
  return users;
};

const migrateFollows = async (users, idMap) => {
  for (const user of users) {
    const followerId = mapMongoIdToUuid(idMap.user, 'user', user._id);
    for (const followingMongoId of user.following || []) {
      const followingId = mapMongoIdToUuid(idMap.user, 'user', followingMongoId);
      if (!followingId || followingId === followerId) {
        continue;
      }

      if (!DRY_RUN) {
        await prisma.follow.upsert({
          where: { followerId_followingId: { followerId, followingId } },
          update: {},
          create: { followerId, followingId },
        });
      }
    }
  }
};

const migratePosts = async (idMap) => {
  const posts = await mongoDb.collection('posts').find({}).toArray();
  for (const post of posts) {
    const newId = mapMongoIdToUuid(idMap.post, 'post', post._id);
    const authorId = mapMongoIdToUuid(idMap.user, 'user', post.author);
    if (!authorId) {
      continue;
    }

    const payload = {
      id: newId,
      legacyMongoId: post._id.toString(),
      body: post.body || null,
      image: post.image || null,
      authorId,
      createdAt: post.createdAt || new Date(),
      updatedAt: post.updatedAt || new Date(),
    };

    if (!DRY_RUN) {
      await prisma.post.upsert({
        where: { legacyMongoId: payload.legacyMongoId },
        update: payload,
        create: payload,
      });
    }
  }
  return posts;
};

const migrateLikesAndComments = async (posts, idMap) => {
  for (const post of posts) {
    const postId = mapMongoIdToUuid(idMap.post, 'post', post._id);

    for (const likeMongoId of post.likes || []) {
      const userId = mapMongoIdToUuid(idMap.user, 'user', likeMongoId);
      if (!userId) {
        continue;
      }

      if (!DRY_RUN) {
        await prisma.postLike.upsert({
          where: { postId_userId: { postId, userId } },
          update: {},
          create: { postId, userId },
        });
      }
    }

    for (const comment of post.comments || []) {
      const commentId = mapMongoIdToUuid(
        idMap.comment,
        'comment',
        comment._id || `${post._id}:${comment.text}:${comment.author}`
      );
      const authorId = mapMongoIdToUuid(idMap.user, 'user', comment.author);
      if (!authorId) {
        continue;
      }

      const payload = {
        id: commentId,
        legacyMongoId: comment._id ? comment._id.toString() : null,
        postId,
        authorId,
        text: comment.text || '',
      };

      if (!DRY_RUN) {
        if (payload.legacyMongoId) {
          await prisma.comment.upsert({
            where: { legacyMongoId: payload.legacyMongoId },
            update: payload,
            create: payload,
          });
        } else {
          await prisma.comment.upsert({
            where: { id: payload.id },
            update: payload,
            create: payload,
          });
        }
      }
    }
  }
};

const run = async () => {
  const idMap = {
    user: new Map(),
    post: new Map(),
    comment: new Map(),
  };

  try {
    await ensureMongoConnection();
    await prisma.$connect();

    const users = await migrateUsers(idMap);
    await migrateFollows(users, idMap);
    const posts = await migratePosts(idMap);
    await migrateLikesAndComments(posts, idMap);

    console.log(
      `[migration] Complete${DRY_RUN ? ' (dry run)' : ''}. Users: ${users.length}, Posts: ${posts.length}`
    );
  } catch (error) {
    console.error('[migration] Failed:', error);
    process.exitCode = 1;
  } finally {
    await prisma.$disconnect();
    if (mongoClient) {
      await mongoClient.close();
    }
  }
};

run();
