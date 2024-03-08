import { fetchBitcoinBalance } from "./fetchWalletData";

// Define a mapping of cryptocurrency types to their fetching functions
const fetchBalanceFunctions = {
  bitcoin: fetchBitcoinBalance,
  // Add more cryptocurrencies and their respective functions here
};

export default fetchBalanceFunctions;
