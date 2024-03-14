import express from "express";
import fetchBalanceFunctions from "../utils/fetchBalanceFunctions";
import { CryptoType, DashboardData } from "../../types/cryptoTypes";

const router = express.Router();

router.get("/", async (request, response) => {
  if (!request.isAuthenticated()) {
    return response.redirect("/");
  }

  type CryptoAddress = keyof typeof request.user;

  try {
    const balancePromises = Object.entries(fetchBalanceFunctions).map(
      async ([cryptoType, fetchBalance]) => {
        const cryptoAddress =
          request.user[`${cryptoType}Address` as CryptoAddress];

        if (cryptoAddress) {
          try {
            const balance = await fetchBalance(cryptoAddress);
            return { cryptoType, data: { balance } };
          } catch (error) {
            return {
              cryptoType,
              data: { error: "Failed to fetch wallet data" },
            };
          }
        }

        return {
          cryptoType,
          data: { balance: 0 },
        };
      }
    );

    const balances = await Promise.all(balancePromises);
    const dashboardData = balances.reduce((acc, accountData) => {
      const { cryptoType, data } = accountData;
      acc[cryptoType as CryptoType] = data;
      return acc;
    }, {} as DashboardData);

    response.json(dashboardData);
  } catch (error) {
    response.status(500).json({ error: "An unexpected error occurred" });
  }
});

export default router;
