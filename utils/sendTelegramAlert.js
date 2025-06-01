// utils/sendTelegramAlert.js
const TelegramBot = require("node-telegram-bot-api");

const bot = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN);

function escapeMarkdownV2(text) {
  const specials = /[_*[\]()~`>#+\-=|{}.!]/g;
  return text.replace(specials, '\\$&');
}

const sendTelegramAlert = (wallet, method, filePath) => {
  const escapedWallet = escapeMarkdownV2(wallet);
  const escapedMethod = escapeMarkdownV2(method.toUpperCase());
  const escapedFilePath = escapeMarkdownV2(filePath);

  const message = `
🚨 New Screenshot Uploaded
👛 Wallet: \`${escapedWallet}\`
💰 Method: *${escapedMethod}*
🖼️ Screenshot: ${escapedFilePath}
`;

  bot.sendMessage(process.env.TELEGRAM_CHAT_ID, message, { parse_mode: 'MarkdownV2' })
    .then(() => console.log("Telegram alert sent successfully!"))
    .catch(err => {
      console.error("Failed to send Telegram alert:", err.message);
    });
};

module.exports = sendTelegramAlert;