# ClearCut AI — Visual Testing Guide: Phase 1, Task 1
## E-Commerce Marketplace Auto-Compliance & Smart Padding Engine

This guide provides exhaustive step-by-step instructions to visually verify all components of the Phase 1, Task 1 release.

---

### Prerequisites & Setup
1. Ensure the development server is active at `http://localhost:3001`:
   ```bash
   npm run dev -- -p 3001
   ```
2. Open Google Chrome, Brave, Safari, or Microsoft Edge and navigate to:
   [http://localhost:3001](http://localhost:3001)

---

## Test Suite Overview

| Test ID | Module | Key Features Tested |
| :--- | :--- | :--- |
| **TC-01** | Studio Left Nav Dock | "Market" tool button, slide-out drawer, docked layout integrity |
| **TC-02** | Amazon 100% Compliance | Pure `#FFFFFF`, 1:1 frame, 85% fill, Amazon Compliance Monitor & auto-fix |
| **TC-03** | Smart Padding & Auto-Centering | Fill slider (50%–100%), quick presets (75%, 85%, 90%, 100%), auto-center toggle, safe zone guide overlay |
| **TC-04** | Multi-Platform Presets | Shopify Hero (soft shadow), Etsy (4:3), eBay (1:1), Instagram Square (1:1), Instagram Story (9:16) |
| **TC-05** | 1-Click Export Modal | Marketplace export tab, format switching (PNG/JPG/WebP), dimension confirmation, download validation |
| **TC-06** | Multi-Image Batch Queue | `/batch` marketplace mode, uniform catalog standardization, ZIP download |

---

## Detailed Test Procedures

### Test Case 1 (TC-01): Studio Left Nav Dock & Drawer
**Objective**: Verify that the new "Market" tool item appears in the Left Nav Tool Dock and opens the Marketplace Drawer smoothly without shifting canvas coordinates.

1. Navigate to `http://localhost:3001`.
2. Upload a sample product image:
   - Click one of the sample images under the upload box (e.g., **Sneaker (E-Commerce)** or **Vintage Camera**), or drag and drop your own product photo.
3. Wait for the neural segmentation to finish (`Deep Neural Matting...` progress overlay).
4. Inspect the vertical tool dock on the left:
   - **Expected**: You should see 5 tools in order:
     1. **Backdrop** (Palette icon)
     2. **Market** (ShoppingBag icon) *(NEW)*
     3. **Defringe** (Scissors icon)
     4. **Shadow** (Sliders icon)
     5. **Erase** (Paintbrush icon)
5. Click the **Market** button:
   - **Expected**: A glass-panel floating drawer titled **"Marketplace Compliance & Framing"** slides in smoothly from the left (`left-[76px]`).
   - **Expected**: The center image comparison canvas remains firmly anchored and does not resize or jump.
6. Click the **Market** button again or the `X` icon in the drawer header:
   - **Expected**: The drawer closes cleanly.

---

### Test Case 2 (TC-02): Amazon Compliance & Live Monitor
**Objective**: Verify 100% Amazon compliance requirements: pure `#FFFFFF` background, 1:1 square canvas, 85% frame fill, auto-centered bounding box, no shadows, and dynamic compliance checking.

1. Re-open the **Market** tool drawer.
2. In the drawer, locate the master toggle: **"Marketplace Auto-Framing"** and ensure it is turned ON (teal glow).
3. Click the **"Amazon Compliance"** preset card.
4. Observe the Studio Canvas:
   - **Expected**: The background turns to pure white (`#FFFFFF`).
   - **Expected**: The canvas viewport displays a centered 1:1 square frame.
   - **Expected**: The subject scales so its outer bounds fill 85% of the frame.
   - **Expected**: A dashed teal guide box appears labeled `85% Subject Box`.
5. Scroll down in the Market drawer to the **Amazon Compliance Monitor** card:
   - **Expected**: The status badge displays `100% Compliant` (green).
   - **Expected**: 4 green checkmarks are visible:
     - Pure White (#FFFFFF) → `Pass`
     - Subject Fill >= 85% → `85% Standard`
     - Subject Auto-Centered → `Centered`
     - 1:1 Square Frame → `1:1 Square`
6. **Negative / Non-Compliance Test**:
   - Click the **Backdrop** tool on the left dock and select a colored background (e.g., Pastel Blue or Warm Sunset).
   - Switch back to the **Market** tool.
   - **Expected**: The Amazon Compliance Monitor turns amber and shows `Non-Compliant`. The background row highlights the non-compliant hex code with an alert icon.
   - **Expected**: A button appears: **"Fix All to Amazon Compliance"**.
7. Click **"Fix All to Amazon Compliance"**:
   - **Expected**: Background immediately resets to `#FFFFFF`, fill resets to 85%, and the monitor turns back to `100% Compliant`.

---

### Test Case 3 (TC-03): Smart Padding & Optical Auto-Centering
**Objective**: Test interactive margin slider, quick fill pill buttons, optical auto-centering toggle, and safe zone guide visibility.

1. In the **Market** drawer:
2. Drag the **"Subject Frame Fill (Margin)"** slider:
   - Drag to **50%**: Notice the subject smoothly shrinks down, creating generous margin padding.
   - Drag to **95%**: Notice the subject expands to almost touch the frame edges.
3. Test the quick preset pills below the slider:
   - Click **75%**: Slider snaps to 75%, subject resizes immediately.
   - Click **85% (Amazon Std)**: Slider snaps to 85%, safe frame matches Amazon requirements.
   - Click **90%**: Slider snaps to 90%.
   - Click **100%**: Subject fills 100% of the frame.
4. Test the **"Auto-Center Subject"** switch:
   - For an off-center cutout image, toggle **Auto-Center Subject** off.
   - **Expected**: Subject reverts to its original relative offset.
   - Toggle **Auto-Center Subject** back on.
   - **Expected**: Subject's optical center automatically aligns with the exact canvas center `(width / 2, height / 2)`.
5. In the canvas floating toolbar (top right of canvas area):
   - Locate the button: **`Safe Zone (85%)`**.
   - Click it to toggle the dashed safe zone frame off and on.

---

### Test Case 4 (TC-04): Platform Presets (Shopify, Etsy, eBay, Social)
**Objective**: Verify preset switching for other major e-commerce platforms.

1. In the **Market** drawer, click **"Shopify Hero Product"**:
   - **Expected**: Canvas dimensions set to 2048×2048px (1:1).
   - **Expected**: A soft natural floor shadow appears grounded beneath the product (`distance: 16`, `blur: 20`, `opacity: 0.22`).
2. Click **"Etsy 4:3 Gallery"**:
   - **Expected**: Canvas aspect ratio transitions to a **4:3 rectangle** (2000×1500px).
   - **Expected**: Subject fills 80% with safe margins preventing Etsy search thumbnail cutoffs.
3. Click **"Instagram Story / Reel (9:16)"**:
   - **Expected**: Canvas aspect ratio transitions to a **tall 9:16 vertical rectangle** (1080×1920px).
   - **Expected**: Subject centers optically within the vertical story frame with 75% fill.
4. Click **"eBay Standard Listing"**:
   - **Expected**: Returns to 2000×2000px 1:1 square with 85% fill and clean neutral white background.

---

### Test Case 5 (TC-05): 1-Click Standards Export Modal
**Objective**: Verify that the export modal renders platform-compliant downloads at full high-resolution.

1. In the Studio top navigation bar, click **"Export / Download"**.
2. **Expected**: The Export Modal opens with two tabs at the top:
   - **`1-Click Marketplace`**
   - **`Current Studio Shot`**
3. Select **`1-Click Marketplace`**:
   - **Expected**: Shows platform cards: Amazon Compliance, Shopify Hero, eBay Standard, Etsy 4:3, Instagram Square, Instagram Story.
   - **Expected**: A summary banner displays platform badge, dimensions, and description.
4. Select **"Amazon Compliance"**:
   - Under Resolution, verify the dimension label displays **`2000 × 2000 px`**.
5. Select format: **`PNG (Alpha)`** or **`JPG (Pure White)`**.
6. Click **"Download Free Web Preview"** or **"Download 1-Click High-Res"**:
   - **Expected**: Confetti animation triggers.
   - **Expected**: File downloads with filename format:
     `[filename]-amazon-compliant-hd.png` (or `.jpg`).
7. Open the downloaded file in your OS image previewer or inspector:
   - Verify dimensions: exactly `2000 × 2000 px` (or `1000 × 1000 px` for preview).
   - Verify product is auto-centered with uniform margins occupying exactly 85% of the frame.
   - Verify background is pure `#FFFFFF` (RGB 255, 255, 255).

---

### Test Case 6 (TC-06): Batch Queue Marketplace Standardization
**Objective**: Verify that an entire catalog of multiple images can be standardized to marketplace compliance simultaneously.

1. Navigate to [http://localhost:3001/batch](http://localhost:3001/batch).
2. Click **"Add Images"** and select 2 to 4 product photos (JPG, PNG, or WebP).
3. Observe the header configuration panel:
   - **Expected**: Two mode tabs are available:
     - **`E-Commerce Marketplace Compliance`** *(Selected by default)*
     - **`Custom Studio Backdrop`**
4. Under Marketplace Presets, click **"Amazon"** (or **"Shopify"**):
   - **Expected**: Badge displays `Amazon 100% Compliant (2000×2000px)`.
   - **Expected**: Frame fill slider shows `85%`.
   - **Expected**: "Auto-Center Cutout Bounds" switch is ON.
5. Click **"Process All"**:
   - **Expected**: Each queue item shows real-time progress:
     - `Ready` → `Processing...` (pulsing teal badge) → `Standardized` (green checkmark).
   - **Expected**: Thumbnail previews show each product cutout centered with uniform white background.
   - **Expected**: Metadata subtitle displays calibrated dimensions (e.g., `2000×2000px`).
6. Click **"Download ZIP (N)"**:
   - **Expected**: Downloads `clearcut-amazon-catalog-[timestamp].zip`.
7. Extract the ZIP archive:
   - **Expected**: Contains all processed images.
   - **Expected**: Every file in the archive is standardized to the identical resolution, centered bounding box, and padding.

---

## Pass/Fail Verification Checklist

| Checkpoint | Expected Result | Result (P/F) |
| :--- | :--- | :--- |
| Left dock "Market" button | Opens/closes drawer without shifting studio canvas | [ ] |
| Amazon 85% fill | Product bounding box fills 85% of the canvas | [ ] |
| Amazon pure white | Background color is `#FFFFFF` (RGB 255, 255, 255) | [ ] |
| Amazon compliance monitor | Displays 100% compliant badge; triggers auto-fix if altered | [ ] |
| Auto-centering toggle | Centers cutout bounding box horizontally & vertically | [ ] |
| Fill slider (50%–100%) | Interactively scales subject bounding box smoothly | [ ] |
| Safe zone guide overlay | Visual dashed boundary box indicating exact fill % | [ ] |
| Shopify Hero preset | Sets 2048×2048px with grounded soft floor shadow | [ ] |
| Etsy 4:3 Gallery preset | Sets 2000×1500px rectangular thumbnail ratio | [ ] |
| Instagram Story preset | Sets 1080×1920px 9:16 vertical format | [ ] |
| 1-Click Export Modal | Exports matching preset dimensions and auto-centering | [ ] |
| Batch Queue Standardization | Standardizes multi-image catalog in batch to single ZIP | [ ] |
