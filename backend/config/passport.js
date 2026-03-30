const passport = require('passport');
const { Strategy: JwtStrategy, ExtractJwt } = require('passport-jwt');
const prisma = require('./prisma');

const findUserByJwtId = async (id) => {
  return prisma.user.findFirst({
    where: {
      OR: [{ id }, { legacyMongoId: id }],
    },
  });
};

const initializePassport = () => {
  const secretOrKey = process.env.JWT_SECRET;
  if (!secretOrKey) {
    throw new Error('Missing JWT_SECRET environment variable.');
  }

  passport.use(
    new JwtStrategy(
      {
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        secretOrKey,
      },
      async (jwtPayload, done) => {
        try {
          const user = await findUserByJwtId(jwtPayload.id);
          if (!user) {
            return done(null, false);
          }
          return done(null, user);
        } catch (error) {
          return done(error, false);
        }
      }
    )
  );
};

module.exports = {
  passport,
  initializePassport,
};
