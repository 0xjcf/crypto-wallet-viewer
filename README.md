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

### Next Steps
Stay tuned for the next lesson, where we'll dive into database setup with MongoDB and Mongoose, enabling us to store user data and cryptocurrency wallet addresses.
