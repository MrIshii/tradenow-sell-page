// LOCAL-ONLY: builds the sell flow as a standalone static website (index.html +
// assets) that can be uploaded to any web server. Same app as Figma Make;
// App.tsx's "./routes" import is swapped for routes.sell.tsx (sell flow only,
// hash routing, so no server rewrite rules are needed). Do not copy into Make.
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

export default mergeConfig(
  base,
  defineConfig({
    plugins: [sellRoutes],
    base: "./",
    publicDir: false,
  }),
);
