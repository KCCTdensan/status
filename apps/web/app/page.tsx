import db from "db"
import { Fragment } from "react"
import { exclude } from "utils"

import styles from "./page.module.scss"
import StatusBar from "./StatusBar"

async function getData() {
  const mikkamae = new Date(Date.now() - 1000 * 60 * 60 * 24 * 3)

  // 見事なN+1 Prismaを信じて放置
  const targets = await db.target.findMany()
  const statuses = await Promise.all(
    targets.map(target =>
      db.status.findMany({
        where: {
          targetId: target.id,
          time: { gte: mikkamae },
        },
        include: { cause: true },
      })
    )
  )

  const rawStatuses = targets.map((target, i) => ({
    target,
    statuses: statuses[i].map(status =>
      exclude(
        {
          ...status,
          time: status.time.getTime(),
          cause: status.cause
            ? exclude(status.cause, ["id", "statusId"])
            : null,
        },
        ["id", "targetId"]
      )
    ),
  }))

  return { rawStatuses }
}

export default async function IndexPage() {
  const { rawStatuses } = await getData()

  return (
    <main className={styles.main}>
      <h2>ほげほげ</h2>
      <b>
        なんとアメリカから監視しています。
        <br />
        こっち→に行くほど最新
      </b>

      {rawStatuses.map(({ target, statuses }, i) => (
        <Fragment key={i}>
          <h2>{target.url}</h2>
          <StatusBar statuses={statuses} />
        </Fragment>
      ))}
    </main>
  )
}
