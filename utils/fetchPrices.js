// src/utils/fetchPrices.js
const axios = require("axios");

const fetchBTCPrice = async () => {
  const url = process.env.BTC_PRICE_API;
  console.log('[fetchBTCPrice] URL check: ' + url); // Using a prefix for easier log identification

  try {
    const res = await axios.get(url);

    // Only log the response data on success, and use console.log
    console.log('[fetchBTCPrice] Successfully fetched response data:', res.data);

    // Basic validation of the response structure
    if (!res.data || !res.data.bitcoin || typeof res.data.bitcoin.usd !== 'number') {
      console.error('[fetchBTCPrice] Invalid response format from API:', JSON.stringify(res.data));
      throw new Error('Invalid response format from BTC price API. Expected data.bitcoin.usd.');
    }

    return res.data.bitcoin.usd;

  } catch (error) {
    // This block catches any error thrown by axios.get(url)
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.error('[fetchBTCPrice] API Response Error:', {
        status: error.response.status,
        headers: error.response.headers,
        data: error.response.data,
      });
      throw new Error(`Failed to fetch BTC price (HTTP ${error.response.status}): ${JSON.stringify(error.response.data)}`);
    } else if (error.request) {
      // The request was made but no response was received
      // `error.request` is an instance of XMLHttpRequest in the browser and an http.ClientRequest in node.js
      console.error('[fetchBTCPrice] Network Error (No response received):', error.request);
      throw new Error('Network error when trying to fetch BTC price. No response received.');
    } else {
      // Something happened in setting up the request that triggered an Error
      console.error('[fetchBTCPrice] Request Setup Error:', error.message);
      throw new Error(`Error setting up BTC price request: ${error.message}`);
    }
  }
};

module.exports = fetchBTCPrice;