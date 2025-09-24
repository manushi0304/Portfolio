// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  // app code lives in client/
  root: path.resolve(__dirname, "client"),

  plugins: [react(), tsconfigPaths()],

  resolve: {
    alias: {
      "@": path.resolve(__dirname, "client", "src"),
      "@shared": path.resolve(__dirname, "shared"),
      "@assets": path.resolve(__dirname, "attached_assets"),
    },
  },

  build: {
    // put dist at repo root so Vercel finds it
    outDir: path.resolve(__dirname, "dist"),
    emptyOutDir: true,
    chunkSizeWarningLimit: 1500,
    rollupOptions: {
      output: {
        manualChunks: {
          react: ["react", "react-dom"],
          motion: ["framer-motion"],
          charts: ["recharts"],
          radix: [
            "@radix-ui/react-tooltip",
            "@radix-ui/react-dialog",
            "@radix-ui/react-dropdown-menu",
          ],
          icons: ["react-icons", "lucide-react"],
        },
      },
    },
  },

  server: {
    port: 5173,
    proxy: {
      "/api": { target: "http://127.0.0.1:3001", changeOrigin: true },
    },
    fs: { strict: true, deny: ["**/.*"] },
  },
});
