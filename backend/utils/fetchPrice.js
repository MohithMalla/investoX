const axios = require('axios');

module.exports = async function fetchPrice(symbol) {
    try {
        const url = `https://query1.finance.yahoo.com/v8/finance/chart/${symbol}`;
        const response = await axios.get(url);

        const result = response.data.chart.result[0];
        const lastClosePrice = result.meta.regularMarketPrice;

        return lastClosePrice;
    } catch (error) {
        console.error("❌ Failed to fetch stock price from Yahoo:", error.message);
        return null;
    }
};
