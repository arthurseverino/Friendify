const { PrismaClient } = require('@prisma/client');

const prisma = global.__prismaClient || new PrismaClient();

if (process.env.NODE_ENV !== 'production') {
  global.__prismaClient = prisma;
}

module.exports = prisma;
