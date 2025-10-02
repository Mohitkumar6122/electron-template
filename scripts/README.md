# Scripts

This directory contains utility scripts for the Text Capture project.

## download-lucide-icons.mjs

Downloads icons from [Lucide](https://lucide.dev/icons/) and converts them to PNG assets at multiple resolutions.

### Usage

```bash
# Using npm script (recommended)
pnpm script:icons:download <icon-name> [icon-name...] [--size=16]

# Or directly
node scripts/download-lucide-icons.mjs <icon-name> [icon-name...] [--size=16]
```

### Examples

```bash
# Download a single icon
pnpm script:icons:download settings

# Download multiple icons
pnpm script:icons:download settings user home

# Download with custom size (default is 16px for tray icons)
pnpm script:icons:download chevron-up chevron-down --size=20

# Download menu icons
pnpm script:icons:download menu x minimize maximize
```

### What it does

1. Downloads SVG icons from Lucide's CDN
2. Converts each icon to PNG at 3 resolutions:
   - `icon-name.png` (1x - 16x16 by default)
   - `icon-name@2x.png` (2x - 32x32 by default)
   - `icon-name@4x.png` (4x - 64x64 by default)
3. Creates a directory for each icon: `electron/assets/icons/<icon-name>/`
4. Generates TypeScript exports for each icon
5. Updates the main `electron/assets/icons/index.ts`

### Output Structure

```
electron/assets/icons/
├── index.ts                    # Main export file
├── maximize/
│   ├── index.ts               # Icon-specific exports
│   ├── maximize.png           # 16x16
│   ├── maximize@2x.png        # 32x32
│   └── maximize@4x.png        # 64x64
└── settings/
    ├── index.ts
    ├── settings.png
    ├── settings@2x.png
    └── settings@4x.png
```

### Usage in Code

```typescript
// Import specific resolution
import {
  maximize,
  maximize2x,
  maximize4x
} from '@/electron/assets/icons/maximize'

// Import default array of all resolutions
import maximizeIcons from '@/electron/assets/icons/maximize'

// Use in Electron
const tray = new Tray(maximize)
```

### Finding Icons

Browse available icons at [lucide.dev/icons](https://lucide.dev/icons/)

Use the icon's kebab-case name (e.g., `arrow-up`, `circle-check`, `settings`)

## generate-padded-icons.mjs

Generates padded icon sets for macOS app icons.

### Usage

```bash
pnpm icons:pad [padding-ratio]
```

Default padding ratio is 0.88 (12% padding).
