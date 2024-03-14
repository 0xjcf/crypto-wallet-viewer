import request from "supertest";
import dashboardController from "../../controllers/dashboardController";
import fetchBalanceFunctions from "../../utils/fetchBalanceFunctions";
import { initializeTestApp } from "../utils/testUtils";

const originalAll = Promise.all;

const user = {
  bitcoinAddress: "someBitcoinAddress",
  ethereumAddress: "someEthereumAddress",
};

describe("Dashboard Controller", () => {
  afterEach(() => {
    jest.restoreAllMocks(); // Restores functions to their original implementations
  });

  afterAll(() => {
    Promise.all = originalAll;
  });

  it("/dashboard - redirects to homepage if user is not authenticated", async () => {
    const isAuthenticated = false;
    const testApp = initializeTestApp(
      "/",
      dashboardController,
      isAuthenticated
    );

    const response = await request(testApp).get("/");
    expect(response.status).toBe(302); // Assuming redirect status code
    expect(response.headers.location).toBe("/"); // Assuming redirection to homepage
  });

  it("/dashboard - responds with dashboard data when user is authenticated", async () => {
    const isAuthenticated = true;
    const testApp = initializeTestApp(
      "/",
      dashboardController,
      isAuthenticated,
      user
    );

    // Set default mock resolved values
    fetchBalanceFunctions["bitcoin"] = jest.fn().mockResolvedValue(0.5);
    fetchBalanceFunctions["ethereum"] = jest.fn().mockResolvedValue(2);

    const response = await request(testApp).get("/");
    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      bitcoin: { balance: 0.5 },
      ethereum: { balance: 2 },
    });
  });

  it("/dashboard - responds with an error message for wallet that fails to fetch the balance", async () => {
    const isAuthenticated = true;
    const testApp = initializeTestApp(
      "/",
      dashboardController,
      isAuthenticated,
      user
    );
    // Mock fetchBalanceFunctions to throw an error
    fetchBalanceFunctions["bitcoin"] = jest.fn().mockResolvedValue(0);
    fetchBalanceFunctions["ethereum"] = jest
      .fn()
      .mockRejectedValue(new Error());

    const response = await request(testApp).get("/");
    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      bitcoin: {
        balance: 0,
      },
      ethereum: {
        error: "Failed to fetch wallet data",
      },
    });
  });

  it("/dashboard - returns a balance of 0 for cryptocurrencies without an address", async () => {
    const isAuthenticated = true;
    const user = {
      bitcoinAddress: "someBitcoinAddress",
      // missing ethereumAddress
    };
    const testApp = initializeTestApp(
      "/",
      dashboardController,
      isAuthenticated,
      user
    );

    // Setup mock resolved values for available addresses, and ensure the logic defaults to balance: 0 for missing addresses
    fetchBalanceFunctions["bitcoin"] = jest.fn().mockResolvedValue(0.5);
    // Not spying or mocking `ethereum` since no address will trigger the logic path we're testing

    const response = await request(testApp).get("/");

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      bitcoin: { balance: 0.5 },
      ethereum: { balance: 0 }, // Expecting balance: 0 for ethereum due to missing address
    });
  });

  it("/dashboard - handles unexpected errors gracefully", async () => {
    const isAuthenticated = true;
    const testApp = initializeTestApp(
      "/",
      dashboardController,
      isAuthenticated,
      user
    );

    // Simulate an unexpected error in Promise.all
    Promise.all = jest.fn().mockImplementation(() => {
      return new Promise((_resolve, reject) => {
        reject("Simulated error in Promise.all");
      });
    });

    const response = await request(testApp).get("/");

    // Assuming your controller sends a 500 status with a generic error message
    // for unexpected errors as shown in the modified controller code.
    expect(response.status).toBe(500);
    expect(response.body).toEqual({ error: "An unexpected error occurred" });

    // Restore the mocked implementation to avoid affecting other tests
    jest.restoreAllMocks();
  });
});
