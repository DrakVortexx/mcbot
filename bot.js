import mineflayer from "mineflayer"

const bot = mineflayer.createBot({
  host: "fa.mc.gg",
  port: 25565,
  username: "MinerBot" // change name if needed
})

// Search radius for breaking blocks
const RADIUS = 4

bot.once("spawn", () => {
  console.log("Bot spawned! Starting mining loop...")
  mineLoop()
})

async function mineLoop() {
  while (true) {
    try {
      const target = findBlockToMine()

      if (target) {
        console.log("Mining:", target.name)
        
        await bot.pathfinder?.goto ?
          bot.pathfinder.goto(bot.pathfinder.movements.follow(target.position)) :
          bot.lookAt(target.position.offset(0.5, 0.5, 0.5))

        await bot.dig(target)
      }

    } catch (err) {
      console.log("Error:", err.message)
    }

    await sleep(500)
  }
}

function findBlockToMine() {
  return bot.findBlock({
    matching: block => block && block.name !== "air",
    maxDistance: RADIUS
  })
}

function sleep(ms) {
  return new Promise(r => setTimeout(r, ms))
}

bot.on("error", err => console.log("Bot error:", err))
bot.on("end", () => console.log("Bot disconnected"))
