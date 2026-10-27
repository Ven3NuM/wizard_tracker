// Runs a lesson: npm run lesson 3 (in the browser), npm run lesson 13 test (its unit tests)
import { existsSync, readdirSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { createServer } from 'vite'
import { startVitest } from 'vitest/node'
import react from '@vitejs/plugin-react'

const lessonsDir = fileURLToPath(new URL('lessons/', import.meta.url))
const lessons = readdirSync(lessonsDir).filter((name) => /^\d\d-/.test(name))
const [number, mode] = process.argv.slice(2)
const lesson = lessons.find((name) => name.startsWith(`${number?.padStart(2, '0')}-`))

if (!lesson) {
  console.log(`Χρήση: npm run lesson <αριθμός> [test]\n\n${lessons.join('\n')}`)
  process.exit(1)
}

const root = lessonsDir + lesson

if (!existsSync(`${root}/index.html`)) {
  console.log(`Το μάθημα ${lesson} είναι μόνο θεωρία: course/lessons/${lesson}/README.md`)
} else if (mode === 'test') {
  await startVitest('test', [], { root, run: true })
} else {
  const server = await createServer({
    configFile: false,
    root,
    plugins: [react()],
    server: { open: true },
  })
  await server.listen()
  console.log(`\n  Μάθημα ${lesson}\n`)
  server.printUrls()
}
