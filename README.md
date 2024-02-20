
# Live Preview 
https://friendify-afc27231acd7.herokuapp.com

# Friendify

Friendify is a full-stack social media website created with the MERN stack. It's designed to help people stay connected with their friends, share updates, and discover new content.


## Getting Started

To get started with the website, follow these steps:

1. Clone the repository to your local machine.
2. Run <code>npm install</code> to install the project dependencies.
3. Create a .env.local file and fill in the necessary environment variables (e.g., `MONGODB_URI`, `JWT_SECRET`).
4. Run <code>npm run dev</code> to start the development server.
5. Open http://localhost:3000 in your web browser to view the website.


## Features

Friendify includes the following features:

- JWT authentication with Passport.js.
- CRUD operations for posts and comments
- AWS cloud storage for user images
- Real-time feed of posts from friends
- Ability to like posts and comments
- Log into the website as a visitor.
- Responsive design

... and much more!


## Dependencies

The following dependencies are used in this project:

- react: JavaScript library for building user interfaces.
- react-router-dom: Routing library for React.
- aws-sdk: Handles AWS S3 Bucket file storage for user-uploaded images
- express: Web application framework for Node.js.
- mongoose: Object Data Modeling library for MongoDB.
- supertest: HTTP testings.
- jest: Jest test frameworks.
- bcryptjs: Handles Hashing passwords
- express-validator: Runs back-end validation for form data.
- passport-jwt: Passport strategy for authenticating with JWT tokens.
- jsonwebtoken: JSON Web Token implementation for Node.js.
- multer: Handles multiform FormData.
- cors: Handles CORS.

## Pages

The website includes the following pages:

- /index: Displays login and sign-up forms.
- /home: The home page includes a feed of posts from the user and their friends.
- /profile: Displays the user's profile page and a feed of the user's posts.
- /friends: Displays a list of users including suggestions for users to follow.

## Screenshots 

### Index Page
![Screenshot of the Landing Page](./frontend/src/images/Landing-page.png)

### Home Page
![Screenshot of the Home Page](./frontend/src/images/Home-Page.png)

### Profile Page
![Screenshot of the Profile Page](./frontend/src/images/Profile-Page.png)

### Users Page 
![Screenshot of the Users Page](./frontend/src/images/Users-Page.png)

## Contributing to Friendify

Contributions are welcome! To contribute to Friendify, follow these steps:

1. Fork the repository.
2. Create a branch: `git checkout -b <branch_name>`.
3. Make your changes and commit them: `git commit -m '<commit_message>'`
4. Push to the original branch.
5. Create the pull request.

## Contact

If you want to contact me you can reach me at <aas1181@nyu.edu>.

## License

This project is licensed under the MIT License. See the LICENSE file for details.