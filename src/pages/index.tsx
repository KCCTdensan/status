import { InferGetServerSidePropsType } from "next"
import { Fragment } from "react"

import HistoryBar from "~/components/HistoryBar"
import prisma from "~/libs/db"
import { filterStatus } from "~/libs/models"

type Props = InferGetServerSidePropsType<typeof getServerSideProps>

export async function getServerSideProps() {
  const mikkamae = new Date(Date.now() - 1000 * 60 * 60 * 24 * 3)

  // 見事なN+1
  const targets = await prisma.target.findMany()
  const statuses = await Promise.all(
    targets.map(target =>
      prisma.status.findMany({
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
    statuses: statuses[i].map(filterStatus),
  }))

  return { props: { rawStatuses } }
}

export default function IndexPage({ rawStatuses }: Props) {
  return (
    <>
      <header>
        <h1>status.d3bu.net</h1>
      </header>
      {rawStatuses.map(({ target, statuses }, i) => (
        <Fragment key={i}>
          <h2>{target.url}</h2>
          <HistoryBar statuses={statuses} />
        </Fragment>
      ))}
    </>
  )
}
