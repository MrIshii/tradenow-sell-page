# Vehicle spin: changes to copy back into Figma Make

Source: unpacked from `~/Downloads/Auto dealer mockup.make` (exported 2026-09-25).
Don't edit the /sell screens in Make until these files are pasted in, or those edits will be overwritten.

## Paste into Make (replace the whole file, or create it)

| # | File | What changed |
|---|------|--------------|
| 1 | `src/app/sell/spinAssets.ts` | **New.** Spin-video and intro URLs for white, navy, grey and black; color → video map. `SPIN_BASE_URL` is the one line to change when the files are hosted. |
| 2 | `src/app/sell/components/SpinViewer.tsx` | Rewritten to play the full turntable **video** (227 frames, 24 fps) on loop; drag pauses and scrubs it; color change crossfades at the same angle; intro zoom with its grey studio feathered into white; markers by angle; robust to stalled seeks. |
| 3 | `src/app/sell/SellContext.tsx` | Adds `vehicleColor` / `setVehicleColor` (saved with the rest of the flow). |
| 4 | `src/app/sell/screens/LandingScreen.tsx` | Real white frames + intro zoom (only the visible viewer plays it). |
| 5 | `src/app/sell/screens/VehicleScreen.tsx` | Starts white; picking a color crossfades to that color's spin video (Blue → navy, Gray, Black, White). CSS tint removed. |
| 6 | `src/app/sell/screens/OfferScreen.tsx` | Frames in the customer's chosen color; markers set by angle on the new videos (door 150°, bumper 180°, tires/windshield 0°, paint 30°). |
| 7 | `src/app/sell/screens/WalkaroundIntroScreen.tsx` | On a page opened without https, says "Camera needs a secure connection" instead of showing the QR hand-off (browsers hide the camera on plain http). |

| 8 | `src/app/sell/screens/WalkaroundScreen.tsx` + **new image** `src/imports/scan-camera-bg.webp` | The scan screen's simulated camera shows the driveway photo of a grey SUV. Upload the image to Make first. |
| 9 | Brand rename "Axio Auto" → "AutoNexus": `Hero.tsx`, `WhyAxio.tsx`, `FinancingSection.tsx`, `Locations.tsx`, `Footer.tsx`, `Reviews.tsx` (src/app/components), `SellPage.tsx` (src/app/pages), and the design docs in `src/imports/*.md` + `04-design-tokens.json` | Customer-facing text only; color token names (Axio Blue, `--axio-green`) and code names unchanged. |

## Local-only (do NOT copy into Make)

- `index.html`, `src/main.local.tsx` — local entry point (Make has its own)
- `vite.local.config.ts`, `.local-https/` — local https certificate so phones allow the camera
- `public/__local-test-color.html` — local test page that presets a paint color
- `public/` — local copies of the frames and intro video
- `.claude/`, `CHANGES.md`

## Hosting the frames

Make can't reasonably hold 150 image files. Upload the contents of `~/Downloads/handover-motion-v2/`
(`motion/` and `spin/`, 10 files, 3.1 MB) somewhere with a public URL, then set in `spinAssets.ts`:

```ts
export const SPIN_BASE_URL = "https://your-host/path-to-folder";
```

## Not changed yet

- `WalkaroundScreen.tsx` and `CloseUpsScreen.tsx` still use a stock photo for the simulated camera view.
- The offer screen's evidence sheet shows a camera icon placeholder instead of a photo.
