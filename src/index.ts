import { dirname, join } from "node:path"
import { fileURLToPath } from "node:url"

import fastifyNext from "@fastify/nextjs"
import fastifyStatic from "@fastify/static"
import fastify from "fastify"

import db from "~/libs/db"

import updateTask from "./update"

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const port = Number(process.env.PORT) || 3000
const root = join(__dirname, "../public")

const app = fastify()
await app.register(fastifyNext)
await app.register(fastifyStatic, { root })

app.next("/")

console.log("================================================================")
console.log(`  starting fastify at http://localhost:${port} ...`)
console.log("================================================================")

if (updateTask) console.log("update task is valid")
else throw new Error("update task is not valid")

await db.$connect()
await app.listen({ port })
