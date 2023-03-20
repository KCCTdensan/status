import cron from "node-cron"

import db from "db"

db.$connect()

cron.schedule("* * * * *", async () => {
  const targets = await db.target.findMany()
  targets.forEach(async target => {
    try {
      const res = await fetch(target.url)
      await db.status.create({
        data: {
          targetId: target.id,
          status: res.status,
        },
      })
    } catch (e) {
      const cause = (e as any).cause
      await db.status.create({
        data: {
          targetId: target.id,
          cause: {
            create: {
              errno: cause.errno,
              code: cause.code,
              syscall: cause.syscall,
              address: cause.address,
              port: cause.port,
            },
          },
        },
      })
    }
  })
})

console.log("================================")
console.log("  updater started")
console.log("================================")
