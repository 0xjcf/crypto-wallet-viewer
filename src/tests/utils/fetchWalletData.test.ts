import axios from "axios";
import {
  fetchBitcoinBalance,
  fetchEthereumBalance,
  getWeb3ProviderUrl,
} from "../../utils/fetchWalletData";
// @ts-ignore mocking Web3
import { getBalanceMock, fromWeiMock, Web3, HttpProvider } from "web3";

const mockedAxios = axios as jest.Mocked<typeof axios>;

describe("fetchBitcoinBalance", () => {
  beforeEach(() => {
    // Clear all instances and calls to constructor and all methods:
    mockedAxios.get.mockClear();
  });

  it("uses the default mock implementation of axios.get", async () => {
    const address = "defaultMockTestAddress";

    // Call the function without setting a specific mock implementation for this test
    const result = await fetchBitcoinBalance(address);

    // Check that the default mock implementation was used
    expect(axios.get).toHaveBeenCalledWith(
      `https://api.blockcypher.com/v1/btc/test3/addrs/${address}/balance`
    );

    // Check that the default mock implementation returned 0
    expect(result).toBe(0);
  });

  it("fetches Bitcoin balance correctly", async () => {
    const address = "testBitcoinAddress";
    const mockBitcoinBalanceResponse = {
      data: {
        final_balance: 100000000, // 1 BTC in Satoshis
      },
    };

    // Setup axios mock to resolve with the mock response
    mockedAxios.get.mockResolvedValue(mockBitcoinBalanceResponse);

    const balance = await fetchBitcoinBalance(address);

    expect(balance).toEqual(1); // Expect the balance to be 1 BTC
    expect(mockedAxios.get).toHaveBeenCalledWith(
      `https://api.blockcypher.com/v1/btc/test3/addrs/${address}/balance`
    );
  });

  it("throws an error on failure to fetch Bitcoin balance", async () => {
    const address = "testBitcoinAddress";
    // Setup axios mock to reject
    mockedAxios.get.mockRejectedValue(new Error("Failed to fetch balance"));

    await expect(fetchBitcoinBalance(address)).rejects.toThrow(
      `Unable to get balance for address: ${address}`
    );
  });
});

describe("fetchEthereumBalance", () => {
  beforeEach(() => {
    // Setup mock responses
    getBalanceMock.mockResolvedValue("1000000000000000000"); // 1 ETH in Wei
    fromWeiMock.mockReturnValue("1"); // Convert Wei to ETH
  });

  it("fetches Ethereum balance correctly", async () => {
    const address = "0x123";
    const balance = await fetchEthereumBalance(address);

    expect(balance).toEqual(1); // Expect the balance to be 1 ETH
    expect(getBalanceMock).toHaveBeenCalledWith(address);
    expect(fromWeiMock).toHaveBeenCalledWith("1000000000000000000", "ether");
  });

  it("throws an error on failure", async () => {
    getBalanceMock.mockRejectedValue(new Error("Failed to fetch balance"));
    const address = "0x123";

    await expect(fetchEthereumBalance(address)).rejects.toThrow(
      "Unable to get balance for address: 0x123"
    );
  });
});

describe("Web3 Initialization", () => {
  beforeEach(() => {
    jest.resetModules();
    delete process.env.INFURA_API_KEY;
  });

  it("should use the default provider URL if INFURA_API_KEY is not set", () => {
    expect(getWeb3ProviderUrl()).toEqual("http://localhost:8545");
  });

  it("should use the INFURA provider URL if INFURA_API_KEY is set", () => {
    process.env.INFURA_API_KEY = "testApiKey";
    expect(getWeb3ProviderUrl()).toEqual(
      "https://sepola.infura.io/v3/testApiKey"
    );
  });

  it("should initialize Web3 with the correct provider URL", () => {
    process.env.INFURA_API_KEY = "testApiKey";
    const web3Provider = new HttpProvider(getWeb3ProviderUrl());
    const web3 = new Web3(web3Provider) as jest.Mocked<
      Web3 & {
        providers: {
          HttpProvider: {
            getClientUrl: () => string;
          };
        };
      }
    >;
    expect(web3.providers.HttpProvider.getClientUrl()).toEqual(
      getWeb3ProviderUrl()
    );
    delete process.env.INFURA_API_KEY;
  });
});
