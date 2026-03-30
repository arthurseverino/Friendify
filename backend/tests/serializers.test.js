const { serializeUser, serializePost } = require('../utils/serializers');

describe('serializers', () => {
  it('serializes a user with mongo-like shape', () => {
    const user = {
      id: 'abc',
      username: 'arthur',
      followers: ['a'],
      following: ['b'],
    };

    const result = serializeUser(user, { excludePassword: true });
    expect(result).toEqual(
      expect.objectContaining({
        _id: 'abc',
        username: 'arthur',
      })
    );
  });

  it('serializes a post with prisma-like relations', () => {
    const post = {
      id: 'post-1',
      body: 'hello',
      image: null,
      likes: [{ postId: 'post-1', userId: 'user-1' }],
      comments: [
        {
          id: 'comment-1',
          text: 'nice',
          author: { id: 'user-2', username: 'friend', profilePicture: 'x' },
        },
      ],
      author: { id: 'user-1', username: 'arthur', profilePicture: 'x' },
    };

    const result = serializePost(post);
    expect(result._id).toBe('post-1');
    expect(result.likes).toEqual(['user-1']);
    expect(result.comments[0].author._id).toBe('user-2');
  });
});
