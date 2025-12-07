const mineflayer = require('mineflayer');
const http = require('http');

// Keepalive web server
http.createServer((req, res) => {
  res.writeHead(200);
  res.end('Bot is alive');
}).listen(process.env.PORT || 3000);

const botOptions = {
  host: 'rubblesmp.aternos.me',
  port: 57916,
  username: 'AFKBot',
  version: 'auto'
};

function startBotCycle() {
  console.log(`[${new Date().toISOString()}] Connecting bot...`);

  const bot = mineflayer.createBot(botOptions);

  bot.once('spawn', () => {
    console.log(`[${new Date().toISOString()}] Bot connected, waiting 2 seconds...`);
    
    // Wait 2 seconds, then disconnect
    setTimeout(() => {
      console.log(`[${new Date().toISOString()}] Disconnecting bot...`);
      bot.quit(); // triggers 'end' event
    }, 2000);
  });

  bot.on('end', () => {
    console.log(`[${new Date().toISOString()}] Bot disconnected, waiting 60 seconds before reconnecting...`);
    
    // Wait 60 seconds before reconnecting
    setTimeout(() => {
      startBotCycle(); // reconnect
    }, 60000);
  });

  bot.on('error', (err) => {
    console.log(`[${new Date().toISOString()}] Bot error:`, err);
  });
}

// Start the first cycle
startBotCycle();
