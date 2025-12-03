import mineflayer from "mineflayer"

let bot

function startBot() {
  bot = mineflayer.createBot({
    host: "fa.mc.gg",
    port: 25565,
    username: "MinerBot" // change this if you want
  })

  bot.once("spawn", () => {
    console.log("Bot spawned! Starting mining loop...")
    mineLoop()
  })

  bot.on("end", () => {
    console.log("Bot disconnected. Reconnecting in 10 seconds...")
    setTimeout(startBot, 10000)
  })

  bot.on("error", (err) => {
    console.log("Bot error:", err.message)
  })
}

startBot()

// ---------------------------
// Mining System
// ---------------------------

const RADIUS = 4

async function mineLoop() {
  while (bot && bot.entity) {
    try {
      const target = findBlockToMine()

      if (target) {
        console.log("Mining:", target.name)

        // Look at block
        await bot.lookAt(target.position.offset(0.5, 0.5, 0.5))

        // Dig block
        await bot.dig(target)
      }
    } catch (err) {
      console.log("Error:", err.message)
    }

    await sleep(500)
  }
}

function findBlockToMine() {
  if (!bot) return null
  return bot.findBlock({
    matching: block => block && block.name !== "air",
    maxDistance: RADIUS
  })
}

function sleep(ms) {
  return new Promise(r => setTimeout(r, ms))
}
