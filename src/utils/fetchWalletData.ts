import axios from "axios";
import { Web3 } from "web3";
import dotenv from "dotenv";
import { BitcoinBalanceResponse } from "../../types/cryptoTypes";

dotenv.config();

export async function fetchBitcoinBalance(address: string) {
  const btcTesnetUrl = `https://api.blockcypher.com/v1/btc/test3/addrs/${address}/balance`; //! just for testing purposes
  try {
    const response = await axios.get<BitcoinBalanceResponse>(btcTesnetUrl);
    const statoshis = 100000000;
    return response.data.final_balance / statoshis;
  } catch (error) {
    throw new Error(`Unable to get balance for address: ${address}`);
  }
}

const provider = `https://sepolia.infura.io/v3/${process.env.INFURA_API_KEY}`; //! just for testing purposes
const web3Provider = new Web3.providers.HttpProvider(
  provider || "ws://localhost:8545"
);
const web3 = new Web3(web3Provider);

export async function fetchEthereumBalance(address: string) {
  try {
    const balance = await web3.eth.getBalance(address);
    const balanceInEther = Number.parseFloat(
      web3.utils.fromWei(balance, "ether")
    );
    return balanceInEther;
  } catch (error) {
    throw new Error(`Unable to get balance for address: ${address}`);
  }
}
