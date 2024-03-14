import express from "express";
import fetchBalanceFunctions from "../utils/fetchBalanceFunctions";
import User from "../models/User";

const router = express.Router();

// Route for fetching the user's cryptocurrency balance
router.post("/:cryptocurrency", async (request, response) => {
  if (!request.isAuthenticated()) {
    return response.status(401).json({ message: "Unauthorized" });
  }

  const { cryptocurrency } = request.params;
  const { address } = request.body;
  type keyOfFunctions = keyof typeof fetchBalanceFunctions;
  const fetchBalance = fetchBalanceFunctions[cryptocurrency as keyOfFunctions];

  if (!fetchBalance) {
    return response
      .status(400)
      .json({ message: "Unsupported cryptocurrency type" });
  }

  try {
    const balance = await fetchBalance(address);
    response.json({ balance });
  } catch (error) {
    if (error instanceof Error) {
      return response
        .status(500)
        .json({ message: "Error fetching balance", error: error.message });
    }
  }
});

// Rout for updating the user's cryptocurrency addresses
router.put("/:cryptocurrency", async (request, response) => {
  if (!request.isAuthenticated()) {
    return response.status(401).json({ message: "Unauthorized" });
  }

  const { cryptocurrency } = request.params;
  const { address } = request.body;

  if (!address || !cryptocurrency) {
    return response
      .status(400)
      .json({ message: "Please provide both address and cryptocurrency" });
  }

  try {
    // Update the user's cryptocurrency address
    const updatedUser = await User.findByIdAndUpdate(
      request.user.id,
      { [`${cryptocurrency}Address`]: address },
      { new: true }
    );
    return response.json({
      message: "Address updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    return response
      .status(500)
      .json({ message: "Error updating address", error });
  }
});

export default router;
