import { defineConfig } from "vite";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { dts } from "rolldown-plugin-dts";

const __dirname = fileURLToPath(new URL(".", import.meta.url));
const isServer = process.env.BUILD_TARGET === "server";

export default defineConfig({
  build: {
    // We want to leave the minification to the users, so we don't minify
    minify: false,

    ssr: isServer,

    // We want to change the output dir and content based on the build target
    outDir: isServer ? "dist/server" : "dist/client",
    lib: {
      entry: {
        ...(!isServer && { index: resolve(__dirname, "src/entry-client.ts") }),
        ...(isServer && { server: resolve(__dirname, "src/entry-server.ts") }),
      },
      // As of 2024, basically only "es" matters
      formats: ["es"],
    },

    rollupOptions: {
      external: ["ofetch"],
    },
  },
  plugins: [
    // We include types to ease the use of the library
    dts(),
  ],
});
