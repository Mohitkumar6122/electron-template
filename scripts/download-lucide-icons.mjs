#!/usr/bin/env node

/**
 * Script to download Lucide icons and convert them to PNG assets
 * Usage: node scripts/download-lucide-icons.mjs <icon-name> [icon-name...] [--size=24]
 * Example: node scripts/download-lucide-icons.mjs maximize minimize close --size=24
 */

import { mkdir, readdir, writeFile } from 'fs/promises'
import { dirname, join } from 'path'
import sharp from 'sharp'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// Configuration
const BASE_SIZE = 16 // Default icon size for Electron tray icons (16x16, 32x32, 64x64)
const SCALES = [1, 2, 4] // @1x, @2x, @4x
const LUCIDE_CDN = 'https://unpkg.com/lucide-static@latest/icons'
const ICONS_DIR = join(__dirname, '../electron/assets/icons')

/**
 * Parse command line arguments
 */
function parseArgs() {
  const args = process.argv.slice(2)

  if (args.length === 0) {
    console.error('❌ Please provide at least one icon name')
    console.log(
      '\nUsage: node scripts/download-lucide-icons.mjs <icon-name> [icon-name...] [--size=16]'
    )
    console.log(
      'Example: node scripts/download-lucide-icons.mjs maximize minimize close --size=16'
    )
    console.log('\nFind icons at: https://lucide.dev/icons/')
    process.exit(1)
  }

  const iconNames = []
  let size = BASE_SIZE

  for (const arg of args) {
    if (arg.startsWith('--size=')) {
      size = parseInt(arg.split('=')[1], 10)
      if (isNaN(size)) {
        console.error('❌ Invalid size value')
        process.exit(1)
      }
    } else {
      iconNames.push(arg)
    }
  }

  return { iconNames, size }
}

/**
 * Download SVG from Lucide CDN
 */
async function downloadSvg(iconName) {
  const url = `${LUCIDE_CDN}/${iconName}.svg`

  console.log(`📥 Downloading ${iconName} from ${url}`)

  try {
    const response = await fetch(url)

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`)
    }

    return await response.text()
  } catch (error) {
    throw new Error(`Failed to download ${iconName}: ${error.message}`)
  }
}

/**
 * Convert SVG to PNG at different scales
 */
async function convertSvgToPng(svgContent, iconName, size) {
  const iconDir = join(ICONS_DIR, iconName)

  // Create icon directory
  await mkdir(iconDir, { recursive: true })

  const pngFiles = []

  for (const scale of SCALES) {
    const scaledSize = size * scale
    const suffix = scale === 1 ? '' : `@${scale}x`
    const filename = `${iconName}${suffix}.png`
    const filepath = join(iconDir, filename)

    console.log(`  🖼️  Converting to ${filename} (${scaledSize}x${scaledSize})`)

    try {
      await sharp(Buffer.from(svgContent))
        .resize(scaledSize, scaledSize)
        .png()
        .toFile(filepath)

      pngFiles.push({ scale, filename, filepath })
    } catch (error) {
      throw new Error(`Failed to convert ${filename}: ${error.message}`)
    }
  }

  return pngFiles
}

/**
 * Convert kebab-case to camelCase
 */
function kebabToCamelCase(str) {
  return str.replace(/-([a-z])/g, (match, letter) => letter.toUpperCase())
}

/**
 * Generate TypeScript index file for icon
 */
async function generateIndexFile(iconName, pngFiles) {
  // Convert icon name to camelCase for variable names
  const camelCaseName = kebabToCamelCase(iconName)

  const imports = pngFiles
    .map(({ scale, filename }) => {
      const varName = scale === 1 ? camelCaseName : `${camelCaseName}${scale}x`
      return `import ${varName} from './${filename}'`
    })
    .join('\n')

  const exportVars = pngFiles
    .map(({ scale }) => {
      return scale === 1 ? camelCaseName : `${camelCaseName}${scale}x`
    })
    .join(', ')

  const exportArray = pngFiles
    .map(({ scale }) => {
      return scale === 1 ? camelCaseName : `${camelCaseName}${scale}x`
    })
    .join(', ')

  const content = `${imports}

export { ${exportVars} }
export default [${exportArray}]
`

  const indexPath = join(ICONS_DIR, iconName, 'index.ts')
  await writeFile(indexPath, content, 'utf-8')

  console.log(`  ✅ Generated ${iconName}/index.ts`)
}

/**
 * Update main icons index.ts file
 */
async function updateMainIndex(allIconNames) {
  const exports = allIconNames
    .map(name => `export * from './${name}'`)
    .join('\n')
  const mainIndexPath = join(ICONS_DIR, 'index.ts')

  await writeFile(mainIndexPath, exports + '\n', 'utf-8')

  console.log(`\n✅ Updated icons/index.ts`)
}

/**
 * Get existing icon directories
 */
async function getExistingIcons() {
  try {
    const entries = await readdir(ICONS_DIR, { withFileTypes: true })
    return entries
      .filter(entry => entry.isDirectory())
      .map(entry => entry.name)
      .sort()
  } catch (error) {
    return []
  }
}

/**
 * Main function
 */
async function main() {
  const { iconNames, size } = parseArgs()

  console.log(
    `\n🎨 Downloading ${
      iconNames.length
    } Lucide icon(s) at ${size}px base size (${size}×${size}, ${size * 2}×${
      size * 2
    }, ${size * 4}×${size * 4})\n`
  )

  for (const iconName of iconNames) {
    try {
      console.log(`📦 Processing "${iconName}"`)

      // Download SVG
      const svgContent = await downloadSvg(iconName)

      // Convert to PNGs
      const pngFiles = await convertSvgToPng(svgContent, iconName, size)

      // Generate index.ts
      await generateIndexFile(iconName, pngFiles)

      console.log(`✅ Successfully added "${iconName}"\n`)
    } catch (error) {
      console.error(`❌ Error processing "${iconName}": ${error.message}\n`)
    }
  }

  // Update main index
  const allIcons = await getExistingIcons()
  await updateMainIndex(allIcons)

  console.log(`\n🎉 Done! Processed ${iconNames.length} icon(s)`)
  console.log(`📁 Icons location: electron/assets/icons/`)
  console.log(`\n💡 Import usage:`)
  const firstIconCamelCase = kebabToCamelCase(iconNames[0])
  console.log(
    `   import { ${firstIconCamelCase} } from '@/electron/assets/icons/${iconNames[0]}'`
  )
}

main().catch(error => {
  console.error('❌ Fatal error:', error)
  process.exit(1)
})
