export type CryptoType = "bitcoin";

export type CryptoData = { balance?: number; error?: string };

export type DashboardData = Record<CryptoType, CryptoData>;

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
