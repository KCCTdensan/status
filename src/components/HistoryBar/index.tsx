import { FilteredStatus } from "~/libs/models"

import styles from "./index.module.scss"

export default function HistoryBar({
  statuses,
}: {
  statuses: FilteredStatus[]
}) {
  return (
    <div className={styles.bar}>
      {statuses.map((status, i) => (
        <span className={styles.cell} key={i}>
          {status.time.toString()}
        </span>
      ))}
    </div>
  )
}
