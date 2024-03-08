import { fetchBitcoinBalance, fetchEthereumBalance } from "./fetchWalletData";

// Define a mapping of cryptocurrency types to their fetching functions
const fetchBalanceFunctions = {
  bitcoin: fetchBitcoinBalance,
  ethereum: fetchEthereumBalance,
  // Add more cryptocurrencies and their respective functions here
};

export default fetchBalanceFunctions;
