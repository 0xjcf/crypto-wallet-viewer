const { Web3 } = jest.requireActual("web3");

// Mock implementation of some Web3 methods
export const getBalanceMock = jest.fn();
export const fromWeiMock = jest.fn();

class HttpProviderMock {
  public clientUrl: string;

  constructor(clientUrl: string) {
    this.clientUrl = clientUrl;
  }

  public getClientUrl() {
    return this.clientUrl;
  }
}

class Web3Mock extends Web3 {
  getBalance: jest.Mock | undefined;
  fromWei: jest.Mock | undefined;

  constructor(provider: HttpProviderMock) {
    super(provider); // Call super constructor to initialize Web3 with the provided provider
    this.eth = {
      getBalance: getBalanceMock,
    };
    this.utils = {
      fromWei: fromWeiMock,
    };
    this.providers = {
      HttpProvider: provider,
    };
  }
}

// Export the mocks and the Web3 instance directly
export { Web3Mock as Web3, HttpProviderMock as HttpProvider };
