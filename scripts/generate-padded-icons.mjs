// Generate padded macOS icons and rebuild .icns files
// Usage: node scripts/generate-padded-icons.mjs [scale]
// scale is the inner content scale relative to the canvas (default: 0.88)

import { execFile } from 'node:child_process'
import fs from 'node:fs'
import fsp from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { promisify } from 'node:util'
import sharp from 'sharp'

const execFileAsync = promisify(execFile)

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const projectRoot = path.join(__dirname, '..')
const iconsetInDir = path.join(
  projectRoot,
  'resources',
  'icons',
  'macos.iconset'
)
const iconsetOutDir = path.join(
  projectRoot,
  'resources',
  'icons',
  'macos-padded.iconset'
)
const outIcns = path.join(projectRoot, 'resources', 'icons', 'icon.icns')
const outDockIcns = path.join(
  projectRoot,
  'resources',
  'icons',
  'icon-dock.icns'
)

const innerScale = (() => {
  const arg = parseFloat(process.argv[2] || '')
  if (!isNaN(arg) && arg > 0 && arg < 1) return arg
  return 0.88
})()

async function ensureDirEmpty(dir) {
  await fsp.rm(dir, { recursive: true, force: true })
  await fsp.mkdir(dir, { recursive: true })
}

async function padPng(inputPath, outputPath, scale) {
  const image = sharp(inputPath)
  const meta = await image.metadata()
  const width = meta.width || 0
  const height = meta.height || 0
  if (!width || !height) throw new Error(`Invalid dimensions for ${inputPath}`)

  const targetWidth = width
  const targetHeight = height
  const innerWidth = Math.max(1, Math.round(targetWidth * scale))
  const innerHeight = Math.max(1, Math.round(targetHeight * scale))

  const resized = await image
    .resize({ width: innerWidth, height: innerHeight, fit: 'contain' })
    .png()
    .toBuffer()

  const canvas = sharp({
    create: {
      width: targetWidth,
      height: targetHeight,
      channels: 4,
      background: { r: 0, g: 0, b: 0, alpha: 0 }
    }
  })

  const composited = await canvas
    .composite([{ input: resized, gravity: 'center' }])
    .png()
    .toBuffer()

  await fsp.writeFile(outputPath, composited)
}

async function buildIcns(iconsetDir, outPath) {
  // iconutil is available on macOS
  try {
    await fsp.rm(outPath, { force: true })
  } catch {}
  await execFileAsync('iconutil', ['-c', 'icns', iconsetDir, '-o', outPath])
}

async function run() {
  // Validate inputs
  const exists = fs.existsSync(iconsetInDir)
  if (!exists) throw new Error(`Missing input iconset: ${iconsetInDir}`)

  // Prepare output iconset
  await ensureDirEmpty(iconsetOutDir)

  const files = (await fsp.readdir(iconsetInDir)).filter(f =>
    f.endsWith('.png')
  )
  if (files.length === 0)
    throw new Error('No PNG files found in iconset directory')

  // Process each png
  for (const file of files) {
    const src = path.join(iconsetInDir, file)
    const dst = path.join(iconsetOutDir, file)
    await padPng(src, dst, innerScale)
    process.stdout.write(`Padded ${file} with scale ${innerScale}\n`)
  }

  // Build icns files
  await buildIcns(iconsetOutDir, outIcns)
  await fsp.copyFile(outIcns, outDockIcns)
  process.stdout.write(`Wrote ${outIcns} and ${outDockIcns}\n`)
}

run().catch(err => {
  console.error(err)
  process.exit(1)
})
