import { Cause, Status } from "~/libs/db"
import { exclude } from "~/libs/utils"

export type FilteredStatus = ReturnType<typeof filterStatus>

export function filterStatus(status: Status & { cause: Cause | null }) {
  return exclude(
    {
      ...status,
      time: status.time.getTime(),
      cause: status.cause ? exclude(status.cause, ["id", "statusId"]) : null,
    },
    ["id", "targetId"]
  )
}
