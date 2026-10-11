import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "tailwindcss";
import autoprefixer from "autoprefixer";

export default defineConfig({
  base: "./",
  plugins: [react()],
  resolve: { dedupe: ["react", "react-dom", "lucide-react"] },
  css: { postcss: { plugins: [tailwindcss({ content: ["../bom-pra-voce-novo/src/**/*.{js,jsx}"] }), autoprefixer()] } },
  server: { host: "127.0.0.1", port: 5174, strictPort: true, fs: { allow: [".", "../bom-pra-voce-novo/src"] } }
});
