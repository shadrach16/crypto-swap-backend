const axios = require("axios");

const fetchBTCPrice = async () => {
  const url = process.env.BTC_PRICE_API;
  const res = await axios.get(url);
  return res.data.bitcoin.usd;
};

module.exports = fetchBTCPrice;
