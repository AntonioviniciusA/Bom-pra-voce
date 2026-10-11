import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
export default defineConfig({ plugins: [react()], resolve: { dedupe: ["react", "react-dom", "lucide-react"] }, server: { fs: { allow: [".", "../bom-pra-voce-novo/src"] } }, test: { environment: "jsdom", include: ["src/**/*.test.{js,jsx}"], restoreMocks: true } });
