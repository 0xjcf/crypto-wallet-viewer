import axios from "axios";
import { BitcoinBalanceResponse } from "../../types/cryptoTypes";

export async function fetchBitcoinBalance(address: string) {
  const btcTesnetUrl = `https://api.blockcypher.com/v1/btc/test3/addrs/${address}/balance`;
  // const blockCypherTestUrl = `https://api.blockcypher.com/v1/byc/test/addrs/${address}/balance`;
  try {
    const response = await axios.get<BitcoinBalanceResponse>(btcTesnetUrl);
    return response.data.balance || 0;
  } catch (error) {
    throw new Error(`Unable to get balance for address: ${address}`);
  }
}
