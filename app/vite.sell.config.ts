// LOCAL-ONLY: builds the sell flow as ONE classic script for the Trade Now page
// trade-now.solidnumber.com/sell (Solid# CMS page with custom code). Same app as
// Figma Make; App.tsx's "./routes" import is swapped for routes.sell.tsx (sell
// flow only, hash routing). Do not copy into Figma Make.
//
// Why one classic script: the Solid# site's security policy blocks external
// stylesheets, and the asset host sends no CORS headers (so no ES modules). The
// CSS and the one small image are therefore packed into the script, which adds
// its own <style> and a full-screen <div id="root"> when it runs.
import path from "path";
import { defineConfig, mergeConfig, type Plugin } from "vite";
import base from "./vite.config";

const sellRoutes: Plugin = {
  name: "autonexus-sell-routes",
  enforce: "pre",
  resolveId(source, importer) {
    if (source === "./routes" && importer?.endsWith(path.join("src", "app", "App.tsx"))) {
      return path.resolve(__dirname, "src/app/routes.sell.tsx");
    }
    return null;
  },
};

// Moves the CSS into the script and mounts the app full-screen over the CMS page.
const packForCms: Plugin = {
  name: "autonexus-pack-for-cms",
  apply: "build",
  enforce: "post",
  generateBundle(_opts, bundle) {
    const cssFiles = Object.keys(bundle).filter((f) => f.endsWith(".css"));
    const css = cssFiles.map((f) => String((bundle[f] as { source: string | Uint8Array }).source)).join("\n");
    cssFiles.forEach((f) => delete bundle[f]);
    const js = Object.values(bundle).find((c) => c.type === "chunk" && c.isEntry);
    if (!js || js.type !== "chunk") return;
    const boot = `(function(){
  var s=document.createElement("style");s.setAttribute("data-autonexus","");
  s.textContent=${JSON.stringify(css)}+"\\n/* AutoNexus owns this page: hide the CMS chrome */ body>*:not(#root){display:none!important}";
  document.head.appendChild(s);
  if(!document.getElementById("root")){var r=document.createElement("div");r.id="root";document.body.appendChild(r);}
})();\n`;
    js.code = boot + js.code;
  },
};

export default mergeConfig(
  base,
  defineConfig({
    plugins: [sellRoutes, packForCms],
    base: "./",
    publicDir: false,
    build: {
      assetsInlineLimit: 64 * 1024,
      cssCodeSplit: false,
      rollupOptions: {
        input: path.resolve(__dirname, "src/main.local.tsx"),
        output: {
          format: "iife",
          inlineDynamicImports: true,
          entryFileNames: "autonexus-sell.js",
        },
      },
    },
  }),
);
