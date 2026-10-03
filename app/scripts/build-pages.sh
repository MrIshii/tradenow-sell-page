#!/usr/bin/env bash
# Builds the demo from app/ and writes the published copies:
#   ../docs/                     the website GitHub Pages serves (docs/media is kept)
#   ../solid-embed/tradenow-sell.js  the one-script version for the Trade Now Solid# site
# Run by .github/workflows/deploy.yml on every change to app/, or locally from app/.
set -euo pipefail
APP="$(cd "$(dirname "$0")/.." && pwd)"
ROOT="$(cd "$APP/.." && pwd)"
STAMP="$(date -u +%Y-%m-%dT%H:%MZ)"
cd "$APP"

rm -rf dist-site dist-embed
npx vite build -c vite.site.config.ts --outDir dist-site
npx vite build -c vite.sell.config.ts --outDir dist-embed

# Page title/description + hidden build stamp (view source or the console to see which build is open)
python3 - "$STAMP" <<'EOF'
import re, sys
stamp = sys.argv[1]
p = "dist-site/index.html"; s = open(p).read()
head = ('<title>Sell or trade your car | TradeNow</title>\n'
        '    <meta name="description" content="Get a firm offer on your car from your phone in 3 steps and about 10 minutes." />\n'
        '    <meta name="theme-color" content="#ffffff" />\n'
        f'    <meta name="tradenow-build" content="{stamp}" />\n'
        f'    <script>console.info("TradeNow demo build {stamp}")</script>\n')
s = re.sub(r"<title>.*?</title>\n", head, s, count=1)
open(p, "w").write(s)
e = "dist-embed/autonexus-sell.js"
body = open(e).read()
assert len(body) > 100000, "embed build looks empty"
open(e, "w").write(f"/* TradeNow demo build {stamp} */\n" + body)
EOF

KEEP="$(mktemp -d)"
[[ -d "$ROOT/docs/media" ]] && cp -R "$ROOT/docs/media" "$KEEP/media"
rm -rf "$ROOT/docs" && cp -R dist-site "$ROOT/docs" && touch "$ROOT/docs/.nojekyll"
[[ -d "$KEEP/media" ]] && cp -R "$KEEP/media" "$ROOT/docs/media"
mkdir -p "$ROOT/solid-embed" && cp dist-embed/autonexus-sell.js "$ROOT/solid-embed/tradenow-sell.js"
rm -rf dist-site dist-embed
echo "Built $STAMP"
