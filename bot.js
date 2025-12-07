const mineflayer = require('mineflayer');
const http = require('http');

http.createServer((req, res) => {
  res.writeHead(200);
  res.end('Bot is alive');
}).listen(process.env.PORT || 3000);

let bot;
let retryTimeout;

const botOptions = {
  host: 'rubblesmp.aternos.me',
  port: 57916,
  username: 'AFKBot',
  version: 'auto'
};

function createBot() {
  console.log(`[${new Date().toISOString()}] Starting bot...`);

  if (bot) {
    bot.removeAllListeners();
    try { bot.quit(); } catch {}
    bot = null;
  }

  bot = mineflayer.createBot(botOptions);

  bot.once('spawn', () => {
    console.log(`[${new Date().toISOString()}] Bot spawned!`);

    // Example: after being online 2 seconds, wait 60 seconds then reconnect
    setTimeout(() => {
      console.log(`[${new Date().toISOString()}] Reconnecting after 60s...`);
      bot.quit(); // triggers 'end' event and reconnect
    }, 62000); // 2s + 60s
  });

  bot.on('end', () => {
    console.log(`[${new Date().toISOString()}] Bot disconnected.`);
    scheduleRetry();
  });

  bot.on('error', (err) => {
    console.log(`[${new Date().toISOString()}] Bot error:`, err);
    scheduleRetry();
  });

  bot.on('kicked', (reason) => {
    console.log(`[${new Date().toISOString()}] Bot was kicked: ${reason}`);
    scheduleRetry();
  });
}

function scheduleRetry() {
  if (retryTimeout) clearTimeout(retryTimeout); // clear existing timeout
  console.log(`[${new Date().toISOString()}] Retrying in 30 seconds...`);
  retryTimeout = setTimeout(() => {
    retryTimeout = null;
    createBot();
  }, 30000);
}

// Start the bot
createBot();
