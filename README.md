Live: https://friendify-afc27231acd7.herokuapp.com

# Friendify

Friendify is a full-stack social media website created with the MERN stack. It's designed to help people stay connected with their friends, share updates, and discover new content.

![Screenshot of the Landing Page](./frontend/src/images/Landing-page.png)

## Features

Friendify includes the following features:

- JWT authentication with Passport.js.
- CRUD operations for posts and comments
- Real-time feed of posts from friends
- Ability to like posts and comments
- Log into the website as a visitor.
- Responsive design

... and much more!

## Dependencies

The following dependencies are used in this project:

- react: JavaScript library for building user interfaces.
- react-router-dom: Entry point to the DOM and route handler for React.
- date-fns: DateTime helper.
- express: Web framework for Node.js.
- mongoose: Object modeling tool for MongoDB.
- dotenv: Loads environment variables from a .env file.
- express validator: Runs back-end validation for form data.
- passport: Authentication middleware for Node.js.
- passport-jwt: Passport strategy for authenticating with JWT tokens.
- jsonwebtoken: JSON Web Token implementation for Node.js.
- multer: Handles multiform FormData.
- cors: Handles CORS.
- bcryptjs: Handles Hashing passwords

## Pages

The website includes the following pages:

- /: The index page, which displays login and sign-up forms.
- /home: The homepage which includes a feed of posts from the user and their friends.
- /friends: Displays a list of users including suggestions for users to follow.
- /posts: Displays a list of all posts from all users.
- /profile: Displays the user's profile page and a feed of the user's posts.