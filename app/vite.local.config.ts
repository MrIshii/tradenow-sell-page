// LOCAL-ONLY: serves the demo over https so phones allow the camera.
// Do not copy into Figma Make (Make serves over https already).
import fs from "fs";
import { defineConfig, mergeConfig } from "vite";
import base from "./vite.config";

export default mergeConfig(
  base,
  defineConfig({
    server: {
      https: {
        key: fs.readFileSync(new URL("./.local-https/key.pem", import.meta.url)),
        cert: fs.readFileSync(new URL("./.local-https/cert.pem", import.meta.url)),
      },
    },
  }),
);
