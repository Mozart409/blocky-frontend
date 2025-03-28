import react from "@vitejs/plugin-react-swc";
/**
 * @type {import('vite').UserConfig}
 */
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [react()],
});
