const cron = require("node-cron");
const Alert = require("../model/AlertModel");
const fetchPrice = require("../utils/fetchPrice");

module.exports = function priceChecker() {
  // Run every 1 minute
cron.schedule("*/5 * * * *", async () => {
    console.log("⏰ [Cron Job] Checking alerts...");

    try {
      const alerts = await Alert.find({ notified: false });

      if (alerts.length === 0) {
        console.log("📭 No active alerts to process.");
        return;
      }

      await Promise.all(
        alerts.map(async (alert) => {
          try {
            const currentPrice = await fetchPrice(alert.symbol);

            if (!currentPrice) {
              console.warn(`⚠️ Could not fetch price for ${alert.symbol}`);
              return;
            }

            const changePercent =
              ((currentPrice - alert.basePrice) / alert.basePrice) * 100;

            console.log(
              `📊 ${alert.symbol}: Base ₹${alert.basePrice}, Current ₹${currentPrice}, Change ${changePercent.toFixed(
                2
              )}%`
            );

            if (changePercent >= alert.targetPercent) {
              console.log(
                `✅ 🔔 ALERT: ${alert.symbol} hit target! (+${changePercent.toFixed(
                  2
                )}%)`
              );
              alert.notified = true;
              alert.triggeredAt = new Date(); // optional: if you've added triggeredAt in schema
            }

            alert.currentPrice = currentPrice;
            await alert.save();
          } catch (innerErr) {
            console.error(
              `❌ Error processing alert for ${alert.symbol}:`,
              innerErr.message
            );
          }
        })
      );
    } catch (err) {
      console.error("❌ Cron Job Error:", err.message);
    }
  });
};
