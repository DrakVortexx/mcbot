const mineflayer = require('mineflayer');
const http = require('http');

// Keepalive server (required for Render)
http.createServer((req, res) => {
  res.writeHead(200);
  res.end('Bot is running');
}).listen(process.env.PORT || 3000);

const botOptions = {
  host: 'rubblesmp.aternos.me',
  port: 57916,
  username: 'bot',
  version: false
};

let bot;

function createBot() {
  bot = mineflayer.createBot(botOptions);

  bot.on('spawn', () => {
    console.log('Bot spawned!');
  });

  bot.on('end', () => {
    console.log('Bot disconnected.');
    reconnect();
  });

  bot.on('error', (err) => {
    console.log('Bot error:', err);
    reconnect();
  });
}

function reconnect() {
  console.log('Reconnecting in 60 seconds...');
  setTimeout(createBot, 60000);
}

createBot();
