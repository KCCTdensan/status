"use client"

import * as TooltipPrimitive from "@radix-ui/react-tooltip"
import { Cause } from "db"
import { ReactNode, useEffect, useRef, useState } from "react"
import { group, hstr } from "utils"

import styles from "./StatusBar.module.scss"

type Status = {
  time: number
  status: number | null
  cause: Omit<Cause, "id" | "statusId"> | null
}

function Tooltip({ children, text }: { children: ReactNode; text: string }) {
  return (
    <TooltipPrimitive.Root>
      {children}
      <TooltipPrimitive.Portal>
        <TooltipPrimitive.Content>
          <pre>{text}</pre>
        </TooltipPrimitive.Content>
      </TooltipPrimitive.Portal>
    </TooltipPrimitive.Root>
  )
}

function StatusCell({ hour, statuses }: { hour: Date; statuses?: Status[] }) {
  let up = 0,
    down = 0,
    err = 0

  if (statuses) {
    statuses.forEach(({ status }) => {
      if (status === null) err++
      else if (status < 400) up++
      else down++
    })
    const perc = statuses.length / 100
    up /= perc
    down /= perc
    err /= perc
  }

  let status: "ok" | "bad" | "warn" | "na" = "na"
  if (err + down > up) status = "bad"
  else if (err + down > 0) status = "warn"
  else if (up > 0) status = "ok"
  else status = "na"

  return (
    <Tooltip
      text={
        `${hstr(hour)}\n` +
        (status === "na"
          ? "N/A"
          : `UP: ${~~up}%\nDOWN: ${~~down}%\nERR: ${~~err}%`)
      }>
      <TooltipPrimitive.Trigger asChild>
        <span className={[styles.cell, styles[status]].join(" ")} />
      </TooltipPrimitive.Trigger>
    </Tooltip>
  )
}

export default function StatusBar({ statuses }: { statuses: Status[] }) {
  const byHours = group(statuses, ({ time }: any) => ~~(time / 3600000) * 3600000)
  const now = ~~(Date.now() / 3600000) * 3600000

  const barRef = useRef<HTMLDivElement>(null)
  const [barWidth, setBarWidth] = useState(0)

  useEffect(() => {
    const w = barRef.current?.clientWidth
    if (w) setBarWidth(w)
    window.addEventListener("resize", () => {
      const w = barRef.current?.clientWidth
      if (w) setBarWidth(w)
    })
  }, [])

  return (
    <TooltipPrimitive.Provider>
      <div className={styles.bar} ref={barRef}>
        {Array.from({ length: barWidth / 24 })
          .map((_, i) => now - 3600000 * i)
          .reverse()
          .map((h, i) => (
            <StatusCell hour={new Date(h)} statuses={byHours[h + ""]} key={i} />
          ))}
      </div>
    </TooltipPrimitive.Provider>
  )
}
