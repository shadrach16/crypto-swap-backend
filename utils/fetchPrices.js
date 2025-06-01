// src/utils/fetchPrices.js
const axios = require("axios");

// In-memory cache variables (KEEP THESE!)
let cachedBTCPrice = null;
let lastFetchTime = 0;
const CACHE_DURATION = 5 * 60 * 1000; // Cache duration in milliseconds (e.g., 5 minutes)

const fetchBTCPrice = async () => {
  const url = 'https://blockchain.info/ticker'; // New URL

  // Check if we have a valid cached price that hasn't expired (KEEP THIS!)
  if (cachedBTCPrice && (Date.now() - lastFetchTime < CACHE_DURATION)) {
    console.log('[fetchBTCPrice] Returning cached BTC price (from Blockchain.com).');
    return cachedBTCPrice;
  }

  console.log('[fetchBTCPrice] Attempting to fetch from Blockchain.com URL: ' + url);

  try {
    const res = await axios.get(url);

    console.log('[fetchBTCPrice] Successfully fetched response data from Blockchain.com:', res.data);

    // --- IMPORTANT: Adjust parsing for Blockchain.com's response structure ---
    // The response is an object where keys are currency codes, e.g., { "USD": { "last": 69500, ... } }
    if (!res.data || !res.data.USD || typeof res.data.USD.last === 'undefined') {
      console.error('[fetchBTCPrice] Invalid response format from Blockchain.com API:', res.data);
      throw new Error('Invalid response format from Blockchain.com API. Expected data.USD.last.');
    }

    const currentPrice = res.data.USD.last; // Get the 'last' price for USD

    // Update cache (KEEP THIS!)
    cachedBTCPrice = currentPrice;
    lastFetchTime = Date.now();
    console.log(`[fetchBTCPrice] New BTC price fetched and cached from Blockchain.com: ${currentPrice}`);

    return currentPrice;

  } catch (error) {
    // This robust error handling block should stay the same, it's generic for axios
    if (error.response) {
      console.error('[fetchBTCPrice] API Response Error (Blockchain.com):', {
        status: error.response.status,
        headers: error.response.headers,
        data: error.response.data,
      });
      // Keep cache fallback here too
      if (error.response.status === 429 && cachedBTCPrice) {
          console.log("[fetchBTCPrice] Blockchain.com Rate Limit Exceeded. Returning stale cached price.");
          return cachedBTCPrice;
      }
      throw new Error(`Failed to fetch BTC price from Blockchain.com (HTTP ${error.response.status}): ${JSON.stringify(error.response.data)}`);
    } else if (error.request) {
      console.error('[fetchBTCPrice] Network Error (No response received from Blockchain.com):', error.request);
      throw new Error('Network error when trying to fetch BTC price from Blockchain.com. No response received.');
    } else {
      console.error('[fetchBTCPrice] Request Setup Error (Blockchain.com):', error.message);
      throw new Error(`Error setting up BTC price request for Blockchain.com: ${error.message}`);
    }
  }
};

module.exports = fetchBTCPrice;