# ClearCut AI - Background Removal SaaS Platform

An enterprise-grade, privacy-first AI Background Removal SaaS product inspired by **remove.bg**, **Pixelcut.ai**, **Pixlr**, and **Picsart**, engineered in accordance with [ARCHITECTURE.md](./ARCHITECTURE.md) and [DEVELOPER-REQ.md](./DEVELOPER-REQ.md).

---

## 🌟 Key Features

### 1. Studio & Intelligent Foreground Segmentation
- **Dual-Tier Segmentation Engine**: Fast saliency-based canvas matting with soft Gaussian edge feathering, running client-side with zero external GPU delay or cost.
- **Interactive Split Comparison**: Side-by-side draggable split-slider with zoom (up to 300%), pan, and single/split view toggles.
- **Background Swatches & E-Commerce Presets**:
  - Transparent (standard checkerboard PNG).
  - Amazon & eBay Pure White (`#ffffff`, meets marketplace compliance).
  - Studio neutrals, blush, and custom hex color picker.
  - Curated studio gradients (Sunset, Nordic Aurora, Cyber Violet, etc.).
  - Realistic stock photo backdrops (Marble countertop, oak wood desk, studio loft, cafe bokeh).
  - Custom user backdrop photo upload.
  - Original photo Bokeh / Blur slider (DSLR depth-of-field effect).
- **Pixelcut-Style AI Drop Shadows**:
  - Customizable shadow angle (0°–360°), distance, blur softness, opacity, and tint color.
  - 1-click presets: *Contact Shadow*, *Floating 3D*, and *45° Studio Light*.
- **Refinement & Touch-Up Brush**:
  - Interactive canvas modal with adjustable brush size.
  - Erase mode to remove artifacts.
  - Restore mode to recover fine details from the original photo.
  - Step-by-step Undo & Reset history.

### 2. Multi-Image Batch Processing (`/batch`)
- Upload up to 20 images simultaneously.
- Apply uniform backgrounds and shadow presets across an entire product catalog.
- Progress tracking per image and 1-click **Download All as ZIP** using `jszip`.

### 3. Monetization & Credit Wallet (`/pricing`)
- **Subscription Tiers**:
  - Free Trial: 3 HD credits + unlimited standard web previews.
  - Starter: $9/mo (40 credits, $0.22/image).
  - Pro (Most Popular): $29/mo (200 credits, $0.14/image, batch processing).
  - Business: $79/mo (800 credits, $0.09/image, dedicated API SLA).
- **Pay-As-You-Go Credit Packs**:
  - 10 credits ($9), 50 credits ($35), 200 credits ($99), 1,000 credits ($299).
  - No expiration (valid for 2 years).
- **Credit Wallet**: Real-time interactive balance tracker in the global header with 1-click instant test checkout simulation.

### 4. Developer REST API & Platform (`/api-docs`)
- Full REST endpoint at `/api/remove-bg`.
- API Key management dashboard with real-time generation and revocation.
- Interactive code snippets in **cURL**, **Python**, **Node.js**, and **PHP**.
- In-browser interactive sandbox tester.

---

## 🎨 Design System & Color Tokens (ARCHITECTURE.md Section 27)

- **Deep Structural Colors**: Slate-900 (`#0f172a`) / Slate-950 (`#020617`).
- **Primary Action / Discovery**: Vibrant Teal (`#0d9488`, `#14b8a6`).
- **Secondary Action**: Blue (`#2563eb`).
- **Restrained Accent**: Studio Purple (`#7c3aed`).
- **Main Canvas**: Crisp white (`#ffffff`) and cool slate off-white (`#f8fafc`).
- **Accessibility**: Full visible focus rings, native semantic links, keyboard trap modals with Escape handling.

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ (tested on Node 20 / Node 25)
- npm or yarn

### Installation
```bash
npm install
```

### Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to view the application.

### Production Build
```bash
npm run build
npm run start
```

### Code Quality
```bash
npm run lint
```
