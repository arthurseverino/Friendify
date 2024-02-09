Live:

# Friendify

Friendify is a full-stack social media website created with the MERN stack. It's designed to help people stay connected with their friends, share updates, and discover new content.

## Features

Friendify includes the following features:

- User authetication
- CRUD operations for posts and comments
- Real-time feed of posts from friends
- Ability to like posts and comments
- Log into the website as a visitor.
- Responsive design

... and much more!

- The API is written with a test-driven design.
- Includes JWT authentication with Passport.js.

## Getting Started

To get started with Friendify, follow these steps:

1. Clone the repository to your local machine.
2. Run `npm install` to install the project dependencies.
3. Rename .env.example file to .env and fill in the necessary environment variables.
4. Run `npm run dev` to start the development server.
5. Open http://localhost:3000 in your web browser to view the website.

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

## Screenshots
