import express from "express";
import fetchBalanceFunctions from "../utils/fetchBalanceFunctions";
import { CryptoType, DashboardData } from "../../types/cryptoTypes";

const router = express.Router();

router.get("/", async (request, response) => {
  if (!request.isAuthenticated()) {
    return response.redirect("/");
  }

  const balancePromises = Object.entries(fetchBalanceFunctions).map(
    async ([cryptoType, fetchBalance]) => {
      const address =
        request.user[`${cryptoType}Address` as keyof typeof request.user];

      if (address) {
        const balance = await fetchBalance(address);
        return {
          cryptoType,
          balance: balance || 0,
        };
      }

      return {
        cryptoType,
        balance: 0,
      };
    }
  );

  try {
    const balances = await Promise.all(balancePromises);
    const dashboardData = balances.reduce((acc, accountData) => {
      const { cryptoType, balance } = accountData;
      acc[cryptoType as CryptoType] = { balance };
      return acc;
    }, {} as DashboardData);

    response.json(dashboardData);
  } catch (error) {
    response.status(500).json({ error: "Failed to fetch wallet data" });
  }
});

export default router;
