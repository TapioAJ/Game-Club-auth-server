# Game Club auth server

This is the authentication server used in [game club](https://github.com/Higic/Game-Club) and is required to run it

## Instructions
Clone this git repo, install the required dependencies and create a `.env` based on the `.env.sample`. \
This is used to communicate with the main project. Use the same JWT_SECRET as you do in the main project for the authentication to work. The database url is the MongoDB Atlas url used in the main project. \
After that is done, run `npm run dev` and the auth server opens up on `localhost:3001`. Now you can go back to the main project's readme.
