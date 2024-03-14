import request from "supertest";
import express from "express";
import { MongoClient, Db, ObjectId } from "mongodb";
import walletController from "../../controllers/walletController";
import fetchBalanceFunctions from "../../utils/fetchBalanceFunctions";
import { initializeTestApp } from "../utils/testUtils";
import User, { IUser } from "../../models/User";

describe("Wallet Controller", () => {
  let testApp: express.Application;
  let mongoClient: MongoClient;
  let db: Db;
  let userId = new ObjectId();
  const isAuthenticated = true;

  beforeAll(async () => {
    mongoClient = new MongoClient(process.env.MONGODB_URI as string);
    await mongoClient.connect();
    db = mongoClient.db();

    testApp = initializeTestApp("/wallet", walletController, isAuthenticated, {
      id: userId.toHexString(), // setting id to be able to look up the user in the mock database for the tests
    });
  });

  afterEach(async () => {
    jest.clearAllMocks();
  });

  afterAll(async () => {
    await mongoClient.db().collection("users").deleteMany({});
    await mongoClient.close();
  });

  it("/wallet - should fetch the user's cryptocurrency balance", async () => {
    const cryptocurrency = "bitcoin";
    fetchBalanceFunctions[cryptocurrency] = jest.fn().mockResolvedValue(100);

    const response = await request(testApp)
      .post(`/wallet/${cryptocurrency}`)
      .send({
        address: "testAddress",
      });

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ balance: 100 });
    expect(fetchBalanceFunctions[cryptocurrency]).toHaveBeenCalledWith(
      "testAddress"
    );
  });

  it("/wallet - should update the user's cryptocurrency address", async () => {
    const cryptocurrency = "ethereum";
    const address = "newEthAddress";

    await db.collection("users").insertOne({
      _id: userId,
      username: "testUser",
      ethereumAddress: "oldEthAddress",
    });

    const response = await request(testApp)
      .put(`/wallet/${cryptocurrency}`)
      .send({
        address,
      });
    // check that the response is correct
    expect(response.status).toBe(200);
    expect(response.body).toMatchObject({
      message: "Address updated successfully",
      user: {
        username: "testUser",
        ethereumAddress: "newEthAddress",
      },
    });
    // check that the user's address was updated in the database
    const updatedUser = (await db
      .collection("users")
      .findOne({ _id: userId })) as IUser;

    expect(updatedUser.ethereumAddress).toBe("newEthAddress");
    expect(updatedUser).toMatchObject({
      username: "testUser",
      ethereumAddress: "newEthAddress",
    });
  });

  it("/wallet - should return 401 if the user is not authenticated", async () => {
    const unAuthorizedTestApp = initializeTestApp(
      "/wallet",
      walletController,
      false
    );

    const response = await request(unAuthorizedTestApp)
      .post("/wallet/bitcoin")
      .send({ address: "testAddress" });

    expect(response.status).toBe(401);
    expect(response.body).toEqual({ message: "Unauthorized" });
  });

  it("/wallet - should return 400 if the cryptocurrency is not supported", async () => {
    const response = await request(testApp)
      .post("/wallet/unsupportedCrypto")
      .send({ address: "testAddress" });

    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      message: "Unsupported cryptocurrency type",
    });
  });

  it("/wallet - should return 500 if an error occurs while fetching the balance", async () => {
    fetchBalanceFunctions.bitcoin = jest
      .fn()
      .mockRejectedValue(new Error("Test Error"));

    const response = await request(testApp)
      .post("/wallet/bitcoin")
      .send({ address: "testAddress" });

    expect(response.status).toBe(500);
    expect(response.body).toEqual({
      message: "Error fetching balance",
      error: "Test Error",
    });
  });

  it("/wallet - should return 401 if the user is not authenticated when updating the address", async () => {
    const unAuthorizedTestApp = initializeTestApp(
      "/wallet",
      walletController,
      false
    );

    const response = await request(unAuthorizedTestApp)
      .put("/wallet/bitcoin")
      .send({ address: "testAddress" });

    expect(response.status).toBe(401);
    expect(response.body).toEqual({ message: "Unauthorized" });
  });

  it("/wallet - should return 400 if the address or cryptocurrency is not provided when updating the address", async () => {
    const response = await request(testApp).put("/wallet/bitcoin");

    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      message: "Please provide both address and cryptocurrency",
    });
  });

  it("/wallet - should return 500 if an error occurs while updating the address", async () => {
    jest.spyOn(User, "findOneAndUpdate").mockRejectedValue(new Error());

    const response = await request(testApp)
      .put("/wallet/bitcoin")
      .send({ address: "testAddress" });

    expect(response.status).toBe(500);
    expect(response.body).toEqual({
      message: "Error updating address",
      error: {},
    });
  });
});
