import cron from "node-cron"

import prisma from "~/libs/db"

const task = cron.schedule("* * * * *", async () => {
  const targets = await prisma.target.findMany()
  targets.forEach(async target => {
    try {
      const res = await fetch(target.url)
      await prisma.status.create({
        data: {
          targetId: target.id,
          status: res.status,
        },
      })
    } catch (e) {
      const cause = (e as any).cause
      await prisma.status.create({
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

export default task
