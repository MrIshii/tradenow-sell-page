# TradeNow "Sell or trade your car" page

Built October 2, 2026 from the current version of the Figma Make file
("Auto dealer mockup"): 3 steps, TradeNow logo, 360° spin in four colors,
walkaround video, close-up photos, clickable damage spots, and the
"continue on your phone" link.

This repository has two ways to put the page live. Use one.

## Live demo

https://mrishii.github.io/tradenow-sell-page/ (GitHub Pages, served from `docs/`)

## Try it locally

Download the repository (Code → Download ZIP), then in the `docs/` folder run
`python3 -m http.server 8000` and open http://localhost:8000.

## Option 1: `docs/` (any web server)

A complete static web page. Nothing to install or configure.

1. Upload **everything inside `docs/`** (the `index.html` file and the
   `assets` folder, keeping the folder structure) to your server.
   - At the site root: the page opens at `https://your-domain/`
   - In a folder, for example `sell/`: it opens at `https://your-domain/sell/`
2. Serve it over **https**. Browsers only allow the camera on https pages.
3. Open the address. The flow starts on the Sell screen.

Steps show in the address after a `#` (for example `…/#/sell/vehicle`). This is
why no server rules are needed: refreshing on any step works on any host
(Apache, Nginx, IIS, Netlify, Vercel, Cloudflare Pages, S3 + CloudFront…).

## Option 2: `solid-embed/` (a page on the Trade Now Solid# site)

For `trade-now.solidnumber.com/sell` or Trade Now's own domain. Solid# does not
run custom scripts on `*.solidnumber.com` until Trade Now has its own domain,
so this only works after that.

1. Upload `tradenow-sell.js` somewhere that serves it over https.
   (Already uploaded once to the Solid# asset library; re-upload this version.)
2. Allow that address as a script source for the site (Solid# setting; the
   account owner approves it).
3. In the `/sell` page (page 309, currently an unpublished draft), paste the
   line from `embed-snippet.html` into the custom code at the end of the body,
   with the real script address.
4. Preview, then publish. The flow covers the whole page (the site's own
   header and footer are hidden on this page only).

## What the page loads from other places

These must stay available, or those parts of the page break:

| What | Where it comes from |
|---|---|
| Spin videos, zoom intro, walkaround video, close-up photos, TradeNow logos | Trade Now's Solid# asset library (`solid-tenant-assets.nyc3.digitaloceanspaces.com/company_78/…`) |
| QR code image on the "continue on your phone" screen | `api.qrserver.com` |
| Fonts (Montserrat, Inter) | Google Fonts |

## Good to know

- **Sample data:** the vehicle (2022 Mazda CX-50), prices, offer and pickup
  times are sample data. Nothing is sent to a server or saved beyond the
  visitor's own browser.
- **Camera:** this is a demo, so it never turns on the real camera. "Allow camera
  and start" plays a sample walkaround video as the camera feed, and the close-up
  photos show sample pictures. To use the real camera, set `DEMO_CAMERA` to
  `false` in `WalkaroundScreen.tsx` (Figma Make file) and rebuild.
- **"Text me a link"** opens the visitor's messaging app with the link filled
  in; it does not send a text by itself.
- **Updating:** after changing the Make file, this package has to be rebuilt.
