import "./global.scss"

import { Zen_Kaku_Gothic_New } from "next/font/google"
import { ReactNode } from "react"

import { default as pkg } from "../package.json"
import styles from "./layout.module.scss"

const zkgn = Zen_Kaku_Gothic_New({
  weight: ["400", "700"],
  preload: false,
})

export const metadata = {
  title: "status",
  description: "KCCT status",
  openGraph: {
    title: "status",
    images: [{ url: "https://status.d3bu.net/icon.png" }],
  },
  twitter: {
    card: "summary",
  },
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ja" className={zkgn.className}>
      <body>
        <header>
          <div className={styles.row}>
            <h1>status.d3bu.net</h1>
            <p>※主に鯖落ち監視用</p>
            <a
              className={styles.badge}
              href="https://github.com/KCCTdensan/status/">
              v{pkg.version}
            </a>
          </div>
        </header>
        {children}
        <footer className={styles.footer}>&copy; 2023 KCCTdensan</footer>
      </body>
    </html>
  )
}
