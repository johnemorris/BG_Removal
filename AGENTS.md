# AGENTS.md — ClearCut AI

This file contains persistent instructions for AI coding agents working on ClearCut AI.

Before making changes, read this file completely.

---

# 1. Project Purpose & Architecture

ClearCut AI is an AI-powered background removal and photo studio platform built with:
- Next.js 16 (App Router), React 19, Node.js 24.22.1 LTS (see `.nvmrc`)
- TypeScript (Strict mode)
- Tailwind CSS with custom studio utility theme
- Existing inference via the Node API route and a per-request Python/rembg subprocess
- High-resolution canvas compositing and shadow rendering (`src/lib/engine/shadowRenderer.ts`)

Phase 1 added Vitest behavioral tests and Playwright route smoke checks. See
`docs/phase-1a.md` for pending later-phase regressions and
`docs/architecture-decisions.md` for recommended infrastructure that is not yet implemented.

Key routes and components:
- `/` (`src/app/page.tsx`): Main Photo Studio with Left Nav Tool Dock, Defringing, Drop Shadow, Background Presets, and Export Modal
- `/batch` (`src/app/batch/page.tsx` & `src/components/batch/BatchQueue.tsx`): Multi-image catalog queue with uniform batch export
- `/collage` (`src/app/collage/page.tsx`): Multi-layer collage composition studio
- `/pricing` (`src/app/pricing/page.tsx`): Credits and plans

---

# 2. Marketplace Compliance & Smart Padding Standards

When working on e-commerce compliance:
- **Amazon Compliance**:
  - Pure `#FFFFFF` background (RGB 255, 255, 255)
  - 1:1 square canvas (default 2000x2000px)
  - Subject fills exactly 85% of the frame (Amazon standard: product must occupy >= 85% of frame)
  - Subject bounding box auto-centered horizontally and vertically
  - No drop shadows or unattached accessories
- **Shopify Hero**:
  - Clean centered product with configurable soft floor shadow
  - 2048x2048px (1:1 standard)
  - Clean white or studio off-white
- **Etsy / eBay**:
  - 4:3 (2000x1500) and 1:1 (2000x2000) standards with centered smart padding
- **Social / Instagram**:
  - 1:1 (1080x1080) and 9:16 Story/Reel (1080x1920)

---

# 3. Canvas & Image Processing Guidelines

- Always preserve full original sensor resolution for exports unless explicitly scaled down for web preview.
- Canvas compositing must preserve color space and alpha matting quality.
- Bounding box calculations must examine the alpha channel (> threshold) to accurately determine subject bounds.

---

# 4. Verification & Testing

Before declaring any task or phase complete:
1. `npm test`
2. `npm run lint`
3. `npm run build`

All three commands must exit cleanly without errors.

---

# 5. Completion Report Format

At the end of implementation, provide a completion report detailing:
- What changed
- Marketplace presets and engine features added
- UI changes across Studio, SplitComparison, ExportModal, and BatchQueue
- Verification commands run and results
- Any follow-up or technical debt
