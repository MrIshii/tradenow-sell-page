// LOCAL-ONLY: builds the whole demo site (home page + sell flow) as a static
// website for GitHub Pages / any server. Same app as Figma Make; the only
// difference is hash routing (createBrowserRouter -> createHashRouter) so every
// page works from a subfolder and survives a refresh. Do not copy into Make.
import { defineConfig, mergeConfig, type Plugin } from "vite";
import base from "./vite.config";

const hashRouter: Plugin = {
  name: "tradenow-hash-router",
  enforce: "pre",
  transform(code, id) {
    if (!id.endsWith("/src/app/routes.tsx")) return null;
    if (!code.includes("createBrowserRouter")) throw new Error("routes.tsx: createBrowserRouter not found");
    return code.replaceAll("createBrowserRouter", "createHashRouter");
  },
};

export default mergeConfig(
  base,
  defineConfig({
    plugins: [hashRouter],
    base: "./",
    publicDir: false,
  }),
);
