const mineflayer = require('mineflayer');
const http = require('http');

// Keepalive web server for Render
http.createServer((req, res) => {
  res.writeHead(200);
  res.end('Bot is alive');
}).listen(process.env.PORT || 3000);

let bot;
let retryScheduled = false;

const botOptions = {
  host: 'rubblesmp.aternos.me',
  port: 57916,
  username: 'bot',
  version: '1.21.10' // version must be a string
};

function createBot() {
  console.log(`[${new Date().toISOString()}] Starting bot...`);

  // Clean up old bot if exists
  if (bot) {
    bot.removeAllListeners();
    try { bot.quit(); } catch {}
    bot = null;
  }

  try {
    bot = mineflayer.createBot(botOptions);
  } catch (err) {
    console.log(`[${new Date().toISOString()}] Failed to create bot:`, err);
    scheduleRetry();
    return;
  }

  bot.on('spawn', () => {
    console.log(`[${new Date().toISOString()}] Bot spawned and connected!`);
  });

  bot.on('end', () => {
    console.log(`[${new Date().toISOString()}] Bot disconnected.`);
    scheduleRetry();
  });

  bot.on('error', (err) => {
    console.log(`[${new Date().toISOString()}] Bot error:`, err);
    // Only retry for network/connection errors
    if (err.code !== 'ECONNREFUSED') { 
      scheduleRetry();
    }
  });
}

function scheduleRetry() {
  if (retryScheduled) return;
  retryScheduled = true;
  console.log(`[${new Date().toISOString()}] Retrying in 30 seconds...`);
  setTimeout(() => {
    retryScheduled = false;
    createBot();
  }, 30000);
}

// Start the bot
createBot();
