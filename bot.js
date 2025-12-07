const mineflayer = require('mineflayer');
const http = require('http');

// Keepalive web server for Render
http.createServer((req, res) => {
  res.writeHead(200);
  res.end('Bot is alive');
}).listen(process.env.PORT || 3000);

let bot;
const botOptions = {
  host: 'rubblesmp.aternos.me',
  port: 57916,
  username: 'bot',
  version: false
};

function createBot() {
  console.log("Starting bot...");

  try {
    bot = mineflayer.createBot(botOptions);
  } catch (err) {
    console.log("Mineflayer failed to start:", err);
    retry();
    return;
  }

  bot.on('spawn', () => {
    console.log('Bot spawned and connected!');
  });

  bot.on('end', () => {
    console.log('Bot ended. Retrying...');
    retry();
  });

  bot.on('error', (err) => {
    console.log('Bot error:', err);
    retry();
  });
}

function retry() {
  console.log("Retrying in 30 seconds...");
  setTimeout(() => {
    createBot();
  }, 30000);
}

createBot();
