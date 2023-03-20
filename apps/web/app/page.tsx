import db from "db"
import { Fragment } from "react"
import { exclude } from "utils"

import styles from "./page.module.scss"
import StatusBar from "./StatusBar"

export const revalidate = 60

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
      <ul className={styles.bold}>
        <li>なんとアメリカから監視しています。</li>
        <li>PCでご覧ください。</li>
        <li>こっち→に行くほど最新</li>
      </ul>

      {rawStatuses.map(({ target, statuses }, i) => (
        <Fragment key={i}>
          <h2>{target.url}</h2>
          <StatusBar statuses={statuses} />
        </Fragment>
      ))}
    </main>
  )
}
