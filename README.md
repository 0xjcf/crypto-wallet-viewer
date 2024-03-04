# Cryptocurrency Wallet Viewer Tutorial

Welcome to our tutorial, where we're building an application that lets users log in and view their Bitcoin and Ethereum wallet balances. This beginner-friendly guide will walk you through setting up a basic Express server with TypeScript, and gradually adding more features.

## Lesson 1: Basic Express Server Setup with TypeScript

### Objective

Set up a simple Express server that responds with "Hello World", using TypeScript for added type safety and better development experience.

### High-Level Steps

1. **Project Initialization**: Create your project folder and run `npm init -y` to initialize your Node.js project.

2. **Install Dependencies**: Install Express for your server framework and TypeScript for type checking. `npm install express
npm install --save-dev typescript @types/express ts-node nodemon` Also, add `ts-node` for running TypeScript files directly and `nodemon` for auto-reloading during development.

3. **TypeScript Configuration**: Run `npx tsc --init` to generate a `tsconfig.json` file, configuring TypeScript for your project.

4. **Server Setup**: Create a `server.ts` file in the `src` directory. Write a basic Express server code that listens on a port and responds to the root route (`/`) with "Hello World".

5. **Running the Server**: Add a start script to your `package.json` to run your server using `ts-node` and `nodemon`. Start your server and navigate to `http://localhost:3000` to see the "Hello World" message.

## Lesson 2: Integrating MongoDB with Mongoose

### Objective

Integrate MongoDB into our application to manage user data, including authentication details and cryptocurrency wallet addresses.

### High-Level Steps

1. **Install Mongoose and dotenv**: Add these packages to handle database operations and manage environment variables. `npm install mongoose dotenv
npm install --save-dev @types/mongoose @types/dotenv`

2. **Configure Environment Variables**: Create a `.env` file in your project root to securely store your MongoDB connection URI and other sensitive configurations.

3. **Connect to MongoDB**: Use Mongoose in your `server.ts` file to connect to your MongoDB database with the connection URI stored in your `.env` file.

4. **Define a User Model**: In the `models` directory, create a `User.ts` file to define the schema for user data, including fields for usernames, passwords, and optionally, cryptocurrency wallet addresses.

5. **Test the Connection**: Ensure your application successfully connects to MongoDB by starting your server. Look for a console log indicating a successful connection.

### Conclusion

With MongoDB set up, we're now prepared to handle user data securely and efficiently. This database integration is crucial for storing user information and supporting future features like authentication and wallet data management.

### Next Steps

Stay tuned for the next lesson, where we'll explore setting up user authentication using Passport.js.
