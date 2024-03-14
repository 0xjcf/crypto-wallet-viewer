import request from "supertest";
import express from "express";
import bcrypt from "bcrypt";
import { MongoClient, Db } from "mongodb";
import User from "../../models/User";
import authController from "../../controllers/authController";
import { initializeTestApp } from "../utils/testUtils";

describe("Authentication Controller", () => {
  let testApp: express.Application;
  let mongoClient: MongoClient;
  let db: Db;
  const isAuthenticated = true;

  beforeAll(async () => {
    mongoClient = new MongoClient(process.env.MONGODB_URI as string);
    await mongoClient.connect();
    db = mongoClient.db();

    testApp = initializeTestApp("/auth", authController, isAuthenticated);
  });

  afterEach(async () => {
    jest.clearAllMocks();
  });

  afterAll(async () => {
    await mongoClient.db().collection("users").deleteMany({});
    await mongoClient.close();
  });

  it("/register - should register a new user", async () => {
    const bcryptHashSpy = jest
      .spyOn(bcrypt, "hash")
      .mockResolvedValue("#PASSWORD#" as never);

    const response = await request(testApp).post("/auth/register").send({
      username: "testUser",
      password: "testPassword",
    });

    expect(response.status).toBe(201);

    expect(response.body).toMatchObject({
      message: "User created successfully",
      user: {
        username: "testUser",
        password: "#PASSWORD#",
      },
    });

    const user = await db.collection("users").findOne({ username: "testUser" });

    expect(user).toMatchObject({
      username: "testUser",
      password: "#PASSWORD#",
    });

    expect(bcryptHashSpy).toHaveBeenCalledWith("testPassword", 10);
  });

  it("/register - should return an error if username or password is not provided", async () => {
    const response = await request(testApp).post("/auth/register").send({
      username: "testUser",
    });

    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      message: "Please provide both username and password",
    });
  });

  it("/register - should return an error if user creation fails", async () => {
    const mockedError = new Error("User creation failed");

    jest.spyOn(User, "create").mockRejectedValueOnce(mockedError);

    const response = await request(testApp).post("/auth/register").send({
      username: "testUser",
      password: "testPassword",
    });

    expect(response.status).toBe(500);
    expect(response.body).toEqual({
      message: "Error creating user",
      error: "User creation failed",
    });
  });

  it("/login - should authenticate user and redirect to dashboard", async () => {
    const response = await request(testApp).post("/auth/login").send({
      username: "testUser",
      password: "testPassword",
    });

    expect(response.status).toBe(302);
    expect(response.headers.location).toBe("/dashboard");
  });

  it("/login - should redirect to login screen if login fails", async () => {
    const response = await request(testApp).post("/auth/login").send({
      username: "invalidUser",
      password: "invalidPassword",
    });

    expect(response.status).toBe(302);
    expect(response.headers.location).toBe("/");
  });

  it("/logout - should log out a user and redirect", async () => {
    // Assuming a user is "logged in" (you might need to simulate this state)
    const response = await request(testApp).get("/auth/logout");

    expect(response.status).toBe(302); // Assuming redirection status code
    expect(response.headers.location).toBe("/"); // Redirects to home page
  });

  it("/logout - should handle errors during logout", async () => {
    // Make a request to the logout route with a query parameter to trigger the mock
    const response = await request(testApp).get(
      "/auth/logout?mockLogoutError=true"
    );

    // Verify that the response correctly indicates an error occurred during logout
    expect(response.status).toBe(500);
    expect(response.body).toEqual({ message: "Error logging out" });
  });
});
