const express = require("express");
const router = express.Router();
const getTokenBalance = require("../utils/getBalance");
const fetchBTCPrice = require("../utils/fetchPrices");

router.get("/check-balance/:wallet", async (req, res) => {
  const wallet = req.params.wallet;

  try {
    const tokenBalance = await getTokenBalance(
      wallet,
      process.env.POLYGON_RPC,
      process.env.TOKEN_CONTRACT,
      parseInt(process.env.TOKEN_DECIMALS)
    );

    const feeUSD = tokenBalance * 0.02; // 2%
    const btcPrice = await fetchBTCPrice();
    const feeBTC = feeUSD / btcPrice;

    res.json({
      wallet,
      tokenBalance,
      feeUSD: feeUSD.toFixed(2),
      btcPrice,
      feeBTC: feeBTC.toFixed(8)
    });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch balance or price." });
  }
});

module.exports = router;
