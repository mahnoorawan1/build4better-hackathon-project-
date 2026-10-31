/**
 * Generate pre-recorded Urdu MP3 clips from src/audioCatalog.js
 * Usage: node scripts/generate-urdu-audio.mjs
 */
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.resolve(__dirname, '..')
const outDir = path.join(root, 'public', 'audio', 'ur')
const catalogPath = path.join(root, 'src', 'audioCatalog.js')

const MAX_CHARS = 180

async function loadCatalog() {
  const mod = await import(pathToFileURL(catalogPath).href + `?t=${Date.now()}`)
  return mod.URDU_AUDIO
}

function splitText(text) {
  const cleaned = String(text).replace(/\s+/g, ' ').trim()
  if (!cleaned) return []
  if (cleaned.length <= MAX_CHARS) return [cleaned]

  const parts = []
  let remaining = cleaned
  while (remaining.length > MAX_CHARS) {
    let cut = remaining.lastIndexOf(' ', MAX_CHARS)
    if (cut < 40) cut = remaining.lastIndexOf('۔', MAX_CHARS)
    if (cut < 40) cut = remaining.lastIndexOf('.', MAX_CHARS)
    if (cut < 40) cut = MAX_CHARS
    parts.push(remaining.slice(0, cut).trim())
    remaining = remaining.slice(cut).trim()
  }
  if (remaining) parts.push(remaining)
  return parts.filter(Boolean)
}

async function fetchChunk(text) {
  const params = new URLSearchParams({
    ie: 'UTF-8',
    client: 'gtx',
    tl: 'ur',
    q: text,
  })
  const url = `https://translate.googleapis.com/translate_tts?${params}`
  const res = await fetch(url, {
    headers: {
      'User-Agent':
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
    },
  })
  if (!res.ok) {
    throw new Error(`HTTP ${res.status} for chunk starting: ${text.slice(0, 40)}`)
  }
  const buf = Buffer.from(await res.arrayBuffer())
  if (buf.length < 64 || buf[0] === 0x3c) {
    throw new Error(`Invalid audio for chunk starting: ${text.slice(0, 40)}`)
  }
  return buf
}

async function buildMp3(text) {
  const chunks = splitText(text)
  const parts = []
  for (const chunk of chunks) {
    parts.push(await fetchChunk(chunk))
    // Be polite to the unofficial endpoint.
    await new Promise((r) => setTimeout(r, 250))
  }
  return Buffer.concat(parts)
}

async function main() {
  fs.mkdirSync(outDir, { recursive: true })
  const catalog = await loadCatalog()
  const ids = Object.keys(catalog)
  console.log(`Generating ${ids.length} Urdu clips into ${outDir}`)

  for (const id of ids) {
    const outFile = path.join(outDir, `${id}.mp3`)
    process.stdout.write(`- ${id} ... `)
    try {
      const mp3 = await buildMp3(catalog[id])
      fs.writeFileSync(outFile, mp3)
      console.log(`${mp3.length} bytes`)
    } catch (err) {
      console.log('FAILED')
      console.error(`  ${err.message || err}`)
      process.exitCode = 1
    }
  }

  console.log('Done.')
}

main()
