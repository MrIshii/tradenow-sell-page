#!/usr/bin/env bash
# Rebuilds the two copies GitHub doesn't update on its own, from this app/ folder:
# the Desktop zip and the Claude-link folder (dist-board/, which Claude then publishes).
# The GitHub page itself is rebuilt by .github/workflows/deploy.yml on every push.
#
#   app/scripts/release-local.sh
#
# Every copy gets the same hidden build stamp (a <meta name="tradenow-build"> tag and a
# console line), so an old cached page can be told apart from the current one.
# The Claude link (Handover Concept Board artifact) is prepared in $BOARD; Claude publishes it.
set -euo pipefail

SRC="$(cd "$(dirname "$0")/.." && pwd)"
PKG="$HOME/Desktop/tradenow-sell-page-package"
BOARD="$SRC/dist-board"
SOLID_HOST="https://solid-tenant-assets.nyc3.digitaloceanspaces.com/company_78/uploads"
GH_MEDIA="https://mrishii.github.io/tradenow-sell-page/media/"

STAMP="$(date -u +%Y-%m-%dT%H:%MZ)"
echo "▶ Build $STAMP"
cd "$SRC"
rm -rf dist-site dist-embed
npx vite build -c vite.site.config.ts --outDir dist-site >/dev/null
npx vite build -c vite.sell.config.ts --outDir dist-embed >/dev/null

# Page title/description + hidden build stamp (same values every copy)
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

echo "▶ Desktop package"
rm -rf "$PKG/website" && cp -R dist-site "$PKG/website"
cp dist-embed/autonexus-sell.js "$PKG/solid-embed/tradenow-sell.js"
( cd "$(dirname "$PKG")" && rm -f "$(basename "$PKG").zip" && zip -qr "$(basename "$PKG").zip" "$(basename "$PKG")" -x '*.DS_Store' )

echo "▶ Claude link folder (media copied in: its viewer blocks outside images/video)"
rm -rf "$BOARD" && cp -R dist-site "$BOARD"
python3 - "$BOARD" "$SOLID_HOST" "$GH_MEDIA" <<'EOF'
import glob, os, re, sys, urllib.request
board, solid, gh = sys.argv[1:]
js = glob.glob(f"{board}/assets/*.js")[0]; s = open(js).read()
def get(url, dest):
    os.makedirs(os.path.dirname(dest), exist_ok=True)
    try:
        urllib.request.urlretrieve(url, dest); return True
    except Exception as e:
        print("  could not fetch", url, e); return False
for p in sorted(set(re.findall(r"ast_[a-f0-9]{8}/[A-Za-z0-9._-]+", s))):
    get(f"{solid}/{p}", f"{board}/media/solid/{p}")
s = s.replace(solid, "media/solid")
for name in sorted(set(re.findall(re.escape(gh) + r"([A-Za-z0-9._-]+)", s))):
    get(gh + name, f"{board}/media/gh/{name}")
s = s.replace(gh, "media/gh/")
for u in sorted(set(re.findall(r"https://images\.unsplash\.com/[A-Za-z0-9./_?=&%-]+", s))):
    pid = re.search(r"/(photo-[0-9a-f-]+)\?", u).group(1)
    if get(u, f"{board}/media/unsplash/{pid}.jpg"):
        s = s.replace(u, f"media/unsplash/{pid}.jpg")
open(js, "w").write(s)
h = f"{board}/index.html"; t = open(h).read()
open(h, "w").write(t.replace("<title>Sell or trade your car | TradeNow</title>", "<title>Handover Concept Board</title>", 1))
files = [os.path.relpath(f, board) for f in glob.glob(f"{board}/**/*", recursive=True) if os.path.isfile(f)]
print(f"  {len(files)} files ready in {board}")
EOF

echo "✔ Done — build $STAMP"
