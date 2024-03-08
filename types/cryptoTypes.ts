export type CryptoType = "bitcoin";
export type DashboardData = Record<CryptoType, { balance: number }>;
export type BitcoinBalanceResponse = {
  address: string;
  total_received: number;
  total_sent: number;
  balance: number;
  unconfirmed_balance: number;
  final_balance: number;
  n_tx: number;
  unconfirmed_n_tx: number;
  final_n_tx: number;
};
